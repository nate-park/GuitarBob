# backend/dsp/live_listen.py
import asyncio
import os
import numpy as np
import sounddevice as sd
import time
import librosa


def _get_input_device():
    """Use Scarlett if available, else default. Set SCARLETT_DEVICE=index to force."""
    idx = os.environ.get("SCARLETT_DEVICE")
    if idx is not None:
        try:
            return int(idx)
        except ValueError:
            pass
    # Prefer Scarlett by name
    devices = sd.query_devices(kind="input")
    for i, d in enumerate(devices):
        name = str(d.get("name", "")).lower()
        if "scarlett" in name or "focusrite" in name:
            return i
    return None  # system default


def hz_to_note_name(hz: float):
    if hz is None or hz <= 0 or np.isnan(hz):
        return None
    midi = librosa.hz_to_midi(hz)
    return librosa.midi_to_note(int(round(midi)))

async def stream_live_guitar_events(
    device=None,          # None = auto-detect Scarlett or default
    channels: int = 2,    # Scarlett 2i2 typically has 2 input channels
    sr: int | None = None,
    hop_size: int = 1024,
    win_size: int = 4096,
):
    loop = asyncio.get_event_loop()
    q: asyncio.Queue[np.ndarray] = asyncio.Queue()

    if device is None:
        device = _get_input_device()
    if sr is None:
        try:
            sr = int(sd.query_devices(device)["default_samplerate"])
        except Exception:
            sr = 44100

    buf = np.zeros(win_size, dtype=np.float32)
    last_send = 0.0
    last_energy = 0.0

    def callback(indata, frames, time_info, status):
        # push full multichannel block
        loop.call_soon_threadsafe(q.put_nowait, indata.copy().astype(np.float32))

    stream = sd.InputStream(
        samplerate=sr,
        blocksize=hop_size,
        channels=channels,
        callback=callback,
        device=device,
    )

    stream.start()
    try:
        while True:
            block = await q.get()  # shape: (hop_size, channels)

            # pick loudest channel (guitar might be plugged into input 2)
            if block.ndim == 2 and block.shape[1] > 1:
                rms_per_ch = np.sqrt(np.mean(block**2, axis=0))
                ch = int(np.argmax(rms_per_ch))
                x = block[:, ch]
            else:
                x = block[:, 0] if block.ndim == 2 else block

            # rolling window for pitch estimation
            if len(x) >= win_size:
                buf[:] = x[-win_size:]
            else:
                buf = np.roll(buf, -len(x))
                buf[-len(x):] = x

            energy = float(np.sqrt(np.mean(buf**2)) + 1e-12)

            # gate silence: prevents fake “B5 @ 1000Hz” when input is basically silent
            if energy < 1e-6:
                now = time.time()
                if now - last_send > 0.05:
                    yield {
                        "ts": now,
                        "pitch_hz": None,
                        "note": None,
                        "confidence": 0.0,
                        "onset": False,
                        "energy": energy,
                    }
                    last_send = now
                continue

            onset = (energy - last_energy) > 0.01
            last_energy = 0.9 * last_energy + 0.1 * energy

            # pitch with librosa.yin
            f0 = librosa.yin(buf, fmin=80, fmax=1000, sr=sr)
            hz = float(np.nanmedian(f0))
            note = hz_to_note_name(hz)

            # confidence proxy: energy + stability
            stability = float(np.nanstd(f0))
            conf = float(max(0.0, min(1.0, (energy / 0.05) * (1.0 - stability / 80.0))))

            now = time.time()
            if now - last_send > 0.05:
                yield {
                    "ts": now,
                    "pitch_hz": hz,
                    "note": note,
                    "confidence": conf,
                    "onset": bool(onset),
                    "energy": energy,
                }
                last_send = now
    finally:
        stream.stop()
        stream.close()