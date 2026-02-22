import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import GuitarHeroFretboard from '../components/GuitarHeroFretboard';
import PracticeVisualizer from '../components/PracticeVisualizer';
import ChordDiagram, { CHORD_DATA } from '../components/ChordDiagram';
import { MOCK_SONG } from '../data/mockSongData';
import { PRACTICE_SONG } from '../data/practiceVisualizerSong';

export default function Practice() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visualizerMode, setVisualizerMode] = useState('notes'); // 'notes' | 'chords'
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef(null);
  const lastTickRef = useRef(0);

  const SPEEDS = [0.25, 0.5, 0.75, 1];
  const SONG = visualizerMode === 'notes' ? PRACTICE_SONG : MOCK_SONG;
  const songDuration = visualizerMode === 'notes' ? SONG.durationMs : SONG.duration;

  // Tick interval in ms - how often we update the slider
  const TICK_MS = 50;

  // setInterval-based playback: each tick advances (TICK_MS * speed) ms of song time
  useEffect(() => {
    // Always clear any existing interval first (prevents double intervals when deps change)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying) {
      lastTickRef.current = Date.now();

      const tick = () => {
        const now = Date.now();
        const realElapsed = now - lastTickRef.current;
        lastTickRef.current = now;
        const advance = realElapsed * playbackSpeed; // ms of song to advance

        let reachedEnd = false;
        setCurrentTime((prev) => {
          const next = Math.min(prev + advance, songDuration);
          if (next >= songDuration) {
            reachedEnd = true;
          }
          return next;
        });

        if (reachedEnd) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsPlaying(false);
        }
      };

      intervalRef.current = setInterval(tick, TICK_MS);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, playbackSpeed, songDuration]);

  const handlePlayPause = () => {
    setIsPlaying((p) => !p);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleReplay = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleSeek = (time) => {
    if (!isPlaying) {
      setCurrentTime(time);
    }
  };

  // Unique chords from song (from location.state or MOCK_SONG), filtered to those in chord library
  const songChords = useMemo(() => {
    const chords = location.state?.chords ?? MOCK_SONG.chords.map((c) => c.chord);
    const unique = [...new Set(chords)];
    return unique.filter((c) => CHORD_DATA[c]);
  }, [location.state?.chords]);

  return (
    <div className="min-h-screen flex flex-col practice-space-bg relative">
      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl practice-header-text mb-2">Practice Mode</h1>
          <p className="font-body practice-subtext">
            Play along with the chord progression
          </p>
        </div>

        {/* Visualizer mode toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setVisualizerMode('notes');
              setCurrentTime(0);
            }}
            className={`px-4 py-2 rounded-xl font-display font-semibold text-sm transition practice-btn ${
              visualizerMode === 'notes'
                ? 'bg-amber-400 text-amber-950 practice-btn-active'
                : 'bg-amber-100/90 text-amber-900 hover:bg-amber-200/90'
            }`}
          >
            Note Highway
          </button>
          <button
            onClick={() => {
              setVisualizerMode('chords');
              setCurrentTime(0);
            }}
            className={`px-4 py-2 rounded-xl font-display font-semibold text-sm transition practice-btn ${
              visualizerMode === 'chords'
                ? 'bg-amber-400 text-amber-950 practice-btn-active'
                : 'bg-amber-100/90 text-amber-900 hover:bg-amber-200/90'
            }`}
          >
            Chord Mode
          </button>
        </div>

        {/* Visualizer */}
        <div className="mt-4">
          {visualizerMode === 'notes' ? (
            <>
              <PracticeVisualizer
                currentTime={currentTime / 1000}
                songData={PRACTICE_SONG}
                lookahead={3}
                frets={12}
              />
              
              {/* Progress bar (notes mode) */}
              <div className="mt-6">
          <div className="bg-amber-900/30 rounded-full h-2.5 overflow-hidden border border-amber-800/40">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
              style={{
                width: `${songDuration ? (currentTime / songDuration) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
            </>
          ) : (
            /* Chord Mode: clickable chord grid from song */
            <div className="practice-card rounded-3xl p-6">
              <h2 className="font-display text-xl practice-header-text mb-4">Chords in this song</h2>
              <p className="font-body practice-subtext text-sm mb-6">Click a chord for a closer look with note names and intervals</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {songChords.map((chordKey) => (
                  <Link
                    key={chordKey}
                    to={`/chord/${chordKey}`}
                    className="flex flex-col items-center p-4 rounded-2xl border-2 border-amber-800/30 hover:border-bob-green/50 hover:bg-bob-green/10 transition-all"
                  >
                    <ChordDiagram chord={chordKey} size={110} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Audio Controls (notes mode only) */}
        {visualizerMode === 'notes' && (
        <div className="mt-8 practice-card rounded-3xl p-6 relative overflow-hidden">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {/* Speed controls - always visible */}
            <div className="flex items-center gap-2">
              <span className="font-body text-sm font-semibold text-amber-900">Speed:</span>
              {SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-3 py-2 rounded-xl font-display font-semibold text-sm transition practice-btn ${
                    playbackSpeed === speed
                      ? 'bg-amber-400 text-amber-950 practice-btn-active'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-800/30'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
            <button
              onClick={handlePlayPause}
              className="px-8 py-3 bg-amber-500 text-amber-950 rounded-2xl font-display font-semibold hover:bg-amber-400 transition practice-btn border-2 border-amber-700/50"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={handleStop}
              className="px-8 py-3 bg-amber-800/80 text-amber-100 rounded-2xl font-display font-semibold hover:bg-amber-800 transition practice-btn border-2 border-amber-900/50"
            >
              ■ Stop
            </button>
            <button
              onClick={handleReplay}
              className="px-8 py-3 bg-amber-400 text-amber-950 rounded-2xl font-display font-semibold hover:bg-amber-300 transition practice-btn border-2 border-amber-600/50"
            >
              ↻ Replay
            </button>
          </div>

          {/* Seek Position */}
          <div className="text-center mt-6">
            <p className="font-body text-sm text-amber-900 mb-2">Seek Position</p>
            <input
              type="range"
              min="0"
              max={songDuration}
              value={currentTime}
              onChange={(e) => {
                const time = Number(e.target.value);
                handleSeek(time);
              }}
              className="w-full max-w-xs"
            />
            <p className="font-body text-xs text-amber-800 mt-2">
              {(currentTime / 1000).toFixed(1)}s / {(songDuration / 1000).toFixed(1)}s
            </p>
          </div>
        </div>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="font-body text-amber-200 hover:text-amber-100 mt-8 block mx-auto transition btn-jiggle"
        >
          ← Back to Home
        </button>
      </main>
    </div>
  );
}
