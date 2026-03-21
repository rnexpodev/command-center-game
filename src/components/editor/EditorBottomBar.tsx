import { Play, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore, buildScenario } from "@/store/editor-store";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";

export function EditorBottomBar() {
  const editorState = useEditorStore();
  const startScenario = useGameStore((s) => s.startScenario);
  const setScreen = useUIStore((s) => s.setScreen);

  const totalEvents = editorState.waves.reduce(
    (sum, w) => sum + w.events.length,
    0,
  );
  const canPlay = totalEvents > 0;

  function handlePlay() {
    if (!canPlay) return;
    const scenario = buildScenario(editorState);
    startScenario(scenario);
    setScreen("game");
  }

  function handleCancel() {
    setScreen("menu");
  }

  return (
    <div className="flex items-center justify-between border-t border-zinc-700 bg-zinc-900/80 px-4 py-2.5">
      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-zinc-400">
        <span>{editorState.waves.length} גלים</span>
        <span>{totalEvents} אירועים</span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCancel}
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm",
            "border-zinc-600 text-zinc-400 hover:bg-zinc-800 transition-colors",
          )}
        >
          <ArrowRight className="h-4 w-4" />
          חזרה לתפריט
        </button>

        <button
          onClick={handlePlay}
          disabled={!canPlay}
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium",
            "transition-colors",
            canPlay
              ? "border-green-500/40 bg-green-500/20 text-green-400 hover:bg-green-500/30"
              : "border-zinc-700 bg-zinc-800 text-zinc-600 cursor-not-allowed",
          )}
        >
          <Play className="h-4 w-4" />
          הפעל תרחיש
        </button>
      </div>
    </div>
  );
}
