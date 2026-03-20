import type { GameEvent, GameState } from "./types";
import {
  EventStatus,
  EventType,
  ForceType,
  Severity,
  UnitStatus,
} from "./types";
import { generateId } from "../lib/utils";
import { escalateEvent } from "./escalation";

type EventDef = Omit<
  GameEvent,
  "id" | "reportedAt" | "assignedUnits" | "status" | "resolveProgress"
>;

/**
 * Spawn a new event into the game state.
 * Returns the mutated state (mutates in place for performance).
 */
export function spawnEvent(state: GameState, eventDef: EventDef): GameState {
  const event: GameEvent = {
    ...eventDef,
    id: generateId("evt"),
    reportedAt: state.tick,
    assignedUnits: [],
    status: EventStatus.REPORTED,
    resolveProgress: 0,
  };
  state.events.push(event);
  return state;
}

/**
 * Called each tick. Handles:
 * - Escalation timers (events worsen if not attended)
 * - Chain event spawning
 * - Resolution progress (when units are on scene)
 * - Status transitions
 */
export function updateEvents(state: GameState): GameState {
  const newChainEvents: EventDef[] = [];

  for (const event of state.events) {
    // Read status once to avoid TS narrowing issues across mutations
    const currentStatus: EventStatus = event.status;

    // Skip already resolved events
    if (currentStatus === EventStatus.RESOLVED) continue;

    // --- Count on-scene units for this event ---
    const onSceneUnits = state.units.filter(
      (u) => u.targetEventId === event.id && u.status === UnitStatus.ON_SCENE,
    );
    const hasResponders = onSceneUnits.length > 0;
    const hasDispatchedUnits = event.assignedUnits.length > 0 || hasResponders;

    // --- Status transitions ---
    if (
      currentStatus === EventStatus.REPORTED &&
      hasDispatchedUnits &&
      !hasResponders
    ) {
      event.status = EventStatus.RESPONDING;
    }

    // --- Resolution progress ---
    if (hasResponders) {
      if (
        currentStatus === EventStatus.REPORTED ||
        currentStatus === EventStatus.RESPONDING ||
        currentStatus === EventStatus.ESCALATED
      ) {
        event.status = EventStatus.RESPONDING;
      }

      // Calculate resolve rate based on units present
      let effectiveRate = 0;
      for (const unit of onSceneUnits) {
        // Units matching required forces resolve faster
        const isMatchingForce = event.requiredForces.includes(unit.forceType);
        const specializationBonus = unit.specialization.includes(event.type)
          ? 1.5
          : 1.0;
        const matchBonus = isMatchingForce ? 1.0 : 0.3;
        effectiveRate +=
          event.resolveRate *
          unit.effectiveness *
          matchBonus *
          specializationBonus;
      }

      // Check if all required force types are present
      const presentForceTypes = new Set(onSceneUnits.map((u) => u.forceType));
      const requiredMet = event.requiredForces.filter((f) =>
        presentForceTypes.has(f),
      ).length;
      const requiredTotal = event.requiredForces.length;

      // Bonus for having all required forces
      if (requiredTotal > 0 && requiredMet === requiredTotal) {
        effectiveRate *= 1.5;
      }

      event.resolveProgress = Math.min(
        100,
        event.resolveProgress + effectiveRate,
      );

      // Stabilized when progress > 50
      if (
        event.resolveProgress >= 50 &&
        event.status !== EventStatus.STABILIZED
      ) {
        event.status = EventStatus.STABILIZED;
      }

      // Resolved when progress hits 100
      if (event.resolveProgress >= 100) {
        resolveEvent(state, event.id);
      }
    }

    // --- Escalation timer ---
    if (!hasResponders && currentStatus !== EventStatus.STABILIZED) {
      event.escalationTimer -= 1;

      if (event.escalationTimer <= 0) {
        escalateEvent(state, event.id);
      }
    }

    // --- Chain events ---
    if (event.chainEvents) {
      for (const chain of event.chainEvents) {
        const ticksSinceReport = state.tick - event.reportedAt;
        if (ticksSinceReport === chain.delay) {
          if (Math.random() < chain.probability) {
            const chainEventDef: EventDef = {
              type: chain.type,
              severity: Severity.MEDIUM,
              position: {
                x: event.position.x + (Math.random() - 0.5) * 0.005,
                y: event.position.y + (Math.random() - 0.5) * 0.005,
              },
              locationName: `סמוך ל${event.locationName}`,
              description: `אירוע משני בסמוך ל${event.locationName}`,
              requiredForces: getDefaultForces(chain.type),
              casualties: 0,
              threatRadius: 50,
              blocksRoad: false,
              fireDanger: chain.type === EventType.BUILDING_FIRE,
              collapseDanger: chain.type === EventType.BUILDING_COLLAPSE,
              needsEvacuation: false,
              infrastructureDamage: false,
              escalationTimer: 40,
              resolveRate: 1.0,
            };
            newChainEvents.push(chainEventDef);
          }
        }
      }
    }
  }

  // Spawn chain events
  for (const chainDef of newChainEvents) {
    spawnEvent(state, chainDef);
  }

  return state;
}

/** Mark an event as resolved and release its units */
export function resolveEvent(state: GameState, eventId: string): GameState {
  const event = state.events.find((e) => e.id === eventId);
  if (!event) return state;

  event.status = EventStatus.RESOLVED;
  event.resolveProgress = 100;

  // Release units assigned to this event — they start returning
  for (const unit of state.units) {
    if (unit.targetEventId === eventId) {
      unit.status = UnitStatus.RETURNING;
      unit.targetEventId = undefined;
      unit.arrivalTick = undefined;
    }
  }

  return state;
}

/** Get default required forces for a chain event type */
function getDefaultForces(eventType: EventType): ForceType[] {
  const map: Record<string, ForceType[]> = {
    [EventType.BUILDING_FIRE]: [ForceType.FIRE, ForceType.MAGEN_DAVID],
    [EventType.BUILDING_COLLAPSE]: [ForceType.RESCUE, ForceType.MAGEN_DAVID],
    [EventType.TRAFFIC_ACCIDENT]: [ForceType.POLICE, ForceType.MAGEN_DAVID],
    [EventType.GAS_LEAK]: [ForceType.FIRE, ForceType.ENGINEERING],
    [EventType.POWER_OUTAGE]: [ForceType.INFRASTRUCTURE],
    [EventType.ROAD_BLOCKAGE]: [ForceType.POLICE, ForceType.ENGINEERING],
    [EventType.HAZMAT]: [ForceType.FIRE, ForceType.HOMEFRONT],
    [EventType.FLOODING]: [ForceType.RESCUE, ForceType.INFRASTRUCTURE],
    [EventType.MASS_CASUALTY]: [ForceType.MAGEN_DAVID, ForceType.POLICE],
    [EventType.EVACUATION_NEEDED]: [ForceType.EVACUATION, ForceType.POLICE],
  };
  return map[eventType] ?? [ForceType.POLICE];
}
