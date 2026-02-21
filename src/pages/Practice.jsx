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
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  // Use RAF for smooth time updates with a timer
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - pausedTimeRef.current;
      
      const updateTime = () => {
        const elapsed = Date.now() - startTime;
        setCurrentTime(elapsed);
        
        // Stop at end of song
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
  }, [isPlaying]);

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

  const handleReplay = () => {
    setCurrentTime(0);
    pausedTimeRef.current = 0;
    setIsPlaying(true);
  };

  const handleSeek = (time) => {
    if (!isPlaying) {
      setCurrentTime(time);
      pausedTimeRef.current = time;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar streak={1} hearts={3} xp={50} />
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
          <div className="flex gap-4 justify-center">
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
