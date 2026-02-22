// Mock song data for testing the chord tracker
// All times in milliseconds; 1 second = 1000ms
const SEC = 1000;

export const MOCK_SONG = {
  title: "Basic Practice Progression",
  artist: "Guitar Bob",
  duration: 60 * SEC, // 60 seconds (1 minute)
  tempo: 80,
  chords: [
    { time: 0 * SEC, chord: "C", duration: 7.5 * SEC },
    { time: 7.5 * SEC, chord: "C", duration: 7.5 * SEC },
    { time: 15 * SEC, chord: "G", duration: 7.5 * SEC },
    { time: 22.5 * SEC, chord: "G", duration: 7.5 * SEC },
    { time: 30 * SEC, chord: "Am", duration: 7.5 * SEC },
    { time: 37.5 * SEC, chord: "Am", duration: 7.5 * SEC },
    { time: 45 * SEC, chord: "F", duration: 7.5 * SEC },
    { time: 52.5 * SEC, chord: "F", duration: 7.5 * SEC },
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
