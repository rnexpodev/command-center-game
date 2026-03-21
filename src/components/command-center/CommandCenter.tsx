import { useEffect } from "react";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { useTourStore } from "@/store/tour-store";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { cn } from "@/lib/utils";
import { Weather, TimeOfDay } from "@/engine/types";
import { TopBar } from "./TopBar";
import { EventsPanel } from "./EventsPanel";
import { UnitsPanel } from "./UnitsPanel";
import { CityMap } from "./CityMap";
import { EventDetail } from "./EventDetail";
import { NotificationToast } from "./NotificationToast";
import { RadioFeed } from "./RadioFeed";
import { GuidedTour } from "../tour/GuidedTour";
import { InstructorPanel } from "../training/InstructorPanel";

/** Map weather CSS class from Weather value */
const weatherClassMap: Record<Weather, string> = {
  [Weather.CLEAR]: "",
  [Weather.RAIN]: "weather-rain",
  [Weather.SANDSTORM]: "weather-sandstorm",
  [Weather.HEATWAVE]: "weather-heatwave",
};

/** Map time-of-day CSS class from TimeOfDay value */
const timeClassMap: Record<TimeOfDay, string> = {
  [TimeOfDay.DAY]: "",
  [TimeOfDay.DAWN]: "time-dawn",
  [TimeOfDay.DUSK]: "time-dusk",
  [TimeOfDay.NIGHT]: "time-night",
};

export function CommandCenter() {
  const isComplete = useGameStore((s) => s.isComplete);
  const setScreen = useUIStore((s) => s.setScreen);
  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const hasSeenTour = useTourStore((s) => s.hasSeenTour);
  const startTour = useTourStore((s) => s.startTour);
  const weather = useGameStore((s) => s.weather);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const trainingMode = useGameStore((s) => s.trainingMode);

  // Sound effects — reacts to game state changes
  useSoundEffects();

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
        <div className="w-72 shrink-0 overflow-hidden diegetic-scanlines">
          <EventsPanel />
        </div>

        {/* Map (center) with weather/time overlay */}
        <div
          className={cn(
            "min-w-0 flex-1 diegetic-grid weather-overlay",
            weatherClassMap[weather],
            timeClassMap[timeOfDay],
          )}
        >
          <CityMap />
        </div>

        {/* Units panel (left side in RTL) */}
        <div className="w-64 shrink-0 overflow-hidden diegetic-scanlines">
          <UnitsPanel />
        </div>

        {/* Radio feed (leftmost in RTL) */}
        <div className="w-56 shrink-0 overflow-hidden diegetic-scanlines">
          <RadioFeed />
        </div>

        {/* Training mode instructor panel */}
        {trainingMode && <InstructorPanel />}
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
