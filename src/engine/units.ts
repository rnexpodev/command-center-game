import type { GameState, Unit } from "./types";
import {
  EventStatus,
  ForceType,
  MatchQuality,
  UnitPhase,
  UnitStatus,
} from "./types";
import { calculateDistance, calculateTravelTime } from "../lib/utils";
import { gameRecorder, TimelineEventType } from "./recorder";
import { forceTypeNames } from "../data/map-icons";
import { getSpeedModifier } from "./weather";

/** Number of ticks a unit spends in ARRIVING phase (setting up on scene) */
const ARRIVING_DURATION = 3;
/** Number of ticks a unit spends in WRAPPING_UP phase (packing up after resolution) */
const WRAPPING_UP_DURATION = 3;

/**
 * Dispatch a unit to an event.
 * Calculates travel time based on distance and sets the unit
 * to DISPATCHED, then marks it EN_ROUTE on the next tick.
 */
export function dispatchUnit(
  state: GameState,
  unitId: string,
  eventId: string,
): GameState {
  const unit = state.units.find((u) => u.id === unitId);
  const event = state.events.find((e) => e.id === eventId);
  if (!unit || !event) return state;

  // Only dispatch available units
  if (unit.status !== UnitStatus.AVAILABLE) return state;

  const distance = calculateDistance(unit.position, event.position);
  const speedMod = getSpeedModifier(state.weather, state.timeOfDay);
  const travelTicks = calculateTravelTime(distance, unit.speed * speedMod);

  unit.status = UnitStatus.DISPATCHED;
  unit.phase = UnitPhase.DISPATCHED;
  unit.targetEventId = eventId;
  unit.arrivalTick = state.tick + travelTicks;

  // Compute match quality
  const isMatch = event.requiredForces.includes(unit.forceType);
  const isSpecialized = unit.specialization.includes(event.type);
  unit.matchQuality = isMatch
    ? MatchQuality.FULL
    : isSpecialized
      ? MatchQuality.PARTIAL
      : MatchQuality.NONE;

  // Add unit to event's assigned list
  if (!event.assignedUnits.includes(unitId)) {
    event.assignedUnits.push(unitId);
  }

  return state;
}

/**
 * Recall a unit — send it back to its base.
 * Removes it from the event's assigned units.
 */
export function recallUnit(state: GameState, unitId: string): GameState {
  const unit = state.units.find((u) => u.id === unitId);
  if (!unit) return state;

  // Remove from event's assigned units
  if (unit.targetEventId) {
    const event = state.events.find((e) => e.id === unit.targetEventId);
    if (event) {
      event.assignedUnits = event.assignedUnits.filter((id) => id !== unitId);
    }
  }

  unit.status = UnitStatus.RETURNING;
  unit.phase = UnitPhase.RETURNING;
  unit.targetEventId = undefined;
  unit.treatmentContribution = 0;
  unit.matchQuality = MatchQuality.NONE;

  // Calculate return travel time with weather modifier
  const distance = calculateDistance(unit.position, unit.basePosition);
  const speedMod = getSpeedModifier(state.weather, state.timeOfDay);
  const travelTicks = calculateTravelTime(distance, unit.speed * speedMod);
  unit.arrivalTick = state.tick + travelTicks;

  return state;
}

/**
 * Called each tick. Handles:
 * - DISPATCHED -> EN_ROUTE transition (immediate)
 * - Unit movement toward target
 * - ARRIVING phase (3 ticks of setup)
 * - WRAPPING_UP phase (3 ticks after event resolved)
 * - Return to base after event resolved
 */
