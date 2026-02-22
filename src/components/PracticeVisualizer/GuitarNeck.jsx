import React from 'react';

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e'];

/**
 * GuitarNeck - Static horizontal fretboard
 * 6 strings (rows), N frets (columns)
 * glowCells: Map<string, 'perfect'|'good'> | Set<string> - "s-f" keys (e.g. "2-3" = string 2, fret 3)
 */
export default function GuitarNeck({
  frets = 12,
  glowCells = new Map(),
  className = '',
}) {
  const cols = frets + 1; // 0..frets (nut + frets)

  return (
    <div
      className={`bg-gradient-to-b from-amber-900/90 to-amber-950 rounded-xl overflow-hidden border-2 border-amber-800 shadow-lg ${className}`}
      role="img"
      aria-label="Guitar fretboard"
    >
      <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th className="w-8 py-1 text-xs font-bold text-amber-200/90 bg-amber-950/50" />
            {Array.from({ length: cols }, (_, i) => (
              <th
                key={i}
                className="py-1 text-xs font-bold text-amber-200/70 bg-amber-950/30 border-b border-amber-700/50"
              >
                {i === 0 ? 'O' : i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {STRINGS.map((name, s) => (
            <tr key={s}>
              <td className="py-0.5 px-1 text-sm font-bold text-amber-200 bg-amber-900/80 border-r border-amber-700/50">
                {name}
              </td>
              {Array.from({ length: cols }, (_, f) => {
                const key = `${s}-${f}`;
                const quality = glowCells.get?.(key);
                const isGlow = !!quality;
                const bg = isGlow
                  ? quality === 'perfect'
                    ? 'bg-emerald-500/80'
                    : 'bg-amber-400/70'
                  : 'bg-amber-800/40';
                return (
                  <td
                    key={f}
                    className={`py-0.5 border-b border-r border-amber-700/40 transition-colors duration-75 ${bg} ${
                      isGlow ? 'shadow-[inset_0_0_12px_rgba(255,255,255,0.5)]' : ''
                    }`}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { STRINGS };
