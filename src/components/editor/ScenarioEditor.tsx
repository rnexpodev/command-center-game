import { EditorTopBar } from "./EditorTopBar";
import { EditorBottomBar } from "./EditorBottomBar";
import { WaveListPanel } from "./WaveListPanel";
import { EventDetailsPanel } from "./EventDetailsPanel";
import { EditorMap } from "./EditorMap";
import { SavedScenariosPanel } from "./SavedScenariosPanel";

export function ScenarioEditor() {
  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      {/* Top bar */}
      <EditorTopBar />

      {/* Main content: 3-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* RTL: Right panel = Wave list */}
        <div className="w-64 shrink-0 border-l border-zinc-700 bg-zinc-900/50 flex flex-col">
          <div className="flex-1 min-h-0">
            <WaveListPanel />
          </div>
          <SavedScenariosPanel />
        </div>

        {/* Center: Map */}
        <div className="flex-1 relative min-w-0">
          <EditorMap />
        </div>

        {/* RTL: Left panel = Event details */}
        <div className="w-72 shrink-0 border-r border-zinc-700 bg-zinc-900/50">
          <EventDetailsPanel />
        </div>
      </div>

      {/* Bottom bar */}
      <EditorBottomBar />
    </div>
  );
}

export default ScenarioEditor;
