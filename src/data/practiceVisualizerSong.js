/**
 * Mock song data for PracticeVisualizer
 * Notes use explicit (time, string, fret) - no chord inference
 * time: seconds (from audio element or playback clock)
 */
export const PRACTICE_SONG = {
  duration: 20, // seconds (for visualizer)
  durationMs: 20 * 1000, // for playback clock
  notes: [
    // Single notes
    { time: 1, string: 0, fret: 0 },
    { time: 2, string: 1, fret: 2 },
    { time: 3, string: 2, fret: 3 },
    { time: 4, string: 3, fret: 0 },
    { time: 5, string: 4, fret: 1 },
    { time: 6, string: 5, fret: 0 },
    { time: 7, string: 2, fret: 5 },
    { time: 8, string: 0, fret: 3 },
    // Chord - C major (0,3,2,0,1,0)
    { time: 10, string: 0, fret: 0 },
    { time: 10, string: 1, fret: 3 },
    { time: 10, string: 2, fret: 2 },
    { time: 10, string: 3, fret: 0 },
    { time: 10, string: 4, fret: 1 },
    { time: 10, string: 5, fret: 0 },
    // G chord (3,2,0,0,3,3)
    { time: 12, string: 0, fret: 3 },
    { time: 12, string: 1, fret: 2 },
    { time: 12, string: 2, fret: 0 },
    { time: 12, string: 3, fret: 0 },
    { time: 12, string: 4, fret: 3 },
    { time: 12, string: 5, fret: 3 },
    // More singles
    { time: 14, string: 5, fret: 12 },
    { time: 15, string: 0, fret: 5 },
    { time: 16, string: 3, fret: 7 },
  ],
};
