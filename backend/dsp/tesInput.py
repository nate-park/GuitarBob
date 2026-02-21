import sounddevice as sd
import numpy as np
import time

print("Default device:", sd.default.device)
print("All devices:")
for i, d in enumerate(sd.query_devices()):
    if d["max_input_channels"] > 0:
        print(i, d["name"], "| inputs:", d["max_input_channels"], "| default_sr:", d["default_samplerate"])

INPUT_ID = None  # <-- set this to your interface index from the list above
sr = 48000

if INPUT_ID is not None:
    sd.default.device = (INPUT_ID, None)

while True:
    audio = sd.rec(int(sr * 0.2), samplerate=sr, channels=2, dtype="float32")
    sd.wait()
    rms = np.sqrt(np.mean(audio**2, axis=0))
    peak = np.max(np.abs(audio), axis=0)
    print("RMS:", rms, "PEAK:", peak)
    time.sleep(0.2)