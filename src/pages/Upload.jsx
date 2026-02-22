import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BobWithSpeech from '../components/BobWithSpeech';

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|m4a|ogg)$/i))) {
      setFile(f);
    }
  };

  const handleChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = () => {
    if (!file) return;
    navigate('/processing', { state: { file: file.name } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto">
        <BobWithSpeech
          message="Drop your song here – any format works! I'll listen and get the chords and tabs ready."
          pose="listening"
          bobSize={140}
        />
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            mt-8 rounded-3xl border-4 border-dashed p-12 text-center transition
            ${dragOver ? 'border-bob-green bg-bob-green/10' : 'border-bob-green/50 bg-white'}
          `}
        >
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.ogg"
            onChange={handleChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer block">
            <span className="text-6xl block mb-4">🎵</span>
            <span className="font-display text-xl text-bob-green-dark block mb-2">
              {file ? file.name : 'Tap to choose or drag a song'}
            </span>
            <span className="font-body text-gray-500">MP3, WAV, M4A, OGG</span>
          </label>
        </div>
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!file}
            className={`btn-bob-green flex-1 ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Let Bob listen!
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-bob-outline flex-1"
          >
            Back
          </button>
        </div>
      </main>
    </div>
  );
}
