import React from 'react';
import Mascot from './Mascot';

/**
 * Tutor + speech bubble – use for onboarding and step-by-step guidance.
 * Uses the currently selected character (Bob, Luna, or Riff).
 */
export default function BobWithSpeech({
  message,
  pose = 'default',
  bobSize = 160,
  side = 'left',
  className = '',
}) {
  return (
    <div className={`flex items-end gap-4 ${side === 'right' ? 'flex-row-reverse' : ''} ${className}`}>
      <Mascot pose={pose} size={bobSize} />
      <div
        className={
          side === 'right'
            ? 'speech-bubble rounded-br-none rounded-bl-2xl'
            : 'speech-bubble'
        }
      >
        <p className="font-body text-lg leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
