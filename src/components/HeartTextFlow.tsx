/**
 * EN: Animated heart composition — repeated text tokens circulate on closed heart lanes.
 * RU: Анимированная композиция-сердце — повторяющиеся текстовые токены циркулируют по замкнутым дорожкам сердца.
 */

import { useEffect, useMemo, useRef } from "react";

const TOKEN_TEXT = " I love you ♥ ";

/**
 * Generate a closed heart-shaped SVG path.
 * Parametric heart curve: x=16sin³(t), y=13cos(t)-5cos(2t)-2cos(3t)-cos(4t)
 * Start angle is shifted by PI so seam sits at the bottom tip, not top-center.
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
const CY = 460;
const LANE_SCALES = [1.0, 0.88, 0.76, 0.64, 0.52, 0.4, 0.28];
const FONT_SIZES = [13, 12, 11, 10, 9, 8, 7];
const TOKEN_COUNTS = [28, 25, 22, 19, 16, 13, 10];
const SPEED_PX_PER_SEC = 62;

const HeartTextFlow = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const paths = useMemo(
    () => LANE_SCALES.map((s) => heartPath(s * 18, CX, CY)),
    []
  );

  const laneTokenIndexes = useMemo(
    () => TOKEN_COUNTS.map((count) => Array.from({ length: count }, (_, i) => i)),
    []
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const pathEls = svg.querySelectorAll<SVGPathElement>("defs path[id^='hl']");
    const laneMetrics = Array.from(pathEls).map((pathEl, lane) => {
      const length = pathEl.getTotalLength();
      const count = TOKEN_COUNTS[lane] ?? 12;
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

        const offset = (progressRef.current + token * metric.spacing) % metric.length;
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
              fill={`hsl(330 100% ${70 + lane * 2}%)`}
              fontSize={FONT_SIZES[lane]}
              fontFamily="'Inter', sans-serif"
              opacity={0.95 - lane * 0.08}
            >
              <textPath
                data-lane={lane}
                data-token={token}
                href={`#hl${lane}`}
                startOffset="0px"
              >
                {TOKEN_TEXT}
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

