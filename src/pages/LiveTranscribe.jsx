import React from 'react';
import { Link } from 'react-router-dom';
import TopBar from '../components/TopBar';
import LiveDetectedNotes, { useLiveGuitar } from '../components/LiveDetectedNotes';

export default function LiveTranscribe() {
  const { notes, isConnected, error, connect, disconnect } = useLiveGuitar();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      <TopBar streak={0} xp={0} />
      <main className="flex-1 flex flex-col items-center px-6 py-8 max-w-lg mx-auto w-full">
        <h1 className="font-display text-2xl text-bob-green-dark mb-1">Live Listen Test</h1>
        <p className="font-body text-sm text-amber-800/80 mb-6">
          Raw pitch data dump — verify detection works when you play guitar
        </p>

        <div className="w-full max-w-sm mb-4">
          <button
            onClick={isConnected ? disconnect : connect}
            className={`w-full py-3 px-6 rounded-xl font-display font-semibold text-white transition-all ${
              isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-bob-green hover:bg-bob-green-dark'
            }`}
          >
            {isConnected ? 'Stop' : 'Listen'}
          </button>
          {error && <p className="font-body text-sm text-red-600 mt-2">{error}</p>}
        </div>

        <div className="w-full">
          <LiveDetectedNotes notes={notes} isConnected={isConnected} error={error} />
        </div>

        <Link to="/" className="mt-8 font-body text-bob-green-dark hover:underline">
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
