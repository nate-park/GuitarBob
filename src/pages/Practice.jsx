import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import GuitarHeroFretboard from '../components/GuitarHeroFretboard';
import PracticeVisualizer from '../components/PracticeVisualizer';
import LiveDetectedNotes, { useLiveGuitar } from '../components/LiveDetectedNotes';
import ChordDiagram, { CHORD_DATA } from '../components/ChordDiagram';
import { MOCK_SONG } from '../data/mockSongData';
import { PRACTICE_SONG } from '../data/practiceVisualizerSong';

export default function Practice() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visualizerMode, setVisualizerMode] = useState('notes'); // 'notes' | 'chords'
  const { notes, isConnected, error, connect, disconnect } = useLiveGuitar();

  // Use songData from Results (uploaded song) or fallback to mock
  const songDataFromUpload = location.state?.songData;
  const audioUrl = location.state?.audioUrl;
  const NOTES_SONG = songDataFromUpload ?? PRACTICE_SONG;
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const lastTickRef = useRef(0);

  const SPEEDS = [0.25, 0.5, 0.75, 1];
  const SONG = visualizerMode === 'notes' ? NOTES_SONG : MOCK_SONG;
  const songDuration = visualizerMode === 'notes'
    ? (SONG.durationMs ?? SONG.duration * 1000)
    : SONG.duration;

  const TICK_MS = 50;
  const useAudio = audioUrl && visualizerMode === 'notes';

  // When using real audio: sync state from audio element
  useEffect(() => {
    if (!useAudio || !audioRef.current) return;
    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime * 1000);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [useAudio]);

  // When using real audio: try to auto-start when ready (browsers may block autoplay)
  useEffect(() => {
    if (!useAudio || !audioRef.current || !songDataFromUpload) return;
    const audio = audioRef.current;
    const tryPlay = () => {
      audio.playbackRate = playbackSpeed;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    };
    if (audio.readyState >= 2) tryPlay();
    else audio.addEventListener('canplay', tryPlay, { once: true });
    return () => audio.removeEventListener('canplay', tryPlay);
  }, [useAudio, songDataFromUpload, playbackSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  // When using mock (no audio): setInterval-based playback
  useEffect(() => {
    if (useAudio) return;
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
        const advance = realElapsed * playbackSpeed;
        let reachedEnd = false;
        setCurrentTime((prev) => {
          const next = Math.min(prev + advance, songDuration);
          if (next >= songDuration) reachedEnd = true;
          return next;
        });
        if (reachedEnd) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsPlaying(false);
        }
      };
      intervalRef.current = setInterval(tick, TICK_MS);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [useAudio, isPlaying, playbackSpeed, songDuration]);

  // Apply playback rate to audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const handlePlayPause = () => {
    if (useAudio && audioRef.current) {
      const audio = audioRef.current;
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const handleStop = () => {
    if (useAudio && audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleReplay = () => {
    if (useAudio && audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleSeek = (time) => {
    if (useAudio && audioRef.current) {
      audioRef.current.currentTime = time / 1000;
      if (isPlaying) audioRef.current.play();
    } else if (!isPlaying) {
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

        {/* Hidden audio element for uploaded song playback */}
        {audioUrl && visualizerMode === 'notes' && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="auto"
            onError={(e) => console.warn('Audio load failed:', e.target?.error)}
          />
        )}

        {/* Visualizer */}
        <div className="mt-4">
          {visualizerMode === 'notes' ? (
            <>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <PracticeVisualizer
                    currentTime={currentTime / 1000}
                    songData={NOTES_SONG}
                    lookahead={3}
                    frets={12}
                  />
                </div>
                <div className="w-full lg:w-72 shrink-0">
                  <div className="mb-2 flex justify-between items-center">
                    <span className="font-body text-sm text-amber-900">Compare with your guitar</span>
                    <button
                      onClick={isConnected ? disconnect : connect}
                      className={`px-4 py-2 rounded-xl font-display font-semibold text-sm transition ${
                        isConnected
                          ? 'bg-red-500/80 text-white hover:bg-red-600'
                          : 'bg-bob-green text-white hover:bg-bob-green-dark'
                      }`}
                    >
                      {isConnected ? 'Stop listening' : 'Listen'}
                    </button>
                  </div>
                  <LiveDetectedNotes notes={notes} isConnected={isConnected} error={error} />
                </div>
              </div>
              
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
