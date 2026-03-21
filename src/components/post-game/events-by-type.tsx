import { eventTypeNames } from "@/data/map-icons";

/** Color badge per event type category */
function getEventBadgeColor(eventType: string): string {
  if (eventType.startsWith("missile_") || eventType === "interception_debris") {
    return "border-red-500/40 bg-red-500/15 text-red-400";
  }
  if (eventType === "building_fire" || eventType === "gas_leak") {
    return "border-orange-500/40 bg-orange-500/15 text-orange-400";
  }
  if (eventType === "building_collapse" || eventType === "hazmat") {
    return "border-yellow-500/40 bg-yellow-500/15 text-yellow-400";
  }
  if (eventType === "mass_casualty" || eventType === "evacuation_needed") {
    return "border-pink-500/40 bg-pink-500/15 text-pink-400";
  }
  return "border-blue-500/40 bg-blue-500/15 text-blue-400";
}

interface EventsByTypeProps {
  data: Record<string, number>;
}

export function EventsByType({ data }: EventsByTypeProps) {
  const entries = Object.entries(data).sort(([, a], [, b]) => b - a);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-500">
        אין אירועים
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <h3 className="mb-4 text-sm font-semibold text-zinc-300">
        אירועים לפי סוג
      </h3>
      <div className="flex flex-wrap gap-2">
        {entries.map(([type, count]) => {
          const name = eventTypeNames[type] ?? type;
          return (
            <span
              key={type}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${getEventBadgeColor(type)}`}
            >
              {name}
              <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-zinc-300">
                {count}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
