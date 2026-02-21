import React from 'react';

/**
 * SVG Chord Diagram Component
 * 
 * ==== HOW IT WORKS ====
 * 
 * FRET POSITIONS (the 6 numbers in each chord):
 * - Represents the 6 guitar strings: E(low) A D G B E(high)
 * - Each number is the fret position:
 *   0 = OPEN STRING (play it, but don't press any fret)
 *   1-4 = FRET NUMBER (which fret to press)
 *   -1 = MUTED (don't play this string)
 * 
 * VISUAL INDICATORS IN SVG:
 * - 🟢 Green circle ABOVE the nut = Open string
 * - ❌ Red X ABOVE the nut = Muted string
 * - 🔵 Blue dot ON a fret = Where finger presses
 * - 🟠 Orange bar = Barre chord (finger holds multiple strings)
 * 
 * THE GRID:
 * - Top thick line = NUT (where neck starts)
 * - Horizontal lines = FRETS (where strings are pressed)
 * - Vertical lines = STRINGS (6 of them)
 * - Intersections = where dots go
 * 
 * EXAMPLE - C MAJOR:
 * frets: [0, 3, 2, 0, 1, 0]
 * 
 * String 1 (E low):  0 = open (play it, don't fret)
 * String 2 (A):      3 = press 3rd fret
 * String 3 (D):      2 = press 2nd fret
 * String 4 (G):      0 = open
 * String 5 (B):      1 = press 1st fret
 * String 6 (E high): 0 = open
 * 
 * TO ADD A CHORD:
 * 1. Create the frets array (6 numbers)
 * 2. Add to CHORD_DATA object
 * 3. Use it: <ChordDiagram chord="YourChord" />
 * 
 * ==== 40+ CHORDS INCLUDED ====
 * Major, Minor, 7th, Minor7, Major7, Sus, Power, Dim, Aug
 */

