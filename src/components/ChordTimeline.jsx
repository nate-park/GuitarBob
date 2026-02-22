import React, { useMemo } from 'react';
import ChordDiagram from './ChordDiagram';
import { CHORD_COLORS } from '../data/mockSongData';

export default function ChordTimeline({
  songData,
  currentTime = 0,
  isPlaying = false,
  onChordChange = null,
}) {
  const chords = songData.chords;
  
  // Find current chord
  const currentChordData = useMemo(() => {
    let active = null;
    let upcoming = null;

    for (let i = 0; i < chords.length; i++) {
      const chord = chords[i];
      const chordEnd = chord.time + chord.duration;

      if (currentTime >= chord.time && currentTime < chordEnd) {
        active = { ...chord, index: i };
      }

      if (!upcoming && chord.time > currentTime) {
        upcoming = { ...chord, index: i };
      }
    }

    return { active, upcoming };
  }, [currentTime, chords]);

  // Call callback when chord changes
  React.useEffect(() => {
    if (onChordChange && currentChordData.active) {
      onChordChange(currentChordData.active.chord);
    }
  }, [currentChordData.active?.time, onChordChange]);

  const total = songData.duration;

  return (
    <div className="w-full space-y-4">
      {/* Big active chord display */}
      <div className="bg-gradient-to-br from-bob-blue to-bob-blue/80 rounded-3xl p-8 text-center shadow-2xl flex flex-col items-center">
        <p className="font-body text-sm text-blue-100 mb-4">Now Playing</p>
        <div className="transform scale-150 mb-4">
          <ChordDiagram chord={currentChordData.active?.chord || 'C'} size={100} />
        </div>
        <p className="font-body text-sm text-blue-100 mt-4">
          {Math.floor(currentTime / 1000)}s / {Math.floor(total / 1000)}s
        </p>
      </div>

      {/* Timeline progress bar - no transition so it stays in sync with slider */}
      <div className="bg-gray-200 rounded-full h-3 overflow-hidden shadow-md">
        <div
          className="h-full bg-gradient-to-r from-bob-green to-bob-blue"
          style={{ width: `${(currentTime / total) * 100}%` }}
        />
      </div>

      {/* Chord segments with diagrams */}
      <div className="flex gap-3 flex-wrap justify-center">
        {chords.map((chord, idx) => {
          const chordStart = chord.time;
          const chordEnd = chord.time + chord.duration;
          const isActive = currentTime >= chordStart && currentTime < chordEnd;
          const isPassed = currentTime >= chordEnd;
          const color = CHORD_COLORS[chord.chord] || '#6b7280';

          return (
            <div
              key={idx}
              className={`
                flex flex-col items-center p-2 rounded-lg transition-all duration-100
                ${
                  isActive
                    ? 'scale-110 shadow-lg ring-2 ring-white bg-white/10'
                    : isPassed
                    ? 'opacity-50'
                    : 'opacity-70 hover:opacity-100'
                }
              `}
            >
              <div className="transform scale-75">
                <ChordDiagram chord={chord.chord} size={80} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Info footer */}
      <div className="bg-gray-800 rounded-2xl p-4 text-center">
        <p className="font-body text-sm text-gray-300">
          {isPlaying ? '▶ Playing' : '⏸ Paused'} • {songData.tempo} BPM • {chords.length} chords
          {currentChordData.upcoming && (
            <span className="ml-3 text-bob-green">
              Next: <span className="font-display font-bold">{currentChordData.upcoming.chord}</span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
