import React from 'react';

export default function PlayheadIndicator({ pixelsPerMs = 0.1 }) {
  return (
    <div className="absolute top-0 bottom-0 w-1 bg-bob-blue z-40 transform -translate-x-1/2 left-1/2">
      {/* Center vertical line */}
      <div className="absolute -left-1.5 -top-1 w-4 h-1 bg-bob-blue rounded-full" />
    </div>
  );
}
