from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from uuid import uuid4
from pathlib import Path
import asyncio
import sys

from dsp.audio_io import save_upload_and_convert_to_wav
from dsp.analyze_song import analyze_wav_for_chords
from dsp.chord_tabs import chords_to_note_highway, chords_to_tab_text
from dsp.note_detection import analyze_notes_from_audio

# --- paths ---
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
PROCESSED_DIR = BASE_DIR / "processed"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

# --- app ---
app = FastAPI()

# Serve uploaded audio so frontend can do: /uploads/<jobid>_<originalname>
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- in-memory job store ---
JOBS: dict[str, dict] = {}


class UploadResponse(BaseModel):
    job_id: str
    filename: str  # saved filename in /uploads (jobid_originalname)


class JobStatus(BaseModel):
    job_id: str
    status: str   # "processing" | "done" | "error"
    result: dict | None = None
    error: str | None = None


def _basic_pitch_available() -> bool:
    """True if basic-pitch is available (macOS/Linux). False on Windows (coremltools)."""
    if sys.platform == "win32":
        return False
    try:
        from dsp.note_highway import _which_basic_pitch
        _which_basic_pitch()
        return True
    except Exception:
        return False


@app.get("/health")
def health():
    return {
        "ok": True,
        "basic_pitch": "enabled" if _basic_pitch_available() else "disabled",
        "platform": sys.platform,
    }


async def run_job(job_id: str, wav_path: Path):
    try:
        chords_result = await asyncio.to_thread(analyze_wav_for_chords, wav_path)
        bpm = chords_result.get("bpm")

        # Note highway: prefer basic-pitch (macOS/Linux), else onset-based, else chord-based
        note_highway = None
        if sys.platform != "win32":
            try:
                from dsp.note_highway import build_note_highway
                nh_out_dir = PROCESSED_DIR / f"{job_id}_bp"
                note_highway = await asyncio.to_thread(build_note_highway, wav_path, nh_out_dir)
            except Exception:
                pass
        if note_highway is None:
            try:
                note_result = await asyncio.to_thread(
                    analyze_notes_from_audio,
                    wav_path,
                    bpm=bpm,
                    duration_limit=30.0,
                )
                note_highway = {
                    "notes": note_result["notes"],
                    "duration": note_result["duration"],
                }
            except Exception:
                note_highway = chords_to_note_highway(
                    chords_result.get("chords", []),
                    duration_seconds=30.0,
                    bpm=bpm,
                    strums_per_beat=2,
                )

        tabs_text = chords_to_tab_text(
            chords_result.get("chords", []),
            bpm=bpm,
        )

        result = {
            **chords_result,
            "note_highway": note_highway,
            "tabs": tabs_text,
        }

        # Convert numpy types to native Python for JSON serialization
        def _to_json_safe(obj):
            import numpy as np
            if isinstance(obj, (np.integer, np.int64)):
                return int(obj)
            if isinstance(obj, (np.floating, np.float64)):
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            if isinstance(obj, dict):
                return {k: _to_json_safe(v) for k, v in obj.items()}
            if isinstance(obj, list):
                return [_to_json_safe(v) for v in obj]
            return obj

        JOBS[job_id]["status"] = "done"
        JOBS[job_id]["result"] = _to_json_safe(result)
    except Exception as e:
        JOBS[job_id]["status"] = "error"
        JOBS[job_id]["error"] = str(e)

@app.post("/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...)):
    job_id = str(uuid4())
    JOBS[job_id] = {"status": "processing", "result": None, "error": None}

    try:
        wav_path = await save_upload_and_convert_to_wav(file, UPLOAD_DIR, PROCESSED_DIR, job_id)
        saved_filename = f"{job_id}_{file.filename}"
        raw_path = UPLOAD_DIR / saved_filename
    except Exception as e:
        JOBS[job_id]["status"] = "error"
        JOBS[job_id]["error"] = str(e)
        raise HTTPException(status_code=500, detail=str(e))

    asyncio.create_task(run_job(job_id, wav_path))
    return {"job_id": job_id, "filename": saved_filename}


@app.get("/jobs/{job_id}", response_model=JobStatus)
def job(job_id: str):
    j = JOBS.get(job_id)
    if not j:
        return {"job_id": job_id, "status": "error", "result": None, "error": "job not found"}
    return {"job_id": job_id, "status": j["status"], "result": j["result"], "error": j["error"]}
