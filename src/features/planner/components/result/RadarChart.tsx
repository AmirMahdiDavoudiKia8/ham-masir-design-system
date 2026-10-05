import { SUBJECT_LABEL } from "../../types";
import type { SubjectAllocation } from "../../types";

interface RadarChartProps {
  allocations: SubjectAllocation[];
}

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 96;
const LABEL_RADIUS = RADIUS * 1.22;
const RINGS = [0.25, 0.5, 0.75, 1];

function pointAt(index: number, count: number, value01: number, radius = RADIUS) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
  const r = radius * Math.max(0, Math.min(1, value01));
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

function polygon(count: number, values01: number[], radius = RADIUS) {
  return values01.map((v, i) => pointAt(i, count, v, radius)).map((p) => `${p.x},${p.y}`).join(" ");
}

/**
 * Section B — hand-rolled SVG radar chart (no charting library in this
 * project, see ProgressRing.tsx for the same hand-rolled-SVG convention):
 * current-percent (peach, filled) vs. target-percent (teal, dashed) per
 * subject. Values are clamped to [0,100] purely for plotting — the actual
 * gap number is what the bar chart/table below communicate honestly.
 */
export function RadarChart({ allocations }: RadarChartProps) {
  const count = allocations.length;
  if (count < 3) return null; // a 1-2 axis "radar" isn't a meaningful shape

  const currentValues = allocations.map((a) => Math.min(100, Math.max(0, a.currentPercent)) / 100);
  const targetValues = allocations.map((a) => Math.min(100, Math.max(0, a.targetPercent)) / 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-[280px]" role="img" aria-label="نمودار تعادل وضعیت فعلی و هدف در هر درس">
        {RINGS.map((ring) => (
          <polygon key={ring} points={polygon(count, allocations.map(() => ring))} fill="none" className="stroke-border" strokeWidth={1} />
        ))}
        {allocations.map((a, i) => {
          const p = pointAt(i, count, 1);
          return <line key={a.subjectKey} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} className="stroke-border" strokeWidth={1} />;
        })}

        <polygon points={polygon(count, currentValues)} className="fill-secondary stroke-secondary" style={{ fillOpacity: 0.35 }} strokeWidth={2} />
        <polygon points={polygon(count, targetValues)} fill="none" className="stroke-primary" strokeWidth={2} strokeDasharray="4 4" />

        {allocations.map((a, i) => {
          const p = pointAt(i, count, 1, LABEL_RADIUS);
          return (
            <text key={a.subjectKey} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-[11px] font-semibold">
              {SUBJECT_LABEL[a.subjectKey]}
            </text>
          );
        })}
      </svg>

      <div className="flex items-center gap-5 text-label text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
          وضعیت فعلی تو
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-primary" />
          هدف
        </span>
      </div>
    </div>
  );
}
