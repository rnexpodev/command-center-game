import { useState } from "react";
import { Shield, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { useGameStore } from "@/store/game-store";
import { useCampaignStore } from "@/store/campaign-store";
import { ALL_SCENARIOS } from "@/data/scenarios";
import { CAMPAIGN_BEER_SHEVA_SHIELD } from "@/data/campaign";
import { TimelineItem } from "./TimelineItem";
import { BriefingModal } from "./BriefingModal";

function getScenarioStatus(
  index: number,
  currentIndex: number,
  isUnlocked: boolean,
): "completed" | "current" | "locked" {
  if (index < currentIndex && isUnlocked) return "completed";
  if (index === currentIndex) return "current";
  return "locked";
}

export function CampaignSelect() {
  const [showBriefing, setShowBriefing] = useState(false);
  const setScreen = useUIStore((s) => s.setScreen);
  const startScenario = useGameStore((s) => s.startScenario);
  const campaign = CAMPAIGN_BEER_SHEVA_SHIELD;
  const currentIndex = useCampaignStore((s) => s.currentScenarioIndex);
  const completedScenarios = useCampaignStore((s) => s.completedScenarios);
  const isUnlocked = useCampaignStore((s) => s.isScenarioUnlocked);
  const startCampaign = useCampaignStore((s) => s.startCampaign);
  const activeCampaignId = useCampaignStore((s) => s.activeCampaignId);
  const resetCampaign = useCampaignStore((s) => s.resetCampaign);

  const currentCS = campaign.scenarios[currentIndex];
  const isFinished = currentIndex >= campaign.scenarios.length;

  function handleStartMission() {
    if (!activeCampaignId) startCampaign(campaign.id);
    setShowBriefing(true);
  }

  function handleBriefingStart() {
    if (!currentCS) return;
    const scenario = ALL_SCENARIOS.find((s) => s.id === currentCS.scenarioId);
    if (!scenario) return;
    setShowBriefing(false);
    startScenario(scenario);
    setScreen("game");
  }

  function handleReset() {
    resetCampaign();
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-12 overflow-y-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <Shield className="mx-auto mb-4 h-10 w-10 text-amber-400" />
        <h1 className="mb-2 text-3xl font-bold text-zinc-100">
          {campaign.nameHe}
        </h1>
        <p className="max-w-md text-zinc-400">{campaign.descriptionHe}</p>
      </div>

      {/* Timeline */}
      <div className="w-full max-w-xl">
        {campaign.scenarios.map((cs, i) => {
          const status = getScenarioStatus(i, currentIndex, isUnlocked(i));
          const result = completedScenarios[cs.id];
          return (
            <TimelineItem
              key={cs.id}
              scenario={cs}
              index={i}
              status={status}
              grade={result?.grade}
              score={result?.score}
              isLast={i === campaign.scenarios.length - 1}
            />
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        {!isFinished && (
          <button
            onClick={handleStartMission}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-amber-500/50",
              "bg-amber-500/20 px-6 py-3 text-sm font-bold text-amber-300",
              "transition-all hover:bg-amber-500/30 hover:border-amber-400",
            )}
          >
            <ArrowRight className="h-4 w-4" />
            התחל משימה
          </button>
        )}
        {isFinished && (
          <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-6 py-3 text-center">
            <p className="font-bold text-green-400">מבצע הושלם בהצלחה!</p>
          </div>
        )}
        <button
          onClick={() => setScreen("menu")}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-zinc-700",
            "bg-zinc-800 px-6 py-3 text-sm font-semibold text-zinc-300",
            "transition-colors hover:bg-zinc-700",
          )}
        >
          חזור לתפריט
        </button>
        {activeCampaignId && (
          <button
            onClick={handleReset}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-red-500/30",
              "bg-red-500/10 px-4 py-3 text-sm text-red-400",
              "transition-colors hover:bg-red-500/20",
            )}
          >
            <RotateCcw className="h-4 w-4" />
            אפס
          </button>
        )}
      </div>

      {/* Briefing modal */}
      {showBriefing && currentCS && (
        <BriefingModal
          scenarioName={currentCS.nameHe}
          briefingText={currentCS.briefingHe}
          missionNumber={currentIndex + 1}
          totalMissions={campaign.scenarios.length}
          onStart={handleBriefingStart}
        />
      )}
    </div>
  );
}