const CHORD_DATA = {
  // ==== MAJOR CHORDS ====
  C: {
    name: 'C Major',
    frets: [0, 3, 2, 0, 1, 0],
    fingers: ['open', '3', '2', 'open', '1', 'open'],
    barre: null,
  },
  Csharp: {
    name: 'C# Major',
    frets: [4, 4, 6, 6, 6, 4],
    fingers: ['1', '1', '3', '4', '2', '1'],
    barre: 4,
  },
  D: {
    name: 'D Major',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: ['mute', 'mute', 'open', '1', '3', '2'],
    barre: null,
  },
  Dsharp: {
    name: 'D# Major',
    frets: [-1, -1, 3, 5, 5, 5],
    fingers: ['mute', 'mute', '1', '2', '3', '4'],
    barre: null,
  },
  E: {
    name: 'E Major',
    frets: [0, 2, 2, 1, 0, 0],
    fingers: ['open', '2', '3', '1', 'open', 'open'],
    barre: null,
  },
  F: {
    name: 'F Major',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: ['1', '3', '4', '2', '1', '1'],
    barre: 1,
  },
  Fsharp: {
    name: 'F# Major',
    frets: [2, 4, 4, 3, 2, 2],
    fingers: ['1', '3', '4', '2', '1', '1'],
    barre: 2,
  },
  G: {
    name: 'G Major',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: ['3', '2', 'open', 'open', 'open', '3'],
    barre: null,
  },
  Gsharp: {
    name: 'G# Major',
    frets: [4, 6, 6, 5, 4, 4],
    fingers: ['1', '3', '4', '2', '1', '1'],
    barre: 4,
  },
  A: {
    name: 'A Major',
    frets: [0, 0, 2, 2, 2, 0],
    fingers: ['open', 'open', '1', '2', '3', 'open'],
    barre: null,
  },
  Asharp: {
    name: 'A# Major',
    frets: [1, 1, 3, 3, 3, 1],
    fingers: ['1', '1', '3', '4', '2', '1'],
    barre: 1,
  },
  B: {
    name: 'B Major',
    frets: [2, 4, 4, 4, 4, 2],
    fingers: ['1', '3', '4', '2', '1', '1'],
    barre: 2,
  },

  // ==== MINOR CHORDS ====
  Am: {
    name: 'A Minor',
    frets: [0, 0, 2, 2, 1, 0],
    fingers: ['open', 'open', '1', '2', '3', 'open'],
    barre: null,
  },
  Asharp_m: {
    name: 'A# Minor',
    frets: [1, 1, 3, 3, 2, 1],
    fingers: ['1', '1', '3', '4', '2', '1'],
    barre: 1,
  },
  Bm: {
    name: 'B Minor',
    frets: [2, 3, 4, 4, 3, 2],
    fingers: ['1', '2', '3', '4', '2', '1'],
    barre: null,
  },
  Cm: {
    name: 'C Minor',
    frets: [3, 3, 5, 5, 4, 3],
    fingers: ['1', '1', '3', '4', '2', '1'],
    barre: 3,
  },
  Csharp_m: {
    name: 'C# Minor',
    frets: [4, 4, 6, 6, 5, 4],
    fingers: ['1', '1', '3', '4', '2', '1'],
    barre: 4,
  },
  Dm: {
    name: 'D Minor',
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: ['mute', 'mute', 'open', '1', '3', '2'],
    barre: null,
  },
  Dsharp_m: {
    name: 'D# Minor',
    frets: [-1, -1, 3, 5, 4, 3],
    fingers: ['mute', 'mute', '1', '3', '2', '1'],
    barre: null,
  },
  Em: {
    name: 'E Minor',
    frets: [0, 2, 2, 0, 0, 0],
    fingers: ['open', '1', '2', 'open', 'open', 'open'],
    barre: null,
  },
  Fm: {
    name: 'F Minor',
    frets: [1, 3, 3, 1, 1, 1],
    fingers: ['1', '3', '4', '1', '1', '1'],
    barre: 1,
  },
  Fsharp_m: {
    name: 'F# Minor',
    frets: [2, 4, 4, 2, 2, 2],
    fingers: ['1', '3', '4', '1', '1', '1'],
    barre: 2,
  },
  Gm: {
    name: 'G Minor',
    frets: [3, 5, 5, 3, 3, 3],
    fingers: ['1', '3', '4', '1', '1', '1'],
    barre: 3,
  },
  Gsharp_m: {
    name: 'G# Minor',
    frets: [4, 6, 6, 4, 4, 4],
    fingers: ['1', '3', '4', '1', '1', '1'],
    barre: 4,
  },

  // ==== DOMINANT 7 CHORDS ====
  C7: {
    name: 'C7',
    frets: [0, 3, 2, 3, 1, 0],
    fingers: ['open', '3', '2', '4', '1', 'open'],
    barre: null,
  },
  D7: {
    name: 'D7',
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: ['mute', 'mute', 'open', '2', '1', '3'],
    barre: null,
  },
  E7: {
    name: 'E7',
    frets: [0, 2, 2, 1, 3, 0],
    fingers: ['open', '1', '2', 'open', '3', 'open'],
    barre: null,
  },
  F7: {
    name: 'F7',
    frets: [1, 3, 1, 2, 1, 1],
    fingers: ['1', '3', '1', '2', '1', '1'],
    barre: 1,
  },
  G7: {
    name: 'G7',
    frets: [3, 2, 0, 0, 0, 1],
    fingers: ['3', '2', 'open', 'open', 'open', '1'],
    barre: null,
  },
  A7: {
    name: 'A7',
    frets: [0, 0, 2, 0, 2, 0],
    fingers: ['open', 'open', '1', 'open', '2', 'open'],
    barre: null,
  },
  B7: {
    name: 'B7',
    frets: [2, 4, 2, 4, 3, 2],
    fingers: ['1', '3', '1', '4', '2', '1'],
    barre: null,
  },

  // ==== MINOR 7 CHORDS ====
  Am7: {
    name: 'Am7',
    frets: [0, 0, 2, 0, 1, 0],
    fingers: ['open', 'open', '1', 'open', '2', 'open'],
    barre: null,
  },
  Dm7: {
    name: 'Dm7',
    frets: [-1, -1, 0, 2, 1, 1],
    fingers: ['mute', 'mute', 'open', '1', '2', '2'],
    barre: null,
  },
  Em7: {
    name: 'Em7',
    frets: [0, 2, 2, 0, 3, 0],
    fingers: ['open', '1', '2', 'open', '3', 'open'],
    barre: null,
  },
  Gm7: {
    name: 'Gm7',
    frets: [3, 5, 3, 3, 3, 3],
    fingers: ['1', '2', '1', '1', '1', '1'],
    barre: 3,
  },

  // ==== MAJOR 7 CHORDS ====
  Cmaj7: {
    name: 'Cmaj7',
    frets: [0, 3, 2, 0, 0, 0],
    fingers: ['open', '3', '2', 'open', 'open', 'open'],
    barre: null,
  },
  Gmaj7: {
    name: 'Gmaj7',
    frets: [3, 2, 0, 0, 0, 2],
    fingers: ['3', '2', 'open', 'open', 'open', '1'],
    barre: null,
  },

  // ==== SUS CHORDS ====
  Csus2: {
    name: 'Csus2',
    frets: [0, 3, 2, 0, 3, 0],
    fingers: ['open', '2', '1', 'open', '3', 'open'],
    barre: null,
  },
  Csus4: {
    name: 'Csus4',
    frets: [0, 3, 3, 0, 1, 0],
    fingers: ['open', '2', '3', 'open', '1', 'open'],
    barre: null,
  },
  Gsus4: {
    name: 'Gsus4',
    frets: [3, 3, 0, 0, 1, 3],
    fingers: ['2', '3', 'open', 'open', '1', '4'],
    barre: null,
  },

  // ==== POWER CHORDS ====
  C5: {
    name: 'C5 (Power Chord)',
    frets: [3, 3, 0, 2, 3, -1],
    fingers: ['1', '1', 'open', '2', '3', 'mute'],
    barre: null,
  },
  G5: {
    name: 'G5 (Power Chord)',
    frets: [3, 5, 5, 4, 3, -1],
    fingers: ['1', '3', '3', '2', '1', 'mute'],
    barre: null,
  },
  D5: {
    name: 'D5 (Power Chord)',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: ['mute', 'mute', 'open', '1', '3', '2'],
    barre: null,
  },

  // ==== DIMINISHED CHORDS ====
  Cdim: {
    name: 'C Diminished',
    frets: [3, 4, 2, 3, 1, 3],
    fingers: ['1', '2', 'open', '1', '1', '1'],
    barre: null,
  },
  Bdim: {
    name: 'B Diminished',
    frets: [2, 3, 1, 2, 0, 2],
    fingers: ['1', '2', 'open', '1', 'open', '1'],
    barre: null,
  },

  // ==== AUGMENTED CHORDS ====
  Caug: {
    name: 'C Augmented',
    frets: [0, 3, 2, 1, 1, 0],
    fingers: ['open', '3', '2', '1', '1', 'open'],
    barre: null,
  },
  Gaug: {
    name: 'G Augmented',
    frets: [3, 2, 1, 0, 0, 3],
    fingers: ['3', '2', '1', 'open', 'open', '4'],
    barre: null,
  },
};

