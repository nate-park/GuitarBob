import React from 'react';
import { Link } from 'react-router-dom';
import { useCharacter } from '../context/CharacterContext';
import { CHARACTERS } from '../context/CharacterContext';
import BobWithSpeech from '../components/BobWithSpeech';
import TopBar from '../components/TopBar';

export default function Home() {
  const { characterId } = useCharacter();
  const tutorName = CHARACTERS.find((c) => c.id === characterId)?.name ?? 'Bob';

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar streak={0} hearts={3} xp={0} />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <span className="text-5xl animate-bounce-soft inline-block">🎸</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl text-bob-green-dark text-center mb-2">
          Hey there, rockstar!
        </h1>
        <p className="font-body text-xl text-gray-600 text-center mb-10">
          I'm {tutorName} – your guitar buddy. Let's learn something cool!
        </p>
        <BobWithSpeech
          message="Upload any song and I'll figure out the chords and tabs for you. Then we'll practice together, step by step. Ready?"
          pose="default"
          bobSize={180}
        />
        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link
            to="/upload"
            className="btn-bob-green flex-1 text-center no-underline py-4"
          >
            Upload a song
          </Link>
          <Link
            to="/practice"
            className="btn-bob-outline flex-1 text-center no-underline py-4"
          >
            Practice mode
          </Link>
          <Link
            to="/tuner"
            className="btn-bob-outline flex-1 text-center no-underline py-4"
          >
            Tuner
          </Link>
        </div>
        <p className="font-body text-sm text-gray-500 mt-8 text-center">
          Use your electric guitar + audio interface to play along!
        </p>
      </main>
    </div>
  );
}
