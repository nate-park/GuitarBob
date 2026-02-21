import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Mascot from '../components/Mascot';
import TopBar from '../components/TopBar';

const MESSAGES = [
  "Listening to your song...",
  "Figuring out the chords...",
  "Writing down the tabs...",
  "Almost there!",
];

export default function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileName = location.state?.file || 'your song';
  const [step, setStep] = React.useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => (s + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const done = setTimeout(() => {
      navigate('/results', { state: { file: fileName } });
    }, 6000);
    return () => clearTimeout(done);
  }, [navigate, fileName]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar streak={0} hearts={3} xp={0} />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <Mascot pose="thinking" size={200} className="mb-8" />
        <h2 className="font-display text-2xl text-bob-green-dark mb-2">
          Your tutor is working on "{fileName}"
        </h2>
        <p className="font-body text-lg text-gray-600 animate-pulse">
          {MESSAGES[step]}
        </p>
        <div className="mt-8 w-64 h-2 bg-lesson-border rounded-full overflow-hidden">
          <div
            className="h-full bg-bob-green rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / MESSAGES.length) * 100}%` }}
          />
        </div>
      </main>
    </div>
  );
}
