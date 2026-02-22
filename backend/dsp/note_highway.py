from __future__ import annotations

import csv
import os
import shutil
import subprocess
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Standard tuning (MIDI) for open strings, string index matches your UI:
# 0=low E2, 1=A2, 2=D3, 3=G3, 4=B3, 5=high e4
OPEN_MIDI = [40, 45, 50, 55, 59, 64]

REQUIRED = {"start_time_s", "end_time_s", "pitch_midi", "velocity"}


def _which_basic_pitch() -> str:
    """
    Find the basic-pitch executable.
    Priority:
      1) BASIC_PITCH_EXE env var
      2) basic-pitch / basic-pitch.exe on PATH (venv Scripts usually adds it)
    """
    env = os.getenv("BASIC_PITCH_EXE")
    if env:
        return env

    exe = shutil.which("basic-pitch") or shutil.which("basic-pitch.exe")
    if exe:
        return exe

    raise RuntimeError(
        "basic-pitch executable not found. Install with: pip install basic-pitch "
        "and run from the same venv, or set BASIC_PITCH_EXE to the full path."
    )


def run_basic_pitch(out_dir: Path, audio_path: Path) -> Path:
    """
    Runs basic-pitch CLI and returns path to the generated *_basic_pitch.csv.
    """
    out_dir.mkdir(parents=True, exist_ok=True)

    exe = _which_basic_pitch()
    cmd = [exe, str(out_dir), str(audio_path), "--save-note-events"]

    # Basic Pitch prints a lot; we still want errors if it fails.
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"basic-pitch failed ({proc.returncode}): {proc.stderr or proc.stdout}")

    # Usually <stem>_basic_pitch.csv
    stem = audio_path.stem
    csv_path = out_dir / f"{stem}_basic_pitch.csv"
    if csv_path.exists():
        return csv_path

    # Fallback: first match
    matches = list(out_dir.glob("*_basic_pitch.csv"))
    if not matches:
        raise FileNotFoundError(f"No *_basic_pitch.csv found in {out_dir}")
    return matches[0]


def load_notes(csv_path: Path) -> List[Dict]:
    notes: List[Dict] = []
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, skipinitialspace=True)
        fieldnames = set(reader.fieldnames or [])
        missing = REQUIRED - fieldnames
        if missing:
            raise ValueError(f"CSV missing columns: {missing}. Got: {reader.fieldnames}")

        for row in reader:
            row.pop(None, None)
            start = float(row["start_time_s"])
            end = float(row["end_time_s"])
            midi = int(round(float(row["pitch_midi"])))
            vel = int(round(float(row["velocity"])))
            notes.append({"start": start, "end": end, "midi": midi, "velocity": vel})
    return notes


def _candidates_for_midi(midi: int, max_fret: int) -> List[Tuple[int, int]]:
    """
    Returns [(string, fret)] that can play midi within max_fret.
    """
    out: List[Tuple[int, int]] = []
    for s, open_m in enumerate(OPEN_MIDI):
        fret = midi - open_m
        if 0 <= fret <= max_fret:
            out.append((s, fret))
    return out


def _assign_frame(notes: List[Dict], max_fret: int) -> List[Dict]:
    """
    Assign notes in the same time-frame to unique strings if possible.
    Greedy: higher pitches try to go to higher strings; prefer lower frets.
    """
    used = set()
    out: List[Dict] = []

    # high pitch first
    for n in sorted(notes, key=lambda x: x["midi"], reverse=True):
        cands = _candidates_for_midi(n["midi"], max_fret)
        if not cands:
            continue

        # Score candidate: prefer unused strings, lower fret, and "reasonable" string for pitch
        # Heuristic: ideal string index increases with pitch
        ideal = min(5, max(0, int((n["midi"] - 40) / 5)))  # rough mapping
        scored = []
        for s, f in cands:
            # penalize string collisions heavily
            collision = 1000 if s in used else 0
            score = collision + (f * 2) + abs(s - ideal)
            scored.append((score, s, f))
        scored.sort()

        _, s, f = scored[0]
        used.add(s)
        out.append(
            {
                "time": float(n["start"]),
                "string": int(s),
                "fret": int(f),
                "duration": float(max(0.0, n["end"] - n["start"])),
            }
        )
    return out


def build_note_highway(
    audio_path: Path,
    out_dir: Path,
    *,
    max_fret: int = 12,
    min_velocity: int = 25,
    frame_window_s: float = 0.04,
    max_notes: int = 1200,
) -> Dict:
    """
    Returns a PracticeVisualizer-friendly structure:
      {
        "duration": <seconds>,
        "notes": [{ "time": <seconds>, "string": 0..5, "fret": 0..max_fret, "duration": <seconds> }, ...]
      }

    - Uses basic-pitch CLI to extract note events.
    - Filters low-velocity noise.
    - Groups notes that start within `frame_window_s` seconds to form chord-ish frames.
    - Assigns pitches to strings/frets, trying to avoid multiple notes on same string in a frame.

    Tip: If it looks too busy, increase min_velocity (e.g., 40) or lower max_notes.
    """
    csv_path = run_basic_pitch(out_dir, audio_path)
    raw_notes = load_notes(csv_path)

    # Filter noise
    raw_notes = [n for n in raw_notes if n["velocity"] >= min_velocity]
    raw_notes.sort(key=lambda n: n["start"])

    # Group into frames
    frames: List[List[Dict]] = []
    i = 0
    while i < len(raw_notes):
        t0 = raw_notes[i]["start"]
        frame = [raw_notes[i]]
        i += 1
        while i < len(raw_notes) and (raw_notes[i]["start"] - t0) <= frame_window_s:
            frame.append(raw_notes[i])
            i += 1
        frames.append(frame)

    notes_out: List[Dict] = []
    for frame in frames:
        notes_out.extend(_assign_frame(frame, max_fret=max_fret))
        if len(notes_out) >= max_notes:
            break

    duration = 0.0
    if raw_notes:
        duration = max(n["end"] for n in raw_notes)

    # PracticeVisualizer expects `duration` in seconds
    return {"duration": float(duration), "notes": notes_out}
