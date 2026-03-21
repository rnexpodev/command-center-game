// Builds a GameResult from the current GameState — pure TS, no React
import type { GameState } from "./types";
import { EventStatus } from "./types";
import type { GameResult } from "./achievements";

/**
 * Extract a GameResult snapshot from a completed game state.
 * Called once when transitioning to the post-game report.
 */
export function buildGameResult(state: GameState): GameResult {
  const { events, units, score, tick, activeScenario } = state;

  // Collect unique force types used (dispatched to events)
  const usedForceTypes = new Set<string>();
  for (const unit of units) {
    if (unit.targetEventId || unit.status !== "available") {
      usedForceTypes.add(unit.forceType);
    }
  }

  // Total casualties across all events
  const totalCasualties = events.reduce((sum, e) => sum + e.casualties, 0);

  // Find fastest resolution (ticks from reportedAt to resolved)
  let fastestResolveTicks: number | null = null;
  for (const event of events) {
    if (event.status !== EventStatus.RESOLVED) continue;
    if (!event.treatmentStartTick) continue;
    const duration = event.treatmentDurationTicks ?? 0;
    const total = event.treatmentStartTick - event.reportedAt + duration;
    if (fastestResolveTicks === null || total < fastestResolveTicks) {
      fastestResolveTicks = total;
    }
  }

  return {
    scenarioId: activeScenario?.id ?? "unknown",
    difficulty: activeScenario?.difficulty ?? "easy",
    score: score.totalScore,
    grade: score.grade,
    eventsResolved: score.eventsResolved,
    eventsEscalated: score.eventsEscalated,
    totalCasualties,
    forceTypesUsed: [...usedForceTypes],
    totalTicks: tick,
    fastestResolveTicks,
  };
}
