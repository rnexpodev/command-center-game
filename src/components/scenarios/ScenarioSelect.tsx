import { Shield, AlertTriangle, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Badge,
  difficultyToVariant,
  difficultyToLabel,
} from "@/components/ui/Badge";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { ALL_SCENARIOS } from "@/data/scenarios";
import type { Scenario, Difficulty } from "@/engine/types";

const difficultyBorderColor: Record<string, string> = {
  tutorial: "border-blue-500/60 hover:border-blue-400",
  easy: "border-green-500/60 hover:border-green-400",
  medium: "border-orange-500/60 hover:border-orange-400",
  hard: "border-red-500/60 hover:border-red-400",
};

const difficultyIcon: Record<string, React.ReactNode> = {
  tutorial: <Shield className="h-8 w-8 text-blue-400" />,
  easy: <Zap className="h-8 w-8 text-green-400" />,
  medium: <AlertTriangle className="h-8 w-8 text-orange-400" />,
  hard: <Flame className="h-8 w-8 text-red-400" />,
};

function countEvents(scenario: Scenario): number {
  return scenario.waves.reduce((sum, w) => sum + w.events.length, 0);
}

export function ScenarioSelect() {
  const startScenario = useGameStore((s) => s.startScenario);
  const setScreen = useUIStore((s) => s.setScreen);

  function handleSelect(scenario: Scenario) {
    startScenario(scenario);
    setScreen("game");
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-12 overflow-y-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-100">
          חמ&quot;ל עירוני — סימולטור ניהול חירום
        </h1>
        <p className="text-lg text-zinc-400">בחר תרחיש</p>
      </div>

      {/* Scenario grid */}
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
        {ALL_SCENARIOS.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleSelect(scenario)}
            className={cn(
              "group flex flex-col gap-4 rounded-xl border-2 bg-zinc-900/80 p-6 text-start",
              "transition-all duration-200 hover:bg-zinc-800/80 hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              difficultyBorderColor[scenario.difficulty] ?? "border-zinc-700",
            )}
          >
            {/* Icon + Title row */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 rounded-lg bg-zinc-800 p-3 group-hover:bg-zinc-700">
                {difficultyIcon[scenario.difficulty] ?? (
                  <Shield className="h-8 w-8 text-zinc-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="mb-1 text-xl font-semibold text-zinc-100">
                  {scenario.name}
                </h2>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {scenario.description}
                </p>
              </div>
            </div>

            {/* Footer: badges */}
            <div className="flex items-center gap-3">
              <Badge
                variant={difficultyToVariant(scenario.difficulty as Difficulty)}
              >
                {difficultyToLabel(scenario.difficulty as Difficulty)}
              </Badge>
              <Badge variant="neutral">{countEvents(scenario)} אירועים</Badge>
            </div>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {ALL_SCENARIOS.length === 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">טוען תרחישים...</p>
        </div>
      )}
    </div>
  );
}

export default ScenarioSelect;
