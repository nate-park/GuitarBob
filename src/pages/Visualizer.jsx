import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChordTimeline from '../components/ChordTimeline';
import TabViewer from '../components/TabViewer';
import { MOCK_SONG } from '../data/mockSongData';

export default function Visualizer() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChord, setCurrentChord] = useState(null);
  const [showTabs, setShowTabs] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const rafRef = useRef(null);
  const playStartTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  const SPEEDS = [0.25, 0.5, 0.75, 1];

  // Timer-based playback (scaled by playback speed)
  useEffect(() => {
    if (isPlaying) {
      playStartTimeRef.current = Date.now();

      const updateTime = () => {
        const realElapsed = Date.now() - playStartTimeRef.current;
        const elapsed = pausedTimeRef.current + realElapsed * playbackSpeed;
        pausedTimeRef.current = elapsed;
        setCurrentTime(elapsed);

        if (elapsed >= MOCK_SONG.duration) {
          setIsPlaying(false);
          pausedTimeRef.current = MOCK_SONG.duration;
        } else {
          rafRef.current = requestAnimationFrame(updateTime);
        }
      };
      rafRef.current = requestAnimationFrame(updateTime);
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  const handlePlayPause = () => {
    if (isPlaying) {
      pausedTimeRef.current = currentTime;
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    pausedTimeRef.current = 0;
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
    pausedTimeRef.current = time;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl text-bob-green-dark mb-2">Song Visualizer</h1>
          <p className="font-body text-gray-600">
            {MOCK_SONG.title} • {MOCK_SONG.artist}
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Chord Timeline */}
          <ChordTimeline
            songData={MOCK_SONG}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onChordChange={setCurrentChord}
          />

          {/* Tab Viewer (Optional) */}
          {showTabs && (
            <div>
              <h2 className="font-display text-2xl text-bob-green-dark mb-4">Tablature</h2>
              <TabViewer gpFile="/sample.gp5" />
            </div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            {/* Playback speed */}
            <div className="flex gap-2 justify-center mb-4 flex-wrap">
              <span className="font-body text-sm text-gray-600 self-center mr-2">Speed:</span>
              {SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-4 py-2 rounded-full font-display font-semibold transition ${
                    playbackSpeed === speed
                      ? 'bg-bob-green text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
            <div className="flex gap-4 justify-center mb-6">
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
                onClick={() => setShowTabs(!showTabs)}
                className={`px-8 py-3 rounded-full font-display font-semibold transition shadow-lg ${
                  showTabs
                    ? 'bg-bob-blue text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {showTabs ? '📊 Hide Tabs' : '📊 Show Tabs'}
              </button>
            </div>

            {/* Speed control */}
            <div className="text-center">
              <p className="font-body text-sm text-gray-600 mb-2">Seek Position</p>
              <input
                type="range"
                min="0"
                max={MOCK_SONG.duration}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
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
            className="font-body text-gray-500 hover:text-gray-700 block mx-auto"
          >
            ← Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
