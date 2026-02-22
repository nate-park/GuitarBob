import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import GuitarNeck from './GuitarNeck';
import NoteHighway from './NoteHighway';

/**
 * PracticeVisualizer - Rocksmith/Guitar Hero hybrid
 * - Horizontal fretboard at bottom
 * - Notes fall from top, land at (string, fret) on the neck
 * - currentTime: seconds (from audio.currentTime or playback clock)
 * - songData: { duration, notes: [{ time, string: 0-5, fret, duration? }] }
 */
export default function PracticeVisualizer({
  currentTime = 0,
  songData = { duration: 0, notes: [] },
  lookahead = 3,
  frets = 12,
  className = '',
}) {
  const currentTimeRef = useRef(currentTime);
  const containerRef = useRef(null);
  const [width, setWidth] = useState(640);
  const [glowCells, setGlowCells] = useState(new Map()); // 's-f' -> { quality, until }

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  const onNoteHit = useCallback((string, fret, quality) => {
    const key = `${string}-${fret}`;
    setGlowCells((prev) => {
      const next = new Map(prev);
      next.set(key, { quality, until: Date.now() + 200 });
      return next;
    });
  }, []);

  // Clear expired glows (minimal timer-based cleanup)
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setGlowCells((prev) => {
        let changed = false;
        const next = new Map(prev);
        for (const [k, v] of next) {
          if (v.until < now) {
            next.delete(k);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 50);
    return () => clearInterval(id);
  }, []);

  const activeGlowCells = new Map();
  for (const [k, v] of glowCells) {
    activeGlowCells.set(k, v.quality);
  }

  const highwayHeight = 200;
  const hitLineY = 180;

  return (
    <div
      className={`practice-card rounded-2xl p-4 overflow-hidden relative ${className}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display text-lg text-amber-900">Note Highway</h3>
        <span className="font-body text-sm text-amber-800">
          {currentTime.toFixed(2)}s / {songData.duration ?? 0}s
        </span>
      </div>

      <div
        ref={containerRef}
        className="rounded-xl overflow-hidden practice-visualizer-inner relative"
      >
        {/* Falling notes - Canvas */}
        <NoteHighway
          currentTimeRef={currentTimeRef}
          songData={songData}
          lookahead={lookahead}
          width={width}
          highwayHeight={highwayHeight}
          hitLineY={hitLineY}
          frets={frets}
          onNoteHit={onNoteHit}
        />

        {/* Horizontal fretboard */}
        <div className="p-2">
          <GuitarNeck frets={frets} glowCells={activeGlowCells} />
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-amber-800 font-body">
        Notes fall from top → hit line → align to fret on neck
      </p>
    </div>
  );
}
