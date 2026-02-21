import React, { useState } from 'react';
import ChordDiagram from './ChordDiagram';

export default function ChordLibrary() {
  const [filter, setFilter] = useState('all');

  const categories = {
    major: ['C', 'Csharp', 'D', 'Dsharp', 'E', 'F', 'Fsharp', 'G', 'Gsharp', 'A', 'Asharp', 'B'],
    minor: ['Am', 'Asharp_m', 'Bm', 'Cm', 'Csharp_m', 'Dm', 'Dsharp_m', 'Em', 'Fm', 'Fsharp_m', 'Gm', 'Gsharp_m'],
    dom7: ['C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7'],
    min7: ['Am7', 'Dm7', 'Em7', 'Gm7'],
    maj7: ['Cmaj7', 'Gmaj7'],
    sus: ['Csus2', 'Csus4', 'Gsus4'],
    power: ['C5', 'G5', 'D5'],
    dim: ['Cdim', 'Bdim'],
    aug: ['Caug', 'Gaug'],
  };

  const getChordsToShow = () => {
    if (filter === 'all') {
      return Object.values(categories).flat();
    }
    return categories[filter] || [];
  };

  const chords = getChordsToShow();

  return (
    <div className="w-full">
      {/* Title */}
      <div className="mb-6">
        <h2 className="font-display text-3xl text-bob-green-dark mb-4">Chord Library</h2>
        <p className="font-body text-gray-600 mb-4">
          40+ guitar chords with complete fingering positions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          ['all', 'All Chords'],
          ['major', 'Major'],
          ['minor', 'Minor'],
          ['dom7', 'Dominant 7'],
          ['min7', 'Minor 7'],
          ['maj7', 'Major 7'],
          ['sus', 'Sus'],
          ['power', 'Power'],
          ['dim', 'Diminished'],
          ['aug', 'Augmented'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full font-display font-semibold transition ${
              filter === key
                ? 'bg-bob-green text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chord Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {chords.map((chord) => (
          <div key={chord} className="flex flex-col items-center">
            <ChordDiagram chord={chord} size={100} />
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-12 bg-bob-blue/10 rounded-2xl p-6">
        <h3 className="font-display text-lg text-bob-blue font-bold mb-2">About These Diagrams</h3>
        <ul className="font-body text-gray-700 space-y-2">
          <li>
            <span className="font-semibold">🟢 Green circles</span> = Open strings (play but don't fret)
          </li>
          <li>
            <span className="font-semibold">❌ Red X marks</span> = Muted strings (don't play)
          </li>
          <li>
            <span className="font-semibold">🔵 Blue dots</span> = Where to place your fingers
          </li>
          <li>
            <span className="font-semibold">🟠 Orange bars</span> = Barre chords (press multiple strings)
          </li>
        </ul>
      </div>
    </div>
  );
}
