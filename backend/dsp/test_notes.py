import asyncio
import math
import librosa
from live_listen import stream_live_guitar_events

def cents_off(hz: float):
    """How many cents sharp/flat relative to nearest equal-tempered note."""
    if not hz or hz <= 0 or math.isnan(hz):
        return None, None, None
    midi = float(librosa.hz_to_midi(hz))
    nearest = int(round(midi))
    note = librosa.midi_to_note(nearest)
    ref_hz = float(librosa.midi_to_hz(nearest))
    cents = 1200.0 * math.log2(hz / ref_hz)
    return note, ref_hz, cents

async def main():
    last_note = None

    async for ev in stream_live_guitar_events(device=1, channels=2):
        hz = ev["pitch_hz"]
        conf = float(ev["confidence"] or 0.0)
        energy = float(ev["energy"] or 0.0)
        onset = bool(ev["onset"])

        # Show level in dBFS so you can tell if your input is super quiet
        db = 20.0 * math.log10(energy + 1e-12)

        # Ignore near-silence (TEMP: set low so you can debug)
        if db < -95:
            continue

        note, ref_hz, cents = cents_off(hz)
        if note is None:
            print(f"(no pitch)  conf={conf:.2f}  level={db:6.1f} dBFS  onset={onset}")
            continue

        # TEMP thresholds: loosen so you see something while calibrating
        should_print = (conf > 0.05) and (note != last_note or onset or abs(cents) > 5)

        if should_print:
            print(
                f"{note:4s}  {hz:7.1f} Hz  ({cents:+6.1f} cents)  "
                f"conf={conf:.2f}  level={db:6.1f} dBFS  onset={onset}"
            )
            last_note = note

asyncio.run(main())