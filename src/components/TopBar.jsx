import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCharacter, CHARACTERS } from '../context/CharacterContext';
import Mascot from './Mascot';
import GuitarBobLogoSvg from './GuitarBobLogoSvg';

export default function TopBar({ streak = 0, hideOnScroll = false }) {
  const { characterId, xp } = useCharacter();
  const navigate = useNavigate();
  const currentName = CHARACTERS.find((c) => c.id === characterId)?.name ?? 'Bob';
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity: full opacity at top, fade as you scroll down
  const maxScrollFade = hideOnScroll ? 100 : 300; // fade faster or normal
  const opacity = hideOnScroll ? Math.max(0, 1 - scrollY / maxScrollFade) : Math.max(0.3, 1 - scrollY / maxScrollFade);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b-4 border-bob-green shadow-card relative transition-opacity duration-300 overflow-hidden" style={{ opacity }}>
      <div className="max-w-full mx-auto px-0 py-0 flex items-center gap-0 min-h-fit">
        <Link to="/" className="flex items-center min-w-0 shrink-0 no-underline flex-1 justify-start pl-4" aria-label="GuitarBob home">
          <GuitarBobLogoSvg width={450} height={150} className="shrink-0" />
        </Link>
        
        {/* Character select button - centered */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-1"
          onClick={() => navigate('/shop')}
          style={{ cursor: 'pointer' }}
        >
          <button
            className="flex items-center justify-center gap-2 rounded-xl shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 btn-bob-outline user-select-none select-none touch-none"
            title={`Choose tutor (${currentName})`}
            draggable="false"
            onDragStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'none' }}
          >
            <Mascot pose="default" size={32} className="sm:w-9 sm:h-9 w-8 h-8" />
            <span className="font-lazydog text-sm sm:text-base truncate max-w-[4rem] sm:max-w-none">{currentName}</span>
          </button>
        </div>
        
        {/* XP button - right side symmetrical to logo, matches button style */}
        <div className="flex items-center gap-0 shrink-0 flex-1 justify-end pr-4">
          {xp >= 0 && (
            <div className="flex items-center gap-1 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-bob-green-dark border-4 border-bob-green">
              <span className="font-display font-semibold text-sm sm:text-base">{xp}</span>
              <span className="text-xs sm:text-sm hidden sm:inline">XP</span>
            </div>
          )}
          {streak > 0 && (
            <div className="flex items-center gap-1 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 bg-bob-orange/20 rounded-lg sm:rounded-xl ml-2">
              <span className="text-lg sm:text-xl">🔥</span>
              <span className="font-display font-semibold text-bob-orange-dark text-sm sm:text-base">{streak}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
