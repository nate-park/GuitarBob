import asyncio
from live_listen import stream_live_guitar_events

async def main():
    last_note = None

    async for ev in stream_live_guitar_events(device=1, channels=2):  # <-- set device index here
        note = ev["note"]
        conf = ev["confidence"]
        hz = ev["pitch_hz"]
        energy = ev["energy"]
        onset = ev["onset"]

        # only print when we have a real note and it changed (or an onset happened)
        if note and conf > 0.35 and (note != last_note or onset):
            print(f"{note:4s}  {hz:7.1f} Hz   conf={conf:.2f}  energy={energy:.4f}  onset={onset}")
            last_note = note

asyncio.run(main())