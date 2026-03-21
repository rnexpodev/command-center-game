import {
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  Users,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";

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

export function SummaryView() {
  const score = useGameStore((s) => s.score);

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-10">
      {/* Grade */}
      <div
        className={cn(
          "flex h-32 w-32 items-center justify-center rounded-2xl border-2",
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
      <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
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
    </div>
  );
}
