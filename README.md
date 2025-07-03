# Audio Transcription Application
A full-stack web application featuring a **Flask (Python)** backend API and an **Angular** frontend, containerized with Docker for speech-to-text transcription.
[![transcription-web-application.png](https://i.postimg.cc/hjMCyZGy/transcription-web-application.png)](https://postimg.cc/phhYyZzz)

## Table of Contents
- [Tech Stack](#tech-stack)
- [Quick Start with Docker](#quick-start-with-docker)
- [Development Setup](#development-setup)
- [Running Tests](#running-tests)

## Tech Stack
- **Backend**: Flask REST API
- **Frontend**: Angular Single-Page Application
- **Database**: SQLite 

## Quick Start with Docker
### Build and run backend
```
cd backend
docker build -t backend .
docker run -p 5000:5000 backend
```
### Build and run frontend
```
cd frontend/transcription_ui
docker build -t frontend .
docker run -p 4200:80 frontend
```

## Development Setup
#### Backend (Flask)
```
cd backend
virtualenv venv # Create environment
source venv/bin/activate  # Windows use: venv\Scripts\activate
pip install -r requirements.txt

python app.py # Run application
```
#### Frontend (Angular)
```
cd frontend/transcription_ui
npm install

ng serve # Start development server
```

## Running Tests
#### Backend Tests
```
cd backend
python -m pytest tests/
```
#### Frontend Tests
```
cd frontend
ng test
```
