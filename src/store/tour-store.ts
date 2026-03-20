import { create } from "zustand";

const TOUR_STORAGE_KEY = "hasSeenTour";
const TOTAL_STEPS = 10;

interface TourState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  hasSeenTour: boolean;
}

interface TourActions {
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
}

export type TourStore = TourState & TourActions;

export const useTourStore = create<TourStore>((set, get) => ({
  isActive: false,
  currentStep: 0,
  totalSteps: TOTAL_STEPS,
  hasSeenTour: localStorage.getItem(TOUR_STORAGE_KEY) === "true",

  startTour() {
    set({ isActive: true, currentStep: 0 });
  },

  nextStep() {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      get().completeTour();
    }
  },

  prevStep() {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  skipTour() {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    set({ isActive: false, currentStep: 0, hasSeenTour: true });
  },

  completeTour() {
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
    set({ isActive: false, currentStep: 0, hasSeenTour: true });
  },
}));
