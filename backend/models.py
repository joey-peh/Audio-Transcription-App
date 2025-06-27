from datetime import datetime
from app import db
from sqlalchemy import DateTime, String, Text

class Transcription(db.Model):
    __tablename__ = 'transcriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(Text, unique=True, nullable=False)
    filename = db.Column(String(255), nullable=False)
    created_at = db.Column(DateTime, default = datetime.now())

    def __repr__(self):
        return f'<Transcriptions {self.id}>'