export default function ChordDiagram({ chord, size = 140 }) {
  const chordData = CHORD_DATA[chord];

  if (!chordData) {
    return (
      <div
        className="flex items-center justify-center bg-gray-200 rounded-lg"
        style={{ width: size, height: size }}
      >
        <span className="text-sm font-display text-gray-600">{chord}</span>
      </div>
    );
  }

  // SVG dimensions
  const padding = 10;
  const topPadding = 40; // Extra space for open/mute indicators
  const nutHeight = 4;
  const usableWidth = size - 2 * padding;
  const stringSpacing = usableWidth / 5; // 6 strings divided into 5 spaces = equal spacing
  const fretSpacing = (size * 1.3 - topPadding - padding - nutHeight) / 4;
  const dotRadius = stringSpacing * 0.35;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size * 1.3}
        viewBox={`0 0 ${size} ${size * 1.3}`}
        className="bg-white rounded-lg border-2 border-gray-300"
      >
        {/* Nut (thick line at top) */}
        <line
          x1={padding}
          y1={topPadding + nutHeight / 2}
          x2={size - padding}
          y2={topPadding + nutHeight / 2}
          stroke="#000"
          strokeWidth={nutHeight}
        />

        {/* Fret lines */}
        {[1, 2, 3, 4].map((fret) => (
          <line
            key={`fret-${fret}`}
            x1={padding}
            y1={topPadding + nutHeight / 2 + fret * fretSpacing}
            x2={size - padding}
            y2={topPadding + nutHeight / 2 + fret * fretSpacing}
            stroke="#ccc"
            strokeWidth="1"
          />
        ))}

        {/* String lines */}
        {[0, 1, 2, 3, 4, 5].map((string) => (
          <line
            key={`string-${string}`}
            x1={padding + string * stringSpacing}
            y1={topPadding}
            x2={padding + string * stringSpacing}
            y2={size * 1.3 - padding}
            stroke="#333"
            strokeWidth="2"
          />
        ))}

        {/* Finger dots and open/mute indicators */}
        {chordData.frets.map((fret, stringIdx) => {
          const x = padding + stringIdx * stringSpacing;

          if (fret === 0) {
            // Open string - circle above nut
            return (
              <circle
                key={`dot-${stringIdx}`}
                cx={x}
                cy={topPadding - 12}
                r={4}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
            );
          } else if (fret === -1) {
            // Muted string - X above nut
            return (
              <g key={`mute-${stringIdx}`}>
                <line
                  x1={x - 4}
                  y1={topPadding - 16}
                  x2={x + 4}
                  y2={topPadding - 8}
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                <line
                  x1={x + 4}
                  y1={topPadding - 16}
                  x2={x - 4}
                  y2={topPadding - 8}
                  stroke="#ef4444"
                  strokeWidth="2"
                />
              </g>
            );
          } else {
            // Fretted note - dot on fret
            const y =
              topPadding + nutHeight / 2 + (fret - 0.5) * fretSpacing;
            return (
              <circle
                key={`dot-${stringIdx}`}
                cx={x}
                cy={y}
                r={dotRadius}
                fill="#3b82f6"
              />
            );
          }
        })}

        {/* Barre indicator (if applicable) */}
        {chordData.barre && (
          <rect
            x={padding}
            y={
              topPadding +
              nutHeight / 2 +
              (chordData.barre - 0.5) * fretSpacing -
              dotRadius
            }
            width={size - 2 * padding}
            height={dotRadius * 2}
            fill="#f59e0b"
            opacity="0.3"
            rx={dotRadius}
          />
        )}
      </svg>

      {/* Chord name */}
      <p className="font-display font-bold text-center mt-2">{chord}</p>
    </div>
  );
}
