/**
 * Map pitch (Hz or note name) to guitar fretboard position.
 * Standard tuning: E2(40) A2(45) D3(50) G3(55) B3(59) e4(64)
 */
const OPEN_MIDI = [40, 45, 50, 55, 59, 64];

const NOTE_TO_MIDI = {
  C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6,
  G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11,
};

function hzToMidi(hz) {
  if (!hz || hz <= 0) return null;
  return Math.round(69 + 12 * Math.log2(hz / 440));
}

function noteNameToMidi(name) {
  if (!name || typeof name !== 'string') return null;
  const match = name.match(/^([A-G][#b]?)(\d+)$/);
  if (!match) return null;
  const [, letter, octave] = match;
  const semitone = NOTE_TO_MIDI[letter];
  if (semitone == null) return null;
  return parseInt(octave, 10) * 12 + semitone;
}

/**
 * Given MIDI, return best (string, fret). Prefers lower fret.
 */
export function midiToFretboard(midi, maxFret = 12) {
  if (midi == null || midi < 40 || midi > 127) return null;
  let best = null;
  let bestFret = 999;
  for (let s = 0; s < 6; s++) {
    const fret = midi - OPEN_MIDI[s];
    if (fret >= 0 && fret <= maxFret && fret < bestFret) {
      bestFret = fret;
      best = { string: s, fret };
    }
  }
  return best;
}

/**
 * Map live event { pitch_hz, note } to { string, fret } or null.
 */
export function eventToFretboard(event, maxFret = 12) {
  if (!event || typeof event !== 'object') return null;
  let midi = null;
  if (event.pitch_hz) midi = hzToMidi(event.pitch_hz);
  if (midi == null && event.note) midi = noteNameToMidi(event.note);
  if (midi == null) return null;
  return midiToFretboard(midi, maxFret);
}
