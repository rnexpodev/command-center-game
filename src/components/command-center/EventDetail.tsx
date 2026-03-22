import { useState } from "react";
import {
  Flame,
  Building2,
  Construction,
  Skull,
  Send,
  ShieldOff,
  UserMinus,
  Timer,
  X,
  Clock,
  ChevronUp,
  ChevronDown,
  Star,
  StarHalf,
  ShieldCheck,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGameTime } from "@/lib/utils";
import { useGameStore, gameRecorder } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import {
  Badge,
  severityToVariant,
  severityToLabel,
} from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconButton } from "@/components/ui/IconButton";
import { EventStatus, ForceType, UnitPhase, UnitStatus } from "@/engine/types";
import {
  EventTypeIcon,
  ForceTypeIcon,
  eventTypeNames,
  forceTypeNames,
  forceTypeColors,
  severityColors,
} from "@/data/map-icons";
import { TimelineEventType } from "@/engine/recorder";

type TabId = "status" | "forces" | "timeline";

const tabs: { id: TabId; label: string }[] = [
  { id: "status", label: "מצב" },
  { id: "forces", label: "כוחות בשטח" },
  { id: "timeline", label: "ציר זמן" },
];

export function EventDetail() {
  const [activeTab, setActiveTab] = useState<TabId>("status");
  const [expanded, setExpanded] = useState(false);

  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const selectEvent = useUIStore((s) => s.selectEvent);
  const selectUnit = useUIStore((s) => s.selectUnit);
  const events = useGameStore((s) => s.events);
  const units = useGameStore((s) => s.units);
  const tick = useGameStore((s) => s.tick);
  const closeArea = useGameStore((s) => s.closeArea);
  const startEvacuation = useGameStore((s) => s.startEvacuation);
  const addNotification = useUIStore((s) => s.addNotification);

  const event = events.find((e) => e.id === selectedEventId);
  if (!event) return null;

  const assignedUnits = units.filter(
    (u) =>
      u.targetEventId === event.id &&
      (u.status === UnitStatus.ON_SCENE ||
        u.status === UnitStatus.EN_ROUTE ||
        u.status === UnitStatus.DISPATCHED),
  );
  const assignedForceTypes = new Set(assignedUnits.map((u) => u.forceType));
  const requiredForcesUnique = [...new Set(event.requiredForces)];

  // Check action availability
  const hasPoliceOnScene = units.some(
    (u) =>
      u.targetEventId === event.id &&
      u.status === UnitStatus.ON_SCENE &&
      u.forceType === ForceType.POLICE,
  );
  const hasEvacOnScene = units.some(
    (u) =>
      u.targetEventId === event.id &&
      u.status === UnitStatus.ON_SCENE &&
      u.forceType === ForceType.EVACUATION,
  );

  function getProgressVariant(progress: number) {
    if (progress >= 80) return "success" as const;
    if (progress >= 40) return "info" as const;
    return "warning" as const;
  }

  const treatmentElapsed =
    event.treatmentStartTick !== undefined
      ? tick - event.treatmentStartTick
      : 0;
  const treatmentExpected = event.treatmentDurationTicks ?? 0;

  function handleDispatchClick() {
    selectUnit(null);
    addNotification("בחר כוח זמין ולחץ על אירוע לשליחה", "info");
  }

  function handleCloseArea() {
    if (!selectedEventId || !event) return;
    const success = closeArea(selectedEventId);
    if (success) {
      addNotification(
        `אזור ${event.locationName} נחסם — סיכון מופחת`,
        "success",
      );
    } else {
      addNotification("נדרשת משטרה בזירה לחסימת אזור", "warning");
    }
  }

  function handleEvacuate() {
    if (!selectedEventId || !event) return;
    const success = startEvacuation(selectedEventId);
    if (success) {
      addNotification(`פינוי תושבים החל ב${event.locationName}`, "success");
    } else {
      addNotification("נדרשת יחידת פינוי בזירה", "warning");
    }
  }

  return (
    <div
      className={cn(
        "border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-sm diegetic-panel transition-all duration-300",
        expanded ? "max-h-[45vh]" : "max-h-56",
      )}
      data-tour="event-detail"
    >
      {/* Tab bar + expand/close */}
      <div className="flex items-center border-b border-zinc-800 px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (!expanded) setExpanded(true);
              }}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-blue-500 text-blue-400"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ms-auto flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => selectEvent(null)}
            className="rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div
        className="overflow-y-auto px-6 py-4"
        style={{
          maxHeight: expanded ? "calc(45vh - 44px)" : "calc(14rem - 44px)",
        }}
      >
        {activeTab === "status" && (
          <StatusTab
            event={event}
            tick={tick}
            treatmentElapsed={treatmentElapsed}
            treatmentExpected={treatmentExpected}
            getProgressVariant={getProgressVariant}
            assignedUnits={assignedUnits}
            requiredForcesUnique={requiredForcesUnique}
            assignedForceTypes={assignedForceTypes}
            hasPoliceOnScene={hasPoliceOnScene}
            hasEvacOnScene={hasEvacOnScene}
            onDispatch={handleDispatchClick}
            onCloseArea={handleCloseArea}
            onEvacuate={handleEvacuate}
          />
        )}
        {activeTab === "forces" && (
          <ForcesTab
            event={event}
            units={units}
            assignedUnits={assignedUnits}
            requiredForcesUnique={requiredForcesUnique}
            assignedForceTypes={assignedForceTypes}
            tick={tick}
            onDispatch={handleDispatchClick}
          />
        )}
        {activeTab === "timeline" && <TimelineTab eventId={event.id} />}
      </div>
    </div>
  );
}

