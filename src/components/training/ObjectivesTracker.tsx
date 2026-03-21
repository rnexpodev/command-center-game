import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { TRAINING_OBJECTIVES, type TrainingObjective } from "@/engine/training";

function ObjectiveRow({ objective }: { objective: TrainingObjective }) {
  const state = useGameStore();
  const isComplete = objective.check(state);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-2 py-1.5 transition-all",
        isComplete ? "bg-emerald-900/20" : "bg-zinc-800/50",
      )}
    >
      <div
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
          isComplete
            ? "bg-emerald-500/30 text-emerald-400"
            : "bg-zinc-700 text-zinc-500",
        )}
      >
        {isComplete ? (
          <Check className="h-3 w-3" />
        ) : (
          <Circle className="h-3 w-3" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-xs font-medium",
            isComplete ? "text-emerald-300" : "text-zinc-300",
          )}
        >
          {objective.nameHe}
        </p>
        <p className="text-[10px] text-zinc-500">{objective.descriptionHe}</p>
      </div>
    </div>
  );
}

export function ObjectivesTracker() {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        יעדי אימון
      </h3>
      <div className="space-y-1">
        {TRAINING_OBJECTIVES.map((objective) => (
          <ObjectiveRow key={objective.id} objective={objective} />
        ))}
      </div>
    </div>
  );
}
