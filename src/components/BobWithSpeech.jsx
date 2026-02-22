import React from 'react';
import Mascot from './Mascot';

/**
 * Tutor + speech bubble – use for onboarding and step-by-step guidance.
 * Uses the currently selected character (Bob or Riff).
 */
export default function BobWithSpeech({
  message,
  pose = 'default',
  bobSize = 160,
  side = 'left',
  className = '',
}) {
  return (
    <div className={`flex items-center gap-2 ${side === 'right' ? 'flex-row-reverse' : ''} ${className}`}>
      <Mascot pose={pose} size={bobSize} />
      <div
        key={message}
        className={
          side === 'right'
            ? 'speech-bubble speech-bubble-right rounded-br-none rounded-bl-2xl'
            : 'speech-bubble speech-bubble-left rounded-bl-none rounded-br-2xl'
        }
      >
        <p className="font-body text-lg leading-relaxed">{message}</p>
        <div
          className={
            side === 'right'
              ? 'speech-tail speech-tail-right'
              : 'speech-tail speech-tail-left'
          }
        />
      </div>
    </div>
  );
}
