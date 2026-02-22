import React, { useMemo, useRef, useEffect } from 'react';

const WS_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/^http/, 'ws');
const MAX_RAW_EVENTS = 80;

function formatRawEvent(ev) {
  if (!ev || typeof ev !== 'object') return '';
  const hz = typeof ev.pitch_hz === 'number' && Number.isFinite(ev.pitch_hz)
    ? ev.pitch_hz.toFixed(1) : '—';
  const note = ev.note ?? '—';
  const conf = typeof ev.confidence === 'number' && Number.isFinite(ev.confidence)
    ? ev.confidence.toFixed(2) : '—';
  const energy = typeof ev.energy === 'number' && Number.isFinite(ev.energy)
    ? ev.energy.toFixed(4) : '—';
  return `${hz}Hz  ${note}  conf:${conf}  energy:${energy}`;
}

/**
 * LiveDetectedNotes – raw data dump from live guitar input. Use to verify detection works.
 */
export default function LiveDetectedNotes({ notes = [], isConnected, error }) {
  const scrollRef = useRef(null);

  const rawLines = useMemo(() => {
    return notes
      .slice(-MAX_RAW_EVENTS)
      .filter((ev) => ev != null)
      .reverse()
      .map((ev, i) => ({
        key: `raw-${i}-${ev?.ts ?? ''}`,
        text: formatRawEvent(ev),
      }));
  }, [notes]);

  useEffect(() => {
    if (scrollRef.current && rawLines.length > 0) {
      scrollRef.current.scrollTop = 0;
    }
  }, [rawLines.length]);

  return (
    <div className="practice-card rounded-2xl p-4 flex flex-col h-full min-h-[200px]">
      <h3 className="font-display text-lg text-amber-900 mb-2">What you&apos;re playing</h3>
      {error && (
        <p className="font-body text-sm text-red-600 mb-2">{error}</p>
      )}
      {!isConnected && !error && (
        <p className="font-body text-sm text-amber-800/80">Click &quot;Listen&quot; to connect your guitar (Scarlett)</p>
      )}
      {isConnected && !error && (
        <>
          <p className="font-body text-xs text-amber-700 mb-2">
            Raw data • {notes.length} events — play guitar to see pitch_hz, note, confidence, energy
          </p>
          <div
            ref={scrollRef}
            className="flex-1 min-h-[140px] max-h-[220px] overflow-y-auto overflow-x-hidden rounded-lg bg-amber-950/30 border border-amber-800/40 p-3 font-mono text-[11px] text-amber-100 leading-relaxed"
          >
            {rawLines.length === 0 ? (
              <span className="text-amber-500">Listening... Play a note — data will stream here</span>
            ) : (
              rawLines.map(({ key, text }) => (
                <div key={key} className="whitespace-nowrap">{text}</div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Hook to connect to /ws/live and collect detected notes.
 */
export function useLiveGuitar() {
  const [notes, setNotes] = React.useState([]);
  const [isConnected, setIsConnected] = React.useState(false);
  const [error, setError] = React.useState(null);
  const wsRef = React.useRef(null);

  const connect = React.useCallback(() => {
    setError(null);
    const ws = new WebSocket(`${WS_URL}/ws/live`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setNotes([]);
    };

    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        setNotes((prev) => [...prev.slice(-MAX_RAW_EVENTS), event]);
      } catch (_) {}
    };

    ws.onerror = () => {
      setError('Connection error – is the backend running on port 8000?');
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
    };
  }, []);

  const disconnect = React.useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setError(null);
  }, []);

  React.useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return { notes, isConnected, error, connect, disconnect };
}
