import React, { useMemo } from 'react';
import { CHORD_COLORS } from '../data/mockSongData';

// 6 lanes = 6 strings (low E to high e)
const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e'];

// Chord shapes: [lowE, A, D, G, B, highE]
// -1 = muted, 0 = open, >0 = fretted
const CHORD_SHAPES = {
  C: [0, 3, 2, 0, 1, 0],
  D: [-1, -1, 0, 2, 3, 2],
  E: [0, 2, 2, 1, 0, 0],
  F: [1, 3, 3, 2, 1, 1],
  G: [3, 2, 0, 0, 3, 3],
  A: [0, 0, 2, 2, 2, 0],
  Am: [0, 0, 2, 2, 1, 0],
  B: [2, 2, 4, 4, 4, 2],
  Bm: [2, 3, 4, 4, 3, 2],
};

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/**
 * GuitarHeroFretboard - chord-driven note highway
 * songData.chords: [{time, chord, duration}] in milliseconds
 * currentTime: milliseconds
 */
export default function GuitarHeroFretboard({
  songData,
  currentTime = 0,
  lookaheadMs = 3000,
  highwayHeight = 320,
  hitLineY = 260,
  hitWindowMs = 120,
}) {
  const chords = songData?.chords ?? [];

  const events = useMemo(() => {
    const out = [];
    for (const c of chords) {
      const shape = CHORD_SHAPES[c.chord] ?? null;
      if (!shape) continue;

      shape.forEach((fret, lane) => {
        if (fret === -1) return;
        out.push({
          t: c.time,
          lane,
          fret,
          chordName: c.chord,
          duration: c.duration,
        });
      });
    }
    return out.sort((a, b) => a.t - b.t);
  }, [chords]);

  const activeChord = useMemo(() => {
    for (const c of chords) {
      if (currentTime >= c.time && currentTime < c.time + c.duration) return c;
    }
    return null;
  }, [chords, currentTime]);

  const visible = useMemo(() => {
    const start = currentTime - 250;
    const end = currentTime + lookaheadMs;
    return events.filter((e) => e.t >= start && e.t <= end);
  }, [events, currentTime, lookaheadMs]);

  const laneGlow = useMemo(() => {
    const glow = Array(6).fill(false);
    for (const e of visible) {
      if (Math.abs(e.t - currentTime) <= hitWindowMs) glow[e.lane] = true;
    }
    return glow;
  }, [visible, currentTime, hitWindowMs]);

  return (
    <div className="w-full bg-gradient-to-br from-gray-950 to-gray-900 rounded-3xl p-6 shadow-2xl border border-white/10">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="font-body text-xs text-gray-400">Guitar Hero Mode</p>
          <h2 className="font-display text-3xl text-white">
            {activeChord?.chord ?? '—'}
            <span className="ml-2 text-sm text-gray-400 font-body">
              {activeChord ? '(play now)' : ''}
            </span>
          </h2>
        </div>
        <div className="text-right">
          <p className="font-body text-xs text-gray-400">Time</p>
          <p className="font-display text-base text-white">
            {(currentTime / 1000).toFixed(2)}s
          </p>
        </div>
      </div>

      <div className="fretboard-perspective" style={{ height: highwayHeight }}>
        <div
          className="relative overflow-hidden rounded-2xl fretboard-wood border-2 border-amber-900/60 fretboard-tilt h-full"
        >
        <div className="absolute inset-0 flex">
          {STRINGS.map((s, i) => (
            <div
              key={s}
              className="relative flex-1 flex justify-center items-stretch"
              style={{
                background: laneGlow[i] ? 'rgba(16,185,129,0.12)' : 'transparent',
                transition: 'background 80ms linear',
              }}
            >
              <div
                className={`guitar-string flex-shrink-0 ${
                  i === 0 ? 'guitar-string-thick' : i === 5 ? 'guitar-string-thin' : ''
                }`}
              />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xl font-bold text-amber-200/90 font-display drop-shadow-md">
                {s}
              </div>
            </div>
          ))}
        </div>

        <div
          className="absolute left-0 right-0 h-[3px] bg-bob-blue shadow-[0_0_12px_rgba(59,130,246,0.6)]"
          style={{ top: hitLineY }}
        />
        <div
          className="absolute left-0 right-0 h-10 pointer-events-none"
          style={{ top: hitLineY - 20 }}
        >
          <div className="absolute inset-0 bg-bob-blue/10 blur-md" />
        </div>

        {visible.map((e) => {
          const dt = e.t - currentTime;
          const progress = 1 - dt / lookaheadMs;
          const y = clamp(progress, 0, 1) * hitLineY;
          const depthScale = 0.55 + 0.45 * progress;

          const chordColor = CHORD_COLORS[e.chordName] ?? '#3b82f6';
          const isHit = Math.abs(e.t - currentTime) <= hitWindowMs;

          return (
            <div
              key={`${e.t}-${e.lane}`}
              className="absolute will-change-[top]"
              style={{
                left: `${(e.lane / 6) * 100}%`,
                width: `${100 / 6}%`,
                top: y - 14,
                transition: 'top 60ms linear',
              }}
            >
              <div className="w-full flex justify-center">
                <div
                  className="note-gem-trail rounded-full flex items-center justify-center text-[10px] font-bold text-black select-none"
                  style={{
                    width: 28,
                    height: 28,
                    background: chordColor,
                    boxShadow: isHit
                      ? `0 0 22px ${chordColor}`
                      : '0 0 10px rgba(0,0,0,0.4)',
                    transform: `scale(${isHit ? 1.15 : depthScale})`,
                    transition: 'transform 80ms linear, box-shadow 80ms linear',
                  }}
                  title={`${e.chordName} • ${STRINGS[e.lane]} • fret ${e.fret}`}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="note-sparkle" aria-hidden />
                  ))}
                  <span className="relative z-10">{e.fret === 0 ? 'O' : e.fret}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="absolute left-0 right-0 bottom-3 flex">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const shape = activeChord ? CHORD_SHAPES[activeChord.chord] : null;
            const fret = shape?.[i] ?? null;
            const display = fret === null ? '—' : fret === 0 ? 'O' : fret;
            return (
              <div key={`fret-${i}`} className="flex-1 flex justify-center">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-amber-900/50 flex items-center justify-center text-sm font-bold text-amber-200/90 font-display"
                  style={{
                    background: laneGlow[i] ? 'rgba(16,185,129,0.3)' : 'rgba(0,0,0,0.25)',
                    boxShadow: laneGlow[i] ? '0 0 18px rgba(16,185,129,0.5)' : 'inset 0 1px 2px rgba(0,0,0,0.3)',
                    transition: 'all 80ms linear',
                  }}
                  title={`${STRINGS[i]} string • fret ${fret === 0 ? 'open' : fret ?? '—'}`}
                >
                  {display}
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-400 font-body">
        Chord-driven note highway • Match the gems to the hit line as they scroll down
      </div>
    </div>
  );
}
