import { create } from "zustand";
import { ALL_CAMPAIGNS, gradePassesRequirement } from "@/data/campaign";
import type { Campaign, CampaignScenario } from "@/data/campaign";

const STORAGE_KEY = "campaignState";

interface ScenarioResult {
  grade: string;
  score: number;
}

interface CampaignState {
  activeCampaignId: string | null;
  currentScenarioIndex: number;
  completedScenarios: Record<string, ScenarioResult>;
  bonusUnits: number;
}

interface CampaignActions {
  startCampaign: (campaignId: string) => void;
  recordResult: (scenarioId: string, grade: string, score: number) => void;
  advanceToNext: () => void;
  resetCampaign: () => void;
  getActiveCampaign: () => Campaign | null;
  getCurrentScenario: () => CampaignScenario | null;
  isScenarioUnlocked: (index: number) => boolean;
  didPassCurrentScenario: () => boolean;
}

export type CampaignStore = CampaignState & CampaignActions;

function loadFromStorage(): Partial<CampaignState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<CampaignState>;
  } catch {
    return {};
  }
}

function saveToStorage(state: CampaignState) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      activeCampaignId: state.activeCampaignId,
      currentScenarioIndex: state.currentScenarioIndex,
      completedScenarios: state.completedScenarios,
      bonusUnits: state.bonusUnits,
    }),
  );
}

const defaults: CampaignState = {
  activeCampaignId: null,
  currentScenarioIndex: 0,
  completedScenarios: {},
  bonusUnits: 0,
};

const stored = loadFromStorage();

export const useCampaignStore = create<CampaignStore>((set, get) => ({
  ...defaults,
  ...stored,

  startCampaign(campaignId: string) {
    const newState: CampaignState = {
      activeCampaignId: campaignId,
      currentScenarioIndex: 0,
      completedScenarios: {},
      bonusUnits: 0,
    };
    set(newState);
    saveToStorage(newState);
  },

  recordResult(scenarioId: string, grade: string, score: number) {
    set((prev) => {
      const completed = {
        ...prev.completedScenarios,
        [scenarioId]: { grade, score },
      };
      const campaign = ALL_CAMPAIGNS.find(
        (c) => c.id === prev.activeCampaignId,
      );
      const cs = campaign?.scenarios.find((s) => s.id === scenarioId);
      let bonusUnits = prev.bonusUnits;
      if (cs && gradePassesRequirement(grade, cs.requiredGrade)) {
        bonusUnits += cs.rewards.bonusUnits ?? 0;
      }
      const newState = { ...prev, completedScenarios: completed, bonusUnits };
      saveToStorage(newState);
      return newState;
    });
  },

  advanceToNext() {
    set((prev) => {
      const next = prev.currentScenarioIndex + 1;
      const newState = { ...prev, currentScenarioIndex: next };
      saveToStorage(newState);
      return newState;
    });
  },

  resetCampaign() {
    localStorage.removeItem(STORAGE_KEY);
    set({ ...defaults });
  },

  getActiveCampaign() {
    const { activeCampaignId } = get();
    return ALL_CAMPAIGNS.find((c) => c.id === activeCampaignId) ?? null;
  },

  getCurrentScenario() {
    const campaign = get().getActiveCampaign();
    if (!campaign) return null;
    return campaign.scenarios[get().currentScenarioIndex] ?? null;
  },

  isScenarioUnlocked(index: number) {
    const { completedScenarios, currentScenarioIndex } = get();
    if (index === 0) return true;
    if (index > currentScenarioIndex) return false;
    const campaign = get().getActiveCampaign();
    if (!campaign) return false;
    const prev = campaign.scenarios[index - 1];
    if (!prev) return false;
    const result = completedScenarios[prev.id];
    if (!result) return false;
    return gradePassesRequirement(result.grade, prev.requiredGrade);
  },

  didPassCurrentScenario() {
    const cs = get().getCurrentScenario();
    if (!cs) return false;
    const result = get().completedScenarios[cs.id];
    if (!result) return false;
    return gradePassesRequirement(result.grade, cs.requiredGrade);
  },
}));
