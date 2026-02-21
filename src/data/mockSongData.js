// Mock song data for testing the chord tracker
export const MOCK_SONG = {
  title: "Basic Practice Progression",
  artist: "Guitar Bob",
  duration: 20000, // 20 seconds
  tempo: 120,
  chords: [
    { time: 0, chord: "C", duration: 2500 },
    { time: 2500, chord: "C", duration: 2500 },
    { time: 5000, chord: "G", duration: 2500 },
    { time: 7500, chord: "G", duration: 2500 },
    { time: 10000, chord: "Am", duration: 2500 },
    { time: 12500, chord: "Am", duration: 2500 },
    { time: 15000, chord: "F", duration: 2500 },
    { time: 17500, chord: "F", duration: 2500 },
  ],
};

export const CHORD_COLORS = {
  C: '#10b981', // emerald
  G: '#3b82f6', // blue
  Am: '#f59e0b', // amber
  F: '#ef4444', // red
  Em: '#8b5cf6', // violet
  D: '#06b6d4', // cyan
  A: '#ec4899', // pink
};
