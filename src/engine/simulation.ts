import type { GameState, Scenario } from "./types";
import {
  EventStatus,
  GameSpeed,
  Severity,
  TimeOfDay,
  UnitStatus,
  Weather,
} from "./types";
import { generateId } from "../lib/utils";
import { spawnEvent, updateEvents } from "./events";
import { updateUnits } from "./units";
import { calculateFinalScore, updateScore } from "./scoring";
import { gameRecorder } from "./recorder";
import { advanceTimeOfDay } from "./weather";

/** Create a fresh initial game state */
export function createSimulation(): GameState {
  return {
    tick: 0,
    speed: GameSpeed.PAUSED,
    events: [],
    units: [],
    score: {
      responseTime: 0,
      stabilizationRate: 100,
      casualtiesPrevented: 0,
      resourceEfficiency: 0,
      eventsResolved: 0,
      eventsEscalated: 0,
      totalScore: 0,
      grade: "A",
    },
    cityAlert: Severity.LOW,
    activeScenario: null,
    isRunning: false,
    isComplete: false,
    nextEventId: 1,
    nextUnitId: 1,
    weather: Weather.CLEAR,
    timeOfDay: TimeOfDay.DAY,
    trainingMode: false,
  };
}

/**
 * Advance the simulation by one tick.
 * Order of operations:
 * 1. Advance clock
 * 2. Check scenario waves (spawn new events at scheduled times)
 * 3. Update events (escalation, resolution)
 * 4. Update units (movement, arrival)
 * 5. Update score
 * 6. Check win/lose conditions
 */
export function tickSimulation(state: GameState): GameState {
  if (!state.isRunning || state.isComplete) return state;
  if (state.speed === GameSpeed.PAUSED) return state;

  // 1. Advance clock
  state.tick += 1;

  // 1b. Advance time of day
  advanceTimeOfDay(state);

  // 2. Check scenario waves
  if (state.activeScenario) {
    for (const wave of state.activeScenario.waves) {
      if (wave.tick === state.tick) {
        for (const eventDef of wave.events) {
          spawnEvent(state, eventDef);
        }
      }
    }
  }

  // 3. Update events
  updateEvents(state);

  // 4. Update units
  updateUnits(state);

  // 5. Update score
  updateScore(state);

  // 6. Check win/lose conditions
  checkEndConditions(state);

  return state;
}

/** Load a scenario into the game state */
export function startScenario(state: GameState, scenario: Scenario): GameState {
  // Reset recorder for new scenario
  gameRecorder.reset();

  // Reset state
  const fresh = createSimulation();
  Object.assign(state, fresh);

  state.activeScenario = scenario;
  state.isRunning = true;
  state.speed = GameSpeed.NORMAL;
  state.weather = scenario.weather ?? Weather.CLEAR;
  state.timeOfDay = scenario.startTimeOfDay ?? TimeOfDay.DAY;

  // Spawn initial units from scenario
  for (const unitDef of scenario.initialUnits) {
    const unit = {
      ...unitDef,
      id: generateId("unit"),
      status: UnitStatus.AVAILABLE,
      targetEventId: undefined,
      arrivalTick: undefined,
    };
    state.units.push(unit);
  }

  // Spawn tick-0 wave events immediately
  for (const wave of scenario.waves) {
    if (wave.tick === 0) {
      for (const eventDef of wave.events) {
        spawnEvent(state, eventDef);
      }
    }
  }

  return state;
}

/** Reset the simulation to initial state */
export function resetSimulation(state: GameState): GameState {
  const fresh = createSimulation();
  Object.assign(state, fresh);
  return state;
}

/** Check if the scenario is complete */
function checkEndConditions(state: GameState): void {
  if (!state.activeScenario) return;

  // Time limit reached
  if (state.tick >= state.activeScenario.durationTicks) {
    state.isComplete = true;
    state.isRunning = false;
    calculateFinalScore(state);
    return;
  }

  // All waves spawned and all events resolved
  const allWavesSpawned = state.activeScenario.waves.every(
    (w) => w.tick <= state.tick,
  );
  const allEventsResolved =
    state.events.length > 0 &&
    state.events.every((e) => e.status === EventStatus.RESOLVED);

  if (allWavesSpawned && allEventsResolved) {
    state.isComplete = true;
    state.isRunning = false;
    calculateFinalScore(state);
  }
}
