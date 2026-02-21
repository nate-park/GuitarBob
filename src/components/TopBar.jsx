import React from 'react';
import { Link } from 'react-router-dom';
import { useCharacter, CHARACTERS } from '../context/CharacterContext';
import Mascot from './Mascot';

export default function TopBar({ streak = 0, xp = 0 }) {
  const { characterId } = useCharacter();
  const currentName = CHARACTERS.find((c) => c.id === characterId)?.name ?? 'Bob';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b-4 border-bob-green shadow-card relative">
      <div className="max-w-4xl mx-auto px-3 py-2 sm:py-2.5 flex items-center gap-2 min-h-[52px]">
        <Link to="/" className="flex items-center gap-1.5 min-w-0 shrink-0 no-underline flex-1 justify-start">
          <span className="font-display text-lg sm:text-2xl text-bob-green-dark truncate">GuitarBob</span>
          <span className="text-lg sm:text-2xl shrink-0">🎸</span>
        </Link>
        <Link
          to="/shop"
          className="flex items-center justify-center gap-1.5 rounded-xl border-2 border-lesson-border bg-lesson-bg px-2 py-1 sm:px-2.5 sm:py-1.5 hover:border-bob-green/50 transition shrink-0 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-1 no-underline"
          title={`Choose tutor (${currentName})`}
        >
          <Mascot pose="default" size={28} className="sm:w-8 sm:h-8 w-7 h-7" />
          <span className="font-body text-xs sm:text-sm text-gray-700 truncate max-w-[4rem] sm:max-w-none">{currentName}</span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 flex-1 justify-end">
          {streak > 0 && (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-bob-orange/20 rounded-lg sm:rounded-xl px-1.5 sm:px-3 py-1 sm:py-1.5">
              <span className="text-base sm:text-xl">🔥</span>
              <span className="font-display font-semibold text-bob-orange-dark text-sm sm:text-base">{streak}</span>
            </div>
          )}
          {xp >= 0 && (
            <div className="flex items-center gap-0.5 sm:gap-1 bg-bob-blue/20 rounded-lg sm:rounded-xl px-1.5 sm:px-3 py-1 sm:py-1.5">
              <span className="font-display font-semibold text-bob-blue-dark text-sm sm:text-base">{xp}</span>
              <span className="text-bob-blue-dark text-xs sm:text-sm hidden sm:inline">XP</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
