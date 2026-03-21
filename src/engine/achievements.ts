// Achievement checking engine — pure TypeScript, no React imports
import { ACHIEVEMENTS } from "@/data/achievements";
import type { AchievementCondition } from "@/data/achievements";

/** Per-game result data passed after scenario ends */
export interface GameResult {
  scenarioId: string;
  difficulty: string;
  score: number;
  grade: string;
  eventsResolved: number;
  eventsEscalated: number;
  totalCasualties: number;
  forceTypesUsed: string[];
  totalTicks: number;
  fastestResolveTicks: number | null;
}

/** Cumulative career stats */
export interface CareerStats {
  totalEventsResolved: number;
  totalScenariosPlayed: number;
  totalPlayTimeTicks: number;
  bestGradePerScenario: Record<string, string>;
  bestScorePerScenario: Record<string, number>;
  unlockedAchievements: string[];
}

/** Classic (non-missile) scenario IDs */
const CLASSIC_SCENARIO_IDS = [
  "tutorial",
  "dual_emergency",
  "complex_single",
  "surge",
];

/**
 * Check all achievements against current stats + game result.
 * Returns IDs of newly earned (not previously unlocked) achievements.
 */
export function checkAchievements(
  stats: CareerStats,
  result: GameResult,
): string[] {
  const newlyUnlocked: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (stats.unlockedAchievements.includes(achievement.id)) continue;
    if (evaluateCondition(achievement.condition, stats, result)) {
      newlyUnlocked.push(achievement.id);
    }
  }

  return newlyUnlocked;
}

function evaluateCondition(
  condition: AchievementCondition,
  stats: CareerStats,
  result: GameResult,
): boolean {
  switch (condition.type) {
    case "grade":
      if (condition.difficulty && result.difficulty !== condition.difficulty) {
        return false;
      }
      return result.grade === condition.grade;

    case "score":
      return result.score >= condition.min;

    case "resolveUnderTicks":
      return (
        result.fastestResolveTicks !== null &&
        result.fastestResolveTicks <= condition.maxTicks
      );

    case "scenarioUnderTicks":
      return result.totalTicks <= condition.maxTicks;

    case "allForceTypes":
      return result.forceTypesUsed.length >= 9;

    case "zeroEscalations":
      return result.eventsEscalated === 0;

    case "zeroCasualties":
      return result.totalCasualties === 0;

    case "flawless":
      return result.totalCasualties === 0 && result.eventsEscalated === 0;

    case "firstScenario":
      return stats.totalScenariosPlayed >= 1;

    case "totalEventsResolved":
      return stats.totalEventsResolved >= condition.count;

    case "totalScenariosPlayed":
      return stats.totalScenariosPlayed >= condition.count;

    case "allClassicScenarios":
      return CLASSIC_SCENARIO_IDS.every(
        (id) => id in stats.bestGradePerScenario,
      );

    default:
      return false;
  }
}
