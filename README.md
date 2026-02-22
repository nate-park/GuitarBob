# GuitarBob 🎸

**AI guitar tutor** – Upload a song, get chords & tabs, and learn with **Bob** – your friendly Duolingo-style guitar buddy!

## Quick start

You need **two terminals** – one for the backend, one for the frontend.

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

#### Mac: accurate note transcription (basic-pitch)

On **macOS**, for best note accuracy in Practice mode, install basic-pitch:

```bash
cd backend
source venv/bin/activate
pip install basic-pitch
```

Then restart the backend. Check http://127.0.0.1:8000/health – it should show `"basic_pitch": "enabled"`.

On Windows, basic-pitch is not supported (coremltools); the app uses chord-based notes instead.

### 2. Frontend (React + Vite)

In a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The frontend proxies API calls to the backend on port 8000.

## What's inside

- **Landing** – Bob welcomes you; choose "Upload a song" or "Practice mode"
- **Upload** – Drag & drop or pick an audio file (MP3, WAV, etc.)
- **Processing** – Bob "listens" and shows a fun loading state
- **Results** – Chords and tabs (mock data for now; plug in your API)
- **Practice** – Step-by-step lesson with Bob guiding you through chords

## Front end stack

- **React 18** + **Vite** + **Tailwind CSS**
- **React Router** for navigation
- **Bob** – SVG mascot with poses: default (wave), happy, thinking, teaching, listening, sad
- Duolingo-like UI: Fredoka + Nunito, green/orange/blue palette, rounded buttons, speech bubbles, streak/hearts/XP bar

## Hardware note

Use your **electric guitar + audio interface** to play along during Practice. (Audio input/recognition can be wired in later.)

## Build

```bash
npm run build
npm run preview
```

Have fun and rock on! 🎸
