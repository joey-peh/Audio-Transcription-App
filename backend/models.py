from datetime import datetime
from sqlalchemy import DateTime, String, Text
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy() 

class Transcription(db.Model):
    __tablename__ = 'transcriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(Text, nullable=False)
    filename = db.Column(String(255), nullable=False)
    created_at = db.Column(DateTime, default = datetime.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "text": self.text,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }