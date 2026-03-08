/**
 * EN: Animated heart composition — repeated text tokens circulate on closed heart lanes.
 * RU: Анимированная композиция-сердце — повторяющиеся текстовые токены циркулируют по замкнутым дорожкам сердца.
 */

import { useEffect, useMemo, useRef } from "react";

/* Individual characters as tokens; spaces only between words */
const CHAR_SEQUENCE = ["I", " ", "l", "o", "v", "e", " ", "y", "o", "u", " "];

/**
 * Generate a closed heart-shaped SVG path.
 * Seam at bottom tip (shifted by PI).
 */
function heartPath(scale: number, cx: number, cy: number): string {
  const points: string[] = [];
  const steps = 300;

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 + Math.PI;
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

  return `${points.join(" ")} Z`;
}

const CX = 500;
const CY = 440;
/* Bigger heart — scale multiplier increased from 18 to 24 */
const BASE_SCALE = 24;
const LANE_SCALES = [1.0, 0.87, 0.74, 0.61, 0.48, 0.36, 0.25];
const FONT_SIZES = [28, 25, 22, 20, 17, 15, 12];
const CHAR_COUNTS = [120, 108, 96, 80, 68, 56, 40];
const SPEED_PX_PER_SEC = 45;

/* Colour gradient from outer (deep magenta) to inner (bright hot pink / white-ish) for depth */
const LANE_COLORS = [
  "hsl(328 100% 54%)",
  "hsl(328 100% 54%)",
  "hsl(328 100% 54%)",
  "hsl(328 100% 54%)",
  "hsl(328 100% 54%)",
  "hsl(328 100% 54%)",
  "hsl(328 100% 54%)",
];
const LANE_OPACITIES = [1.0, 0.82, 0.65, 0.50, 0.37, 0.25, 0.15];

const HeartTextFlow = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const paths = useMemo(
    () => LANE_SCALES.map((s) => heartPath(s * BASE_SCALE, CX, CY)),
    []
  );

  const laneTokenIndexes = useMemo(
    () => CHAR_COUNTS.map((count) => Array.from({ length: count }, (_, i) => i)),
    []
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const pathEls = svg.querySelectorAll<SVGPathElement>("defs path[id^='hl']");
    const laneMetrics = Array.from(pathEls).map((pathEl, lane) => {
      const length = pathEl.getTotalLength();
      const count = CHAR_COUNTS[lane] ?? 40;
      const spacing = length / count;
      return { length, spacing };
    });

    const textPaths = svg.querySelectorAll<SVGTextPathElement>("textPath[data-lane][data-token]");

    const animate = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const deltaSec = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      progressRef.current += SPEED_PX_PER_SEC * deltaSec;

      textPaths.forEach((tp) => {
        const lane = Number(tp.dataset.lane || 0);
        const token = Number(tp.dataset.token || 0);
        const metric = laneMetrics[lane];
        if (!metric) return;

        const rawOffset = progressRef.current + token * metric.spacing;
        const offset = ((rawOffset % metric.length) + metric.length) % metric.length;
        tp.setAttribute("startOffset", `${offset}px`);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
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

      {LANE_SCALES.map((_, lane) => (
        <g key={lane} filter="url(#textGlow)">
          {laneTokenIndexes[lane].map((token) => (
            <text
              key={token}
              fill={LANE_COLORS[lane]}
              stroke="black"
              strokeWidth="3"
              paintOrder="stroke"
              fontSize={FONT_SIZES[lane]}
              fontFamily="'Inter', sans-serif"
              opacity={LANE_OPACITIES[lane]}
            >
              <textPath
                data-lane={lane}
                data-token={token}
                href={`#hl${lane}`}
                startOffset="0px"
              >
                {CHAR_SEQUENCE[token % CHAR_SEQUENCE.length]}
              </textPath>
            </text>
          ))}
        </g>
      ))}

      <g filter="url(#accentGlow)">
        <text
          x={CX}
          y={CY + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(328 100% 54%)"
          fontSize="72"
          fontFamily="'Inter', sans-serif"
          fontWeight="700"
          letterSpacing="4"
        >
          Lili
        </text>
        <text
          x={CX + 80}
          y={CY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(340 80% 55%)"
          fontSize="48"
        >
          <animate attributeName="font-size" values="48;60;48" dur="0.8s" repeatCount="indefinite" keyTimes="0;0.3;1" calcMode="spline" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
          <animate attributeName="opacity" values="0.85;1;0.85" dur="0.8s" repeatCount="indefinite" />
          ♥
        </text>
      </g>
    </svg>
  );
};

export default HeartTextFlow;
