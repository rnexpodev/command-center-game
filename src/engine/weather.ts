// ===== Weather & Time-of-Day Engine =====
// Pure TypeScript — no React imports

import type { GameState } from "./types";
import { EventType, TimeOfDay, Weather } from "./types";

/** Ticks per time-of-day period (~2.5 game-hours each) */
const TICKS_PER_PERIOD = 150;

/** Time-of-day cycle order */
const TIME_CYCLE: TimeOfDay[] = [
  TimeOfDay.DAWN,
  TimeOfDay.DAY,
  TimeOfDay.DUSK,
  TimeOfDay.NIGHT,
];

/**
 * Travel speed multiplier based on weather + time of day.
 * Applied on top of base unit speed.
 */
export function getSpeedModifier(
  weather: Weather,
  timeOfDay: TimeOfDay,
): number {
  let modifier = 1.0;

  // Weather penalties
  switch (weather) {
    case Weather.RAIN:
      modifier *= 0.8;
      break;
    case Weather.SANDSTORM:
      modifier *= 0.5;
      break;
    case Weather.HEATWAVE:
      modifier *= 0.9;
      break;
  }

  // Night penalty
  if (timeOfDay === TimeOfDay.NIGHT) {
    modifier *= 0.85;
  } else if (timeOfDay === TimeOfDay.DUSK) {
    modifier *= 0.92;
  }

  return modifier;
}

/** Event types that are boosted during rain */
const RAIN_BOOSTED: Set<string> = new Set([
  EventType.TRAFFIC_ACCIDENT,
  EventType.FLOODING,
  EventType.POWER_OUTAGE,
]);

/** Event types that are boosted during heatwave */
const HEATWAVE_BOOSTED: Set<string> = new Set([
  EventType.MASS_CASUALTY,
  EventType.BUILDING_FIRE,
  EventType.GAS_LEAK,
]);

/**
 * Spawn probability multiplier for a given event type under current weather.
 * Values > 1 increase spawn chance, < 1 decrease it.
 */
export function getEventSpawnModifier(
  weather: Weather,
  eventType: string,
): number {
  switch (weather) {
    case Weather.RAIN:
      return RAIN_BOOSTED.has(eventType) ? 1.2 : 1.0;
    case Weather.SANDSTORM:
      return eventType === EventType.TRAFFIC_ACCIDENT ? 1.3 : 1.0;
    case Weather.HEATWAVE:
      return HEATWAVE_BOOSTED.has(eventType) ? 1.3 : 1.0;
    default:
      return 1.0;
  }
}

/**
 * Advance time of day on the game state.
 * Cycles every TICKS_PER_PERIOD ticks: dawn -> day -> dusk -> night -> dawn
 */
export function advanceTimeOfDay(state: GameState): void {
  if (state.tick === 0) return;
  if (state.tick % TICKS_PER_PERIOD !== 0) return;

  const currentIdx = TIME_CYCLE.indexOf(state.timeOfDay);
  const nextIdx = (currentIdx + 1) % TIME_CYCLE.length;
  state.timeOfDay = TIME_CYCLE[nextIdx];
}
