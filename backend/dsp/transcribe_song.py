import argparse
import csv
import json
import os
import subprocess
from pathlib import Path

NOTE_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
def midi_to_name(m: int) -> str:
    octave = (m // 12) - 1
    return f"{NOTE_NAMES[m % 12]}{octave}"

def run_basic_pitch(basic_pitch_exe: str, out_dir: Path, mp3_path: Path):
    out_dir.mkdir(parents=True, exist_ok=True)
    cmd = [
        basic_pitch_exe,
        str(out_dir),
        str(mp3_path),
        "--save-note-events",
    ]
    print("Running:", " ".join(cmd))
    subprocess.check_call(cmd)

def find_csv(out_dir: Path, mp3_path: Path) -> Path:
    # Basic Pitch outputs: <stem>_basic_pitch.csv
    stem = mp3_path.stem
    csv_path = out_dir / f"{stem}_basic_pitch.csv"
    if not csv_path.exists():
        # fallback: find any *_basic_pitch.csv
        matches = list(out_dir.glob("*_basic_pitch.csv"))
        if not matches:
            raise FileNotFoundError(f"No basic_pitch csv found in {out_dir}")
        return matches[0]
    return csv_path


import csv

REQUIRED = {"start_time_s", "end_time_s", "pitch_midi", "velocity"}

def load_notes(csv_path: str):
    notes = []
    with open(csv_path, "r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, skipinitialspace=True)

        fieldnames = set(reader.fieldnames or [])
        missing = REQUIRED - fieldnames
        if missing:
            raise ValueError(f"CSV missing columns: {missing}. Got: {reader.fieldnames}")

        for row in reader:
            # If the CSV line has an extra trailing comma, DictReader stores extras under key None
            row.pop(None, None)

            # Parse
            start = float(row["start_time_s"])
            end = float(row["end_time_s"])
            pitch_midi = int(round(float(row["pitch_midi"])))
            velocity = int(round(float(row["velocity"])))

            pitch_bend = row.get("pitch_bend", "")
            pitch_bend = float(pitch_bend) if pitch_bend not in ("", None) else 0.0

            notes.append({
            # time (aliases)
            "start": start,
            "end": end,
            "start_time_s": start,
            "end_time_s": end,

            # pitch (aliases)
            "midi": pitch_midi,
            "pitch_midi": pitch_midi,

            # other
            "velocity": velocity,
            "pitch_bend": pitch_bend,
            "bend": pitch_bend,
            })

    return notes


def group_into_frames(notes, window_s=0.04):
    """Group notes that start within window_s into a single 'frame' (chord-ish)."""
    frames = []
    i = 0
    while i < len(notes):
        t0 = notes[i]["start"]
        frame = [notes[i]]
        i += 1
        while i < len(notes) and (notes[i]["start"] - t0) <= window_s:
            frame.append(notes[i])
            i += 1

        # unique pitch classes for chord-ish display
        pcs = sorted({n["midi"] % 12 for n in frame})
        names = [NOTE_NAMES[pc] for pc in pcs]

        frames.append({
            "time": t0,
            "notes": frame,
            "pitch_classes": pcs,
            "pitch_class_names": names,
        })
    return frames

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mp3", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--basic_pitch_exe", default=None)
    ap.add_argument("--frame_window", type=float, default=0.04)
    args = ap.parse_args()

    mp3_path = Path(args.mp3)
    out_dir = Path(args.out)

    # If not provided, assume venv Scripts path style on Windows
    basic_pitch_exe = args.basic_pitch_exe
    if basic_pitch_exe is None:
        basic_pitch_exe = str(Path(".") / ".venv311" / "Scripts" / "basic-pitch.exe")

    run_basic_pitch(basic_pitch_exe, out_dir, mp3_path)
    csv_path = find_csv(out_dir, mp3_path)
    notes = load_notes(csv_path)
    frames = group_into_frames(notes, window_s=args.frame_window)

    result = {
        "input": str(mp3_path),
        "csv": str(csv_path),
        "note_count": len(notes),
        "notes": notes,
        "frames": frames,
    }

    json_path = out_dir / f"{mp3_path.stem}_notes.json"
    json_path.write_text(json.dumps(result, indent=2))
    print("Saved:", json_path)

if __name__ == "__main__":
    main()