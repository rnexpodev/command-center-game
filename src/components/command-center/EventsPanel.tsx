import { ShieldAlert, Users, Timer } from "lucide-react";
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
import {
  EventStatus,
  Severity,
  UnitStatus,
  type GameEvent,
} from "@/engine/types";
import {
  EventTypeIcon,
  ForceTypeIcon,
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
  const units = useGameStore((s) => s.units);
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

            // Get assigned force types for this event
            const assignedForceTypes = new Set(
              units
                .filter(
                  (u) =>
                    u.targetEventId === event.id &&
                    u.status !== UnitStatus.AVAILABLE,
                )
                .map((u) => u.forceType),
            );
            const requiredForcesUnique = [...new Set(event.requiredForces)];
            const missingForces = requiredForcesUnique.filter(
              (f) => !assignedForceTypes.has(f),
            );

            // Escalation urgency
            const escalationUrgent =
              event.escalationTimer > 0 &&
              event.escalationTimer < 120 &&
              event.status !== EventStatus.RESOLVED &&
              event.status !== EventStatus.STABILIZED;

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

                {/* Force dots — shows which forces are assigned/missing */}
                <div className="mb-2 flex items-center gap-1">
                  {requiredForcesUnique.map((force) => {
                    const isAssigned = assignedForceTypes.has(force);
                    return (
                      <span
                        key={force}
                        title={`${force}: ${isAssigned ? "מוקצה" : "חסר"}`}
                        className="shrink-0"
                      >
                        <ForceTypeIcon
                          type={force}
                          size={12}
                          color={isAssigned ? "#4ade80" : "#f87171"}
                        />
                      </span>
                    );
                  })}
                  {missingForces.length > 0 && (
                    <span className="text-xs text-red-400 ms-1">
                      חסר {missingForces.length}
                    </span>
                  )}
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

                {/* Bottom row: status + time + escalation + units */}
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={statusVariant[event.status]} size="sm">
                    {statusNames[event.status]}
                  </Badge>
                  <span className="text-zinc-500">
                    {formatGameTime(tick - event.reportedAt)}
                  </span>

                  {/* Escalation countdown */}
                  {escalationUrgent && (
                    <span className="flex items-center gap-0.5 text-red-400 font-semibold">
                      <Timer className="h-3 w-3" />
                      {Math.ceil(event.escalationTimer / 60)}׳
                    </span>
                  )}

                  {event.assignedUnits.length > 0 && (
                    <span className="ms-auto flex items-center gap-1 text-zinc-400">
                      <Users className="h-3 w-3" />
                      {event.assignedUnits.length}
                    </span>
                  )}
                </div>

                {/* Area/evacuation status badges */}
                {(event.areaClosed || event.evacuationActive) && (
                  <div className="mt-1.5 flex gap-1.5">
                    {event.areaClosed && (
                      <span className="rounded px-1.5 py-0.5 text-xs bg-green-500/10 text-green-400">
                        חסום
                      </span>
                    )}
                    {event.evacuationActive && (
                      <span className="rounded px-1.5 py-0.5 text-xs bg-blue-500/10 text-blue-400">
                        פינוי
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EventsPanel;
