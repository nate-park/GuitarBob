import React, { useRef, useEffect } from 'react';

const STRING_COLORS = [
  '#ef4444', // E - red
  '#f59e0b', // A - amber
  '#10b981', // D - emerald
  '#3b82f6', // G - blue
  '#8b5cf6', // B - violet
  '#ec4899', // e - pink
];

const HIT_PERFECT = 0.04;
const HIT_GOOD = 0.08;

/**
 * NoteHighway - Canvas-based falling notes (60fps, no React re-renders per frame)
 * Notes fall from top to hit line, aligned to (string, fret) on the horizontal neck below.
 */
export default function NoteHighway({
  currentTimeRef,
  songData,
  lookahead = 3,
  width = 800,
  highwayHeight = 200,
  hitLineY = 180,
  frets = 12,
  onNoteHit,
}) {
  const canvasRef = useRef(null);
  const hitFiredRef = useRef(new Set()); // 'time-string' to avoid duplicate onNoteHit

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !songData?.notes || width <= 0) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = highwayHeight * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${highwayHeight}px`;
    ctx.scale(dpr, dpr);

    const laneWidth = width / 6;
    const noteSize = Math.min(laneWidth * 0.6, 36);

    const draw = () => {
      const t = currentTimeRef?.current ?? 0;
      ctx.clearRect(0, 0, width, highwayHeight);

      // Fretboard wood background
      const woodGrad = ctx.createLinearGradient(0, 0, width, 0);
      woodGrad.addColorStop(0, '#2a1e14');
      woodGrad.addColorStop(0.2, '#422f22');
      woodGrad.addColorStop(0.5, '#4d3828');
      woodGrad.addColorStop(0.8, '#422f22');
      woodGrad.addColorStop(1, '#35271b');
      ctx.fillStyle = woodGrad;
      ctx.fillRect(0, 0, width, highwayHeight);
      // Wood grain overlay
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (let i = 0; i < width; i += 4) {
        ctx.fillRect(i, 0, 1, highwayHeight);
      }

      // Six guitar strings - metallic, varying thickness (low E thick → high e thin)
      const stringThickness = [2.5, 2.2, 2, 1.8, 1.5, 1.2];
      for (let s = 0; s < 6; s++) {
        const cx = s * laneWidth + laneWidth / 2;
        const halfT = stringThickness[s] / 2;
        const grad = ctx.createLinearGradient(cx - halfT, 0, cx + halfT, 0);
        grad.addColorStop(0, '#404040');
        grad.addColorStop(0.3, '#888');
        grad.addColorStop(0.5, '#e8e8e8');
        grad.addColorStop(0.7, '#b0b0b0');
        grad.addColorStop(1, '#505050');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - halfT, 0, stringThickness[s], highwayHeight);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(cx - halfT, 0, Math.max(1, stringThickness[s] * 0.3), highwayHeight);
      }

      // String labels (E A D G B e) - one per lane
      const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
      ctx.font = 'bold 11px Nunito, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,220,180,0.9)';
      for (let s = 0; s < 6; s++) {
        ctx.fillText(STRING_NAMES[s], s * laneWidth + 8, highwayHeight / 2);
      }

      // Hit zone band
      const bandTop = hitLineY - 20;
      const bandBottom = hitLineY + 20;
      const g = ctx.createLinearGradient(0, bandTop, 0, bandBottom);
      g.addColorStop(0, 'rgba(28,176,246,0.08)');
      g.addColorStop(0.5, 'rgba(28,176,246,0.25)');
      g.addColorStop(1, 'rgba(28,176,246,0.08)');
      ctx.fillStyle = g;
      ctx.fillRect(0, bandTop, width, bandBottom - bandTop);

      // Hit line
      ctx.strokeStyle = '#1CB0F6';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(28,176,246,0.7)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(0, hitLineY);
      ctx.lineTo(width, hitLineY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      const start = t - 0.25;
      const end = t + lookahead;
      const notes = songData.notes.filter((n) => n.time >= start && n.time <= end);

      for (const note of notes) {
        const dt = note.time - t;
        const progress = 1 - dt / lookahead;
        const y = Math.max(-noteSize, Math.min(hitLineY + 20, progress * hitLineY));

        const lane = note.string;
        const cx = lane * laneWidth + laneWidth / 2;
        const color = STRING_COLORS[lane] ?? '#6b7280';

        const hitDelta = Math.abs(dt);
        const inPerfect = hitDelta <= HIT_PERFECT;
        const inGood = hitDelta <= HIT_GOOD;

        if (inGood && onNoteHit) {
          const key = `${note.time.toFixed(3)}-${note.string}`;
          if (!hitFiredRef.current.has(key)) {
            hitFiredRef.current.add(key);
            onNoteHit(note.string, note.fret, inPerfect ? 'perfect' : 'good');
          }
        }

        const isInHitZone = y >= hitLineY - 25 && y <= hitLineY + 25;
        const glow = isInHitZone && inGood;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        roundRect(ctx, cx - noteSize / 2 + 2, y - noteSize / 2 + 2, noteSize, noteSize, 8);
        ctx.fill();

        // Note block
        ctx.fillStyle = color;
        if (glow) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 15;
        }
        roundRect(ctx, cx - noteSize / 2, y - noteSize / 2, noteSize, noteSize, 8);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Fret label
        ctx.fillStyle = '#000';
        ctx.font = `bold ${Math.floor(noteSize * 0.45)}px Nunito, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(note.fret === 0 ? 'O' : String(note.fret), cx, y);
      }

      // Clean old hit keys (notes that have passed)
      for (const key of hitFiredRef.current) {
        const [noteTime] = key.split('-');
        if (Number(noteTime) < t - 0.5) hitFiredRef.current.delete(key);
      }
    };

    let rafId;
    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [songData, lookahead, width, highwayHeight, hitLineY, frets, onNoteHit, currentTimeRef]);

  return (
    <canvas
      ref={canvasRef}
      className="block"
      style={{ width, height: highwayHeight }}
      width={width}
      height={highwayHeight}
    />
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
