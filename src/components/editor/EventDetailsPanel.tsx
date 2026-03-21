import { Trash2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { EventTypeSelect } from "./EventTypeSelect";
import { SeveritySelect } from "./SeveritySelect";
import type { Severity } from "@/engine/types";

export function EventDetailsPanel() {
  const waves = useEditorStore((s) => s.waves);
  const selectedWaveIndex = useEditorStore((s) => s.selectedWaveIndex);
  const removeEventFromWave = useEditorStore((s) => s.removeEventFromWave);
  const updateEventInWave = useEditorStore((s) => s.updateEventInWave);

  if (selectedWaveIndex === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-zinc-500">בחר גל לצפייה באירועים</p>
      </div>
    );
  }

  const wave = waves[selectedWaveIndex];
  if (!wave) return null;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-zinc-700 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-200">
          אירועים — גל {selectedWaveIndex + 1}
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">לחץ על המפה להוספת אירוע</p>
      </div>

      {/* Events list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {wave.events.length === 0 && (
          <p className="text-center text-xs text-zinc-500 py-8">
            לחץ על המפה כדי להוסיף אירוע לגל הזה
          </p>
        )}

        {wave.events.map((ev, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 space-y-2"
          >
            {/* Row 1: Type + remove */}
            <div className="flex items-center justify-between gap-2">
              <EventTypeSelect
                value={ev.type}
                onChange={(type) =>
                  updateEventInWave(selectedWaveIndex, idx, { type })
                }
                className="flex-1 min-w-0"
              />
              <button
                onClick={() => removeEventFromWave(selectedWaveIndex, idx)}
                className={cn(
                  "p-1.5 rounded text-zinc-500",
                  "hover:text-red-400 hover:bg-red-500/10 transition-colors",
                )}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Row 2: Severity */}
            <SeveritySelect
              value={ev.severity}
              onChange={(severity) =>
                updateEventInWave(selectedWaveIndex, idx, {
                  severity: severity as Severity,
                })
              }
            />

            {/* Row 3: Location name */}
            <input
              type="text"
              value={ev.locationName}
              onChange={(e) =>
                updateEventInWave(selectedWaveIndex, idx, {
                  locationName: e.target.value,
                })
              }
              placeholder="שם מיקום"
              className={cn(
                "w-full rounded border border-zinc-600 bg-zinc-800 px-2 py-1",
                "text-xs text-zinc-200 placeholder:text-zinc-600",
                "focus:outline-none focus:border-blue-500",
              )}
            />

            {/* Row 4: Position display */}
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <MapPin className="h-3 w-3" />
              <span>
                {ev.position[0].toFixed(4)}, {ev.position[1].toFixed(4)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
