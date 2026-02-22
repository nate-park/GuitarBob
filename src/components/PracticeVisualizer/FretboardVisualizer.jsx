import React, { useMemo } from 'react';

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e'];
const STRING_COLORS = [
  '#ef4444', // E - red
  '#f59e0b', // A - amber
  '#10b981', // D - emerald
  '#3b82f6', // G - blue
  '#8b5cf6', // B - violet
  '#ec4899', // e - pink
];

/**
 * FretboardVisualizer - Shows upcoming notes as hollow circles that fill as they approach
 * - Displays 6 strings (rows) x N frets (columns)
 * - Hollow circles for upcoming notes
 * - Circles fill in gradually as notes get closer (based on distance from hit line)
 * - Filled circles when notes hit
 * - currentTime: seconds
 * - songData: { notes: [{ time, string, fret }] }
 * - lookahead: how far in the future to show notes (seconds)
 * - hitTimelineY: Y position on highway where notes "hit"
 */
export default function FretboardVisualizer({
  currentTime = 0,
  songData = { notes: [] },
  lookahead = 3,
  frets = 12,
  hitTimelineY = 300,
  highwayHeight = 320,
  className = '',
}) {
  // Calculate which notes are upcoming and their fill percentage
  const noteFillMap = useMemo(() => {
    const map = new Map(); // 'string-fret' -> { fillPercentage, fadeOut }
    const now = currentTime;
    const notes = songData.notes || [];
    const FADE_OUT_DURATION = 0.3; // seconds to fade out after note passes

    for (const note of notes) {
      const timeDelta = note.time - now; // seconds until note hits

      // Show notes in lookahead window
      if (timeDelta > lookahead) continue;
      
      // Also show notes that are fading out
      if (timeDelta < -FADE_OUT_DURATION) continue;

      const key = `${note.string}-${note.fret}`;
      let fillPercentage = 0;
      let fadeOut = 1;

      if (timeDelta >= 0) {
        // Note is upcoming
        fillPercentage = 1 - (timeDelta / lookahead);
      } else {
        // Note has passed, start fade out
        fadeOut = Math.max(0, 1 - (-timeDelta / FADE_OUT_DURATION));
        fillPercentage = 1; // Keep it full while fading
      }

      // Keep the highest fill percentage for this cell (if multiple notes map to same fret)
      const current = map.get(key);
      if (!current || fillPercentage > current.fillPercentage) {
        map.set(key, { fillPercentage, fadeOut });
      }
    }

    return map;
  }, [currentTime, songData, lookahead]);

  const cols = frets + 1; // 0..frets (nut + frets)

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg ${className}`}
      role="img"
      aria-label="Fretboard visualizer with upcoming notes"
      style={{
        background: 'linear-gradient(135deg, #8B6914 0%, #A0826D 50%, #6B5914 100%)',
        padding: '0.5rem',
      }}
    >
      {/* Fretboard background */}
      <div
        style={{
          background: 'linear-gradient(90deg, #2d1810 0%, #3d2817 25%, #4d3820 50%, #3d2817 75%, #2d1810 100%)',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${cols * 60 + 40} ${STRINGS.length * 40 + 20}`}
          preserveAspectRatio="none"
          style={{ minHeight: '300px', display: 'block' }}
        >
          {/* Metal fret lines (vertical) */}
          {Array.from({ length: cols }, (_, f) => {
            const x = f * 60 + 40;
            const isNut = f === 0;
            return (
              <g key={`fret-${f}`}>
                {/* Fret line with metallic gradient */}
                <defs>
                  <linearGradient id={`fret-gradient-${f}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#e8e8e8" stopOpacity={isNut ? 0.9 : 0.7} />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity={isNut ? 1 : 0.8} />
                    <stop offset="100%" stopColor="#b0b0b0" stopOpacity={isNut ? 0.9 : 0.7} />
                  </linearGradient>
                </defs>
                <line
                  x1={x}
                  y1="10"
                  x2={x}
                  y2={STRINGS.length * 40 + 10}
                  stroke={`url(#fret-gradient-${f})`}
                  strokeWidth={isNut ? 4 : 2.5}
                  opacity={isNut ? 1 : 0.8}
                />
                {/* Fret shadow */}
                {!isNut && (
                  <line
                    x1={x + 1.5}
                    y1="10"
                    x2={x + 1.5}
                    y2={STRINGS.length * 40 + 10}
                    stroke="#000000"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                )}
              </g>
            );
          })}

          {/* String lines (horizontal) with varying thickness */}
          {STRINGS.map((name, s) => {
            const y = s * 40 + 30;
            const stringThickness = [2.5, 2.2, 2, 1.8, 1.5, 1.2][s]; // Thicker strings at bottom
            const stringColor = STRING_COLORS[s];
            return (
              <g key={`string-${s}`}>
                <defs>
                  <linearGradient id={`string-gradient-${s}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#404040" stopOpacity="1" />
                    <stop offset="30%" stopColor="#888" stopOpacity="1" />
                    <stop offset="50%" stopColor="#e8e8e8" stopOpacity="1" />
                    <stop offset="70%" stopColor="#b0b0b0" stopOpacity="1" />
                    <stop offset="100%" stopColor="#505050" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {/* Main string line */}
                <line
                  x1="20"
                  y1={y}
                  x2={cols * 60 + 40}
                  y2={y}
                  stroke={`url(#string-gradient-${s})`}
                  strokeWidth={stringThickness}
                />
                {/* String highlight */}
                <line
                  x1="20"
                  y1={y - stringThickness / 2}
                  x2={cols * 60 + 40}
                  y2={y - stringThickness / 2}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={Math.max(0.5, stringThickness * 0.3)}
                />
              </g>
            );
          })}

          {/* Note indicators - thin lines that thicken for open strings */}
          {STRINGS.map((_, s) =>
            Array.from({ length: cols }, (_, f) => {
              const key = `${s}-${f}`;
              const noteData = noteFillMap.get(key);
              if (!noteData) return null;

              const { fillPercentage, fadeOut } = noteData;
              const x = f * 60 + 40;
              const y = s * 40 + 30;
              const isOpenString = f === 0;

              if (isOpenString) {
                // For open strings, highlight the entire string when approaching
                const stringThickness = [2.5, 2.2, 2, 1.8, 1.5, 1.2][s];
                const highlightThickness = stringThickness * (1 + fillPercentage * 2);
                
                return (
                  <g key={`note-${s}-${f}`}>
                    {/* Thin base line */}
                    <line
                      x1="20"
                      y1={y}
                      x2={cols * 60 + 40}
                      y2={y}
                      stroke={STRING_COLORS[s]}
                      strokeWidth={highlightThickness}
                      opacity={(0.3 + fillPercentage * 0.6) * fadeOut}
                      style={{
                        transition: 'stroke-width 0.05s linear, opacity 0.05s linear',
                      }}
                    />
                    {/* Glow effect when almost filled */}
                    {fillPercentage > 0.7 && (
                      <line
                        x1="20"
                        y1={y}
                        x2={cols * 60 + 40}
                        y2={y}
                        stroke={STRING_COLORS[s]}
                        strokeWidth={highlightThickness}
                        opacity={(fillPercentage - 0.7) * fadeOut}
                        style={{
                          filter: `drop-shadow(0 0 ${8 * (fillPercentage - 0.7)} ${STRING_COLORS[s]})`,
                        }}
                      />
                    )}
                  </g>
                );
              } else {
                // For fretted notes, show dots
                const radius = 8;

                return (
                  <g key={`note-${s}-${f}`}>
                    {/* Hollow outline dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill="none"
                      stroke={STRING_COLORS[s]}
                      strokeWidth="1"
                      opacity={0.4 * fadeOut}
                    />
                    {/* Filled dot - grows as note approaches */}
                    <circle
                      cx={x}
                      cy={y}
                      r={radius * fillPercentage}
                      fill={STRING_COLORS[s]}
                      opacity={(0.5 + fillPercentage * 0.5) * fadeOut}
                      style={{
                        transition: 'r 0.05s linear',
                      }}
                    />
                    {/* Glow effect when almost filled */}
                    {fillPercentage > 0.7 && (
                      <circle
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="none"
                        stroke={STRING_COLORS[s]}
                        strokeWidth="0.8"
                        opacity={(fillPercentage - 0.7) * fadeOut}
                        style={{
                          filter: `drop-shadow(0 0 ${5 * (fillPercentage - 0.7)} ${STRING_COLORS[s]})`,
                        }}
                      />
                    )}
                  </g>
                );
              }
            })
          )}
        </svg>

        {/* String labels on the left */}
        <div
          style={{
            position: 'absolute',
            left: '0.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            height: `${STRINGS.length * 40}px`,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            color: '#e8d7c3',
            fontFamily: 'monospace',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          {STRINGS.map((name, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


