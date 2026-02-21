from pathlib import Path
from fastapi import UploadFile
import shutil
import subprocess

async def save_upload_and_convert_to_wav(
    file: UploadFile,
    uploads_dir: Path,
    processed_dir: Path,
    song_id: str,
    target_sr: int = 44100,
):
    raw_path = uploads_dir / f"{song_id}_{file.filename}"
    with raw_path.open("wb") as f:
        shutil.copyfileobj(file.file, f)

    wav_path = processed_dir / f"{song_id}.wav"

    cmd = [
        "ffmpeg", "-y",
        "-i", str(raw_path),
        "-ac", "1",
        "-ar", str(target_sr),
        str(wav_path)
    ]
    # If this errors, ffmpeg isn't on PATH
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg failed ({proc.returncode}): {proc.stderr}")
    return wav_path