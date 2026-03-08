/**
 * EN: Animated heart composition — text "I love you" flows along heart-shaped SVG paths.
 * RU: Анимированная композиция-сердце — текст "I love you" движется по SVG-путям в форме сердца.
 */

import { useEffect, useRef } from "react";

const PHRASE = "I love you  ♥  ";

/**
 * Generate a heart-shaped SVG path string at a given scale.
 * Uses parametric heart curve: x = 16sin³(t), y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
 */
function heartPath(scale: number, cx: number, cy: number): string {
  const points: string[] = [];
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = cx + scale * 16 * Math.pow(Math.sin(t), 3);
    const y =
      cy -
      scale *
        (13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t));
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(" ") + " Z";
}

const LANE_SCALES = [0.95, 0.78, 0.61, 0.44, 0.28];
const CX = 300;
const CY = 280;

const HeartTextFlow = () => {
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const textRefsArr = useRef<(SVGTextPathElement | null)[][]>(
    LANE_SCALES.map(() => [])
  );

  // Pre-generate paths
  const paths = LANE_SCALES.map((s) => heartPath(s, CX, CY));

  useEffect(() => {
    const speed = 0.03; // percent per frame
    const animate = () => {
      progressRef.current = (progressRef.current + speed) % 100;
      // Update all textPath startOffsets synchronously
      for (let lane = 0; lane < LANE_SCALES.length; lane++) {
        const refs = textRefsArr.current[lane];
        if (refs) {
          refs.forEach((ref, idx) => {
            if (ref) {
              const offset = (progressRef.current + idx * 50) % 100;
              ref.setAttribute("startOffset", `${offset}%`);
            }
          });
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <svg
      viewBox="0 0 600 560"
      className="w-full h-full max-w-[600px] max-h-[90vh]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Glow filter */}
        <filter id="pinkGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Heart paths for each lane */}
        {paths.map((d, i) => (
          <path key={i} id={`heartLane${i}`} d={d} fill="none" />
        ))}
      </defs>

      {/* Ambient glow behind heart */}
      <ellipse
        cx={CX}
        cy={CY}
        rx="200"
        ry="180"
        fill="rgba(255,105,180,0.04)"
      />

      {/* Text lanes */}
      {LANE_SCALES.map((_, laneIdx) => (
        <g key={laneIdx} filter="url(#pinkGlow)">
          {[0, 1].map((copyIdx) => (
            <text
              key={copyIdx}
              fill="#ff69b4"
              fontSize={laneIdx < 2 ? "11" : laneIdx < 4 ? "9" : "7"}
              fontFamily="'Inter', sans-serif"
              opacity={1 - laneIdx * 0.12}
            >
              <textPath
                ref={(el) => {
                  if (!textRefsArr.current[laneIdx]) {
                    textRefsArr.current[laneIdx] = [];
                  }
                  textRefsArr.current[laneIdx][copyIdx] = el;
                }}
                href={`#heartLane${laneIdx}`}
                startOffset="0%"
              >
                {PHRASE.repeat(8)}
              </textPath>
            </text>
          ))}
        </g>
      ))}

      {/* Center "Lili" accent */}
      <g filter="url(#strongGlow)">
        <text
          x={CX}
          y={CY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ff85c8"
          fontSize="38"
          fontFamily="'Inter', sans-serif"
          fontWeight="700"
          letterSpacing="3"
        >
          Lili
        </text>
        {/* Pulsing heart next to Lili */}
        <text
          x={CX + 52}
          y={CY + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ff69b4"
          fontSize="20"
          className="animate-pulse"
        >
          ♥
        </text>
      </g>
    </svg>
  );
};

export default HeartTextFlow;
