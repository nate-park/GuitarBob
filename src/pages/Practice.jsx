import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Mascot from '../components/Mascot';
import BobWithSpeech from '../components/BobWithSpeech';
import TopBar from '../components/TopBar';
import ProgressBar from '../components/ProgressBar';

const STEPS = [
  { title: 'Play the first chord', chord: 'C', tip: 'Place your fingers and strum once.' },
  { title: 'Now try G', chord: 'G', tip: 'Classic G shape – you got this!' },
  { title: 'Switch to Am', chord: 'Am', tip: 'Just one finger change from C.' },
  { title: 'Add F', chord: 'F', tip: 'The F barre – take your time.' },
  { title: 'Put them together', chord: 'C → G → Am → F', tip: 'Slow and steady. Bob believes in you! 🎸' },
];

export default function Practice() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'try' | null
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setFeedback('correct');
      setTimeout(() => navigate('/'), 1500);
      return;
    }
    setFeedback('correct');
    setTimeout(() => {
      setStep((s) => s + 1);
      setFeedback(null);
    }, 800);
  };

  const handleTryAgain = () => {
    setFeedback('try');
    setTimeout(() => setFeedback(null), 1200);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar streak={1} hearts={3} xp={50} />
      <main className="flex-1 px-6 py-8 max-w-2xl mx-auto">
        <ProgressBar current={step + 1} total={STEPS.length} label="Practice" />
        <div className="mt-8 flex justify-center">
          <Mascot pose={feedback === 'correct' ? 'happy' : feedback === 'try' ? 'sad' : 'teaching'} size={140} />
        </div>
        <div className="mt-6 speech-bubble text-center">
          <h3 className="font-display text-xl text-bob-green-dark mb-2">{current.title}</h3>
          <p className="font-body text-gray-700 mb-4">{current.tip}</p>
          <p className="font-display text-3xl text-bob-blue">{current.chord}</p>
        </div>
        {feedback === 'correct' && (
          <p className="text-center font-display text-bob-green text-xl mt-4 animate-pop">
            🎉 Nice! Keep going!
          </p>
        )}
        {feedback === 'try' && (
          <p className="text-center font-body text-bob-orange mt-4">
            No worries – try again. Use your guitar and audio interface!
          </p>
        )}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleNext}
            className="btn-bob-green flex-1"
          >
            {isLast ? 'Finish lesson 🏆' : 'I did it!'}
          </button>
          <button
            onClick={handleTryAgain}
            className="btn-bob-outline flex-1"
          >
            Listen again
          </button>
        </div>
        <button
          onClick={() => navigate(location.state?.file ? '/results' : '/')}
          className="font-body text-gray-500 mt-4 block mx-auto"
        >
          ← Back
        </button>
      </main>
    </div>
  );
}
