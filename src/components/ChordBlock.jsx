import React from 'react';
import { CHORD_COLORS } from '../data/mockSongData';

export default function ChordBlock({ 
  chord, 
  time, 
  duration, 
  currentTime, 
  pixelsPerMs,
  isUpcoming,
  isActive
}) {
  const offsetX = (time - currentTime) * pixelsPerMs;
  const width = Math.max(duration * pixelsPerMs, 60);
  const color = CHORD_COLORS[chord] || '#6b7280';
  
  return (
    <div
      className={`
        absolute h-16 rounded-lg flex items-center justify-center font-display font-bold text-white
        transition-all duration-75 cursor-default
        ${isActive ? 'ring-2 ring-white scale-105 shadow-lg' : 'shadow-md'}
        ${isUpcoming ? 'opacity-80' : 'opacity-70'}
      `}
      style={{
        left: `${offsetX}px`,
        width: `${width}px`,
        backgroundColor: color,
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <span className="text-sm sm:text-base truncate">{chord}</span>
    </div>
  );
}
