import { create } from "zustand";
import { checkAchievements } from "@/engine/achievements";
import type { GameResult, CareerStats } from "@/engine/achievements";

const CAREER_STORAGE_KEY = "careerStats";

interface CareerState extends CareerStats {
  achievementUnlockDates: Record<string, number>;
  /** IDs of achievements earned in the most recent game (for popup display) */
  pendingAchievements: string[];
}

interface CareerActions {
  recordGameResult: (result: GameResult) => void;
  getStats: () => CareerStats;
  clearPendingAchievements: () => void;
  resetCareer: () => void;
}

export type CareerStore = CareerState & CareerActions;

function loadFromStorage(): Partial<CareerState> {
  try {
    const raw = localStorage.getItem(CAREER_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<CareerState>;
  } catch {
    return {};
  }
}

function saveToStorage(state: CareerState) {
  const data: Partial<CareerState> = {
    totalEventsResolved: state.totalEventsResolved,
    totalScenariosPlayed: state.totalScenariosPlayed,
    totalPlayTimeTicks: state.totalPlayTimeTicks,
    bestGradePerScenario: state.bestGradePerScenario,
    bestScorePerScenario: state.bestScorePerScenario,
    unlockedAchievements: state.unlockedAchievements,
    achievementUnlockDates: state.achievementUnlockDates,
  };
  localStorage.setItem(CAREER_STORAGE_KEY, JSON.stringify(data));
}

const defaults: CareerState = {
  totalEventsResolved: 0,
  totalScenariosPlayed: 0,
  totalPlayTimeTicks: 0,
  bestGradePerScenario: {},
  bestScorePerScenario: {},
  unlockedAchievements: [],
  achievementUnlockDates: {},
  pendingAchievements: [],
};

const stored = loadFromStorage();

export const useCareerStore = create<CareerStore>((set, get) => ({
  ...defaults,
  ...stored,
  pendingAchievements: [],

  recordGameResult(result: GameResult) {
    set((prev) => {
      // Update cumulative stats
      const totalEventsResolved =
        prev.totalEventsResolved + result.eventsResolved;
      const totalScenariosPlayed = prev.totalScenariosPlayed + 1;
      const totalPlayTimeTicks = prev.totalPlayTimeTicks + result.totalTicks;

      // Update best grades/scores
      const bestGradePerScenario = { ...prev.bestGradePerScenario };
      const bestScorePerScenario = { ...prev.bestScorePerScenario };
      const gradeOrder = ["F", "D", "C", "B", "A", "S"];
      const currentBest = bestGradePerScenario[result.scenarioId];
      if (
        !currentBest ||
        gradeOrder.indexOf(result.grade) > gradeOrder.indexOf(currentBest)
      ) {
        bestGradePerScenario[result.scenarioId] = result.grade;
      }
      if (
        !bestScorePerScenario[result.scenarioId] ||
        result.score > bestScorePerScenario[result.scenarioId]
      ) {
        bestScorePerScenario[result.scenarioId] = result.score;
      }

      // Build updated stats for achievement checking
      const updatedStats: CareerStats = {
        totalEventsResolved,
        totalScenariosPlayed,
        totalPlayTimeTicks,
        bestGradePerScenario,
        bestScorePerScenario,
        unlockedAchievements: [...prev.unlockedAchievements],
      };

      // Check new achievements
      const newAchievements = checkAchievements(updatedStats, result);
      const now = Date.now();
      const achievementUnlockDates = { ...prev.achievementUnlockDates };
      for (const id of newAchievements) {
        achievementUnlockDates[id] = now;
      }

      const newState: CareerState = {
        totalEventsResolved,
        totalScenariosPlayed,
        totalPlayTimeTicks,
        bestGradePerScenario,
        bestScorePerScenario,
        unlockedAchievements: [
          ...prev.unlockedAchievements,
          ...newAchievements,
        ],
        achievementUnlockDates,
        pendingAchievements: newAchievements,
      };

      saveToStorage(newState);
      return newState;
    });
  },

  getStats(): CareerStats {
    const s = get();
    return {
      totalEventsResolved: s.totalEventsResolved,
      totalScenariosPlayed: s.totalScenariosPlayed,
      totalPlayTimeTicks: s.totalPlayTimeTicks,
      bestGradePerScenario: s.bestGradePerScenario,
      bestScorePerScenario: s.bestScorePerScenario,
      unlockedAchievements: s.unlockedAchievements,
    };
  },

  clearPendingAchievements() {
    set({ pendingAchievements: [] });
  },

  resetCareer() {
    localStorage.removeItem(CAREER_STORAGE_KEY);
    set({ ...defaults });
  },
}));
