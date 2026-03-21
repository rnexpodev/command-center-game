import { useState, useEffect, useRef } from "react";
import { Trophy, Film, BarChart3, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { useCareerStore } from "@/store/career-store";
import { useCampaignStore } from "@/store/campaign-store";
import { SummaryView } from "./summary-view";
import { ReplayView } from "./ReplayView";
import { AnalyticsView } from "./AnalyticsView";
import { ReportActions } from "./ReportActions";
import { CampaignResultOverlay } from "../campaign/CampaignResultOverlay";
import { buildGameResult } from "@/engine/result-builder";
import { ALL_SCENARIOS } from "@/data/scenarios";

type Tab = "summary" | "replay" | "analytics";

const tabs: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: "summary", label: "סיכום", icon: BarChart3 },
  { id: "analytics", label: "ניתוח", icon: Activity },
  { id: "replay", label: "הקלטה", icon: Film },
];

export function PostGameReport() {
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const reset = useGameStore((s) => s.reset);
  const score = useGameStore((s) => s.score);
  const setScreen = useUIStore((s) => s.setScreen);
  const activeScenario = useGameStore((s) => s.activeScenario);
  const recordGameResult = useCareerStore((s) => s.recordGameResult);
  const hasRecorded = useRef(false);

  const activeCampaignId = useCampaignStore((s) => s.activeCampaignId);
  const getCurrentScenario = useCampaignStore((s) => s.getCurrentScenario);
  const getActiveCampaign = useCampaignStore((s) => s.getActiveCampaign);
  const currentIndex = useCampaignStore((s) => s.currentScenarioIndex);
  const recordCampaignResult = useCampaignStore((s) => s.recordResult);
  const advanceToNext = useCampaignStore((s) => s.advanceToNext);

  const campaignScenario = activeCampaignId ? getCurrentScenario() : null;
  const campaign = activeCampaignId ? getActiveCampaign() : null;

  useEffect(() => {
    if (hasRecorded.current) return;
    hasRecorded.current = true;
    const state = useGameStore.getState();
    if (!state.activeScenario) return;
    const result = buildGameResult(state);
    recordGameResult(result);
    if (campaignScenario) {
      recordCampaignResult(
        campaignScenario.id,
        state.score.grade,
        state.score.totalScore,
      );
    }
  }, [recordGameResult, campaignScenario, recordCampaignResult]);

  function handlePlayAgain() {
    if (!activeScenario) return;
    const scenario = activeScenario;
    reset();
    useGameStore.getState().startScenario(scenario);
    setScreen("game");
  }

  function handleCampaignContinue() {
    advanceToNext();
    reset();
    setScreen("campaign");
  }

  function handleCampaignRetry() {
    if (!campaignScenario) return;
    const scenario = ALL_SCENARIOS.find(
      (s) => s.id === campaignScenario.scenarioId,
    );
    if (!scenario) return;
    reset();
    useGameStore.getState().startScenario(scenario);
    setScreen("game");
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-8">
      <div className="mb-6 text-center">
        <Trophy className="mx-auto mb-4 h-10 w-10 text-yellow-400" />
        <h1 className="mb-2 text-3xl font-bold text-zinc-100">סיכום משימה</h1>
        {activeScenario && (
          <p className="text-zinc-400">{activeScenario.name}</p>
        )}
      </div>

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

      <div className="mb-10 w-full flex justify-center">
        {activeTab === "summary" && <SummaryView />}
        {activeTab === "analytics" && <AnalyticsView />}
        {activeTab === "replay" && <ReplayView />}
      </div>

      {campaignScenario && campaign ? (
        <div className="mb-8">
          <CampaignResultOverlay
            scenario={campaignScenario}
            grade={score.grade}
            score={score.totalScore}
            missionNumber={currentIndex + 1}
            totalMissions={campaign.scenarios.length}
            isLastMission={currentIndex >= campaign.scenarios.length - 1}
            onContinue={handleCampaignContinue}
            onRetry={handleCampaignRetry}
          />
        </div>
      ) : (
        <ReportActions
          onPlayAgain={handlePlayAgain}
          onBackToMenu={() => {
            reset();
            setScreen("menu");
          }}
        />
      )}
    </div>
  );
}

export default PostGameReport;
