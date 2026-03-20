import { useEffect } from "react";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { useTourStore } from "@/store/tour-store";
import { TopBar } from "./TopBar";
import { EventsPanel } from "./EventsPanel";
import { UnitsPanel } from "./UnitsPanel";
import { CityMap } from "./CityMap";
import { EventDetail } from "./EventDetail";
import { NotificationToast } from "./NotificationToast";
import { GuidedTour } from "../tour/GuidedTour";

export function CommandCenter() {
  const isComplete = useGameStore((s) => s.isComplete);
  const setScreen = useUIStore((s) => s.setScreen);
  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const hasSeenTour = useTourStore((s) => s.hasSeenTour);
  const startTour = useTourStore((s) => s.startTour);

  // Navigate to report when scenario completes
  useEffect(() => {
    if (isComplete) {
      setScreen("report");
    }
  }, [isComplete, setScreen]);

  // Auto-start tour on first play
  useEffect(() => {
    if (!hasSeenTour) {
      // Small delay so the game UI renders first
      const timer = setTimeout(() => startTour(), 600);
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour, startTour]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-950">
      {/* Top bar */}
      <TopBar />

      {/* Main content: Events | Map | Units */}
      <div className="flex min-h-0 flex-1">
        {/* Events panel (right side in RTL) */}
        <div className="w-72 shrink-0 overflow-hidden">
          <EventsPanel />
        </div>

        {/* Map (center) */}
        <div className="min-w-0 flex-1">
          <CityMap />
        </div>

        {/* Units panel (left side in RTL) */}
        <div className="w-72 shrink-0 overflow-hidden">
          <UnitsPanel />
        </div>
      </div>

      {/* Event detail panel (bottom) */}
      {selectedEventId && <EventDetail />}

      {/* Notification toasts */}
      <NotificationToast />

      {/* Guided tour overlay */}
      <GuidedTour />
    </div>
  );
}

export default CommandCenter;
