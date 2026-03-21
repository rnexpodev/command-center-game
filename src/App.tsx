import { useUIStore } from "@/store/ui-store";
import { ScenarioSelect } from "@/components/scenarios/ScenarioSelect";
import { CommandCenter } from "@/components/command-center/CommandCenter";
import { PostGameReport } from "@/components/post-game/PostGameReport";
import { TutorialPage } from "@/components/tutorial/TutorialPage";
import { CareerDashboard } from "@/components/career/CareerDashboard";
import { CampaignSelect } from "@/components/campaign/CampaignSelect";
import { ScenarioEditor } from "@/components/editor/ScenarioEditor";
import { AchievementPopup } from "@/components/achievements/AchievementPopup";

function App() {
  const screen = useUIStore((s) => s.screen);

  return (
    <div
      className={`w-screen bg-zinc-950 text-zinc-100 ${screen === "game" || screen === "editor" ? "h-screen overflow-hidden" : "min-h-screen overflow-y-auto"}`}
    >
      {screen === "menu" && <ScenarioSelect />}
      {screen === "game" && <CommandCenter />}
      {screen === "report" && <PostGameReport />}
      {screen === "tutorial" && <TutorialPage />}
      {screen === "career" && <CareerDashboard />}
      {screen === "campaign" && <CampaignSelect />}
      {screen === "editor" && <ScenarioEditor />}
      <AchievementPopup />
    </div>
  );
}

export default App;
