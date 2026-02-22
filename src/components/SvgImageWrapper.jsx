import React from 'react';

/**
 * SvgImageWrapper – embeds PNG/GIF inside SVG for clean clipping, scaling, and borders.
 * Use for mascots, logos, and icons to avoid black boxes and ensure crisp scaling.
 *
 * NOTE: Black boxes = source image has solid background. Export with transparent
 * background (PNG alpha) or use GIF with transparency.
 */
export default function SvgImageWrapper({
  href,
  alt = '',
  width = 200,
  height = 200,
  className = '',
  rounded = 16,
  clip = true,
  preserveAspectRatio = 'xMidYMid meet',
}) {
  const id = React.useId().replace(/:/g, '');
  const vb = `0 0 ${width} ${height}`;

  return (
    <svg
      viewBox={vb}
      width={width}
      height={height}
      className={`inline-block overflow-visible ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      aria-hidden={!alt}
      role={alt ? 'img' : undefined}
    >
      <defs>
        {clip && (
          <clipPath id={`clip-${id}`}>
            <rect x="0" y="0" width={width} height={height} rx={rounded} ry={rounded} />
          </clipPath>
        )}
      </defs>
      <image
        href={href}
        x="0"
        y="0"
        width={width}
        height={height}
        preserveAspectRatio={preserveAspectRatio}
        clipPath={clip ? `url(#clip-${id})` : undefined}
      />
    </svg>
  );
}
