import io
from models import Transcription
from models import db


def test_health_endpoint(client):
    """
    GIVEN a Flask application with a health endpoint
    WHEN requesting the health check endpoint
    THEN check that a healthy status with HTTP 200 response and valid timestamp is returned
    """
    # Test health
    response = client.get("/health")
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_transcribe_endpoint(client):
    """
    GIVEN a mock audio file
    WHEN a transcription is created
    THEN check that the output are defined correctly
    """
    # Create a mock audio file
    audio_data = b"RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x80>\x00\x00\x00}\x00\x00\x02\x00\x10\x00data\x00\x00\x00\x00"

    # Test transcribe
    response = client.post(
        "/transcribe",
        data={"audio": (io.BytesIO(audio_data), "test_audio.wav")},
        content_type="multipart/form-data",
    )

    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["filename"] == "test_audio.wav"
    assert "text" in data[0]
    assert "id" in data[0]


def test_search_endpoint(client):
    """
    GIVEN a filename search query
    WHEN transcription is found in db
    THEN check that transcription is returned successfully
    """
    # Add mock audio file in memory db
    with client.application.app_context():
        test_transcription = Transcription(
            filename="meeting_notes.wav", text="Test meeting notes"
        )
        db.session.add(test_transcription)
        db.session.commit()

    # Test search
    response = client.get("/search?filename=meeting")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["filename"] == "meeting_notes.wav"
