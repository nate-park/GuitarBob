from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import uuid
from fastapi import HTTPException
from dsp.audio_io import save_upload_and_convert_to_wav
from dsp.analyze_song import analyze_wav_for_chords
from dsp.live_listen import stream_live_guitar_events

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = Path(__file__).parent
UPLOADS = BASE / "storage" / "uploads"
PROCESSED = BASE / "storage" / "processed"
UPLOADS.mkdir(parents=True, exist_ok=True)
PROCESSED.mkdir(parents=True, exist_ok=True)

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    try:
        song_id = str(uuid.uuid4())
        wav_path = await save_upload_and_convert_to_wav(file, UPLOADS, PROCESSED, song_id)
        analysis = analyze_wav_for_chords(wav_path)
        analysis["song_id"] = song_id
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/listen")
async def ws_listen(websocket: WebSocket):
    await websocket.accept()
    try:
        async for evt in stream_live_guitar_events(device=1, channels=2):
            await websocket.send_json(evt)
    except WebSocketDisconnect:
        return