import { useState } from "react";
import { Users, Navigation, Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGameTime } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ForceType, UnitPhase, UnitStatus, type Unit } from "@/engine/types";
import { ForceTypeIcon, forceTypeColors } from "@/data/map-icons";

/** Phase display config */
const phaseConfig: Record<
  string,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: "idle" | "route" | "arriving" | "treating" | "wrapping" | "returning";
  }
> = {
  [UnitPhase.IDLE]: {
    label: "זמין",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    icon: "idle",
  },
  [UnitPhase.DISPATCHED]: {
    label: "נשלח",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    icon: "route",
  },
  [UnitPhase.EN_ROUTE]: {
    label: "בדרך",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    icon: "route",
  },
  [UnitPhase.ARRIVING]: {
    label: "מגיע לזירה",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    icon: "arriving",
  },
  [UnitPhase.TREATING]: {
    label: "מטפל",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    icon: "treating",
  },
  [UnitPhase.WRAPPING_UP]: {
    label: "מסיים",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    icon: "wrapping",
  },
  [UnitPhase.RETURNING]: {
    label: "חוזר",
    color: "text-zinc-400",
    bgColor: "bg-zinc-500/10",
    icon: "returning",
  },
};

/** Match quality display */
const matchLabels: Record<
  string,
  { label: string; color: string; icon: "full" | "partial" | "none" }
> = {
  full: { label: "מתאים", color: "text-green-400", icon: "full" },
  partial: { label: "חלקי", color: "text-yellow-400", icon: "partial" },
  none: { label: "לא מתאים", color: "text-zinc-500", icon: "none" },
};

/** Phase sort priority (lower = shown first) */
const phaseSortOrder: Record<string, number> = {
  [UnitPhase.TREATING]: 0,
  [UnitPhase.ARRIVING]: 1,
  [UnitPhase.EN_ROUTE]: 2,
  [UnitPhase.DISPATCHED]: 3,
  [UnitPhase.WRAPPING_UP]: 4,
  [UnitPhase.RETURNING]: 5,
  [UnitPhase.IDLE]: 6,
};

/** Filter tabs */
const filterTabs: { key: string; label: string }[] = [
  { key: "all", label: "הכל" },
  { key: ForceType.FIRE, label: "כיבוי" },
  { key: ForceType.MAGEN_DAVID, label: 'מד"א' },
  { key: ForceType.POLICE, label: "משטרה" },
  { key: ForceType.RESCUE, label: "חילוץ" },
  { key: ForceType.ENGINEERING, label: "הנדסה" },
];

