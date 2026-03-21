import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCareerStore } from "@/store/career-store";
import { useUIStore } from "@/store/ui-store";
import { CareerStatsPanel } from "./CareerStatsPanel";
import { AchievementGrid } from "./AchievementGrid";
import { BestGradesTable } from "./BestGradesTable";

export function CareerDashboard() {
  const setScreen = useUIStore((s) => s.setScreen);
  const totalScenariosPlayed = useCareerStore((s) => s.totalScenariosPlayed);

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-10 overflow-y-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-zinc-100">קריירת מפקד</h1>
        <p className="text-sm text-zinc-400">סטטיסטיקות והישגים</p>
      </div>

      {/* Stats summary */}
      <CareerStatsPanel />

      {/* Achievement grid */}
      <AchievementGrid />

      {/* Best grades table */}
      {totalScenariosPlayed > 0 && <BestGradesTable />}

      {/* Back button */}
      <button
        onClick={() => setScreen("menu")}
        className={cn(
          "mt-8 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3",
          "text-sm font-semibold text-zinc-300 transition-colors",
          "hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
        )}
      >
        <ArrowRight className="h-4 w-4" />
        חזרה לתפריט
      </button>
    </div>
  );
}
