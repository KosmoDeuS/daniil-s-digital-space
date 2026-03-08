/**
 * Pink heart-shaped firefly particles — canvas-based ambient effect.
 * Each particle has unique size, speed, brightness, and rotation modifiers (±15%).
 */

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  da: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  rotation: number;
  rotationSpeed: number;
}

const PARTICLE_COUNT = 120;

/** Random value within ±15% of base */
const vary = (base: number) => base * (0.85 + Math.random() * 0.3);

/** Draw a heart shape centered at (0, 0) with given size */
function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  const s = size;
  const oy = s * 0.45; // center offset
  ctx.beginPath();
  ctx.moveTo(0, -oy + s * 0.3);
  ctx.bezierCurveTo(0, -oy - s * 0.1, -s * 0.6, -oy - s * 0.1, -s * 0.6, -oy + s * 0.2);
  ctx.bezierCurveTo(-s * 0.6, -oy + s * 0.55, 0, -oy + s * 0.8, 0, -oy + s);
  ctx.bezierCurveTo(0, -oy + s * 0.8, s * 0.6, -oy + s * 0.55, s * 0.6, -oy + s * 0.2);
  ctx.bezierCurveTo(s * 0.6, -oy - s * 0.1, 0, -oy - s * 0.1, 0, -oy + s * 0.3);
  ctx.closePath();
  ctx.fill();
}

const PinkParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const BASE_SIZE = 8;
    const BASE_VY = -0.35;
    const BASE_ALPHA = 0.45;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: vary(BASE_SIZE),
      vx: 0,
      vy: vary(BASE_VY),
      alpha: vary(BASE_ALPHA),
      da: (Math.random() - 0.5) * 0.008,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: vary(0.02),
      wobbleAmp: vary(0.6),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * vary(0.012),
    }));

    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.wobblePhase += p.wobbleSpeed;
        p.vx = Math.sin(p.wobblePhase) * p.wobbleAmp;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.alpha += p.da;
        if (p.alpha > 0.7 || p.alpha < 0.15) p.da = -p.da;
        if (p.y < -20) {
          p.y = h + 20;
          p.x = Math.random() * w;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `hsla(330, 100%, 70%, ${p.alpha})`;
        drawHeart(ctx, p.size);
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default PinkParticles;
