import React from 'react';

export default function ProgressBar({ current = 1, total = 5, label }) {
  const pct = total > 0 ? (current / total) * 100 : 0;
  return (
    <div className="w-full">
      {label && (
        <p className="font-body text-sm text-gray-600 mb-1">{label}</p>
      )}
      <div className="h-3 bg-lesson-border rounded-full overflow-hidden">
        <div
          className="h-full bg-bob-green rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="font-display text-sm text-bob-green-dark mt-1">
        Step {current} of {total}
      </p>
    </div>
  );
}
