import React from 'react';

/** Riff – orange rock-star guitar buddy. Same poses as Bob. */
const RIFF_POSES = {
  default: (
    <g className="animate-bounce-soft">
      <circle cx="80" cy="100" r="52" fill="#FF9600" stroke="#E68600" strokeWidth="4"/>
      <circle cx="80" cy="100" r="44" fill="#FFB347" opacity="0.3"/>
      <circle cx="65" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="95" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="67" cy="86" r="4" fill="white"/>
      <circle cx="97" cy="86" r="4" fill="white"/>
      <path d="M68 112 Q80 120 92 112" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <ellipse cx="128" cy="75" rx="14" ry="18" fill="#FF9600" stroke="#E68600" strokeWidth="2" transform="rotate(-20 128 75)"/>
      <path d="M120 68 L136 68 L136 82 L120 82" stroke="#E68600" strokeWidth="2" fill="none" transform="rotate(-20 128 75)"/>
      <rect x="55" y="125" width="50" height="28" rx="4" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="80" cy="139" r="8" fill="#1a1a1a"/>
      <line x1="80" y1="115" x2="80" y2="125" stroke="#1a1a1a" strokeWidth="3"/>
    </g>
  ),
  happy: (
    <g className="animate-bounce-soft">
      <circle cx="80" cy="100" r="52" fill="#FF9600" stroke="#E68600" strokeWidth="4"/>
      <circle cx="65" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="95" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="67" cy="86" r="4" fill="white"/>
      <circle cx="97" cy="86" r="4" fill="white"/>
      <path d="M62 108 Q80 128 98 108" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M65 85 L67 90 L72 90 L68 93 L69 98 L65 95 L61 98 L62 93 L58 90 L63 90 Z" fill="#FFC800"/>
      <path d="M95 85 L97 90 L102 90 L98 93 L99 98 L95 95 L91 98 L92 93 L88 90 L93 90 Z" fill="#FFC800"/>
      <rect x="55" y="125" width="50" height="28" rx="4" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="80" cy="139" r="8" fill="#1a1a1a"/>
      <line x1="80" y1="115" x2="80" y2="125" stroke="#1a1a1a" strokeWidth="3"/>
    </g>
  ),
  thinking: (
    <g>
      <circle cx="80" cy="100" r="52" fill="#FF9600" stroke="#E68600" strokeWidth="4"/>
      <circle cx="65" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="95" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="67" cy="86" r="4" fill="white"/>
      <circle cx="97" cy="86" r="4" fill="white"/>
      <path d="M70 112 Q80 108 90 112" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <ellipse cx="45" cy="105" rx="12" ry="16" fill="#FF9600" stroke="#E68600" strokeWidth="2" transform="rotate(-30 45 105)"/>
      <rect x="55" y="125" width="50" height="28" rx="4" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="80" cy="139" r="8" fill="#1a1a1a"/>
      <line x1="80" y1="115" x2="80" y2="125" stroke="#1a1a1a" strokeWidth="3"/>
      <text x="80" y="38" textAnchor="middle" fill="#1CB0F6" fontSize="28" fontFamily="Fredoka">?</text>
    </g>
  ),
  teaching: (
    <g className="animate-wiggle">
      <circle cx="80" cy="100" r="52" fill="#FF9600" stroke="#E68600" strokeWidth="4"/>
      <circle cx="65" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="95" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="67" cy="86" r="4" fill="white"/>
      <circle cx="97" cy="86" r="4" fill="white"/>
      <path d="M68 112 Q80 118 92 112" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <line x1="80" y1="85" x2="120" y2="60" stroke="#E68600" strokeWidth="10" strokeLinecap="round"/>
      <circle cx="125" cy="58" r="8" fill="#FF9600" stroke="#E68600" strokeWidth="2"/>
      <rect x="55" y="125" width="50" height="28" rx="4" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="80" cy="139" r="8" fill="#1a1a1a"/>
      <line x1="80" y1="115" x2="80" y2="125" stroke="#1a1a1a" strokeWidth="3"/>
    </g>
  ),
  listening: (
    <g>
      <circle cx="80" cy="100" r="52" fill="#FF9600" stroke="#E68600" strokeWidth="4"/>
      <circle cx="65" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="95" cy="88" r="12" fill="#1a1a1a"/>
      <circle cx="67" cy="86" r="4" fill="white"/>
      <circle cx="97" cy="86" r="4" fill="white"/>
      <path d="M68 112 Q80 116 92 112" stroke="#1a1a1a" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <ellipse cx="125" cy="50" rx="6" ry="8" fill="#1a1a1a"/>
      <line x1="131" y1="50" x2="131" y2="30" stroke="#1a1a1a" strokeWidth="3"/>
      <ellipse cx="140" cy="45" rx="5" ry="7" fill="#1a1a1a"/>
      <line x1="145" y1="45" x2="145" y2="28" stroke="#1a1a1a" strokeWidth="2"/>
      <rect x="55" y="125" width="50" height="28" rx="4" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="80" cy="139" r="8" fill="#1a1a1a"/>
      <line x1="80" y1="115" x2="80" y2="125" stroke="#1a1a1a" strokeWidth="3"/>
    </g>
  ),
  sad: (
    <g>
      <circle cx="80" cy="100" r="52" fill="#FF9600" stroke="#E68600" strokeWidth="4"/>
      <circle cx="65" cy="90" r="12" fill="#1a1a1a"/>
      <circle cx="95" cy="90" r="12" fill="#1a1a1a"/>
      <circle cx="67" cy="88" r="4" fill="white"/>
      <circle cx="97" cy="88" r="4" fill="white"/>
      <path d="M68 108 Q80 98 92 108" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <rect x="55" y="125" width="50" height="28" rx="4" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="2"/>
      <circle cx="80" cy="139" r="8" fill="#1a1a1a"/>
      <line x1="80" y1="115" x2="80" y2="125" stroke="#1a1a1a" strokeWidth="3"/>
    </g>
  ),
};

export default function Riff({ pose = 'default', size = 200, className = '' }) {
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} className={`inline-block ${className}`} aria-hidden>
      {RIFF_POSES[pose] || RIFF_POSES.default}
    </svg>
  );
}
