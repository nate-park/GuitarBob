import React, { useEffect } from 'react';

const RING_COUNT = 24;
const TUNNEL_LINE_COUNT = 16;

export default function HyperspaceTransition({ onComplete, durationMs = 2800 }) {
  useEffect(() => {
    const t = setTimeout(onComplete, durationMs);
    return () => clearTimeout(t);
  }, [onComplete, durationMs]);

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#060608] flex items-center justify-center">
      {/* Screen bezel - like you're looking into a monitor */}
      <div className="absolute inset-4 sm:inset-8 rounded-[2rem] border-4 border-slate-700/80 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] pointer-events-none" />

      {/* Wormhole: concentric rings flying toward center (into the screen) */}
      <div className="absolute inset-0">
        {Array.from({ length: RING_COUNT }).map((_, i) => (
          <div
            key={i}
            className="wormhole-ring absolute rounded-full border-2 border-bob-green/70 left-1/2 top-1/2"
            style={{
              width: '140vmax',
              height: '140vmax',
              marginLeft: '-70vmax',
              marginTop: '-70vmax',
              animationDelay: `${i * 0.11}s`,
            }}
          />
        ))}
      </div>

      {/* Perspective tunnel lines - from corners toward center */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {Array.from({ length: TUNNEL_LINE_COUNT }).map((_, i) => {
          const angle = (i / TUNNEL_LINE_COUNT) * Math.PI * 2;
          const x = 50 + Math.cos(angle) * 80;
          const y = 50 + Math.sin(angle) * 80;
          return (
            <div
              key={i}
              className="absolute w-[200vmax] h-px bg-gradient-to-r from-transparent via-bob-green/50 to-transparent wormhole-line origin-center"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${(angle * 180) / Math.PI}deg)`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          );
        })}
      </div>

      {/* Center glow - end of the tunnel */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-32 h-32 rounded-full bg-bob-green/20 blur-3xl wormhole-glow" />
      </div>

      {/* Center: destination (inside the computer/screen) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div className="hyperspace-pulse text-6xl sm:text-7xl mb-2">🎸</div>
        <p className="font-display text-bob-green-light text-lg sm:text-xl tracking-widest uppercase opacity-95">
          Practice Mode
        </p>
        <p className="font-body text-bob-green/80 text-xs sm:text-sm mt-1">Entering...</p>
      </div>
    </div>
  );
}
