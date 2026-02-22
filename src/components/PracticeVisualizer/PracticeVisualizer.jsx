import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import FretboardVisualizer from './FretboardVisualizer';
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

  const highwayHeight = 320;
  const hitLineY = 300;

  const onNoteHit = useCallback((string, fret, quality) => {
    // No-op for now since FretboardVisualizer handles its own fill logic
  }, []);

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
        {/* Falling notes - Canvas with steep perspective */}
        <div className="highway-perspective overflow-hidden">
          <div className="highway-tilt">
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
          </div>
        </div>

        {/* Fretboard visualizer with filling circles */}
        <div className="p-2">
          <FretboardVisualizer 
            currentTime={currentTime}
            songData={songData}
            lookahead={lookahead}
            frets={frets}
          />
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-amber-800 font-body">
        Notes fall from top → hit line → align to fret on neck
      </p>
    </div>
  );
}
