"""
Onset-based note detection from audio.
Detects individual notes and chords, distinguishes arpeggios (notes one-by-one)
from strums (notes together). Uses librosa onset + chroma.
"""
from __future__ import annotations

import numpy as np
import librosa

from .chord_tabs import CHORD_SHAPES

# Standard tuning MIDI: 0=low E2, 1=A2, 2=D3, 3=G3, 4=B3, 5=high e4
OPEN_MIDI = [40, 45, 50, 55, 59, 64]
CHROMA_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

# Notes within this many seconds collapse to same time (strum)
STRUM_WINDOW_S = 0.08
# Cluster span above this = arpeggio (keep individual times)
ARPEGGIO_SPAN_S = 0.15
# Quantize times to this grid (fraction of beat)
QUANTIZE_DIV = 16  # 16th notes


def _chroma_to_pitch_classes(chroma: np.ndarray, threshold: float = 0.25) -> list[int]:
    """Return list of pitch class indices (0-11) above threshold."""
    c = chroma.flatten() if chroma.ndim > 1 else chroma
    if len(c) < 12:
        return []
    c = c[:12]
    peak = float(np.max(c)) if np.max(c) > 0 else 1.0
    thresh = max(threshold, peak * 0.4)
    return [i for i in range(12) if c[i] >= thresh]


def _pitch_classes_to_chord_shape(pcs: list[int]) -> list[int] | None:
    """Map pitch classes to a chord shape [s0,s1,s2,s3,s4,s5]. Returns None if no match."""
    if len(pcs) < 2:
        return None
    # Try to match known chord shapes
    for name, shape in CHORD_SHAPES.items():
        shape_pcs = set()
        for s, f in enumerate(shape):
            if f >= 0:
                midi = OPEN_MIDI[s] + f
                shape_pcs.add(midi % 12)
        if set(pcs) <= shape_pcs and len(shape_pcs) >= 2:
            return shape
    return None


def _single_note_to_fret(pc: int) -> tuple[int, int] | None:
    """Map pitch class (0-11) to best (string, fret). Guitar range E2(40)-E6(88)."""
    best = None
    best_fret = 99
    for octave in range(2, 7):
        midi = octave * 12 + pc
        if midi < 40 or midi > 88:
            continue
        for s, open_m in enumerate(OPEN_MIDI):
            fret = midi - open_m
            if 0 <= fret <= 12 and fret < best_fret:
                best_fret = fret
                best = (s, fret)
    return best


def _extract_notes_at_onset(
    chroma: np.ndarray,
    frame: int,
    win: int = 2,
    prev_chroma: np.ndarray | None = None,
) -> list[tuple[int, int]]:
    """
    At onset frame, get chroma and return [(string, fret), ...].
    If prev_chroma given, use delta to detect single new note (arpeggio).
    """
    c = chroma[:, max(0, frame - win) : frame + win + 1]
    if c.size == 0:
        return []
    chroma_vec = np.mean(c, axis=1)
    if len(chroma_vec) < 12:
        return []

    # Delta from previous frame: highlights the NEW note (for arpeggios)
    if prev_chroma is not None and prev_chroma.size >= 12:
        delta = chroma_vec[:12] - prev_chroma[:12]
        pos_delta = np.maximum(delta, 0)
        if np.max(pos_delta) > 0.15:
            pc_new = int(np.argmax(pos_delta))
            n = _single_note_to_fret(pc_new)
            if n:
                return [n]

    pcs = _chroma_to_pitch_classes(chroma_vec)
    if not pcs:
        return []

    # Single strong note (one pitch class dominates)
    if len(pcs) == 1:
        n = _single_note_to_fret(pcs[0])
        return [n] if n else []

    shape = _pitch_classes_to_chord_shape(pcs)
    if shape and len(pcs) >= 2:
        notes = []
        for s, f in enumerate(shape):
            if f >= 0:
                notes.append((s, f))
        return notes

    # Fallback: strongest single
    idx = np.argmax(chroma_vec[:12])
    n = _single_note_to_fret(idx)
    return [n] if n else []


