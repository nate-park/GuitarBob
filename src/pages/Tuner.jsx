import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCharacter } from '../context/CharacterContext';
import { CHARACTERS } from '../context/CharacterContext';
import Mascot from '../components/Mascot';
import TopBar from '../components/TopBar';

const GUITAR_STRINGS = [
  { note: 'E', label: 'Low E' },
  { note: 'A', label: 'A' },
  { note: 'D', label: 'D' },
  { note: 'G', label: 'G' },
  { note: 'B', label: 'B' },
  { note: 'E', label: 'High E' },
];

// Slider value 0–100. Center 50 = in tune.
function getTuningState(value) {
  if (value >= 45 && value <= 55) return { key: 'perfect', message: "Perfect! You're in tune! 🎉", pose: 'happy' };
  if (value >= 55 && value <= 65) return { key: 'little_low', message: 'A little lower!', pose: 'teaching' };
  if (value > 65) return { key: 'low', message: 'Go lower!', pose: 'sad' };
  if (value >= 35 && value < 45) return { key: 'little_high', message: 'A little higher!', pose: 'teaching' };
  return { key: 'high', message: 'Go higher!', pose: 'sad' };
}

// Oscilloscope-style waveform: more active when off-pitch, flat when in tune
function ScopeWaveform({ value, width = 400, height = 80 }) {
  const centerY = height / 2;
  const distanceFromCenter = Math.abs(value - 50) / 50; // 0 at center, 1 at edges
  const amplitude = distanceFromCenter * (height * 0.35);
  const points = useMemo(() => {
    const pts = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y = centerY + amplitude * Math.sin((i / steps) * Math.PI * 4);
      pts.push(`${x},${y}`);
    }
    return pts.join(' ');
  }, [width, height, centerY, amplitude]);

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="block w-full"
    >
      <defs>
        <linearGradient id="scopeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
          <stop offset="50%" stopColor="#58CC02" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity={0.9} />
        </linearGradient>
      </defs>
      <rect width={width} height={height} fill="url(#scopeGrad)" />
      <line x1={0} y1={centerY} x2={width} y2={centerY} stroke="#334155" strokeWidth="0.5" strokeDasharray="4 2" />
      <polyline
        points={points}
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Tuner() {
  const { characterId } = useCharacter();
  const tutorName = CHARACTERS.find((c) => c.id === characterId)?.name ?? 'Bob';
  const [targetString, setTargetString] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);

  const state = getTuningState(sliderValue);
  const currentString = GUITAR_STRINGS[targetString];
  const needlePercent = sliderValue;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar streak={0} xp={0} />
      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">
        <h1 className="font-display text-2xl sm:text-3xl text-bob-green-dark text-center mb-2">
          🎸 Tuner
        </h1>
        <p className="font-body text-gray-600 text-center mb-6">
          {tutorName} will tell you when you're in tune.
        </p>

        {/* Target note */}
        <div className="text-center mb-6">
          <p className="font-body text-sm text-gray-500 mb-1">Target note</p>
          <p className="font-display text-4xl text-bob-green-dark">
            {currentString.note} <span className="text-xl text-gray-500">({currentString.label})</span>
          </p>
        </div>

        {/* Oscilloscope */}
        <div className="rounded-2xl overflow-hidden border-2 border-bob-green/30 shadow-lg mb-6 bg-slate-800">
          <div className="px-2 py-1 bg-slate-900/50 border-b border-slate-700">
            <span className="font-mono text-xs text-green-400">SCOPE</span>
          </div>
          <ScopeWaveform value={sliderValue} width={400} height={100} />
        </div>

        {/* Traditional tuner meter: needle over flat / in tune / sharp */}
        <div className="bg-lesson-card rounded-2xl p-6 shadow-card border-2 border-lesson-border mb-6">
          <div className="relative h-14">
            {/* Bar with gradient: red (flat) -> green (center) -> red (sharp) */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, #ef4444 0%, #f59e0b 25%, #58CC02 50%, #f59e0b 75%, #ef4444 100%)',
                opacity: 0.9,
              }}
            />
            {/* Center tick */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-gray-800 left-1/2 -translate-x-px z-10"
              style={{ boxShadow: '0 0 0 1px white' }}
            />
            {/* Needle: triangle pointing toward center */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0 h-0 z-20 transition-all duration-150 ease-out"
              style={{
                left: `calc(${needlePercent}% - 10px)`,
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderLeft: needlePercent > 50 ? 'none' : '18px solid #1e293b',
                borderRight: needlePercent <= 50 ? 'none' : '18px solid #1e293b',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs font-display text-gray-500">
            <span>FLAT</span>
            <span className="text-bob-green-dark font-semibold">IN TUNE</span>
            <span>SHARP</span>
          </div>
        </div>

        {/* Bob + feedback */}
        <div className="flex flex-col items-center mb-6">
          <Mascot pose={state.pose} size={140} className="mb-3" />
          <div className="speech-bubble text-center max-w-sm">
            <p className="font-body text-lg">{state.message}</p>
          </div>
        </div>

        {/* Demo slider (simulate pitch) */}
        <div className="bg-lesson-bg rounded-xl p-4 border border-lesson-border mb-2">
          <p className="font-body text-xs text-gray-500 mb-2">Demo: simulate pitch</p>
          <input
            type="range"
            min={0}
            max={100}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-lesson-border accent-bob-green"
          />
        </div>

        <Link
          to="/"
          className="block mt-6 text-center font-body text-bob-green-dark hover:underline"
        >
          ← Back to home
        </Link>
      </main>
    </div>
  );
}
