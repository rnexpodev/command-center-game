import {
  AlertTriangle,
  CheckCircle,
  Flame,
  Link,
  Navigation,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEntry } from "@/engine/recorder";
import { TimelineEventType } from "@/engine/recorder";

const typeConfig: Record<
  TimelineEventType,
  { icon: typeof Flame; color: string; label: string }
> = {
  [TimelineEventType.EVENT_SPAWNED]: {
    icon: Flame,
    color: "text-red-400",
    label: "אירוע חדש",
  },
  [TimelineEventType.EVENT_ESCALATED]: {
    icon: AlertTriangle,
    color: "text-orange-400",
    label: "החמרה",
  },
  [TimelineEventType.EVENT_RESOLVED]: {
    icon: CheckCircle,
    color: "text-green-400",
    label: "טופל",
  },
  [TimelineEventType.UNIT_DISPATCHED]: {
    icon: Truck,
    color: "text-blue-400",
    label: "שליחה",
  },
  [TimelineEventType.UNIT_ARRIVED]: {
    icon: Navigation,
    color: "text-cyan-400",
    label: "הגעה",
  },
  [TimelineEventType.CHAIN_EVENT]: {
    icon: Link,
    color: "text-purple-400",
    label: "אירוע משני",
  },
};

interface TimelineEntryCardProps {
  entry: TimelineEntry;
}

export function TimelineEntryCard({ entry }: TimelineEntryCardProps) {
  const config = typeConfig[entry.type];
  const Icon = config.icon;

  const hours = Math.floor(entry.tick / 60);
  const minutes = entry.tick % 60;
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3",
        "transition-colors hover:border-zinc-700",
      )}
    >
      <div className={cn("mt-0.5 shrink-0", config.color)}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={cn("text-xs font-semibold", config.color)}>
            {config.label}
          </span>
          <span className="shrink-0 font-mono text-xs text-zinc-500">
            {timeStr}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-zinc-300">
          {entry.description}
        </p>
      </div>
    </div>
  );
}
