import React from 'react';
import SvgImageWrapper from './SvgImageWrapper';

/** Riff – purple rock-star guitar buddy. Wrapped in SVG for clean scaling. */
const POSE_ANIMATIONS = {
  default: 'animate-bounce-soft',
  happy: 'animate-bounce-soft',
  thinking: '',
  teaching: 'animate-wiggle',
  listening: '',
  sad: '',
};

export default function Riff({ pose = 'default', size = 200, className = '' }) {
  const animation = POSE_ANIMATIONS[pose] || POSE_ANIMATIONS.default;

  return (
    <SvgImageWrapper
      href="/riff.png"
      width={size}
      height={size}
      className={`${animation} ${className}`}
      rounded={size * 0.25}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