def analyze_notes_from_audio(
    wav_path,
    hop_length: int = 512,
    bpm: float | None = None,
    duration_limit: float = 30.0,
) -> dict:
    """
    Detect note-level events from audio using onsets + chroma.
    Returns:
      notes: [{"time": s, "string": 0-5, "fret": int, "duration": s}, ...]
      duration: float
      bpm: float
    Notes are either individual (intro, arpeggio) or grouped (strum).
    """
    y, sr = librosa.load(wav_path, sr=None, mono=True, duration=duration_limit)

    tempo, _ = librosa.beat.beat_track(y=y, sr=sr, hop_length=hop_length)
    bpm = bpm or float(tempo)
    beat_s = 60.0 / bpm if bpm > 0 else 0.5
    quantize_s = beat_s / QUANTIZE_DIV

    onset_frames = librosa.onset.onset_detect(
        y=y,
        sr=sr,
        hop_length=hop_length,
        units="frames",
        backtrack=True,
    )
    onset_times = librosa.frames_to_time(onset_frames, sr=sr, hop_length=hop_length)

    chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop_length)
    hop_s = hop_length / sr
    n_frames = chroma.shape[1]

    raw_events: list[tuple[float, list[tuple[int, int]]]] = []
    for i, t in enumerate(onset_times):
        frame = int(round(t / hop_s))
        frame = max(0, min(frame, n_frames - 1))
        prev = chroma[:, frame - 1] if frame >= 1 else None
        notes = _extract_notes_at_onset(chroma, frame, prev_chroma=prev)
        if notes:
            raw_events.append((float(t), notes))

    # Group nearby onsets: strum (collapse) vs arpeggio (preserve)
    out_notes: list[dict] = []
    note_dur = 0.10
    i = 0

    while i < len(raw_events):
        t0, notes0 = raw_events[i]
        cluster = [(t0, notes0)]
        j = i + 1
        while j < len(raw_events):
            tj, notesj = raw_events[j]
            if tj - t0 <= STRUM_WINDOW_S:
                cluster.append((tj, notesj))
                j += 1
            else:
                break

        # Check if cluster is strum (same chord, tight) or arpeggio (spread)
        times = [c[0] for c in cluster]
        span = max(times) - min(times) if len(times) > 1 else 0

        # Merge chord notes from cluster
        all_notes: dict[tuple[int, int], float] = {}
        for t, notes in cluster:
            for (s, f) in notes:
                key = (s, f)
                if key not in all_notes or t < all_notes[key]:
                    all_notes[key] = t

        if span <= STRUM_WINDOW_S and len(all_notes) >= 2:
            # Strum: collapse to quantized time
            t_quant = round(min(times) / quantize_s) * quantize_s
            t_quant = max(0, t_quant)
            for (s, f) in all_notes:
                out_notes.append({
                    "time": t_quant,
                    "string": s,
                    "fret": f,
                    "duration": note_dur,
                })
        elif span > ARPEGGIO_SPAN_S or len(cluster) >= 3:
            # Arpeggio: preserve individual times, quantize slightly
            for t, notes in cluster:
                t_q = round(t / quantize_s) * quantize_s
                t_q = max(0, t_q)
                for (s, f) in notes:
                    out_notes.append({
                        "time": t_q,
                        "string": s,
                        "fret": f,
                        "duration": note_dur,
                    })
        else:
            # Single or small cluster
            for t, notes in cluster:
                t_q = round(t / quantize_s) * quantize_s
                for (s, f) in notes:
                    out_notes.append({
                        "time": t_q,
                        "string": s,
                        "fret": f,
                        "duration": note_dur,
                    })

        i = j

    out_notes.sort(key=lambda n: (n["time"], n["string"]))

    # Remove near-duplicates (same time, same string)
    seen: set[tuple[float, int]] = set()
    deduped = []
    for n in out_notes:
        key = (round(n["time"], 3), n["string"])
        if key not in seen:
            seen.add(key)
            deduped.append(n)

    duration = float(len(y) / sr) if len(y) > 0 else 0
    if deduped:
        duration = max(duration, max(n["time"] for n in deduped) + 0.5)

    return {
        "notes": deduped,
        "duration": min(duration, duration_limit),
        "bpm": float(bpm),
    }
