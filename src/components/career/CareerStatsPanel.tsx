import { Target, Gamepad2, Clock, Trophy } from "lucide-react";
import { useCareerStore } from "@/store/career-store";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <span className="text-yellow-400">{icon}</span>
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xl font-bold text-zinc-100">{value}</span>
    </div>
  );
}

function formatPlayTime(ticks: number): string {
  const hours = Math.floor(ticks / 3600);
  const minutes = Math.floor((ticks % 3600) / 60);
  if (hours > 0) return `${hours} שעות ${minutes} דק׳`;
  return `${minutes} דק׳`;
}

export function CareerStatsPanel() {
  const totalEventsResolved = useCareerStore((s) => s.totalEventsResolved);
  const totalScenariosPlayed = useCareerStore((s) => s.totalScenariosPlayed);
  const totalPlayTimeTicks = useCareerStore((s) => s.totalPlayTimeTicks);
  const unlockedCount = useCareerStore((s) => s.unlockedAchievements.length);

  return (
    <div className="mb-8 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard
        icon={<Target className="h-5 w-5" />}
        label="אירועים שטופלו"
        value={totalEventsResolved}
      />
      <StatCard
        icon={<Gamepad2 className="h-5 w-5" />}
        label="תרחישים"
        value={totalScenariosPlayed}
      />
      <StatCard
        icon={<Clock className="h-5 w-5" />}
        label="זמן משחק"
        value={formatPlayTime(totalPlayTimeTicks)}
      />
      <StatCard
        icon={<Trophy className="h-5 w-5" />}
        label="הישגים"
        value={unlockedCount}
      />
    </div>
  );
}
