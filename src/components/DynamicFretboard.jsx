import React, { useMemo } from 'react';
import { CHORD_COLORS } from '../data/mockSongData';

export default function DynamicFretboard({ songData, currentTime = 0 }) {
  const chords = songData.chords;
  const FRET_COUNT = 12;
  const STRING_COUNT = 6;
  const FRET_WIDTH = 50;
  const STRING_HEIGHT = 40;
  const NUT_WIDTH = 8;

  // Find current active chord
  const currentChord = useMemo(() => {
    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i];
      const chordEnd = chord.time + chord.duration;
      if (currentTime >= chord.time && currentTime < chordEnd) {
        return chord;
      }
    }
    return null;
  }, [currentTime, chords]);

  // Get chord diagram data (same as ChordDiagram.jsx)
  const CHORD_DATA = {
    C: [0, 3, 2, 0, 1, 0],
    Csharp: [1, 4, 3, 1, 2, 1],
    D: [-1, -1, 0, 2, 3, 2],
    Dsharp: [-1, -1, 1, 3, 4, 3],
    E: [0, 2, 2, 1, 0, 0],
    F: [1, 3, 3, 2, 1, 1],
    Fsharp: [2, 4, 4, 3, 2, 2],
    G: [3, 2, 0, 0, 3, 3],
    Gsharp: [4, 3, 1, 1, 4, 4],
    A: [0, 0, 2, 2, 2, 0],
    Am: [0, 0, 2, 2, 1, 0],
    B: [2, 2, 4, 4, 4, 2],
    Bm: [2, 3, 4, 4, 3, 2],
  };

  const chordPositions = CHORD_DATA[currentChord?.chord] || [0, 0, 0, 0, 0, 0];

  return (
    <div className="w-full flex flex-col items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl">
      <div className="mb-4 text-center">
        <p className="font-body text-sm text-gray-400">Current Chord</p>
        <p className="font-display text-5xl text-bob-green-dark animate-pulse">
          {currentChord?.chord || '—'}
        </p>
      </div>

      {/* Fretboard SVG */}
      <svg
        width={NUT_WIDTH + FRET_COUNT * FRET_WIDTH + 40}
        height={STRING_COUNT * STRING_HEIGHT + 40}
        className="bg-amber-900 rounded-lg shadow-lg"
      >
        {/* Nut (thick left edge) */}
        <rect x="10" y="20" width={NUT_WIDTH} height={STRING_COUNT * STRING_HEIGHT} fill="#333" />

        {/* Fret lines */}
        {Array.from({ length: FRET_COUNT + 1 }).map((_, fretIdx) => {
          const x = 10 + NUT_WIDTH + fretIdx * FRET_WIDTH;
          return (
            <line
              key={`fret-${fretIdx}`}
              x1={x}
              y1="20"
              x2={x}
              y2={20 + STRING_COUNT * STRING_HEIGHT}
              stroke="#666"
              strokeWidth="1"
            />
          );
        })}

        {/* String lines and finger positions */}
        {Array.from({ length: STRING_COUNT }).map((_, stringIdx) => {
          const y = 20 + (stringIdx + 0.5) * STRING_HEIGHT;
          const fretNum = chordPositions[stringIdx];

          return (
            <g key={`string-${stringIdx}`}>
              {/* String line */}
              <line
                x1="10"
                y1={y}
                x2={10 + NUT_WIDTH + FRET_COUNT * FRET_WIDTH}
                y2={y}
                stroke="#ddd"
                strokeWidth="2"
              />

              {/* Finger indicator */}
              {fretNum >= 0 && (
                <circle
                  cx={10 + NUT_WIDTH + (fretNum + 0.5) * FRET_WIDTH}
                  cy={y}
                  r="12"
                  fill="#3b82f6"
                  className="animate-pulse"
                  style={{
                    opacity: currentChord ? 1 : 0.3,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              )}

              {/* Open string indicator */}
              {fretNum === 0 && (
                <circle
                  cx={10 + NUT_WIDTH / 2}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}

              {/* Muted string indicator */}
              {fretNum === -1 && (
                <text
                  x={10 + NUT_WIDTH / 2}
                  y={y + 6}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="16"
                  fontWeight="bold"
                  className="animate-pulse"
                >
                  ✕
                </text>
              )}
            </g>
          );
        })}

        {/* Fret numbers */}
        {Array.from({ length: FRET_COUNT }).map((_, fretIdx) => (
          <text
            key={`fret-num-${fretIdx}`}
            x={10 + NUT_WIDTH + (fretIdx + 0.5) * FRET_WIDTH}
            y={20 + STRING_COUNT * STRING_HEIGHT + 20}
            textAnchor="middle"
            fill="#999"
            fontSize="12"
          >
            {fretIdx + 1}
          </text>
        ))}

        {/* String labels (E A D G B E) */}
        {['E', 'A', 'D', 'G', 'B', 'E'].map((label, idx) => (
          <text
            key={`string-label-${idx}`}
            x="5"
            y={20 + (idx + 0.65) * STRING_HEIGHT}
            textAnchor="middle"
            fill="#ccc"
            fontSize="12"
            fontWeight="bold"
          >
            {label}
          </text>
        ))}
      </svg>

      {/* Chord transition info */}
      {currentChord && (
        <div className="mt-6 text-center">
          <p className="font-body text-xs text-gray-400">
            Playing for{' '}
            <span className="text-bob-green font-semibold">
              {(currentChord.duration / 1000).toFixed(1)}s
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
