import { CheckCircle2, XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { gradePassesRequirement } from "@/data/campaign";
import type { CampaignScenario } from "@/data/campaign";

interface CampaignResultOverlayProps {
  scenario: CampaignScenario;
  grade: string;
  score: number;
  missionNumber: number;
  totalMissions: number;
  isLastMission: boolean;
  onContinue: () => void;
  onRetry: () => void;
}

const gradeColors: Record<string, string> = {
  S: "text-yellow-400",
  A: "text-green-400",
  B: "text-blue-400",
  C: "text-zinc-200",
  D: "text-orange-400",
  F: "text-red-400",
};

export function CampaignResultOverlay({
  scenario,
  grade,
  score,
  missionNumber,
  totalMissions,
  isLastMission,
  onContinue,
  onRetry,
}: CampaignResultOverlayProps) {
  const passed = gradePassesRequirement(grade, scenario.requiredGrade);

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-700/50 bg-zinc-900/95 p-8 text-center">
      {/* Pass/Fail indicator */}
      {passed ? (
        <CheckCircle2 className="h-12 w-12 text-green-400" />
      ) : (
        <XCircle className="h-12 w-12 text-red-400" />
      )}

      <h2 className="text-2xl font-bold text-zinc-100">
        {passed ? "משימה הושלמה!" : "משימה נכשלה"}
      </h2>

      {/* Grade + Score */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-xs text-zinc-500">ציון</p>
          <p className={cn("text-4xl font-bold", gradeColors[grade])}>
            {grade}
          </p>
        </div>
        <div className="h-10 w-px bg-zinc-700" />
        <div className="text-center">
          <p className="text-xs text-zinc-500">נקודות</p>
          <p className="text-2xl font-semibold text-zinc-200">{score}</p>
        </div>
      </div>

      {/* Requirement */}
      <p className="text-sm text-zinc-400">
        ציון מינימלי להתקדם:{" "}
        <Badge variant={passed ? "success" : "danger"}>
          {scenario.requiredGrade}
        </Badge>
      </p>

      {/* Rewards */}
      {passed &&
        (scenario.rewards.bonusUnits || scenario.rewards.budgetBonus) && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2">
            <p className="text-sm font-medium text-amber-300">
              {scenario.rewards.bonusUnits
                ? `+${scenario.rewards.bonusUnits} יחידות בונוס`
                : ""}
              {scenario.rewards.bonusUnits && scenario.rewards.budgetBonus
                ? " | "
                : ""}
              {scenario.rewards.budgetBonus
                ? `+${scenario.rewards.budgetBonus} תקציב`
                : ""}
            </p>
          </div>
        )}

      {/* Progress */}
      <p className="text-xs text-zinc-500">
        {missionNumber} / {totalMissions} משימות
      </p>

      {/* Action buttons */}
      <div className="flex gap-3">
        {passed && !isLastMission && (
          <button
            onClick={onContinue}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-green-500/50",
              "bg-green-500/20 px-6 py-3 text-sm font-bold text-green-300",
              "transition-all hover:bg-green-500/30",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            המשך למשימה הבאה
          </button>
        )}
        {passed && isLastMission && (
          <button
            onClick={onContinue}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-yellow-500/50",
              "bg-yellow-500/20 px-6 py-3 text-sm font-bold text-yellow-300",
              "transition-all hover:bg-yellow-500/30",
            )}
          >
            סיום מבצע
          </button>
        )}
        {!passed && (
          <button
            onClick={onRetry}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-blue-500/50",
              "bg-blue-500/20 px-6 py-3 text-sm font-bold text-blue-300",
              "transition-all hover:bg-blue-500/30",
            )}
          >
            <RotateCcw className="h-4 w-4" />
            נסה שוב
          </button>
        )}
      </div>
    </div>
  );
}
