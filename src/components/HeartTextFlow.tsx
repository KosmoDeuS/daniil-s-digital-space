/**
 * EN: Animated heart composition — text "I love you" flows along heart-shaped SVG paths.
 * RU: Анимированная композиция-сердце — текст "I love you" движется по SVG-путям в форме сердца.
 */

import { useEffect, useRef, useMemo } from "react";

const PHRASE = " I love you ♥ ";

/**
 * Generate a heart-shaped SVG path string at a given scale.
 * Parametric heart curve: x=16sin³(t), y=13cos(t)-5cos(2t)-2cos(3t)-cos(4t)
 */
function heartPath(scale: number, cx: number, cy: number): string {
  const points: string[] = [];
  const steps = 300;
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

const CX = 500;
const CY = 460;
const LANE_SCALES = [1.0, 0.88, 0.76, 0.64, 0.52, 0.40, 0.28];
const FONT_SIZES = [13, 12, 11, 10, 9, 8, 7];

const HeartTextFlow = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);

  const paths = useMemo(
    () => LANE_SCALES.map((s) => heartPath(s * 18, CX, CY)),
    []
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Get actual path lengths for pixel-based offsets
    const pathEls = svg.querySelectorAll<SVGPathElement>("defs path[id^='hl']");
    const pathLengths: number[] = [];
    pathEls.forEach((p) => pathLengths.push(p.getTotalLength()));

    const textPaths = svg.querySelectorAll<SVGTextPathElement>("[data-lane]");
    const SPEED = 0.8; // pixels per frame

    const animate = () => {
      progressRef.current += SPEED;
      textPaths.forEach((tp) => {
        const lane = Number(tp.dataset.lane || 0);
        const copy = Number(tp.dataset.copy || 0);
        const len = pathLengths[lane] || 1;
        // Wrap progress within path length
        const base = progressRef.current % len;
        // Offset each copy by a third of the path length
        const offset = (base + copy * (len / 3)) % len;
        tp.setAttribute("startOffset", `${offset}px`);
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 900"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
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
        {paths.map((d, i) => (
          <path key={i} id={`hl${i}`} d={d} fill="none" />
        ))}
      </defs>

      {/* Text lanes */}
      {LANE_SCALES.map((_, i) => (
        <g key={i} filter="url(#textGlow)">
          {[0, 1, 2].map((c) => (
            <text
              key={c}
              fill={`hsl(330, 100%, ${70 + i * 2}%)`}
              fontSize={FONT_SIZES[i]}
              fontFamily="'Inter', sans-serif"
              opacity={0.95 - i * 0.08}
            >
              <textPath
                data-lane={i}
                data-copy={c}
                href={`#hl${i}`}
                startOffset="0px"
              >
                {PHRASE.repeat(20)}
              </textPath>
            </text>
          ))}
        </g>
      ))}

      {/* Center "Lili" accent */}
      <g filter="url(#accentGlow)">
        <text
          x={CX}
          y={CY + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ff85c8"
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
          fill="#ff69b4"
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
