import {
  Trophy,
  RotateCcw,
  Home,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  Users,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";

const gradeColors: Record<string, string> = {
  S: "text-yellow-300 border-yellow-400/60 bg-yellow-500/10",
  A: "text-green-400 border-green-400/60 bg-green-500/10",
  B: "text-blue-400 border-blue-400/60 bg-blue-500/10",
  C: "text-orange-400 border-orange-400/60 bg-orange-500/10",
  D: "text-red-400 border-red-400/60 bg-red-500/10",
  F: "text-red-500 border-red-500/60 bg-red-500/10",
};

const gradeLabels: Record<string, string> = {
  S: "מצטיין",
  A: "מעולה",
  B: "טוב",
  C: "סביר",
  D: "חלש",
  F: "נכשל",
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
      <span className={color}>{icon}</span>
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-2xl font-bold text-zinc-100">{value}</span>
    </div>
  );
}

export function PostGameReport() {
  const score = useGameStore((s) => s.score);
  const reset = useGameStore((s) => s.reset);
  const setScreen = useUIStore((s) => s.setScreen);
  const activeScenario = useGameStore((s) => s.activeScenario);

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-8">
      {/* Title */}
      <div className="mb-8 text-center">
        <Trophy className="mx-auto mb-4 h-10 w-10 text-yellow-400" />
        <h1 className="mb-2 text-3xl font-bold text-zinc-100">סיכום משימה</h1>
        {activeScenario && (
          <p className="text-zinc-400">{activeScenario.name}</p>
        )}
      </div>

      {/* Grade */}
      <div
        className={cn(
          "mb-10 flex h-32 w-32 items-center justify-center rounded-2xl border-2",
          gradeColors[score.grade] ?? gradeColors.F,
        )}
      >
        <div className="text-center">
          <div className="text-6xl font-extrabold">{score.grade}</div>
          <div className="text-sm font-medium opacity-80">
            {gradeLabels[score.grade] ?? ""}
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="mb-10 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={<Clock className="h-6 w-6" />}
          label="זמן תגובה ממוצע"
          value={`${Math.round(score.responseTime)} דק׳`}
          color="text-blue-400"
        />
        <MetricCard
          icon={<Target className="h-6 w-6" />}
          label="שיעור ייצוב"
          value={`${Math.round(score.stabilizationRate)}%`}
          color="text-green-400"
        />
        <MetricCard
          icon={<TrendingUp className="h-6 w-6" />}
          label="אירועים שטופלו"
          value={score.eventsResolved}
          color="text-cyan-400"
        />
        <MetricCard
          icon={<AlertTriangle className="h-6 w-6" />}
          label="אירועים שהוחמרו"
          value={score.eventsEscalated}
          color="text-orange-400"
        />
        <MetricCard
          icon={<Users className="h-6 w-6" />}
          label="ניצול משאבים"
          value={`${Math.round(score.resourceEfficiency)}%`}
          color="text-purple-400"
        />
        <MetricCard
          icon={<Award className="h-6 w-6" />}
          label="ניקוד כולל"
          value={Math.round(score.totalScore)}
          color="text-yellow-400"
        />
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
