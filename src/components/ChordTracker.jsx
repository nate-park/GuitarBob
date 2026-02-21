import React, { useMemo } from 'react';
import ChordBlock from './ChordBlock';
import PlayheadIndicator from './PlayheadIndicator';

export default function ChordTracker({
  songData,
  currentTime = 0,
  isPlaying = false,
  onChordChange = null,
  pixelsPerMs = 0.15,
}) {
  const PLAYHEAD_CENTER = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;

  // Find current and upcoming chords
  const currentChordData = useMemo(() => {
    let active = null;
    let upcoming = null;

    for (let i = 0; i < songData.chords.length; i++) {
      const chord = songData.chords[i];
      const chordEnd = chord.time + chord.duration;

      if (currentTime >= chord.time && currentTime < chordEnd) {
        active = { ...chord, index: i };
      }

      if (!upcoming && chord.time > currentTime && chord.time <= currentTime + 2000) {
        upcoming = { ...chord, index: i };
      }
    }

    return { active, upcoming };
  }, [currentTime, songData.chords]);

  // Call callback when chord changes
  React.useEffect(() => {
    if (onChordChange && currentChordData.active) {
      onChordChange(currentChordData.active.chord);
    }
  }, [currentChordData.active?.time, onChordChange]);

  const displayWindow = 8000; // Show 8 seconds (wider window for smooth entry)
  const windowStart = currentTime - 2000; // Show 2 seconds in past
  const windowEnd = currentTime + displayWindow - 2000; // Show ahead

  // Filter visible chords
  const visibleChords = songData.chords.filter(
    (chord) => chord.time + chord.duration > windowStart && chord.time < windowEnd
  );

  return (
    <div className="w-full bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden border-2 border-bob-blue/30">
      {/* Header */}
      <div className="px-4 py-2 bg-gray-800 border-b border-bob-blue/20">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="font-display text-sm text-bob-blue font-semibold">
              {currentChordData.active?.chord || '—'}
            </h3>
            <p className="font-body text-xs text-gray-400">
              {Math.floor(currentTime / 1000)}s / {Math.floor(songData.duration / 1000)}s
            </p>
          </div>
          {currentChordData.upcoming && (
            <div className="text-right">
              <p className="font-body text-xs text-gray-400">Next:</p>
              <p className="font-display text-sm text-bob-green font-semibold">
                {currentChordData.upcoming.chord}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tracker Container */}
      <div className="relative h-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gray-600"
              style={{ left: `${(i * 500) % window.innerWidth}px` }}
            />
          ))}
        </div>

        {/* Chord blocks */}
        <div className="relative h-full">
          {visibleChords.map((chord, idx) => (
            <ChordBlock
              key={`${chord.time}-${chord.chord}`}
              chord={chord.chord}
              time={chord.time}
              duration={chord.duration}
              currentTime={currentTime}
              pixelsPerMs={pixelsPerMs}
              isActive={currentChordData.active?.time === chord.time}
              isUpcoming={currentChordData.upcoming?.time === chord.time}
            />
          ))}
        </div>

        {/* Playhead indicator */}
        <PlayheadIndicator pixelsPerMs={pixelsPerMs} />
      </div>

      {/* Timeline info */}
      <div className="px-4 py-2 bg-gray-800 border-t border-bob-blue/20">
        <p className="font-body text-xs text-gray-400 text-center">
          {isPlaying ? '▶ Playing' : '⏸ Paused'} • {songData.tempo} BPM
        </p>
      </div>
    </div>
  );
}
