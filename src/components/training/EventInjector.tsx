import { useState } from "react";
import { MapPin, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { EventType, Severity, type Position } from "@/engine/types";
import { EVENT_TYPE_INFO } from "@/data/event-types";
import { useUIStore } from "@/store/ui-store";

/** All non-missile event types for the dropdown */
const STANDARD_EVENT_TYPES = [
  EventType.BUILDING_FIRE,
  EventType.BUILDING_COLLAPSE,
  EventType.TRAFFIC_ACCIDENT,
  EventType.GAS_LEAK,
  EventType.POWER_OUTAGE,
  EventType.ROAD_BLOCKAGE,
  EventType.HAZMAT,
  EventType.FLOODING,
  EventType.MASS_CASUALTY,
  EventType.EVACUATION_NEEDED,
] as const;

const SEVERITY_OPTIONS = [
  { value: Severity.LOW, label: "נמוכה", color: "bg-blue-500" },
  { value: Severity.MEDIUM, label: "בינונית", color: "bg-yellow-500" },
  { value: Severity.HIGH, label: "גבוהה", color: "bg-orange-500" },
  { value: Severity.CRITICAL, label: "קריטית", color: "bg-red-500" },
] as const;

/** Shared state for map-click injection mode */
let pendingInjection: {
  type: EventType;
  severity: Severity;
} | null = null;

export function getPendingInjection() {
  return pendingInjection;
}

export function clearPendingInjection() {
  pendingInjection = null;
}

export function EventInjector() {
  const injectEvent = useGameStore((s) => s.injectEvent);
  const [selectedType, setSelectedType] = useState<EventType>(
    EventType.BUILDING_FIRE,
  );
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>(
    Severity.MEDIUM,
  );
  const [mapClickMode, setMapClickMode] = useState(false);

  function handleActivateMapClick() {
    pendingInjection = {
      type: selectedType,
      severity: selectedSeverity,
    };
    setMapClickMode(true);
  }

  function handleQuickInject() {
    // Place at random Beer Sheva location
    const pos: Position = {
      x: 31.245 + Math.random() * 0.02,
      y: 34.78 + Math.random() * 0.02,
    };
    injectEvent(selectedType, pos, selectedSeverity);
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        הזרקת אירוע
      </h3>

      {/* Event type selector */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as EventType)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-200"
      >
        {STANDARD_EVENT_TYPES.map((type) => (
          <option key={type} value={type}>
            {EVENT_TYPE_INFO[type].nameHe}
          </option>
        ))}
      </select>

      {/* Severity selector */}
      <div className="flex gap-1">
        {SEVERITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedSeverity(opt.value)}
            className={cn(
              "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-all",
              selectedSeverity === opt.value
                ? `${opt.color} text-white`
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleActivateMapClick}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all",
            mapClickMode
              ? "bg-amber-500/30 text-amber-300 border border-amber-500/50"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
          )}
        >
          <MapPin className="h-3.5 w-3.5" />
          {mapClickMode ? "לחץ על המפה..." : "מקם במפה"}
        </button>
        <button
          onClick={handleQuickInject}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-emerald-600/30 px-3 py-2 text-xs font-medium text-emerald-300 transition-all hover:bg-emerald-600/50"
        >
          <Plus className="h-3.5 w-3.5" />
          הוסף מהיר
        </button>
      </div>

      {mapClickMode && (
        <p className="text-center text-xs text-amber-400/80">
          לחץ על המפה כדי למקם את האירוע
        </p>
      )}
    </div>
  );
}
