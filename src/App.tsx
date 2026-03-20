import { useUIStore } from "@/store/ui-store";
import { ScenarioSelect } from "@/components/scenarios/ScenarioSelect";
import { CommandCenter } from "@/components/command-center/CommandCenter";
import { PostGameReport } from "@/components/post-game/PostGameReport";

function App() {
  const screen = useUIStore((s) => s.screen);

  return (
    <div className="h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {screen === "menu" && <ScenarioSelect />}
      {screen === "game" && <CommandCenter />}
      {screen === "report" && <PostGameReport />}
    </div>
  );
}

export default App;
