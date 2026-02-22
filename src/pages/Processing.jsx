import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Mascot from '../components/Mascot';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const MESSAGES = [
  "Listening to your song...",
  "Figuring out the chords...",
  "BasicPitch analyzing notes...",
  "Almost there!",
];

export default function Processing() {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId = location.state?.job_id;
  const fileName = location.state?.fileName || 'your song';
  const [step, setStep] = React.useState(0);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const t = setInterval(() => {
      setStep((s) => (s + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!jobId) {
      setError('No job ID – go back and upload again');
      return;
    }
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs/${jobId}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.status === 'done') {
          navigate('/results', { state: { result: data.result, fileName, jobId } });
          return;
        }
        if (data.status === 'error') {
          setError(data.error || 'Processing failed');
          return;
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not reach backend');
        return;
      }
      setTimeout(poll, 1200);
    };
    poll();
    return () => { cancelled = true; };
  }, [jobId, fileName, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <Mascot pose="thinking" size={200} className="mb-8" />
        <h2 className="font-display text-2xl text-bob-green-dark mb-2">
          Your tutor is working on "{fileName}"
        </h2>
        <p className={`font-body text-lg ${error ? 'text-red-600' : 'text-gray-600 animate-pulse'}`}>
          {error || MESSAGES[step]}
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
