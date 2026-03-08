/**
 * Pink heart-shaped falling petal particles — canvas-based ambient effect.
 * Each particle has unique size, speed, brightness, and rotation modifiers (±15%).
 * Half of particles have a random lifespan (2–4s) and fade out; the largest ones fall forever.
 */

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  rotation: number;
  rotationSpeed: number;
  lifespan: number | null; // null = infinite
  age: number;
}

const PARTICLE_COUNT = 120;
const SIZE_THRESHOLD = 9; // particles above this size live forever

/** Random value within ±15% of base */
const vary = (base: number) => base * (0.85 + Math.random() * 0.3);

/** Draw a heart shape centered at (0, 0) with given size */
function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  const s = size;
  const oy = s * 0.45;
  ctx.beginPath();
  ctx.moveTo(0, -oy + s * 0.3);
  ctx.bezierCurveTo(0, -oy - s * 0.1, -s * 0.6, -oy - s * 0.1, -s * 0.6, -oy + s * 0.2);
  ctx.bezierCurveTo(-s * 0.6, -oy + s * 0.55, 0, -oy + s * 0.8, 0, -oy + s);
  ctx.bezierCurveTo(0, -oy + s * 0.8, s * 0.6, -oy + s * 0.55, s * 0.6, -oy + s * 0.2);
  ctx.bezierCurveTo(s * 0.6, -oy - s * 0.1, 0, -oy - s * 0.1, 0, -oy + s * 0.3);
  ctx.closePath();
  ctx.fill();
}

function createParticle(w: number, h: number, startTop = false): Particle {
  const size = vary(8);
  const maxAlpha = vary(0.45);
  const isLarge = size >= SIZE_THRESHOLD;
  // Half get lifespan (2–4s), large ones never
  const lifespan = isLarge ? null : (Math.random() < 0.5 ? (2 + Math.random() * 2) : null);

  return {
    x: Math.random() * w,
    y: startTop ? -(Math.random() * 40) : Math.random() * h,
    size,
    vx: 0,
    vy: vary(0.5), // falling down
    alpha: lifespan != null ? 0 : maxAlpha, // fade in if has lifespan
    maxAlpha,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: vary(0.02),
    wobbleAmp: vary(0.8),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * vary(0.012),
    lifespan,
    age: 0,
  };
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

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(w, h)
    );

    let lastTime: number | null = null;
    let raf: number;

    const draw = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.wobblePhase += p.wobbleSpeed;
        p.vx = Math.sin(p.wobblePhase) * p.wobbleAmp;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.age += dt;

        // Alpha handling for lifespan particles
        if (p.lifespan != null) {
          const fadeIn = 0.4;
          const fadeOut = 0.4;
          const remaining = p.lifespan - p.age;
          if (p.age < fadeIn) {
            p.alpha = p.maxAlpha * (p.age / fadeIn);
          } else if (remaining < fadeOut) {
            p.alpha = p.maxAlpha * Math.max(0, remaining / fadeOut);
          } else {
            p.alpha = p.maxAlpha;
          }

          // Respawn when lifespan ends
          if (p.age >= p.lifespan) {
            particles[i] = createParticle(w, h, true);
            continue;
          }
        }

        // Respawn at top when falling past bottom (infinite particles)
        if (p.y > h + 20) {
          if (p.lifespan != null) {
            particles[i] = createParticle(w, h, true);
            continue;
          }
          p.y = -20;
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
