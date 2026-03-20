import { ShieldAlert, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGameTime } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import {
  Badge,
  severityToVariant,
  severityToLabel,
} from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EventStatus, Severity, type GameEvent } from "@/engine/types";
import {
  EventTypeIcon,
  eventTypeNames,
  severityColors,
} from "@/data/map-icons";

/** Map status to Hebrew */
const statusNames: Record<string, string> = {
  [EventStatus.REPORTED]: "דווח",
  [EventStatus.RESPONDING]: "בטיפול",
  [EventStatus.STABILIZED]: "יוצב",
  [EventStatus.ESCALATED]: "הוחמר",
  [EventStatus.RESOLVED]: "טופל",
};

const statusVariant: Record<
  string,
  "danger" | "warning" | "caution" | "info" | "success" | "neutral"
> = {
  [EventStatus.REPORTED]: "caution",
  [EventStatus.RESPONDING]: "info",
  [EventStatus.STABILIZED]: "success",
  [EventStatus.ESCALATED]: "danger",
  [EventStatus.RESOLVED]: "neutral",
};

const severityColor: Record<number, string> = {
  [Severity.LOW]: "text-blue-400",
  [Severity.MEDIUM]: "text-yellow-400",
  [Severity.HIGH]: "text-orange-400",
  [Severity.CRITICAL]: "text-red-400",
};

function getProgressVariant(progress: number) {
  if (progress >= 80) return "success" as const;
  if (progress >= 40) return "info" as const;
  return "warning" as const;
}

export function EventsPanel() {
  const events = useGameStore((s) => s.events);
  const tick = useGameStore((s) => s.tick);
  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const selectEvent = useUIStore((s) => s.selectEvent);
  const selectedUnitId = useUIStore((s) => s.selectedUnitId);
  const dispatchUnit = useGameStore((s) => s.dispatchUnit);
  const selectUnit = useUIStore((s) => s.selectUnit);

  // Sort: active first, then by severity desc
  const activeEvents = events
    .filter((e) => e.status !== EventStatus.RESOLVED)
    .sort((a, b) => b.severity - a.severity);

  function handleEventClick(event: GameEvent) {
    if (selectedUnitId) {
      dispatchUnit(selectedUnitId, event.id);
      selectUnit(null);
      selectEvent(event.id);
      return;
    }
    selectEvent(selectedEventId === event.id ? null : event.id);
  }

  const isUnattended = (event: GameEvent) =>
    event.status === EventStatus.REPORTED && event.assignedUnits.length === 0;

  return (
    <div
      className="flex h-full flex-col border-s border-zinc-800 bg-zinc-900/80"
      data-tour="events-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-orange-400" />
          <h2 className="text-sm font-semibold">אירועים פעילים</h2>
        </div>
        <Badge variant="warning" size="sm">
          {activeEvents.length}
        </Badge>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto p-2">
        {activeEvents.length === 0 && (
          <div className="p-4 text-center text-sm text-zinc-500">
            אין אירועים פעילים
          </div>
        )}

        <div className="flex flex-col gap-2">
          {activeEvents.map((event) => {
            const isSelected = selectedEventId === event.id;
            const unattended = isUnattended(event);

            return (
              <button
                key={event.id}
                onClick={() => handleEventClick(event)}
                className={cn(
                  "w-full rounded-lg border bg-zinc-900 p-3 text-start transition-all duration-150",
                  "hover:bg-zinc-800/80",
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-800",
                  unattended &&
                    event.severity === Severity.CRITICAL &&
                    "animate-pulse-danger",
                  unattended &&
                    event.severity === Severity.HIGH &&
                    "animate-pulse-warning",
                )}
              >
                {/* Top row: icon + name + severity */}
                <div className="mb-2 flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-0.5 shrink-0",
                      severityColor[event.severity],
                    )}
                  >
                    <EventTypeIcon
                      type={event.type}
                      size={20}
                      color={severityColors[event.severity] ?? "#71717a"}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-zinc-100">
                      {eventTypeNames[event.type] ?? event.type}
                    </div>
                    <div className="text-xs text-zinc-500">
                      {event.locationName}
                    </div>
                  </div>
                  <Badge variant={severityToVariant(event.severity)} size="sm">
                    {severityToLabel(event.severity)}
                  </Badge>
                </div>

                {/* Progress bar */}
                {event.resolveProgress > 0 && (
                  <div className="mb-2">
                    <ProgressBar
                      value={event.resolveProgress}
                      variant={getProgressVariant(event.resolveProgress)}
                      size="sm"
                    />
                  </div>
                )}

                {/* Bottom row: status + time + units */}
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={statusVariant[event.status]} size="sm">
                    {statusNames[event.status]}
                  </Badge>
                  <span className="text-zinc-500">
                    {formatGameTime(tick - event.reportedAt)}
                  </span>
                  {event.assignedUnits.length > 0 && (
                    <span className="ms-auto flex items-center gap-1 text-zinc-400">
                      <Users className="h-3 w-3" />
                      {event.assignedUnits.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EventsPanel;
