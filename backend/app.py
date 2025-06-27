from flask import Flask, jsonify
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///transcriptions.db"
db = SQLAlchemy(app)

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "timestamp": datetime.now()})


@app.route("/transribe", methods=["POST"])
def transribe():
    return ""


@app.route("/transcriptions", methods=["GET"])
def transcriptions():
    return ""


@app.route("/search", methods=["GET"])
def search():
    return ""


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        app.run(debug=True)