/** Status tab — main event info, progress, actions */
function StatusTab({
  event,
  tick: _tick,
  treatmentElapsed,
  treatmentExpected,
  getProgressVariant,
  assignedUnits,
  requiredForcesUnique,
  assignedForceTypes,
  hasPoliceOnScene,
  hasEvacOnScene,
  onDispatch,
  onCloseArea,
  onEvacuate,
}: {
  event: ReturnType<typeof useGameStore.getState>["events"][0];
  tick: number;
  treatmentElapsed: number;
  treatmentExpected: number;
  getProgressVariant: (p: number) => "success" | "info" | "warning";
  assignedUnits: ReturnType<typeof useGameStore.getState>["units"];
  requiredForcesUnique: string[];
  assignedForceTypes: Set<string>;
  hasPoliceOnScene: boolean;
  hasEvacOnScene: boolean;
  onDispatch: () => void;
  onCloseArea: () => void;
  onEvacuate: () => void;
}) {
  // Escalation time remaining
  const escalationRemaining =
    event.escalationTimer > 0 ? Math.max(0, event.escalationTimer) : 0;

  return (
    <div className="flex items-start gap-6">
      {/* Event info */}
      <div className="min-w-0 flex-1">
        {/* Title row */}
        <div className="mb-3 flex items-center gap-3">
          <EventTypeIcon
            type={event.type}
            size={20}
            color={severityColors[event.severity] ?? "#f97316"}
          />
          <h3 className="text-lg font-semibold text-zinc-100">
            {eventTypeNames[event.type] ?? event.type}
          </h3>
          <Badge variant={severityToVariant(event.severity)} size="md">
            {severityToLabel(event.severity)}
          </Badge>
          <span className="text-sm text-zinc-500">{event.locationName}</span>
        </div>

        {/* Description */}
        <p className="mb-3 text-sm leading-relaxed text-zinc-400">
          {event.description}
        </p>

        {/* Threat + status indicators */}
        <div className="mb-3 flex flex-wrap gap-2">
          {event.fireDanger && (
            <Badge variant="danger" size="sm">
              <Flame className="me-1 h-3 w-3" />
              סכנת שריפה
            </Badge>
          )}
          {event.collapseDanger && (
            <Badge variant="warning" size="sm">
              <Building2 className="me-1 h-3 w-3" />
              סכנת קריסה
            </Badge>
          )}
          {event.blocksRoad && (
            <Badge variant="caution" size="sm">
              <Construction className="me-1 h-3 w-3" />
              כביש חסום
            </Badge>
          )}
          {event.needsEvacuation && (
            <Badge variant="danger" size="sm">
              <UserMinus className="me-1 h-3 w-3" />
              דורש פינוי
            </Badge>
          )}
          {event.casualties > 0 && (
            <Badge variant="danger" size="sm">
              <Skull className="me-1 h-3 w-3" />
              {event.casualties} נפגעים
            </Badge>
          )}
          {event.areaClosed && (
            <Badge variant="success" size="sm">
              <ShieldCheck className="me-1 h-3 w-3" />
              אזור חסום
            </Badge>
          )}
          {event.evacuationActive && (
            <Badge variant="info" size="sm">
              <Navigation className="me-1 h-3 w-3" />
              פינוי פעיל
            </Badge>
          )}
        </div>
      </div>

      {/* Required forces */}
      <div className="w-48 shrink-0">
        <h4 className="mb-2 text-xs font-semibold text-zinc-500">
          כוחות נדרשים
        </h4>
        <div className="flex flex-col gap-1.5">
          {requiredForcesUnique.map((force) => {
            const isAssigned = assignedForceTypes.has(force);
            return (
              <div
                key={force}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1 text-xs",
                  isAssigned
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400",
                )}
              >
                <ForceTypeIcon
                  type={force}
                  size={16}
                  color={isAssigned ? "#4ade80" : "#f87171"}
                />
                <span>{forceTypeNames[force] ?? force}</span>
                {isAssigned ? (
                  <span className="ms-auto">&#10003;</span>
                ) : (
                  <span className="ms-auto text-red-400">✗</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress + actions */}
      <div className="w-56 shrink-0">
        <h4 className="mb-2 text-xs font-semibold text-zinc-500">
          התקדמות טיפול
        </h4>
        <ProgressBar
          value={event.resolveProgress}
          variant={getProgressVariant(event.resolveProgress)}
          size="md"
          label={`${Math.round(event.resolveProgress)}%`}
        />

        {/* Treatment timeline */}
        {treatmentElapsed > 0 && (
          <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>טיפול: {formatGameTime(treatmentElapsed)}</span>
            </div>
            {treatmentExpected > 0 && (
              <div className="text-zinc-500">
                צפי: ~{formatGameTime(treatmentExpected)}
              </div>
            )}
          </div>
        )}

        {/* Escalation timer */}
        {escalationRemaining > 0 && event.status !== EventStatus.RESOLVED && (
          <div
            className={cn(
              "mt-2 flex items-center gap-1.5 text-xs",
              escalationRemaining < 120
                ? "text-red-400 font-semibold"
                : "text-orange-400",
            )}
          >
            <Timer className="h-3 w-3" />
            <span>הסלמה בעוד {Math.ceil(escalationRemaining / 60)} דק׳</span>
          </div>
        )}

        {/* Assigned count */}
        <div className="mt-2 text-xs text-zinc-500">
          כוחות מוקצים:{" "}
          <span className="font-medium text-zinc-300">
            {assignedUnits.length}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 flex-col gap-2">
        <IconButton
          variant="info"
          size="sm"
          label="שגר כוחות"
          onClick={onDispatch}
          title="בחר כוח זמין ולחץ על אירוע לשליחה"
        >
          <Send className="h-4 w-4" />
        </IconButton>
        <IconButton
          variant={
            event.areaClosed
              ? "success"
              : hasPoliceOnScene
                ? "warning"
                : "ghost"
          }
          size="sm"
          label={event.areaClosed ? "אזור חסום ✓" : "סגור אזור"}
          onClick={onCloseArea}
          title={
            event.areaClosed
              ? "האזור כבר חסום"
              : hasPoliceOnScene
                ? "חסום אזור — מפחית סיכון להסלמה ב-70%"
                : "דורש משטרה בזירה"
          }
          disabled={event.areaClosed || !hasPoliceOnScene}
        >
          <ShieldOff className="h-4 w-4" />
        </IconButton>
        <IconButton
          variant={
            event.evacuationActive
              ? "success"
              : hasEvacOnScene
                ? "danger"
                : "ghost"
          }
          size="sm"
          label={event.evacuationActive ? "פינוי פעיל ✓" : "פנה תושבים"}
          onClick={onEvacuate}
          title={
            event.evacuationActive
              ? "פינוי כבר מתבצע"
              : hasEvacOnScene
                ? "התחל פינוי תושבים מאזור הסיכון"
                : "דורש יחידת פינוי בזירה"
          }
          disabled={event.evacuationActive || !hasEvacOnScene}
        >
          <UserMinus className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}

/** Forces tab — per-unit breakdown */
function ForcesTab({
  event: _event,
  units: _units,
  assignedUnits,
  requiredForcesUnique,
  assignedForceTypes,
  tick,
  onDispatch,
}: {
  event: ReturnType<typeof useGameStore.getState>["events"][0];
  units: ReturnType<typeof useGameStore.getState>["units"];
  assignedUnits: ReturnType<typeof useGameStore.getState>["units"];
  requiredForcesUnique: string[];
  assignedForceTypes: Set<string>;
  tick: number;
  onDispatch: () => void;
}) {
  const matchLabels: Record<string, { label: string; color: string }> = {
    full: { label: "מתאים", color: "text-green-400" },
    partial: { label: "חלקי", color: "text-yellow-400" },
    none: { label: "לא מתאים", color: "text-zinc-500" },
  };

  const phaseLabels: Record<string, string> = {
    [UnitPhase.DISPATCHED]: "נשלח",
    [UnitPhase.EN_ROUTE]: "בדרך",
    [UnitPhase.ARRIVING]: "מגיע לזירה",
    [UnitPhase.TREATING]: "מטפל",
    [UnitPhase.WRAPPING_UP]: "מסיים",
    [UnitPhase.RETURNING]: "חוזר",
  };

  return (
    <div>
      {/* Required forces summary */}
      <div className="mb-4">
        <h4 className="mb-2 text-xs font-semibold text-zinc-500">
          כוחות נדרשים
        </h4>
        <div className="flex flex-wrap gap-2">
          {requiredForcesUnique.map((force) => {
            const isAssigned = assignedForceTypes.has(force);
            return (
              <div
                key={force}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs",
                  isAssigned
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400",
                )}
              >
                <ForceTypeIcon
                  type={force}
                  size={14}
                  color={isAssigned ? "#4ade80" : "#f87171"}
                />
                <span>{forceTypeNames[force] ?? force}</span>
                {isAssigned ? " ✓" : " ✗"}
                {!isAssigned && (
                  <button
                    onClick={onDispatch}
                    className="me-1 rounded px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    שגר
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Assigned units list */}
      <h4 className="mb-2 text-xs font-semibold text-zinc-500">
        כוחות מוקצים ({assignedUnits.length})
      </h4>
      {assignedUnits.length === 0 ? (
        <div className="py-4 text-center text-sm text-zinc-600">
          לא הוקצו כוחות — לחץ על &ldquo;שגר כוחות&rdquo;
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {assignedUnits.map((unit) => {
            const match = matchLabels[unit.matchQuality] ?? matchLabels.none;
            const phaseLabel = phaseLabels[unit.phase] ?? unit.phase;
            const eta =
              unit.arrivalTick !== undefined
                ? formatGameTime(Math.max(0, unit.arrivalTick - tick))
                : null;

            return (
              <div
                key={unit.id}
                className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5"
              >
                <ForceTypeIcon
                  type={unit.forceType}
                  size={16}
                  color={forceTypeColors[unit.forceType] ?? "#71717a"}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-zinc-200">
                    {unit.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        unit.phase === UnitPhase.TREATING
                          ? "text-cyan-400"
                          : unit.phase === UnitPhase.EN_ROUTE
                            ? "text-yellow-400"
                            : "text-zinc-400",
                      )}
                    >
                      {phaseLabel}
                    </span>
                    {eta && <span className="text-yellow-400">ETA {eta}</span>}
                  </div>
                </div>

                {/* Match quality */}
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs",
                    match.color,
                  )}
                >
                  {unit.matchQuality === "full" && <Star className="h-3 w-3" />}
                  {unit.matchQuality === "partial" && (
                    <StarHalf className="h-3 w-3" />
                  )}
                  {match.label}
                </span>

                {/* Contribution */}
                {unit.treatmentContribution > 0 && (
                  <span className="text-xs text-zinc-500">
                    {Math.round(unit.treatmentContribution * 100)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Timeline tab — event history from recorder */
function TimelineTab({ eventId }: { eventId: string }) {
  const timeline = gameRecorder.getTimeline();

  // Filter to entries relevant to this event
  const eventEntries = timeline.filter(
    (entry) =>
      entry.eventId === eventId ||
      // Also include unit dispatched/arrived entries for units assigned to this event
      (entry.unitId && entry.eventId === eventId),
  );

  const typeIcons: Record<string, string> = {
    [TimelineEventType.EVENT_SPAWNED]: "⚡",
    [TimelineEventType.UNIT_DISPATCHED]: "→",
    [TimelineEventType.UNIT_ARRIVED]: "✓",
    [TimelineEventType.EVENT_RESOLVED]: "✓",
    [TimelineEventType.EVENT_ESCALATED]: "⚠",
    [TimelineEventType.CHAIN_EVENT]: "🔗",
  };

  const typeColors: Record<string, string> = {
    [TimelineEventType.EVENT_SPAWNED]: "text-orange-400",
    [TimelineEventType.UNIT_DISPATCHED]: "text-blue-400",
    [TimelineEventType.UNIT_ARRIVED]: "text-green-400",
    [TimelineEventType.EVENT_RESOLVED]: "text-green-400",
    [TimelineEventType.EVENT_ESCALATED]: "text-red-400",
    [TimelineEventType.CHAIN_EVENT]: "text-yellow-400",
  };

  return (
    <div>
      {eventEntries.length === 0 ? (
        <div className="py-4 text-center text-sm text-zinc-600">
          אין אירועי ציר זמן
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {eventEntries.map((entry, i) => (
            <div key={i} className="flex items-start gap-3 py-1 text-xs">
              <span className="diegetic-mono shrink-0 text-zinc-600 w-12">
                {formatGameTime(entry.tick)}
              </span>
              <span
                className={cn(
                  "shrink-0 w-4 text-center",
                  typeColors[entry.type] ?? "text-zinc-500",
                )}
              >
                {typeIcons[entry.type] ?? "•"}
              </span>
              <span className="text-zinc-300">{entry.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventDetail;
