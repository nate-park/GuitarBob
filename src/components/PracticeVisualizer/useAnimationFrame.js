import { useEffect, useRef } from 'react';

/**
 * useAnimationFrame - RAF loop that avoids React re-renders
 * @param { (timestamp: number) => void } callback - called each frame
 * @param { boolean } active - whether the loop is running
 */
export function useAnimationFrame(callback, active = true) {
  const callbackRef = useRef(callback);
  const frameRef = useRef(null);

  callbackRef.current = callback;

  useEffect(() => {
    if (!active) return;

    const loop = (ts) => {
      callbackRef.current(ts);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active]);
}
