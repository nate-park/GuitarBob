import React, { useEffect } from 'react';

/**
 * Celebratory overlay when unlocking a character.
 */
export default function UnlockCelebration({ characterName, emoji, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [onClose]);

  const sparkles = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dx = Math.cos(angle) * 80;
    const dy = Math.sin(angle) * 80;
    sparkles.push({ dx, dy, delay: i * 0.03 });
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        className="celebrate-card relative rounded-3xl bg-white px-10 py-12 shadow-2xl border-4 border-bob-green text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {sparkles.map((s, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-bob-green"
              style={{
                left: '50%',
                top: '50%',
                animation: `celebrate-burst 0.9s ease-out ${s.delay}s forwards`,
                ['--dx']: `${s.dx}px`,
                ['--dy']: `${s.dy}px`,
              }}
            />
          ))}
        </div>
        <p className="text-7xl mb-4 animate-bounce-soft">{emoji}</p>
        <h2 className="font-display text-2xl sm:text-3xl text-bob-green-dark mb-2">
          {characterName} Unlocked!
        </h2>
        <p className="font-body text-gray-500 text-sm">Tap anywhere to continue</p>
      </div>
    </div>
  );
}
