import React, { useState, useEffect } from 'react';
import SvgImageWrapper from './SvgImageWrapper';

const GIF_DURATION_MS = 2500;

/** Guitar Bob logo – animates on visit/revisit, then static. */
export default function GuitarBobLogoSvg({ width = 80, height = 40, className = '' }) {
  const [showGif, setShowGif] = useState(true);

  useEffect(() => {
    let timeoutId;

    const playGifThenStatic = () => {
      clearTimeout(timeoutId);
      setShowGif(true);
      timeoutId = setTimeout(() => setShowGif(false), GIF_DURATION_MS);
    };

    const onFocus = () => playGifThenStatic();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') playGifThenStatic();
    };

    playGifThenStatic();

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
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
