import React, { useState } from 'react';
import { useCharacter, CHARACTERS } from '../context/CharacterContext';
import Bob from './Bob';
import Riff from './Riff';
import UnlockCelebration from './UnlockCelebration';

const MASCOT_MAP = { bob: Bob, riff: Riff };

export default function CharacterSelectModal({ onClose }) {
  const { characterId, setCharacterId, unlockCharacter, isUnlocked, canUnlock } = useCharacter();
  const [celebrating, setCelebrating] = useState(null);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex flex-col items-center justify-center min-h-full p-4 py-8 bg-gradient-to-b from-bob-green/20 via-white/95 to-bob-blue/10"
      role="dialog"
      aria-label="Character shop"
    >
      {/* Backdrop click to close */}
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 cursor-default -z-10"
        aria-label="Close"
      />

      {/* Centered wrapper so the shop window is always centered and not cut off */}
      <div className="flex items-center justify-center min-h-full w-full py-8">
        {/* Shop window - framed like a storefront */}
        <div
          className="relative w-full max-w-2xl max-h-[calc(100vh-4rem)] overflow-auto rounded-[2rem] border-[6px] border-bob-green shadow-2xl bg-white animate-pop"
          style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 6px #46A302' }}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Shop header */}
        <div className="sticky top-0 z-10 bg-bob-green rounded-t-[1.5rem] px-6 py-4 text-center border-b-4 border-bob-green-dark">
          <h2 className="font-display text-2xl sm:text-3xl text-white drop-shadow-sm">
            🎸 Character Shop
          </h2>
          <p className="font-body text-white/90 text-sm sm:text-base mt-1">
            Pick your tutor & look
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Characters section */}
          <section className="mb-8">
            <h3 className="font-display text-xl text-bob-green-dark mb-4">
              Choose your tutor
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-sm mx-auto">
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
                      relative flex flex-col items-center p-4 sm:p-6 rounded-2xl border-4 transition transform bg-lesson-bg
                      ${!canUnlockNow && isLocked ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'}
                      ${unlocked && isSelected
                        ? 'border-bob-green bg-bob-green/15 shadow-bob ring-2 ring-bob-green/50'
                        : canUnlockNow
                          ? 'border-bob-orange/60 hover:border-bob-orange'
                          : isLocked
                            ? 'border-gray-300'
                            : 'border-lesson-border hover:border-bob-green/50'
                      }
                    `}
                  >
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 z-10">
                        <span className="font-display font-semibold text-white text-sm px-3 py-1.5 rounded-xl bg-gray-800/90">
                          {canUnlockNow ? '✨ Tap to unlock!' : `${c.unlockXp} XP to unlock`}
                        </span>
                      </div>
                    )}
                    {MascotComponent && (
                      <MascotComponent pose="default" size={100} className="mb-3" />
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

          {/* Skins section - placeholder for future */}
          <section className="mb-8">
            <h3 className="font-display text-xl text-bob-green-dark mb-4">
              Skins
            </h3>
            <div className="rounded-2xl border-2 border-dashed border-lesson-border bg-lesson-bg/50 p-8 text-center">
              <p className="font-body text-gray-500 mb-2">
                More styles for your tutor coming soon!
              </p>
              <p className="text-4xl">✨</p>
            </div>
          </section>

          <button
            type="button"
            onClick={onClose}
            className="w-full btn-bob-green py-4 text-xl"
          >
            Done
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
