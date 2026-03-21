import { forceTypeColors, forceTypeNames } from "@/data/map-icons";
import type { ForceUtilizationMetric } from "@/engine/analytics";

interface ForceUtilizationChartProps {
  data: Record<string, ForceUtilizationMetric>;
}

export function ForceUtilizationChart({ data }: ForceUtilizationChartProps) {
  const entries = Object.entries(data).sort(
    ([, a], [, b]) => b.percent - a.percent,
  );

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-500">
        אין נתוני ניצולת כוחות
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="mb-4 text-sm font-semibold text-zinc-300">ניצולת כוחות</h3>
      <div className="flex flex-col gap-3">
        {entries.map(([force, metric]) => {
          const name = forceTypeNames[force] ?? force;
          const color = forceTypeColors[force] ?? "#6b7280";
          const pct = Math.min(metric.percent, 100);

          return (
            <div key={force} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-start text-xs text-zinc-400">
                {name}
              </span>
              <div className="relative h-4 flex-1 overflow-hidden rounded-sm bg-zinc-800">
                <div
                  className="h-full rounded-sm transition-all"
                  style={{
                    width: `${Math.max(pct, 1)}%`,
                    backgroundColor: color,
                    opacity: 0.8,
                  }}
                />
              </div>
              <span className="w-12 shrink-0 text-start text-xs font-medium text-zinc-400">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
