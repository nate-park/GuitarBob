# GuitarBob – Mac Setup (basic-pitch branch)

This branch adds **basic-pitch** support for accurate note transcription on macOS.

## Quick setup on Mac

### 1. Backend

```bash
cd GuitarBob/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install basic-pitch
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend (new terminal)

```bash
cd GuitarBob/frontend
npm install
npm run dev
```

### 3. Open app

Open http://localhost:5173 in your browser.

### 4. Verify basic-pitch

Visit http://127.0.0.1:8000/health – you should see:

```json
{
  "ok": true,
  "basic_pitch": "enabled",
  "platform": "darwin"
}
```

## If you get errors

- **basic-pitch install fails**: Ensure you're on macOS. basic-pitch requires coremltools, which only works on Mac.
- **Port in use**: Stop any other processes on ports 5173 or 8000.
- **Python version**: Python 3.9+ recommended.

## What's different

- On Mac: Uses basic-pitch for accurate note-level transcription in Practice mode.
- On Windows: Falls back to chord-based notes (basic-pitch not supported).
