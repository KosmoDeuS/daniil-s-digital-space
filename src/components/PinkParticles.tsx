/**
 * Pink floating particles — lightweight canvas-based ambient effect.
 */

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  da: number;
}

const PARTICLE_COUNT = 45;

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

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.3 + 0.1),
      alpha: Math.random() * 0.5 + 0.2,
      da: (Math.random() - 0.5) * 0.008,
    }));

    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.da;
        if (p.alpha > 0.7 || p.alpha < 0.1) p.da = -p.da;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(330, 100%, 70%, ${p.alpha})`;
        ctx.fill();
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
