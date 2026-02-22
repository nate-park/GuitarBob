import React from 'react';

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e'];
const STRING_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899',
];

/**
 * VerticalFretboard – neck upright, shows active positions from live input.
 * activePositions: [{ string: 0-5, fret: 0-12 }]
 */
export default function VerticalFretboard({
  activePositions = [],
  frets = 12,
  cellSize = 36,
  className = '',
}) {
  const numStrings = 6;
  const numFrets = frets + 1;
  const fretSpacing = cellSize;
  const width = 50 + numFrets * fretSpacing;
  const height = 40 + numStrings * cellSize;

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg ${className}`}
      style={{
        background: 'linear-gradient(135deg, #8B6914 0%, #A0826D 50%, #6B5914 100%)',
        padding: '0.5rem',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #2d1810 0%, #4d3820 50%, #2d1810 100%)',
          borderRadius: '0.5rem',
          padding: '0.5rem',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block', minHeight: Math.max(120, 40 + 6 * cellSize) }}
        >
          {/* String lines (horizontal) */}
          {STRINGS.map((label, s) => {
            const y = 30 + s * cellSize;
            return (
              <g key={`string-${s}`}>
                <line
                  x1={50}
                  y1={y}
                  x2={width - 20}
                  y2={y}
                  stroke={STRING_COLORS[s]}
                  strokeWidth={s === 0 ? 2.5 : s === 5 ? 1.2 : 1.8}
                  opacity={0.9}
                />
                <text x={20} y={y + 5} fill="#eee" fontSize={14} fontFamily="sans-serif">
                  {label}
                </text>
              </g>
            );
          })}

          {/* Fret lines (vertical) */}
          {Array.from({ length: numFrets }, (_, f) => {
            const x = 50 + f * fretSpacing;
            const isNut = f === 0;
            return (
              <line
                key={`fret-${f}`}
                x1={x}
                y1={30}
                x2={x}
                y2={30 + (numStrings - 1) * cellSize}
                stroke={isNut ? '#fff' : '#b0b0b0'}
                strokeWidth={isNut ? 3 : 1.5}
                opacity={isNut ? 0.95 : 0.7}
              />
            );
          })}

          {/* Active note circles */}
          {activePositions.map((p, i) => {
            if (!p || typeof p.string !== 'number' || typeof p.fret !== 'number') return null;
            const { string: s, fret: f } = p;
            if (s < 0 || s > 5 || f < 0 || f > frets) return null;
            const x = 50 + (f + 0.5) * fretSpacing;
            const y = 30 + s * cellSize;
            return (
              <g key={`active-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={cellSize * 0.35}
                  fill={STRING_COLORS[s]}
                  stroke="#fff"
                  strokeWidth={2}
                  opacity={0.95}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={11}
                  fontFamily="sans-serif"
                  fontWeight="bold"
                >
                  {f === 0 ? 'O' : f}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
