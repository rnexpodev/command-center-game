import { create } from "zustand";
import type { GameState, Scenario } from "@/engine/types";
import { GameSpeed } from "@/engine/types";
import {
  createSimulation,
  startScenario as engineStartScenario,
  tickSimulation,
} from "@/engine/simulation";
import {
  dispatchUnit as engineDispatchUnit,
  recallUnit as engineRecallUnit,
} from "@/engine/units";
import { createClock, type ClockManager } from "@/engine/clock";
import {
  createManualEvent,
  addExtraUnits,
  clearEvents,
} from "@/engine/training";
import type { EventType, Position, Severity } from "@/engine/types";
export { gameRecorder } from "@/engine/recorder";

/** Helper to snapshot the full GameState from the store for engine mutations */
function snapshotState(prev: GameState): GameState {
  return {
    tick: prev.tick,
    speed: prev.speed,
    events: prev.events.map((e) => ({
      ...e,
      assignedUnits: [...e.assignedUnits],
      chainEvents: e.chainEvents ? [...e.chainEvents] : undefined,
    })),
    units: prev.units.map((u) => ({ ...u })),
    score: { ...prev.score },
    cityAlert: prev.cityAlert,
    activeScenario: prev.activeScenario,
    isRunning: prev.isRunning,
    isComplete: prev.isComplete,
    nextEventId: prev.nextEventId,
    nextUnitId: prev.nextUnitId,
    weather: prev.weather,
    timeOfDay: prev.timeOfDay,
    trainingMode: prev.trainingMode,
  };
}

/** Actions exposed by the game store */
interface GameActions {
  startScenario: (scenario: Scenario) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  setSpeed: (speed: GameSpeed) => void;
  dispatchUnit: (unitId: string, eventId: string) => void;
  recallUnit: (unitId: string) => void;
  advanceTick: () => void;
  reset: () => void;
  setTrainingMode: (mode: boolean) => void;
  injectEvent: (type: EventType, pos: Position, severity: Severity) => void;
  addTrainingUnits: () => void;
  clearAllEvents: () => void;
}

export type GameStore = GameState & GameActions;

/** Clock lives outside the store to avoid serialization issues */
let clock: ClockManager | null = null;

export const useGameStore = create<GameStore>((set, get) => ({
  // --- Initial state (spread flat) ---
  ...createSimulation(),

  // --- Actions ---

  startScenario(scenario: Scenario) {
    if (clock) {
      clock.destroy();
      clock = null;
    }

    const { trainingMode } = get();
    const fresh = createSimulation();
    fresh.trainingMode = trainingMode;
    engineStartScenario(fresh, scenario);
    set(fresh);

    clock = createClock(() => {
      get().advanceTick();
    });
    clock.setSpeed(GameSpeed.NORMAL);
    clock.start();
  },

  pauseGame() {
    if (clock) clock.setSpeed(GameSpeed.PAUSED);
    set({ speed: GameSpeed.PAUSED });
  },

  resumeGame() {
    const { speed } = get();
    const resumeSpeed = speed === GameSpeed.PAUSED ? GameSpeed.NORMAL : speed;
    if (clock) clock.setSpeed(resumeSpeed);
    set({ speed: resumeSpeed });
  },

  setSpeed(newSpeed: GameSpeed) {
    if (clock) clock.setSpeed(newSpeed);
    set({ speed: newSpeed });
  },

  dispatchUnit(unitId: string, eventId: string) {
    set((prev) => {
      const state = snapshotState(prev);
      engineDispatchUnit(state, unitId, eventId);
      return { events: state.events, units: state.units };
    });
  },

  recallUnit(unitId: string) {
    set((prev) => {
      const state = snapshotState(prev);
      engineRecallUnit(state, unitId);
      return { events: state.events, units: state.units };
    });
  },

  advanceTick() {
    set((prev) => {
      const state = snapshotState(prev);
      tickSimulation(state);

      if (state.isComplete && clock) {
        clock.stop();
      }

      return {
        tick: state.tick,
        speed: state.speed,
        events: state.events,
        units: state.units,
        score: state.score,
        cityAlert: state.cityAlert,
        isRunning: state.isRunning,
        isComplete: state.isComplete,
        nextEventId: state.nextEventId,
        nextUnitId: state.nextUnitId,
        weather: state.weather,
        timeOfDay: state.timeOfDay,
        trainingMode: state.trainingMode,
      };
    });
  },

  reset() {
    if (clock) {
      clock.destroy();
      clock = null;
    }
    set(createSimulation());
  },

  setTrainingMode(mode: boolean) {
    set({ trainingMode: mode });
  },

  injectEvent(type: EventType, pos: Position, severity: Severity) {
    set((prev) => {
      const state = snapshotState(prev);
      createManualEvent(state, type, pos, severity);
      return { events: state.events, nextEventId: state.nextEventId };
    });
  },

  addTrainingUnits() {
    set((prev) => {
      const state = snapshotState(prev);
      addExtraUnits(state);
      return { units: state.units, nextUnitId: state.nextUnitId };
    });
  },

  clearAllEvents() {
    set((prev) => {
      const state = snapshotState(prev);
      clearEvents(state);
      return { events: state.events, units: state.units };
    });
  },
}));
