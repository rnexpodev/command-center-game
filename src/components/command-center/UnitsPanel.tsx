import { useState } from "react";
import {
  Flame,
  Heart,
  Shield,
  HardHat,
  Wrench,
  HandHeart,
  Truck,
  Users,
  ShieldCheck,
  CircleDot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { Badge } from "@/components/ui/Badge";
import { ForceType, UnitStatus, type Unit } from "@/engine/types";

/** Force type icons */
const forceIcons: Record<string, React.ReactNode> = {
  [ForceType.FIRE]: <Flame className="h-4 w-4" />,
  [ForceType.MAGEN_DAVID]: <Heart className="h-4 w-4" />,
  [ForceType.POLICE]: <Shield className="h-4 w-4" />,
  [ForceType.RESCUE]: <HardHat className="h-4 w-4" />,
  [ForceType.ENGINEERING]: <Wrench className="h-4 w-4" />,
  [ForceType.WELFARE]: <HandHeart className="h-4 w-4" />,
  [ForceType.INFRASTRUCTURE]: <Wrench className="h-4 w-4" />,
  [ForceType.EVACUATION]: <Truck className="h-4 w-4" />,
  [ForceType.HOMEFRONT]: <ShieldCheck className="h-4 w-4" />,
};

/** Force type colors */
const forceColors: Record<string, string> = {
  [ForceType.FIRE]: "text-red-400",
  [ForceType.MAGEN_DAVID]: "text-red-300",
  [ForceType.POLICE]: "text-blue-400",
  [ForceType.RESCUE]: "text-orange-400",
  [ForceType.ENGINEERING]: "text-yellow-400",
  [ForceType.WELFARE]: "text-pink-400",
  [ForceType.INFRASTRUCTURE]: "text-amber-400",
  [ForceType.EVACUATION]: "text-green-400",
  [ForceType.HOMEFRONT]: "text-cyan-400",
};

/** Status badge mapping */
const statusConfig: Record<
  string,
  {
    label: string;
    variant: "success" | "caution" | "info" | "neutral" | "warning";
  }
> = {
  [UnitStatus.AVAILABLE]: { label: "זמין", variant: "success" },
  [UnitStatus.DISPATCHED]: { label: "בדרך", variant: "caution" },
  [UnitStatus.EN_ROUTE]: { label: "בדרך", variant: "caution" },
  [UnitStatus.ON_SCENE]: { label: "בזירה", variant: "info" },
  [UnitStatus.RETURNING]: { label: "חוזר", variant: "warning" },
  [UnitStatus.UNAVAILABLE]: { label: "לא זמין", variant: "neutral" },
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
  const selectedUnitId = useUIStore((s) => s.selectedUnitId);
  const selectUnit = useUIStore((s) => s.selectUnit);
  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const dispatchUnit = useGameStore((s) => s.dispatchUnit);

  const filteredUnits =
    filter === "all" ? units : units.filter((u) => u.forceType === filter);

  // Sort: available first, then by force type
  const sortedUnits = [...filteredUnits].sort((a, b) => {
    if (a.status === UnitStatus.AVAILABLE && b.status !== UnitStatus.AVAILABLE)
      return -1;
    if (a.status !== UnitStatus.AVAILABLE && b.status === UnitStatus.AVAILABLE)
      return 1;
    return a.forceType.localeCompare(b.forceType);
  });

  function getTargetEventName(unit: Unit): string | null {
    if (!unit.targetEventId) return null;
    const event = events.find((e) => e.id === unit.targetEventId);
    return event?.locationName ?? null;
  }

  function handleUnitClick(unit: Unit) {
    if (unit.status === UnitStatus.AVAILABLE) {
      // If there's a selected event, dispatch directly
      if (selectedEventId) {
        dispatchUnit(unit.id, selectedEventId);
        return;
      }
      // Toggle unit selection
      selectUnit(selectedUnitId === unit.id ? null : unit.id);
    } else {
      // For non-available units, just show info
      selectUnit(selectedUnitId === unit.id ? null : unit.id);
    }
  }

  return (
    <div className="flex h-full flex-col border-e border-zinc-800 bg-zinc-900/80">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-400" />
          <h2 className="text-sm font-semibold">כוחות ומשאבים</h2>
        </div>
        <Badge variant="info" size="sm">
          {units.filter((u) => u.status === UnitStatus.AVAILABLE).length}/
          {units.length}
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
            const targetName = getTargetEventName(unit);
            const config = statusConfig[unit.status] ?? {
              label: unit.status,
              variant: "neutral" as const,
            };

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
                  !isAvailable && "opacity-75",
                )}
              >
                <div className="flex items-center gap-2">
                  {/* Force icon */}
                  <span
                    className={cn(
                      "shrink-0",
                      forceColors[unit.forceType] ?? "text-zinc-400",
                    )}
                  >
                    {forceIcons[unit.forceType] ?? (
                      <CircleDot className="h-4 w-4" />
                    )}
                  </span>

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-zinc-200">
                      {unit.name}
                    </div>
                    {targetName && (
                      <div className="truncate text-xs text-zinc-500">
                        {targetName}
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <Badge variant={config.variant} size="sm">
                    {config.label}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UnitsPanel;