export function UnitsPanel() {
  const [filter, setFilter] = useState("all");
  const units = useGameStore((s) => s.units);
  const events = useGameStore((s) => s.events);
  const tick = useGameStore((s) => s.tick);
  const selectedUnitId = useUIStore((s) => s.selectedUnitId);
  const selectUnit = useUIStore((s) => s.selectUnit);
  const selectEvent = useUIStore((s) => s.selectEvent);
  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const dispatchUnit = useGameStore((s) => s.dispatchUnit);

  const filteredUnits =
    filter === "all" ? units : units.filter((u) => u.forceType === filter);

  // Sort: active units first (treating → en_route → returning → available)
  const sortedUnits = [...filteredUnits].sort((a, b) => {
    const aOrder = phaseSortOrder[a.phase] ?? 6;
    const bOrder = phaseSortOrder[b.phase] ?? 6;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.forceType.localeCompare(b.forceType);
  });

  const availableCount = units.filter(
    (u) => u.status === UnitStatus.AVAILABLE,
  ).length;

  function getTargetEvent(unit: Unit) {
    if (!unit.targetEventId) return null;
    return events.find((e) => e.id === unit.targetEventId) ?? null;
  }

  function getEtaText(unit: Unit): string | null {
    if (unit.arrivalTick === undefined) return null;
    const remaining = Math.max(0, unit.arrivalTick - tick);
    return formatGameTime(remaining);
  }

  function getTravelProgress(unit: Unit): number | null {
    if (
      unit.phase !== UnitPhase.EN_ROUTE &&
      unit.phase !== UnitPhase.DISPATCHED
    )
      return null;
    if (unit.arrivalTick === undefined) return null;
    // Estimate total travel ticks from dispatch
    const event = getTargetEvent(unit);
    if (!event) return null;
    const totalTicks =
      unit.arrivalTick - (tick - Math.max(0, unit.arrivalTick - tick));
    const remaining = Math.max(0, unit.arrivalTick - tick);
    const elapsed = Math.max(1, totalTicks > 0 ? totalTicks - remaining : 1);
    return Math.min(100, (elapsed / Math.max(1, totalTicks)) * 100);
  }

  function handleUnitClick(unit: Unit) {
    if (unit.status === UnitStatus.AVAILABLE) {
      if (selectedEventId) {
        dispatchUnit(unit.id, selectedEventId);
        return;
      }
      selectUnit(selectedUnitId === unit.id ? null : unit.id);
    } else {
      // Clicking an active unit → select it and if it has a target, also select that event
      if (selectedUnitId === unit.id) {
        selectUnit(null);
      } else {
        selectUnit(unit.id);
      }
    }
  }

  function handleTargetClick(eventId: string, e: React.MouseEvent) {
    e.stopPropagation();
    selectEvent(eventId);
  }

  return (
    <div
      className="flex h-full flex-col border-e border-zinc-800 bg-zinc-900/80"
      data-tour="units-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-400" />
          <h2 className="text-sm font-semibold">כוחות ומשאבים</h2>
        </div>
        <Badge variant="info" size="sm">
          {availableCount}/{units.length}
        </Badge>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-zinc-800 px-2 py-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              filter === tab.key
                ? "bg-blue-500/20 text-blue-400"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Units list */}
      <div className="flex-1 overflow-y-auto p-2">
        {sortedUnits.length === 0 && (
          <div className="p-4 text-center text-sm text-zinc-500">
            אין כוחות בקטגוריה זו
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {sortedUnits.map((unit) => {
            const isSelected = selectedUnitId === unit.id;
            const isAvailable = unit.status === UnitStatus.AVAILABLE;
            const targetEvent = getTargetEvent(unit);
            const phase =
              phaseConfig[unit.phase] ?? phaseConfig[UnitPhase.IDLE];
            const eta = getEtaText(unit);
            const travelProgress = getTravelProgress(unit);
            const match = matchLabels[unit.matchQuality] ?? matchLabels.none;

            return (
              <button
                key={unit.id}
                onClick={() => handleUnitClick(unit)}
                className={cn(
                  "w-full rounded-lg border bg-zinc-900 p-2.5 text-start transition-all duration-150",
                  "hover:bg-zinc-800/80",
                  isSelected
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-zinc-800",
                  isAvailable && "cursor-pointer",
                )}
              >
                {/* Row 1: Icon + Name + Phase */}
                <div className="flex items-center gap-2">
                  <span className="shrink-0">
                    <ForceTypeIcon
                      type={unit.forceType}
                      size={16}
                      color={forceTypeColors[unit.forceType] ?? "#71717a"}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-zinc-200">
                      {unit.name}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
                      phase.bgColor,
                      phase.color,
                    )}
                  >
                    {phase.icon === "route" && <span className="me-1">→</span>}
                    {phase.icon === "treating" && (
                      <span className="me-1">⚡</span>
                    )}
                    {phase.icon === "returning" && (
                      <span className="me-1">←</span>
                    )}
                    {phase.label}
                  </span>
                </div>

                {/* Row 2: Progress/ETA (for active units) */}
                {(unit.phase === UnitPhase.EN_ROUTE ||
                  unit.phase === UnitPhase.DISPATCHED) && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <ProgressBar
                          value={travelProgress ?? 0}
                          variant="caution"
                          size="sm"
                        />
                      </div>
                      {eta && (
                        <span className="shrink-0 text-xs font-medium text-yellow-400">
                          ETA {eta}
                        </span>
                      )}
                    </div>
                    {targetEvent && (
                      <div
                        className="mt-1 truncate text-xs text-zinc-500 hover:text-blue-400 cursor-pointer"
                        onClick={(e) => handleTargetClick(targetEvent.id, e)}
                      >
                        ← {targetEvent.locationName}
                      </div>
                    )}
                  </div>
                )}

                {/* Row 2: Treatment info (for treating units) */}
                {unit.phase === UnitPhase.TREATING && targetEvent && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <ProgressBar
                          value={targetEvent.resolveProgress}
                          variant="info"
                          size="sm"
                        />
                      </div>
                      <span className="shrink-0 text-xs font-medium text-cyan-400">
                        {Math.round(targetEvent.resolveProgress)}%
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs">
                      <span
                        className={cn("flex items-center gap-0.5", match.color)}
                      >
                        {match.icon === "full" && <Star className="h-3 w-3" />}
                        {match.icon === "partial" && (
                          <StarHalf className="h-3 w-3" />
                        )}
                        {match.label}
                      </span>
                      {unit.treatmentContribution > 0 && (
                        <span className="text-zinc-500">
                          תרומה: {Math.round(unit.treatmentContribution * 100)}%
                        </span>
                      )}
                    </div>
                    <div
                      className="mt-0.5 truncate text-xs text-zinc-500 hover:text-blue-400 cursor-pointer"
                      onClick={(e) => handleTargetClick(targetEvent.id, e)}
                    >
                      ← {targetEvent.locationName}
                    </div>
                  </div>
                )}

                {/* Row 2: Arriving info */}
                {unit.phase === UnitPhase.ARRIVING && targetEvent && (
                  <div className="mt-1.5">
                    <div className="text-xs text-blue-400">מתארגן בזירה...</div>
                    <div
                      className="mt-0.5 truncate text-xs text-zinc-500 hover:text-blue-400 cursor-pointer"
                      onClick={(e) => handleTargetClick(targetEvent.id, e)}
                    >
                      ← {targetEvent.locationName}
                    </div>
                  </div>
                )}

                {/* Row 2: Wrapping up */}
                {unit.phase === UnitPhase.WRAPPING_UP && (
                  <div className="mt-1.5 text-xs text-purple-400">
                    מסיים ומתפנה...
                  </div>
                )}

                {/* Row 2: Returning ETA */}
                {unit.phase === UnitPhase.RETURNING && eta && (
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500">
                    <Navigation className="h-3 w-3" />
                    <span>חוזר לבסיס — {eta}</span>
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

export default UnitsPanel;
