import React, { useState, useEffect } from 'react';
import SvgImageWrapper from './SvgImageWrapper';

const GIF_DURATION_MS = 2500;

/** Guitar Bob logo – animates on first visit only, then remains static. */
export default function GuitarBobLogoSvg({ width = 80, height = 40, className = '' }) {
  const [showGif, setShowGif] = useState(true);

  useEffect(() => {
    // Check if animation has already been shown in this session
    const hasShownAnimation = sessionStorage.getItem('guitarbob-logo-animated');
    
    if (hasShownAnimation) {
      // Animation already shown, start static
      setShowGif(false);
    } else {
      // First time - show animation then switch to static
      const timeoutId = setTimeout(() => {
        setShowGif(false);
        sessionStorage.setItem('guitarbob-logo-animated', 'true');
      }, GIF_DURATION_MS);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  const href = showGif ? '/GUitar.gif' : '/guitar-bob-logo.png';

  return (
    <SvgImageWrapper
      href={href}
      width={width}
      height={height}
      className={className}
      rounded={8}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
