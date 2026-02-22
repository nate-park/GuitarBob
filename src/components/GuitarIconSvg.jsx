import React from 'react';
import SvgImageWrapper from './SvgImageWrapper';

/** Guitar icon (GIF) – for homepage hero. Size via width/height. */
export default function GuitarIconSvg({ width = 96, height = 112, className = '' }) {
  return (
    <SvgImageWrapper
      href="/guitar-icon.gif"
      width={width}
      height={height}
      className={className}
      rounded={12}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}