export function updateUnits(state: GameState): GameState {
  for (const unit of state.units) {
    switch (unit.status) {
      case UnitStatus.DISPATCHED: {
        // Transition to en-route immediately
        unit.status = UnitStatus.EN_ROUTE;
        unit.phase = UnitPhase.EN_ROUTE;
        const forceName = forceTypeNames[unit.forceType] ?? unit.forceType;
        gameRecorder.record({
          tick: state.tick,
          type: TimelineEventType.UNIT_DISPATCHED,
          unitId: unit.id,
          eventId: unit.targetEventId,
          description: `יחידה נשלחה: ${unit.name} (${forceName})`,
          position: [unit.position.x, unit.position.y],
        });
        break;
      }

      case UnitStatus.EN_ROUTE: {
        if (!unit.targetEventId) {
          unit.status = UnitStatus.RETURNING;
          unit.phase = UnitPhase.RETURNING;
          break;
        }

        const event = state.events.find((e) => e.id === unit.targetEventId);
        if (!event) {
          unit.status = UnitStatus.RETURNING;
          unit.phase = UnitPhase.RETURNING;
          unit.targetEventId = undefined;
          const dist = calculateDistance(unit.position, unit.basePosition);
          const sMod = getSpeedModifier(state.weather, state.timeOfDay);
          unit.arrivalTick =
            state.tick + calculateTravelTime(dist, unit.speed * sMod);
          break;
        }

        // Move toward event
        moveUnitToward(unit, event.position);

        // Check arrival — transition to ARRIVING phase
        if (unit.arrivalTick !== undefined && state.tick >= unit.arrivalTick) {
          unit.status = UnitStatus.ON_SCENE;
          unit.phase = UnitPhase.ARRIVING;
          unit.phaseStartTick = state.tick;
          unit.position = { ...event.position };
          unit.arrivalTick = undefined;

          const arrForceName = forceTypeNames[unit.forceType] ?? unit.forceType;
          gameRecorder.record({
            tick: state.tick,
            type: TimelineEventType.UNIT_ARRIVED,
            unitId: unit.id,
            eventId: unit.targetEventId,
            description: `יחידה הגיעה לזירה: ${unit.name} (${arrForceName})`,
            position: [event.position.x, event.position.y],
          });
        }
        break;
      }

      case UnitStatus.ON_SCENE: {
        // Handle ARRIVING → TREATING transition
        if (unit.phase === UnitPhase.ARRIVING) {
          if (
            unit.phaseStartTick !== undefined &&
            state.tick >= unit.phaseStartTick + ARRIVING_DURATION
          ) {
            unit.phase = UnitPhase.TREATING;
            unit.treatmentStartTick = state.tick;
            unit.phaseStartTick = state.tick;
          }
          break;
        }

        // Handle WRAPPING_UP → RETURNING transition
        if (unit.phase === UnitPhase.WRAPPING_UP) {
          if (
            unit.phaseStartTick !== undefined &&
            state.tick >= unit.phaseStartTick + WRAPPING_UP_DURATION
          ) {
            unit.status = UnitStatus.RETURNING;
            unit.phase = UnitPhase.RETURNING;
            unit.targetEventId = undefined;
            unit.treatmentContribution = 0;
            unit.treatmentStartTick = undefined;
            const dist = calculateDistance(unit.position, unit.basePosition);
            const sMod = getSpeedModifier(state.weather, state.timeOfDay);
            unit.arrivalTick =
              state.tick + calculateTravelTime(dist, unit.speed * sMod);
          }
          break;
        }

        // Check if event is resolved — transition to WRAPPING_UP
        if (unit.targetEventId) {
          const event = state.events.find((e) => e.id === unit.targetEventId);
          if (!event || event.status === EventStatus.RESOLVED) {
            unit.phase = UnitPhase.WRAPPING_UP;
            unit.phaseStartTick = state.tick;
            unit.treatmentContribution = 0;
            // Remove from event's assigned units
            if (event) {
              event.assignedUnits = event.assignedUnits.filter(
                (id) => id !== unit.id,
              );
            }
          }
        }
        break;
      }

      case UnitStatus.RETURNING: {
        unit.phase = UnitPhase.RETURNING;
        // Move toward base
        moveUnitToward(unit, unit.basePosition);

        if (unit.arrivalTick !== undefined && state.tick >= unit.arrivalTick) {
          unit.status = UnitStatus.AVAILABLE;
          unit.phase = UnitPhase.IDLE;
          unit.position = { ...unit.basePosition };
          unit.arrivalTick = undefined;
          unit.targetEventId = undefined;
          unit.treatmentContribution = 0;
          unit.matchQuality = MatchQuality.NONE;
          unit.treatmentStartTick = undefined;
          unit.phaseStartTick = undefined;
        }
        break;
      }

      default:
        break;
    }
  }

  return state;
}

/**
 * Interpolate unit position toward a target by its speed.
 */
function moveUnitToward(unit: Unit, target: { x: number; y: number }): void {
  const dx = target.x - unit.position.x;
  const dy = target.y - unit.position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= unit.speed) {
    unit.position = { x: target.x, y: target.y };
    return;
  }

  const ratio = unit.speed / dist;
  unit.position = {
    x: unit.position.x + dx * ratio,
    y: unit.position.y + dy * ratio,
  };
}

/**
 * Get available units, optionally filtered by force type.
 */
export function getAvailableUnits(
  state: GameState,
  forceType?: ForceType,
): Unit[] {
  return state.units.filter((u) => {
    if (u.status !== UnitStatus.AVAILABLE) return false;
    if (forceType && u.forceType !== forceType) return false;
    return true;
  });
}
