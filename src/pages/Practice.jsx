import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ChordTimeline from '../components/ChordTimeline';
import { MOCK_SONG } from '../data/mockSongData';

export default function Practice() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChord, setCurrentChord] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const intervalRef = useRef(null);
  const lastTickRef = useRef(0);

  const SPEEDS = [0.25, 0.5, 0.75, 1];

  // Tick interval in ms - how often we update the slider
  const TICK_MS = 50;

  // setInterval-based playback: each tick advances (TICK_MS * speed) ms of song time
  // At 0.25x: 1 real second advances 0.25 song seconds (4 real sec = 1 song sec)
  // At 1x: 1 real second advances 1 song second
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

        setCurrentTime((prev) => {
          const next = Math.min(prev + advance, MOCK_SONG.duration);
          if (next >= MOCK_SONG.duration) {
            setTimeout(() => setIsPlaying(false), 0);
          }
          return next;
        });
      };

      intervalRef.current = setInterval(tick, TICK_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, playbackSpeed]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar streak={1} xp={50} />
      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl text-bob-green-dark mb-2">Practice Mode</h1>
          <p className="font-body text-gray-600">
            Play along with the chord progression
          </p>
        </div>

        {/* Chord Timeline */}
        <div className="mt-8">
          <ChordTimeline
            songData={MOCK_SONG}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onChordChange={setCurrentChord}
          />
        </div>

        {/* Audio Controls */}
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            {/* Speed controls - always visible */}
            <div className="flex items-center gap-2">
              <span className="font-body text-sm font-semibold text-gray-700">Speed:</span>
              {SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-3 py-2 rounded-lg font-display font-semibold text-sm transition ${
                    playbackSpeed === speed
                      ? 'bg-bob-green text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
            <button
              onClick={handlePlayPause}
              className="px-8 py-3 bg-bob-green text-white rounded-full font-display font-semibold hover:bg-bob-green/90 transition shadow-lg"
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
            <button
              onClick={handleStop}
              className="px-8 py-3 bg-gray-400 text-white rounded-full font-display font-semibold hover:bg-gray-500 transition shadow-lg"
            >
              ■ Stop
            </button>
            <button
              onClick={handleReplay}
              className="px-8 py-3 bg-bob-blue text-white rounded-full font-display font-semibold hover:bg-bob-blue/90 transition shadow-lg"
            >
              ↻ Replay
            </button>
          </div>

          {/* Seek Position */}
          <div className="text-center mt-6">
            <p className="font-body text-sm text-gray-600 mb-2">Seek Position</p>
            <input
              type="range"
              min="0"
              max={MOCK_SONG.duration}
              value={currentTime}
              onChange={(e) => {
                const time = Number(e.target.value);
                handleSeek(time);
              }}
              className="w-full max-w-xs"
            />
            <p className="font-body text-xs text-gray-500 mt-2">
              {Math.floor(currentTime / 1000)}s / {Math.floor(MOCK_SONG.duration / 1000)}s
            </p>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="font-body text-gray-500 hover:text-gray-700 mt-8 block mx-auto"
        >
          ← Back to Home
        </button>
      </main>
    </div>
  );
}
