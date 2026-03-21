// ===== Civilian Behavior Engine =====
// Pure TypeScript — no React imports
// Calculates population-at-risk, panic level, and evacuation progress

import type { CivilianState, GameState } from "./types";
import { EventStatus, ForceType, Severity, UnitStatus } from "./types";
import { BEER_SHEVA } from "../data/city";
import { neighborhoodPopulation } from "../data/population";

/** Coordinate-unit radius that maps ~500 meters in Beer Sheva */
const THREAT_RADIUS_TO_COORD = 0.003;

/** Max distance (coord units) for an event to affect a neighborhood */
const NEIGHBORHOOD_EFFECT_RADIUS = 0.015;

/** Panic increase per tick per critical event */
const PANIC_PER_CRITICAL = 1.0;

/** Panic increase per tick per high-severity event */
const PANIC_PER_HIGH = 0.4;

/** Panic decay per tick when no critical/high events are active */
const PANIC_DECAY_RATE = 0.5;

/** Max panic level */
const PANIC_MAX = 100;

/** Evacuated civilians gained per tick per on-scene evacuation unit */
const EVAC_PER_UNIT_PER_TICK = 50;

/**
 * Update the civilian state for the current tick.
 * Called once per tick from the main simulation loop.
 * Mutates state.civilianState in place.
 */
export function updateCivilianState(state: GameState): void {
  const civilian = state.civilianState;

  // --- Calculate population at risk ---
  civilian.populationAtRisk = calculatePopulationAtRisk(state);

  // --- Update panic level ---
  updatePanicLevel(state);

  // --- Update evacuation progress ---
  updateEvacuation(state);
}

/**
 * Sum population of neighborhoods that overlap with active event threat zones.
 * Each neighborhood is only counted once even if multiple events overlap it.
 */
function calculatePopulationAtRisk(state: GameState): number {
  const activeEvents = state.events.filter(
    (e) => e.status !== EventStatus.RESOLVED,
  );

  if (activeEvents.length === 0) return 0;

  const affectedNeighborhoods = new Set<string>();

  for (const event of activeEvents) {
    // Convert threatRadius (meters) to coordinate units
    const effectRadius = Math.max(
      (event.threatRadius / 500) * THREAT_RADIUS_TO_COORD,
      NEIGHBORHOOD_EFFECT_RADIUS * 0.5,
    );

    for (const neighborhood of BEER_SHEVA.neighborhoods) {
      if (affectedNeighborhoods.has(neighborhood.id)) continue;

      const dx = event.position.x - neighborhood.position.x;
      const dy = event.position.y - neighborhood.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= effectRadius) {
        affectedNeighborhoods.add(neighborhood.id);
      }
    }
  }

  let total = 0;
  for (const id of affectedNeighborhoods) {
    total += neighborhoodPopulation[id] ?? 0;
  }

  return total;
}

/**
 * Increase panic when critical/high events are active,
 * decrease slowly when threats subside.
 */
function updatePanicLevel(state: GameState): void {
  const civilian = state.civilianState;
  const activeEvents = state.events.filter(
    (e) => e.status !== EventStatus.RESOLVED,
  );

  let criticalCount = 0;
  let highCount = 0;

  for (const event of activeEvents) {
    if (event.severity === Severity.CRITICAL) criticalCount++;
    else if (event.severity === Severity.HIGH) highCount++;
  }

  if (criticalCount > 0 || highCount > 0) {
    const increase =
      criticalCount * PANIC_PER_CRITICAL + highCount * PANIC_PER_HIGH;
    civilian.panicLevel = Math.min(PANIC_MAX, civilian.panicLevel + increase);
  } else {
    civilian.panicLevel = Math.max(0, civilian.panicLevel - PANIC_DECAY_RATE);
  }
}

/**
 * Evacuation units on scene gradually move civilians to safety.
 */
function updateEvacuation(state: GameState): void {
  const civilian = state.civilianState;

  const evacUnitsOnScene = state.units.filter(
    (u) =>
      u.forceType === ForceType.EVACUATION && u.status === UnitStatus.ON_SCENE,
  );

  if (evacUnitsOnScene.length > 0) {
    const evacuatedThisTick = evacUnitsOnScene.length * EVAC_PER_UNIT_PER_TICK;
    civilian.evacuated = Math.min(
      civilian.evacuated + evacuatedThisTick,
      civilian.populationAtRisk + civilian.evacuated,
    );
  }
}

/** Create a fresh civilian state for game initialization */
export function createCivilianState(): CivilianState {
  return {
    panicLevel: 0,
    populationAtRisk: 0,
    evacuated: 0,
  };
}
