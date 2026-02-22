"""
Generate note_highway and chord tabs from chord analysis (no basic-pitch).
Chord shapes match frontend GuitarHeroFretboard CHORD_SHAPES.
[lowE, A, D, G, B, highE]; -1 = muted, 0 = open, >0 = fretted
"""

# Chord shapes: [string0, 1, 2, 3, 4, 5] = [lowE, A, D, G, B, highE]
CHORD_SHAPES = {
    "C": [0, 3, 2, 0, 1, 0],
    "D": [-1, -1, 0, 2, 3, 2],
    "E": [0, 2, 2, 1, 0, 0],
    "F": [1, 3, 3, 2, 1, 1],
    "G": [3, 2, 0, 0, 3, 3],
    "A": [0, 0, 2, 2, 2, 0],
    "Am": [0, 0, 2, 2, 1, 0],
    "B": [2, 2, 4, 4, 4, 2],
    "Bm": [2, 3, 4, 4, 3, 2],
}

# Map analysis output to supported shapes (fallback for C#m, F#m, etc.)
CHORD_ALIASES = {
    "C#": "C", "C#m": "Am", "Db": "C", "Dbm": "Am",
    "D#": "D", "D#m": "Bm", "Eb": "D", "Ebm": "Bm",
    "F#": "F", "F#m": "Am", "Gb": "F", "Gbm": "Am",
    "G#": "G", "G#m": "Am", "Ab": "G", "Abm": "Am",
    "A#": "A", "A#m": "Bm", "Bb": "A", "Bbm": "Bm",
}


def _normalize_chord(label: str) -> str | None:
    if not label or not isinstance(label, str):
        return None
    lab = label.strip()
    return CHORD_ALIASES.get(lab, lab) if lab in CHORD_SHAPES else CHORD_ALIASES.get(lab)


def chords_to_note_highway(
    chords: list,
    duration_seconds: float = 30.0,
    bpm: float | None = None,
    strums_per_beat: int = 2,
) -> dict:
    """
    Convert chord segments to note_highway format for PracticeVisualizer.
    chords: [{"t0": float, "t1": float, "label": str}, ...]
    Returns: {"duration": float, "notes": [{"time": s, "string": 0-5, "fret": int, "duration": s}, ...]}
    """
    notes = []
    duration = 0.0
    note_duration = 0.10

    if bpm and bpm > 0:
        beat_s = 60.0 / bpm
        strum_interval = beat_s / strums_per_beat
    else:
        strum_interval = 0.5

    for c in chords or []:
        t0 = float(c.get("t0", 0))
        t1 = float(c.get("t1", t0))
        label = c.get("label", "")
        chord = _normalize_chord(label)
        if not chord or chord not in CHORD_SHAPES:
            continue

        shape = CHORD_SHAPES[chord]
        t = t0
        while t < t1 - 0.02:
            for string_idx, fret in enumerate(shape):
                if fret == -1:
                    continue
                notes.append({
                    "time": t,
                    "string": string_idx,
                    "fret": fret,
                    "duration": note_duration,
                })
            t += strum_interval
        duration = max(duration, t1)

    return {"duration": max(duration, duration_seconds), "notes": notes}


def chords_to_tab_text(chords: list, bpm: float | None = None) -> str:
    """
    Generate simple chord tab text for Results page.
    """
    lines = []
    if bpm:
        lines.append(f"Tempo: {round(bpm)} BPM")
        lines.append("")
    lines.append("Chord progression (time -> chord):")
    lines.append("-" * 40)
    for c in chords or []:
        t0 = c.get("t0", 0)
        t1 = c.get("t1", t0)
        label = c.get("label", "?")
        lines.append(f"  [{t0:.1f}s - {t1:.1f}s]  {label}")
    return "\n".join(lines)
