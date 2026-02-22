import React, { useState } from 'react';
import { CHORD_DATA } from './ChordDiagram';
import { getNoteAt, parseChordKey, getIntervalLabel } from '../utils/chordTheory';

/**
 * Interactive chord diagram with hover tooltips showing note name and interval (Root, 3rd, 5th, 7th).
 * Uses standard tuning (EADGBE) for accurate fretboard mapping.
 * Pass onHoverChange(info) to get hover updates for parent (e.g. Bob's speech).
 */
export default function ChordDiagramInteractive({ chord, size = 200, onHoverChange }) {
  const [hoveredNote, setHoveredNote] = useState(null);

  const handleHover = (info) => {
    setHoveredNote(info);
    onHoverChange?.(info);
  };
  const chordData = CHORD_DATA[chord];

  if (!chordData) {
    return (
      <div className="flex items-center justify-center bg-gray-200 rounded-lg" style={{ width: size, height: size * 1.3 }}>
        <span className="text-sm font-display text-gray-600">{chord}</span>
      </div>
    );
  }

  const { rootSemitones, formula } = parseChordKey(chord);

  const leftFretMargin = 22;
  const padding = 14;
  const topPadding = 48;
  const nutHeight = 4;
  const usableWidth = size - 2 * padding - leftFretMargin;
  const stringSpacing = usableWidth / 5;
  const fretSpacing = (size * 1.2 - topPadding - padding - nutHeight) / 4;
  const dotRadius = Math.min(stringSpacing * 0.35, fretSpacing * 0.22);
  const gridLeft = padding + leftFretMargin;

  const fretted = chordData.frets.filter((f) => f > 0);
  const minFret = fretted.length ? Math.min(...fretted) : 1;
  const startFret = Math.max(1, minFret > 1 ? minFret : 1);
  const showStartFret = startFret > 1;

  // Build note info for each played string (open or fretted, not muted)
  const noteInfo = chordData.frets.map((fret, stringIdx) => {
    if (fret === -1) return null;
    const { noteName, semitones } = getNoteAt(stringIdx, fret);
    const interval = getIntervalLabel(semitones, rootSemitones, formula);
    return {
      stringIdx,
      fret,
      noteName,
      interval,
      x: gridLeft + stringIdx * stringSpacing,
      isOpen: fret === 0,
    };
  });

  return (
    <div className="relative flex flex-col items-center">
      <svg
        width={size}
        height={size * 1.2}
        viewBox={`0 0 ${size} ${size * 1.2}`}
        className="bg-white rounded-xl border-2 border-gray-300 shadow-lg"
      >
        {showStartFret && (
          <text
            x={padding + leftFretMargin / 2}
            y={topPadding + nutHeight / 2 - 6}
            textAnchor="middle"
            fill="#333"
            fontSize="11"
            fontWeight="600"
          >
            {startFret}fr
          </text>
        )}

        {[1, 2, 3, 4].map((i) => {
          const fretNum = startFret + i - 1;
          const y = topPadding + nutHeight / 2 + (i - 0.5) * fretSpacing;
          return (
            <text
              key={`fret-num-${i}`}
              x={gridLeft - 6}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#333"
              fontSize="12"
              fontWeight="600"
            >
              {fretNum}
            </text>
          );
        })}

        <line
          x1={gridLeft}
          y1={topPadding + nutHeight / 2}
          x2={size - padding}
          y2={topPadding + nutHeight / 2}
          stroke="#000"
          strokeWidth={nutHeight}
        />

        {[1, 2, 3, 4].map((fret) => (
          <line
            key={`fret-${fret}`}
            x1={gridLeft}
            y1={topPadding + nutHeight / 2 + fret * fretSpacing}
            x2={size - padding}
            y2={topPadding + nutHeight / 2 + fret * fretSpacing}
            stroke="#ccc"
            strokeWidth="1"
          />
        ))}

        {[0, 1, 2, 3, 4, 5].map((string) => (
          <line
            key={`string-${string}`}
            x1={gridLeft + string * stringSpacing}
            y1={topPadding}
            x2={gridLeft + string * stringSpacing}
            y2={size * 1.2 - padding}
            stroke="#333"
            strokeWidth="2"
          />
        ))}

        {chordData.frets.map((fret, stringIdx) => {
          const x = gridLeft + stringIdx * stringSpacing;
          const info = noteInfo[stringIdx];

          if (fret === 0) {
            return (
              <g
                key={`dot-${stringIdx}`}
                onMouseEnter={() => handleHover(info)}
                onMouseLeave={() => handleHover(null)}
                style={{ cursor: info ? 'pointer' : 'default' }}
              >
                <circle
                  cx={x}
                  cy={topPadding - 14}
                  r={5}
                  fill={hoveredNote === info ? '#059669' : 'none'}
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-colors"
                />
                {info && (
                  <title>
                    {info.noteName} — {info.interval}
                  </title>
                )}
              </g>
            );
          } else if (fret === -1) {
            return (
              <g key={`mute-${stringIdx}`}>
                <line x1={x - 5} y1={topPadding - 18} x2={x + 5} y2={topPadding - 10} stroke="#ef4444" strokeWidth="2" />
                <line x1={x + 5} y1={topPadding - 18} x2={x - 5} y2={topPadding - 10} stroke="#ef4444" strokeWidth="2" />
              </g>
            );
          } else {
            const displayFret = fret - startFret + 1;
            if (displayFret < 1 || displayFret > 4) return null;
            const y = topPadding + nutHeight / 2 + (displayFret - 0.5) * fretSpacing;
            return (
              <g
                key={`dot-${stringIdx}`}
                onMouseEnter={() => handleHover(info)}
                onMouseLeave={() => handleHover(null)}
                style={{ cursor: info ? 'pointer' : 'default' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={dotRadius}
                  fill={hoveredNote === info ? '#2563eb' : '#3b82f6'}
                  className="transition-all"
                />
                {info && (
                  <title>
                    {info.noteName} — {info.interval}
                  </title>
                )}
              </g>
            );
          }
        })}

        {chordData.barre &&
          (() => {
            const displayBarre = chordData.barre - startFret + 1;
            if (displayBarre < 1 || displayBarre > 4) return null;
            return (
              <rect
                x={gridLeft}
                y={
                  topPadding +
                  nutHeight / 2 +
                  (displayBarre - 0.5) * fretSpacing -
                  dotRadius
                }
                width={size - padding - gridLeft}
                height={dotRadius * 2}
                fill="#f59e0b"
                opacity="0.3"
                rx={dotRadius}
                pointerEvents="none"
              />
            );
          })()}
      </svg>

      <p
        className="font-display font-bold text-center mt-3 text-xl text-white"
        style={{ textShadow: '0 0 16px rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.7)' }}
      >
        {chordData.name}
      </p>
    </div>
  );
}
