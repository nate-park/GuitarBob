import React from 'react';

/**
 * Bob – cute guitar buddy avatar.
 * Uses custom illustrated avatar; pose affects animation.
 */
const POSE_ANIMATIONS = {
  default: 'animate-bounce-soft',
  happy: 'animate-bounce-soft',
  thinking: '',
  teaching: 'animate-wiggle',
  listening: '',
  sad: '',
};

export default function Bob({ pose = 'default', size = 200, className = '' }) {
  const animation = POSE_ANIMATIONS[pose] || POSE_ANIMATIONS.default;

  return (
    <img
      src="/avatar.png"
      alt="GuitarBob"
      width={size}
      height={size}
      className={`inline-block object-contain ${animation} ${className}`}
      aria-hidden
    />
  );
}

export { POSE_ANIMATIONS };
