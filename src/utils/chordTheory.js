/**
 * Chord theory utilities for guitar standard tuning (EADGBE).
 * Maps fretboard positions to note names and chord intervals.
 *
 * Standard tuning open strings (6th to 1st): E A D G B E
 * Semitones from C: E=4, A=9, D=2, G=7, B=11
 */

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NAMES = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];

// Open string semitones from C (string 0 = low E, string 5 = high e)
const OPEN_SEMITONES = [4, 9, 2, 7, 11, 4];

/**
 * Get note name and semitones (0-11) at a string/fret position.
 * @param {number} stringIdx - 0-5 (low E to high e)
 * @param {number} fret - 0-12+ (0 = open)
 * @returns {{ noteName: string, semitones: number }}
 */
export function getNoteAt(stringIdx, fret) {
  const semitones = (OPEN_SEMITONES[stringIdx] + fret) % 12;
  return {
    noteName: NOTES[semitones],
    semitones,
  };
}

/**
 * Chord formulas: semitones from root for each chord type.
 */
const CHORD_FORMULAS = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  dom7: [0, 4, 7, 10],
  min7: [0, 3, 7, 10],
  maj7: [0, 4, 7, 11],
  dim: [0, 3, 6],
  dim7: [0, 3, 6, 9],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  power: [0, 7],
};

/**
 * Interval labels for display.
 */
const INTERVAL_LABELS = {
  0: 'Root',
  1: 'b2',
  2: '2',
  3: 'b3',
  4: '3rd',
  5: '4',
  6: 'b5',
  7: '5th',
  8: '#5',
  9: '6',
  10: '7th',
  11: 'maj7',
};

/**
 * Parse chord library key to root semitones and chord type.
 * @param {string} chordKey - e.g. "C", "Am", "C7", "Csharp", "Asharp_m"
 */
export function parseChordKey(chordKey) {
  const rootMap = {
    C: 0, Csharp: 1, D: 2, Dsharp: 3, E: 4, F: 5, Fsharp: 6,
    G: 7, Gsharp: 8, A: 9, Asharp: 10, B: 11,
  };

  let rootSemitones = 0;
  let formula = CHORD_FORMULAS.major;

  if (chordKey.endsWith('_m')) {
    const rootKey = chordKey.slice(0, -2);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.minor;
  } else if (chordKey.endsWith('m7')) {
    const rootKey = chordKey.slice(0, -2);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.min7;
  } else if (chordKey.endsWith('maj7')) {
    const rootKey = chordKey.slice(0, -4);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.maj7;
  } else if (chordKey.endsWith('7') && !chordKey.endsWith('m7') && !chordKey.endsWith('maj7')) {
    const rootKey = chordKey.slice(0, -1);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.dom7;
  } else if (chordKey.endsWith('dim')) {
    const rootKey = chordKey.slice(0, -3);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.dim;
  } else if (chordKey.endsWith('aug')) {
    const rootKey = chordKey.slice(0, -3);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.aug;
  } else if (chordKey.endsWith('sus2')) {
    const rootKey = chordKey.slice(0, -5);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.sus2;
  } else if (chordKey.endsWith('sus4')) {
    const rootKey = chordKey.slice(0, -5);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.sus4;
  } else if (chordKey.endsWith('5')) {
    const rootKey = chordKey.slice(0, -1);
    rootSemitones = rootMap[rootKey] ?? 0;
    formula = CHORD_FORMULAS.power;
  } else {
    rootSemitones = rootMap[chordKey] ?? 0;
    formula = CHORD_FORMULAS.major;
  }

  return { rootSemitones, formula };
}

/**
 * Get interval label for a note in a chord.
 * @param {number} noteSemitones - semitones from C (0-11)
 * @param {number} rootSemitones - chord root semitones from C
 * @param {number[]} formula - chord formula (e.g. [0,4,7])
 * @returns {string} e.g. "Root", "3rd", "5th", "7th"
 */
export function getIntervalLabel(noteSemitones, rootSemitones, formula) {
  const semitonesFromRoot = (noteSemitones - rootSemitones + 12) % 12;
  return INTERVAL_LABELS[semitonesFromRoot] ?? String(semitonesFromRoot);
}
