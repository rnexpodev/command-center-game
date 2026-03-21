import { useState, useEffect, useRef } from "react";
import { Trophy, RotateCcw, Home, Film, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { useCareerStore } from "@/store/career-store";
import { SummaryView } from "./summary-view";
import { ReplayView } from "./ReplayView";
import { buildGameResult } from "@/engine/result-builder";

type Tab = "summary" | "replay";

export function PostGameReport() {
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const reset = useGameStore((s) => s.reset);
  const setScreen = useUIStore((s) => s.setScreen);
  const activeScenario = useGameStore((s) => s.activeScenario);
  const recordGameResult = useCareerStore((s) => s.recordGameResult);
  const hasRecorded = useRef(false);

  // Record career stats once when report screen mounts
  useEffect(() => {
    if (hasRecorded.current) return;
    hasRecorded.current = true;
    const state = useGameStore.getState();
    if (!state.activeScenario) return;
    const result = buildGameResult(state);
    recordGameResult(result);
  }, [recordGameResult]);

  function handlePlayAgain() {
    if (activeScenario) {
      const scenario = activeScenario;
      reset();
      const startScenario = useGameStore.getState().startScenario;
      startScenario(scenario);
      setScreen("game");
    }
  }

  function handleBackToMenu() {
    reset();
    setScreen("menu");
  }

  const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
    { id: "summary", label: "סיכום", icon: BarChart3 },
    { id: "replay", label: "הקלטה", icon: Film },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-8">
      {/* Title */}
      <div className="mb-6 text-center">
        <Trophy className="mx-auto mb-4 h-10 w-10 text-yellow-400" />
        <h1 className="mb-2 text-3xl font-bold text-zinc-100">סיכום משימה</h1>
        {activeScenario && (
          <p className="text-zinc-400">{activeScenario.name}</p>
        )}
      </div>

      {/* Tab bar */}
      <div className="mb-8 flex gap-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mb-10 w-full flex justify-center">
        {activeTab === "summary" && <SummaryView />}
        {activeTab === "replay" && <ReplayView />}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={handlePlayAgain}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/20 px-6 py-3",
            "text-sm font-semibold text-blue-300 transition-colors",
            "hover:bg-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          )}
        >
          <RotateCcw className="h-4 w-4" />
          שחק שוב
        </button>
        <button
          onClick={handleBackToMenu}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3",
            "text-sm font-semibold text-zinc-300 transition-colors",
            "hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
          )}
        >
          <Home className="h-4 w-4" />
          חזרה לתפריט
        </button>
      </div>
    </div>
  );
}

export default PostGameReport;
