/**
 * Animated heart composition — text flows along closed heart-shaped SVG paths
 * using SMIL <animate> on startOffset for mathematically continuous looping.
 */

import { useMemo } from "react";

const PHRASE = "I love you \u2665 ";
const LONG_TEXT = PHRASE.repeat(40);

const CX = 500;
const CY = 460;

/** Parametric heart curve, seam at bottom tip (offset by PI). */
function heartPath(scale: number, cx: number, cy: number): string {
  const pts: string[] = [];
  const N = 360;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2 + Math.PI;
    const x = cx + scale * 16 * Math.sin(t) ** 3;
    const y =
      cy -
      scale *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t));
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ") + " Z";
}

interface Lane {
  scale: number;
  fontSize: number;
  opacity: number;
  duration: number;
  lightness: number;
}

const LANES: Lane[] = [
  { scale: 18,    fontSize: 14, opacity: 0.95, duration: 18, lightness: 72 },
  { scale: 15.8,  fontSize: 12, opacity: 0.88, duration: 20, lightness: 74 },
  { scale: 13.6,  fontSize: 11, opacity: 0.80, duration: 22, lightness: 76 },
  { scale: 11.4,  fontSize: 10, opacity: 0.72, duration: 24, lightness: 78 },
  { scale: 9.2,   fontSize: 9,  opacity: 0.64, duration: 26, lightness: 80 },
  { scale: 7.0,   fontSize: 8,  opacity: 0.56, duration: 28, lightness: 82 },
  { scale: 5.0,   fontSize: 7,  opacity: 0.48, duration: 30, lightness: 84 },
];

const HeartTextFlow = () => {
  const paths = useMemo(
    () => LANES.map((l, i) => ({ id: `heart-${i}`, d: heartPath(l.scale, CX, CY) })),
    []
  );

  return (
    <svg
      viewBox="0 0 1000 900"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="accentGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {paths.map((p) => (
          <path key={p.id} id={p.id} d={p.d} fill="none" />
        ))}
      </defs>

      {LANES.map((lane, i) => (
        <text
          key={i}
          fill={`hsl(330 100% ${lane.lightness}%)`}
          fontSize={lane.fontSize}
          fontFamily="'Inter', sans-serif"
          opacity={lane.opacity}
          filter="url(#glow)"
        >
          <textPath href={`#heart-${i}`} startOffset="0">
            {LONG_TEXT}
            {/* SMIL animate: startOffset from 0% → 100% of path, linear infinite */}
            <animate
              attributeName="startOffset"
              from="0%"
              to="100%"
              dur={`${lane.duration}s`}
              repeatCount="indefinite"
            />
          </textPath>
        </text>
      ))}

      {/* Center accent */}
      <g filter="url(#accentGlow)">
        <text
          x={CX}
          y={CY + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(330 100% 76%)"
          fontSize="42"
          fontFamily="'Inter', sans-serif"
          fontWeight="700"
          letterSpacing="4"
        >
          Lili
        </text>
        <text
          x={CX + 55}
          y={CY + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(330 100% 71%)"
          fontSize="22"
          className="animate-pulse"
        >
          ♥
        </text>
      </g>
    </svg>
  );
};

export default HeartTextFlow;
