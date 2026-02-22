import librosa
import numpy as np
from .chords import best_chord_for_chroma, smooth_labels, segment_labels

def analyze_wav_for_chords(wav_path, hop_length=2048):
    y, sr = librosa.load(wav_path, sr=None, mono=True, duration=30)

    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop_length)
    chroma = chroma / (np.linalg.norm(chroma, axis=0, keepdims=True) + 1e-9)

    labels = [best_chord_for_chroma(chroma[:, t]) for t in range(chroma.shape[1])]
    labels = smooth_labels(labels, win=11)

    hop_s = hop_length / sr
    segs = segment_labels(labels, hop_s)

    from .chords import merge_short_segments

    segs = merge_short_segments(segs, min_dur=0.6)  # tweak 0.4–1.0s

    chords = [{"t0": float(a), "t1": float(b), "label": lab} for (a, b, lab) in segs]
    return {"bpm": float(tempo), "chords": chords}