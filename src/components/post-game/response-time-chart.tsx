import { cn } from "@/lib/utils";
import { eventTypeNames } from "@/data/map-icons";
import type { EventResponseMetric } from "@/engine/analytics";

function getBarColor(ticks: number): string {
  if (ticks < 20) return "bg-green-500";
  if (ticks <= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function getBarTextColor(ticks: number): string {
  if (ticks < 20) return "text-green-400";
  if (ticks <= 40) return "text-yellow-400";
  return "text-red-400";
}

interface ResponseTimeChartProps {
  data: EventResponseMetric[];
}

export function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-500">
        אין נתוני זמן תגובה
      </div>
    );
  }

  const maxTicks = Math.max(...data.map((d) => d.responseTicks), 1);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="mb-4 text-sm font-semibold text-zinc-300">
        זמן תגובה לפי אירוע
      </h3>
      <div className="flex flex-col gap-2.5">
        {data.map((item) => {
          const widthPercent = Math.max(
            (item.responseTicks / maxTicks) * 100,
            2,
          );
          const name = eventTypeNames[item.eventType] ?? item.eventType;

          return (
            <div key={item.eventId} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-start text-xs text-zinc-400">
                {name}
              </span>
              <div className="relative flex-1">
                <div
                  className={cn(
                    "h-5 rounded-sm transition-all",
                    getBarColor(item.responseTicks),
                  )}
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
              <span
                className={cn(
                  "w-16 shrink-0 text-start text-xs font-medium",
                  getBarTextColor(item.responseTicks),
                )}
              >
                {item.responseTicks} טיקים
              </span>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="mt-4 flex gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500" />
          {"מהיר (<20)"}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-yellow-500" />
          {"בינוני (20-40)"}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500" />
          {"איטי (>40)"}
        </span>
      </div>
    </div>
  );
}
