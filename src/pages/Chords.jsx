import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import ChordLibrary from '../components/ChordLibrary';

export default function ChordsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar streak={1} xp={50} />
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="font-body text-gray-500 hover:text-gray-700 mb-6 inline-block"
        >
          ← Back
        </button>

        <ChordLibrary />
      </main>
    </div>
  );
}
