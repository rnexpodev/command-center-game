import { useMemo } from "react";
import { useGameStore } from "@/store/game-store";
import { gameRecorder } from "@/engine/recorder";
import { computeAnalytics } from "@/engine/analytics";
import { AnalyticsMetrics } from "./analytics-metrics";
import { ResponseTimeChart } from "./response-time-chart";
import { EventsByType } from "./events-by-type";
import { ForceUtilizationChart } from "./force-utilization-chart";

export function AnalyticsView() {
  const tick = useGameStore((s) => s.tick);
  const events = useGameStore((s) => s.events);
  const units = useGameStore((s) => s.units);

  const analytics = useMemo(() => {
    const timeline = gameRecorder.getTimeline();
    return computeAnalytics(timeline, tick, events, units);
  }, [tick, events, units]);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      {/* Key metrics grid */}
      <AnalyticsMetrics analytics={analytics} />

      {/* Response time chart */}
      <ResponseTimeChart data={analytics.responseTimeByEvent} />

      {/* Events by type */}
      <EventsByType data={analytics.eventsByType} />

      {/* Force utilization */}
      <ForceUtilizationChart data={analytics.forceUtilization} />
    </div>
  );
}
