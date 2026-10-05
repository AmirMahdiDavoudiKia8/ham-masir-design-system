import { toPersianDigits } from "@/lib/format";
import type { HourRampPoint } from "../../types";

interface HourRampChartProps {
  points: HourRampPoint[];
}

const WIDTH = 320;
const HEIGHT = 180;
const PAD_LEFT = 28;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 30;

/**
 * Section D — hand-rolled SVG line chart of the recommended daily-hour ramp
 * up to exam day, with a proper Y-axis (gridlines + hour ticks) so the curve
 * can be read against a real scale, not just the two endpoint labels. The
 * last segment (final stretch toward exam day) gets a shaded area behind it
 * to echo the "جمع‌بندی نهایی" callout, since the engine doesn't carry a
 * day-precise cutover per point to shade exactly.
 */
export function HourRampChart({ points }: HourRampChartProps) {
  if (points.length < 2) return null;

  const maxHours = Math.max(...points.map((p) => p.recommendedHours), 1);
  const niceMax = Math.max(2, Math.ceil(maxHours / 2) * 2);
  const yTicks = [0, niceMax / 2, niceMax];

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const stepX = plotWidth / (points.length - 1);
  const baseline = PAD_TOP + plotHeight;
  const yFor = (hours: number) => PAD_TOP + plotHeight - (hours / niceMax) * plotHeight;

  const coords = points.map((p, i) => ({
    x: PAD_LEFT + i * stepX,
    y: yFor(p.recommendedHours),
    ...p,
  }));

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const last = coords[coords.length - 1];
  const secondLast = coords[coords.length - 2];
  const finalStretchArea = `M${secondLast.x},${baseline} L${secondLast.x},${secondLast.y} L${last.x},${last.y} L${last.x},${baseline} Z`;

  const showEveryLabel = points.length <= 6;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto w-full max-w-[360px]" role="img" aria-label="منحنی افزایش ساعت مطالعه تا روز کنکور">
      {yTicks.map((tick) => {
        const y = yFor(tick);
        return (
          <g key={tick}>
            <line x1={PAD_LEFT} y1={y} x2={WIDTH - PAD_RIGHT} y2={y} className="stroke-border" strokeWidth={1} />
            <text x={PAD_LEFT - 6} y={y} textAnchor="end" dominantBaseline="middle" className="fill-muted-foreground text-[9px]">
              {toPersianDigits(tick)}
            </text>
          </g>
        );
      })}
      <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={baseline} className="stroke-border" strokeWidth={1} />

      <path d={finalStretchArea} className="fill-secondary" style={{ fillOpacity: 0.18 }} />

      <path d={linePath} fill="none" className="stroke-primary" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {coords.map((c, i) => {
        const isEdge = i === 0 || i === coords.length - 1;
        const showLabel = showEveryLabel || isEdge || i % 2 === 0;
        return (
          <g key={c.monthLabel}>
            <circle cx={c.x} cy={c.y} r={isEdge ? 4 : 3} className={isEdge ? "fill-secondary" : "fill-primary"} />
            {showLabel && (
              <text x={c.x} y={baseline + 14} textAnchor="middle" className="fill-muted-foreground text-[9px]">
                {toPersianDigits(c.monthLabel)}
              </text>
            )}
            {isEdge && (
              <text x={c.x} y={c.y - 8} textAnchor="middle" className="fill-foreground text-[10px] font-bold">
                {toPersianDigits(c.recommendedHours)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
