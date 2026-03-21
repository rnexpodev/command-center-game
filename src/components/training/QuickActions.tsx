import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";

export function QuickActions() {
  const addTrainingUnits = useGameStore((s) => s.addTrainingUnits);
  const clearAllEvents = useGameStore((s) => s.clearAllEvents);

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        פעולות מהירות
      </h3>
      <div className="flex gap-2">
        <button
          onClick={addTrainingUnits}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md",
            "bg-blue-600/20 px-3 py-2 text-xs font-medium text-blue-300",
            "transition-all hover:bg-blue-600/40 border border-blue-500/30",
          )}
        >
          <Plus className="h-3.5 w-3.5" />
          הוסף 5 יחידות
        </button>
        <button
          onClick={clearAllEvents}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md",
            "bg-red-600/20 px-3 py-2 text-xs font-medium text-red-300",
            "transition-all hover:bg-red-600/40 border border-red-500/30",
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
          הסר כל האירועים
        </button>
      </div>
    </div>
  );
}
