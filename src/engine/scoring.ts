import type { GameState, ScoreMetrics, Severity } from "./types";
import { EventStatus } from "./types";

/**
 * Update the running score during the game.
 * Called each tick.
 */
export function updateScore(state: GameState): GameState {
  const { events, units } = state;

  const activeEvents = events.filter((e) => e.status !== EventStatus.RESOLVED);
  const resolvedEvents = events.filter(
    (e) => e.status === EventStatus.RESOLVED,
  );
  const escalatedEvents = events.filter(
    (e) => e.status === EventStatus.ESCALATED,
  );

  // --- Average response time ---
  let totalResponseTime = 0;
  let respondedCount = 0;
  for (const event of events) {
    if (event.assignedUnits.length > 0) {
      // Find earliest dispatched unit for this event
      const eventUnits = units.filter(
        (u) =>
          event.assignedUnits.includes(u.id) || u.targetEventId === event.id,
      );
      if (eventUnits.length > 0) {
        totalResponseTime += state.tick - event.reportedAt;
        respondedCount++;
      }
    }
  }
  const avgResponseTime =
    respondedCount > 0 ? totalResponseTime / respondedCount : 0;

  // --- Stabilization rate ---
  const totalHandled = resolvedEvents.length + escalatedEvents.length;
  const stabilizationRate =
    totalHandled > 0 ? resolvedEvents.length / totalHandled : 1;

  // --- Resource efficiency ---
  // Measures how well assigned forces match required forces
  let matchScore = 0;
  let matchTotal = 0;
  for (const event of events) {
    if (event.assignedUnits.length === 0) continue;
    const assignedUnits = units.filter((u) =>
      event.assignedUnits.includes(u.id),
    );
    const assignedTypes = new Set(assignedUnits.map((u) => u.forceType));
    const requiredTypes = new Set(event.requiredForces);

    for (const req of requiredTypes) {
      matchTotal++;
      if (assignedTypes.has(req)) matchScore++;
    }

    // Penalize sending wrong types
    for (const assigned of assignedTypes) {
      if (!requiredTypes.has(assigned)) {
        matchTotal++;
        // No bonus for wrong type
      }
    }
  }
  const resourceEfficiency = matchTotal > 0 ? matchScore / matchTotal : 0;

  // --- Casualties prevented ---
  // Estimate based on events stabilized before escalation
  const casualtiesPrevented = resolvedEvents.reduce((sum, e) => {
    // If resolved before escalation, assume prevented casualties
    return sum + Math.max(0, 5 - e.casualties);
  }, 0);

  // --- Total casualties ---
  const totalCasualties = events.reduce((sum, e) => sum + e.casualties, 0);

  // --- Total score (0-1000 scale) ---
  const responseScore = Math.max(0, 250 - avgResponseTime * 5);
  const stabilScore = stabilizationRate * 300;
  const efficiencyScore = resourceEfficiency * 250;
  const casualtyScore = Math.max(0, 200 - totalCasualties * 10);

  const totalScore = Math.round(
    responseScore + stabilScore + efficiencyScore + casualtyScore,
  );

  // --- Grade ---
  const grade = calculateGrade(totalScore);

  state.score = {
    responseTime: Math.round(avgResponseTime),
    stabilizationRate: Math.round(stabilizationRate * 100),
    casualtiesPrevented,
    resourceEfficiency: Math.round(resourceEfficiency * 100),
    eventsResolved: resolvedEvents.length,
    eventsEscalated: escalatedEvents.length,
    totalScore,
    grade,
  };

  // --- City alert level ---
  // Based on worst active event
  if (activeEvents.length > 0) {
    state.cityAlert = Math.max(
      ...activeEvents.map((e) => e.severity),
    ) as Severity;
  }

  return state;
}

/**
 * Calculate the final score at scenario end.
 * Adds time bonus and completion bonus.
 */
export function calculateFinalScore(state: GameState): ScoreMetrics {
  // First get the running score
  updateScore(state);

  const { events } = state;
  const allResolved = events.every((e) => e.status === EventStatus.RESOLVED);

  // Completion bonus
  let completionBonus = 0;
  if (allResolved) {
    completionBonus = 100;
  }

  // Time bonus: finished early = extra points
  let timeBonus = 0;
  if (state.activeScenario && allResolved) {
    const remainingTicks = state.activeScenario.durationTicks - state.tick;
    timeBonus = Math.max(0, Math.round(remainingTicks * 0.5));
  }

  const finalTotal = Math.min(
    1000,
    state.score.totalScore + completionBonus + timeBonus,
  );
  const grade = calculateGrade(finalTotal);

  state.score = {
    ...state.score,
    totalScore: finalTotal,
    grade,
  };

  return state.score;
}

/** Map a numeric score to a letter grade */
function calculateGrade(score: number): "S" | "A" | "B" | "C" | "D" | "F" {
  if (score >= 950) return "S";
  if (score >= 800) return "A";
  if (score >= 650) return "B";
  if (score >= 500) return "C";
  if (score >= 300) return "D";
  return "F";
}
