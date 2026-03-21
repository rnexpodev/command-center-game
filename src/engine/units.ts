import type { GameState, Unit } from "./types";
import { EventStatus, ForceType, UnitStatus } from "./types";
import { calculateDistance, calculateTravelTime } from "../lib/utils";
import { gameRecorder, TimelineEventType } from "./recorder";
import { forceTypeNames } from "../data/map-icons";
import { getSpeedModifier } from "./weather";

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
  unit.targetEventId = eventId;
  unit.arrivalTick = state.tick + travelTicks;

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
  unit.targetEventId = undefined;

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
 * - Arrival detection
 * - Return to base after event resolved
 */
export function updateUnits(state: GameState): GameState {
  for (const unit of state.units) {
    switch (unit.status) {
      case UnitStatus.DISPATCHED: {
        // Transition to en-route immediately
        unit.status = UnitStatus.EN_ROUTE;
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
          break;
        }

        const event = state.events.find((e) => e.id === unit.targetEventId);
        if (!event) {
          unit.status = UnitStatus.RETURNING;
          unit.targetEventId = undefined;
          const dist = calculateDistance(unit.position, unit.basePosition);
          const sMod = getSpeedModifier(state.weather, state.timeOfDay);
          unit.arrivalTick =
            state.tick + calculateTravelTime(dist, unit.speed * sMod);
          break;
        }

        // Move toward event
        moveUnitToward(unit, event.position);

        // Check arrival
        if (unit.arrivalTick !== undefined && state.tick >= unit.arrivalTick) {
          unit.status = UnitStatus.ON_SCENE;
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
        // Check if event is still active
        if (unit.targetEventId) {
          const event = state.events.find((e) => e.id === unit.targetEventId);
          if (!event || event.status === EventStatus.RESOLVED) {
            // Event resolved — start returning
            unit.status = UnitStatus.RETURNING;
            unit.targetEventId = undefined;
            const dist = calculateDistance(unit.position, unit.basePosition);
            const sMod = getSpeedModifier(state.weather, state.timeOfDay);
            unit.arrivalTick =
              state.tick + calculateTravelTime(dist, unit.speed * sMod);
          }
        }
        break;
      }

      case UnitStatus.RETURNING: {
        // Move toward base
        moveUnitToward(unit, unit.basePosition);

        if (unit.arrivalTick !== undefined && state.tick >= unit.arrivalTick) {
          unit.status = UnitStatus.AVAILABLE;
          unit.position = { ...unit.basePosition };
          unit.arrivalTick = undefined;
          unit.targetEventId = undefined;
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
