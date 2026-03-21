import { cn } from "@/lib/utils";
import { ACHIEVEMENTS, AchievementCategory } from "@/data/achievements";
import type { AchievementDef } from "@/data/achievements";
import { useCareerStore } from "@/store/career-store";
import { AchievementIcon } from "@/components/achievements/AchievementIcon";
import { Lock } from "lucide-react";

const categoryLabels: Record<AchievementCategory, string> = {
  [AchievementCategory.PERFORMANCE]: "ביצועים",
  [AchievementCategory.SPEED]: "מהירות",
  [AchievementCategory.MASTERY]: "שליטה",
  [AchievementCategory.MILESTONE]: "ציוני דרך",
};

const categoryOrder: AchievementCategory[] = [
  AchievementCategory.MILESTONE,
  AchievementCategory.PERFORMANCE,
  AchievementCategory.SPEED,
  AchievementCategory.MASTERY,
];

function AchievementCard({
  def,
  unlocked,
}: {
  def: AchievementDef;
  unlocked: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
        unlocked
          ? "border-yellow-600/50 bg-yellow-500/5"
          : "border-zinc-800 bg-zinc-900/50 opacity-50",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          unlocked
            ? "border border-yellow-500/40 bg-yellow-500/10"
            : "border border-zinc-700 bg-zinc-800",
        )}
      >
        {unlocked ? (
          <AchievementIcon
            name={def.icon}
            className="h-4 w-4 text-yellow-400"
          />
        ) : (
          <Lock className="h-4 w-4 text-zinc-600" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold",
            unlocked ? "text-yellow-300" : "text-zinc-500",
          )}
        >
          {def.nameHe}
        </p>
        <p className="text-xs text-zinc-500 leading-tight">
          {def.descriptionHe}
        </p>
      </div>
    </div>
  );
}

export function AchievementGrid() {
  const unlocked = useCareerStore((s) => s.unlockedAchievements);
  const unlockedSet = new Set(unlocked);

  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    achievements: ACHIEVEMENTS.filter((a) => a.category === cat),
  }));

  return (
    <div className="mb-8 w-full max-w-2xl space-y-6">
      <h2 className="text-lg font-bold text-zinc-200">הישגים</h2>
      {grouped.map(({ category, label, achievements }) => (
        <div key={category}>
          <h3 className="mb-3 text-sm font-semibold text-zinc-400">{label}</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {achievements.map((def) => (
              <AchievementCard
                key={def.id}
                def={def}
                unlocked={unlockedSet.has(def.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
