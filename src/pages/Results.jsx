import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BobWithSpeech from '../components/BobWithSpeech';
import TopBar from '../components/TopBar';

// Mock tabs/chords for demo – replace with real API data later
const MOCK_CHORDS = ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'C'];
const MOCK_TABS = `
e|---0---0---0---0---|
B|---1---0---1---0---|
G|---0---0---2---0---|
D|---2---0---2---2---|
A|---3---2---0---3---|
E|---x---3---x---x---|
`.trim();

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileName = location.state?.file || 'Your song';

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar streak={1} xp={25} />
      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto">
        <BobWithSpeech
          message="Here are the chords and tabs I found! When you're ready, we can practice them together."
          pose="teaching"
          bobSize={140}
        />
        <div className="mt-8 space-y-6">
          <div className="bg-lesson-card rounded-3xl p-6 shadow-card border-2 border-lesson-border">
            <h3 className="font-display text-lg text-bob-green-dark mb-3">Chords</h3>
            <div className="flex flex-wrap gap-2">
              {MOCK_CHORDS.map((c, i) => (
                <span
                  key={i}
                  className="inline-block bg-bob-green/20 text-bob-green-dark font-display font-semibold px-4 py-2 rounded-xl"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-lesson-card rounded-3xl p-6 shadow-card border-2 border-lesson-border">
            <h3 className="font-display text-lg text-bob-green-dark mb-3">Tab (intro)</h3>
            <pre className="font-mono text-sm text-gray-800 whitespace-pre overflow-x-auto bg-gray-50 p-4 rounded-xl">
              {MOCK_TABS}
            </pre>
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/practice', { state: { file: fileName, chords: MOCK_CHORDS } })}
            className="btn-bob-green flex-1"
          >
            Practice with Bob
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-bob-outline flex-1"
          >
            Pick another song
          </button>
        </div>
      </main>
    </div>
  );
}
