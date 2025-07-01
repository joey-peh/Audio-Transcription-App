import io
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
from models import db, Transcription
import torchaudio

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///transcriptions.db"
db.init_app(app)

try:
    processor = WhisperProcessor.from_pretrained("openai/whisper-tiny")
    model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-tiny")
    model.config.forced_decoder_ids = None
except Exception as e:
    print("Failed to load model or processor:", str(e))
    raise


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now()})


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio files provided"}), 400

    files = request.files.getlist("audio")

    if not files or all(file.filename == "" for file in files):
        return jsonify({"error": "No selected files"}), 400

    results = []
    try:
        # Start atomic transaction
        db.session.begin()

        for file in files:
            if file.filename == "":
                continue

            try:
                audio_bytes = file.read()
                waveform, sample_rate = torchaudio.load(io.BytesIO(audio_bytes))

                # Resample if less than 16000
                if sample_rate != 16000:
                    resampler = torchaudio.transforms.Resample(
                        orig_freq=sample_rate, new_freq=16000
                    )
                    waveform = resampler(waveform)
                    sample_rate = 16000

                # Convert to mono > Whisper expects single audio channel
                if waveform.shape[0] > 1:
                    waveform = torch.mean(waveform, dim=0, keepdim=True)

                # Process
                input_features = processor(
                    waveform.squeeze().numpy(),
                    sampling_rate=sample_rate,
                    return_tensors="pt",
                ).input_features
                predicted_ids = model.generate(input_features)
                transcription = processor.batch_decode(
                    predicted_ids, skip_special_tokens=True
                )[0]

                # Add into db
                new_transcription = Transcription(
                    filename=file.filename, text=transcription
                )
                db.session.add(new_transcription)
                results.append(new_transcription)
            except Exception as e:
                db.session.rollback()
                return (
                    jsonify(
                        {
                            "error": f"Failed to process {file.filename}",
                            "details": str(e),
                        }
                    ),
                    500,
                )

        db.session.commit()
        # Query the committed objects to get populated fields
        results = [
            t.to_dict()
            for t in Transcription.query.filter(
                Transcription.id.in_([t.id for t in results])
            ).all()
        ]
        return jsonify(results)
    except:
        db.session.rollback()
        return jsonify({"error": "Transaction failed", "details": str(e)}), 500


@app.route("/transcriptions", methods=["GET"])
def transcriptions():
    try:
        transcriptions = Transcription.query.all()
        result = [transcription.to_dict() for transcription in transcriptions]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Internal server error", "details": str(e)}), 500


@app.route("/search", methods=["GET"])
def search():
    filename = request.args.get("filename", "").strip()

    if not filename:
        return (
            jsonify(
                {
                    "error": "Please provide filename query",
                    "example": "/search?filename=meeting",
                }
            ),
            400,
        )
    try:
        transcriptions = Transcription.query.filter(
            Transcription.filename.ilike(f"%{filename}%")
        ).all()
        result = [transcription.to_dict() for transcription in transcriptions]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Search failed", "details": str(e)}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    # listen on 0.0.0.0 to accept connections from outside the container
    app.run(debug=True, host="0.0.0.0", port=5000)
