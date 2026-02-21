import numpy as np

CHORDS = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]

def merge_short_segments(segs, min_dur=0.5):
    """
    segs: list of (t0,t1,label)
    merges segments shorter than min_dur into neighbors
    """
    if not segs:
        return segs

    out = [list(segs[0])]
    for t0, t1, lab in segs[1:]:
        if lab == out[-1][2]:
            out[-1][1] = t1
        else:
            out.append([t0, t1, lab])

    # merge short ones
    i = 0
    while i < len(out):
        dur = out[i][1] - out[i][0]
        if dur < min_dur and len(out) > 1:
            if i == 0:
                out[i+1][0] = out[i][0]
                out.pop(i)
                continue
            else:
                out[i-1][1] = out[i][1]
                out.pop(i)
                i -= 1
                continue
        i += 1

    return [(a,b,c) for a,b,c in out]

def chord_templates():
    tmpls = {}
    for r in range(12):
        maj = np.zeros(12); maj[r] = 1; maj[(r+4)%12] = 1; maj[(r+7)%12] = 1
        minr = np.zeros(12); minr[r] = 1; minr[(r+3)%12] = 1; minr[(r+7)%12] = 1
        tmpls[f"{CHORDS[r]}"] = maj
        tmpls[f"{CHORDS[r]}m"] = minr
    return tmpls

_TEMPLATES = chord_templates()

def best_chord_for_chroma(c: np.ndarray) -> str:
    best, best_score = None, -1e9
    for name, t in _TEMPLATES.items():
        denom = (np.linalg.norm(c) * np.linalg.norm(t) + 1e-9)
        score = float(np.dot(c, t) / denom)
        if score > best_score:
            best_score = score
            best = name
    return best

def smooth_labels(labels, win=9):
    out = []
    n = len(labels)
    for i in range(n):
        a = max(0, i-win//2)
        b = min(n, i+win//2+1)
        chunk = labels[a:b]
        out.append(max(set(chunk), key=chunk.count))
    return out

def segment_labels(labels, hop_s):
    segs = []
    if not labels:
        return segs
    cur = labels[0]
    t0 = 0.0
    for i, lab in enumerate(labels[1:], start=1):
        if lab != cur:
            t1 = i * hop_s
            segs.append((t0, t1, cur))
            cur = lab
            t0 = t1
    segs.append((t0, len(labels)*hop_s, cur))
    return segs