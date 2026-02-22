import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BobWithSpeech from '../components/BobWithSpeech';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const FALLBACK_CHORDS = ['C', 'G', 'Am', 'F'];
const FALLBACK_TABS = 'e|---0---0---0---0---|\nB|---1---0---1---0---|\nG|---0---0---2---0---|\nD|---2---0---2---2---|\nA|---3---2---0---3---|\nE|---x---3---x---x---|';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;
  const fileName = location.state?.fileName || 'Your song';
  const jobId = location.state?.jobId;
  // Use processed WAV – note_highway times match this file exactly
  const audioUrl = jobId
    ? `${API_BASE}/processed/${jobId}.wav`
    : null;

  const chordLabels = result?.chords?.map((c) => (typeof c === 'string' ? c : c?.label ?? c)).filter(Boolean) ?? [];
  const chords = chordLabels.length ? [...new Set(chordLabels)] : FALLBACK_CHORDS;
  const tabs = result?.tabs ?? FALLBACK_TABS;
  const noteHighway = result?.note_highway;

  // Build songData for Practice: { duration, durationMs, notes }
  const songData = noteHighway
    ? {
        duration: noteHighway.duration ?? 0,
        durationMs: (noteHighway.duration ?? 0) * 1000,
        notes: noteHighway.notes ?? [],
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col">
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
              {chords.map((c, i) => (
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
            <h3 className="font-display text-lg text-bob-green-dark mb-3">Tab</h3>
            <pre className="font-mono text-sm text-gray-800 whitespace-pre overflow-x-auto bg-gray-50 p-4 rounded-xl">
              {tabs}
            </pre>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {songData && (
            <button
              onClick={() => navigate('/practice', { state: { songData, chords, audioUrl } })}
              className="btn-bob-green flex-1"
            >
            Practice Note Highway
            </button>
          )}
          <button
            onClick={() => navigate('/practice', { state: { chords } })}
            className="btn-bob-outline flex-1"
          >
            Practice chords only
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
