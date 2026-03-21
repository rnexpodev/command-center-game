import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { formatGameTime } from "@/lib/utils";

export function WaveListPanel() {
  const waves = useEditorStore((s) => s.waves);
  const selectedWaveIndex = useEditorStore((s) => s.selectedWaveIndex);
  const selectWave = useEditorStore((s) => s.selectWave);
  const addWave = useEditorStore((s) => s.addWave);
  const removeWave = useEditorStore((s) => s.removeWave);
  const setWaveTick = useEditorStore((s) => s.setWaveTick);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-200">גלים</h3>
        <button
          onClick={addWave}
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-1 text-xs",
            "bg-blue-500/20 text-blue-400 border border-blue-500/40",
            "hover:bg-blue-500/30 transition-colors",
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          הוסף גל
        </button>
      </div>

      {/* Wave list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {waves.length === 0 && (
          <p className="text-center text-xs text-zinc-500 py-8">
            אין גלים. הוסף גל ראשון.
          </p>
        )}

        {waves.map((wave, index) => {
          const isSelected = selectedWaveIndex === index;
          return (
            <div
              key={index}
              onClick={() => selectWave(index)}
              className={cn(
                "rounded-lg border p-3 cursor-pointer transition-all",
                isSelected
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600",
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-200">
                  גל {index + 1}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWave(index);
                  }}
                  className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Tick input */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-400">טיק:</label>
                <input
                  type="number"
                  min={1}
                  value={wave.tick}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    setWaveTick(index, Math.max(1, Number(e.target.value)))
                  }
                  className={cn(
                    "w-16 rounded border border-zinc-600 bg-zinc-800 px-2 py-0.5",
                    "text-xs text-zinc-200 text-center",
                    "focus:outline-none focus:border-blue-500",
                  )}
                />
                <span className="text-xs text-zinc-500">
                  ({formatGameTime(wave.tick)})
                </span>
              </div>

              {/* Event count */}
              <div className="mt-1.5 text-xs text-zinc-400">
                {wave.events.length} אירועים
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
