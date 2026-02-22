import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCharacter, CHARACTERS } from '../context/CharacterContext';
import Bob from '../components/Bob';
import Riff from '../components/Riff';
import UnlockCelebration from '../components/UnlockCelebration';

const MASCOT_MAP = { bob: Bob, riff: Riff };

export default function CharacterShop() {
  const { characterId, setCharacterId, xp, setXp, unlockCharacter, isUnlocked, canUnlock } = useCharacter();
  const [celebrating, setCelebrating] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bob-green/20 via-white to-bob-blue/10">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl text-bob-green-dark">
            🎸 Character Shop
          </h1>
          <p className="font-body text-gray-600 mt-2">
            Pick your tutor & look
          </p>
        </div>

        {/* Characters */}
        <section className="mb-10">
          <h2 className="font-display text-xl text-bob-green-dark mb-4">
            Choose your tutor
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto">
            {CHARACTERS.map((c) => {
              const MascotComponent = MASCOT_MAP[c.id];
              const isSelected = characterId === c.id;
              const unlocked = isUnlocked(c.id);
              const canUnlockNow = canUnlock(c.id);
              const isLocked = !unlocked;
              const handleClick = () => {
                if (canUnlockNow) {
                  unlockCharacter(c.id);
                  setCelebrating(c);
                } else if (unlocked) {
                  setCharacterId(c.id);
                }
              };
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={handleClick}
                  disabled={isLocked && !canUnlockNow}
                  className={`
                    relative flex flex-col items-center p-4 sm:p-6 rounded-2xl border-4 transition transform bg-white shadow-card
                    ${!canUnlockNow && isLocked ? 'cursor-not-allowed opacity-70' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}
                    ${unlocked && isSelected
                      ? 'border-bob-green bg-bob-green/15 shadow-bob ring-2 ring-bob-green/50'
                      : canUnlockNow
                        ? 'border-bob-orange/60 bg-amber-50 hover:border-bob-orange'
                        : isLocked
                          ? 'border-gray-300'
                          : 'border-lesson-border hover:border-bob-green/50'
                    }
                  `}
                >
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10 bg-black/30">
                      <span className="font-display font-semibold text-white text-sm px-3 py-1.5 rounded-xl bg-gray-800/90">
                        {canUnlockNow ? '✨ Tap to unlock!' : `${c.unlockXp} XP to unlock`}
                      </span>
                    </div>
                  )}
                  {MascotComponent && (
                    <MascotComponent pose="default" size={240} className="mb-3" />
                  )}
                  <span className="font-display font-semibold text-gray-800 text-lg">{c.name}</span>
                  <span className="text-2xl mt-1">{c.emoji}</span>
                    {isSelected && unlocked && (
                    <span className="font-body text-xs text-bob-green-dark mt-2 font-semibold">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {celebrating && (
          <UnlockCelebration
            characterName={celebrating.name}
            emoji={celebrating.emoji}
            onClose={() => setCelebrating(null)}
          />
        )}

        {/* Skins placeholder */}
        <section className="mb-10">
          <h2 className="font-display text-xl text-bob-green-dark mb-4">
            Skins
          </h2>
          <div className="rounded-2xl border-2 border-dashed border-lesson-border bg-white/80 p-8 text-center shadow-card">
            <p className="font-body text-gray-500 mb-2">
              More styles for your tutor coming soon!
            </p>
            <p className="text-4xl">✨</p>
          </div>
        </section>

        {/* XP + test unlock (for demo: add 50 XP to unlock Riff) */}
        <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-bob-blue/10 border-2 border-bob-blue/30">
          <span className="font-body text-gray-700">
            <span className="font-display font-semibold text-bob-blue-dark">{xp}</span> XP
          </span>
          <button
            type="button"
            onClick={() => setXp(xp + 50)}
            className="px-4 py-2 rounded-xl font-display font-semibold text-sm bg-bob-blue/20 text-bob-blue-dark hover:bg-bob-blue/30 transition"
          >
            +50 XP
          </button>
        </div>

        {/* Done - back to app */}
        <Link
          to="/"
          className="block w-full btn-bob-green py-4 text-xl text-center no-underline"
        >
          Done
        </Link>
      </div>
    </div>
  );
}
