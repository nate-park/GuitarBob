import React from 'react';
import { Link } from 'react-router-dom';
import { useCharacter, CHARACTERS } from '../context/CharacterContext';
import Bob from '../components/Bob';
import Luna from '../components/Luna';
import Riff from '../components/Riff';

const MASCOT_MAP = { bob: Bob, luna: Luna, riff: Riff };

export default function CharacterShop() {
  const { characterId, setCharacterId } = useCharacter();
  const navigate = useNavigate();

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
          <div className="grid grid-cols-3 gap-4 sm:gap-6">
            {CHARACTERS.map((c) => {
              const MascotComponent = MASCOT_MAP[c.id];
              const isSelected = characterId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCharacterId(c.id)}
                  className={`
                    flex flex-col items-center p-4 sm:p-6 rounded-2xl border-4 transition transform hover:scale-[1.02] active:scale-[0.98] bg-white shadow-card
                    ${isSelected
                      ? 'border-bob-green bg-bob-green/15 shadow-bob ring-2 ring-bob-green/50'
                      : 'border-lesson-border hover:border-bob-green/50'
                    }
                  `}
                >
                  {MascotComponent && (
                    <MascotComponent pose="default" size={100} className="mb-3" />
                  )}
                  <span className="font-display font-semibold text-gray-800 text-lg">{c.name}</span>
                  <span className="text-2xl mt-1">{c.emoji}</span>
                  {isSelected && (
                    <span className="font-body text-xs text-bob-green-dark mt-2 font-semibold">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

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
