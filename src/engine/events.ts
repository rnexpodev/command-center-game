import type { GameEvent, GameState } from "./types";
import {
  EventStatus,
  EventType,
  ForceType,
  MatchQuality,
  Severity,
  UnitPhase,
  UnitStatus,
} from "./types";
import { generateId } from "../lib/utils";
import { escalateEvent } from "./escalation";
import { calculateBaseDuration } from "../data/treatment-durations";
import { gameRecorder, TimelineEventType } from "./recorder";
import { eventTypeNames } from "../data/map-icons";

type EventDef = Omit<
  GameEvent,
  | "id"
  | "reportedAt"
  | "assignedUnits"
  | "status"
  | "resolveProgress"
  | "areaClosed"
  | "evacuationActive"
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
    areaClosed: false,
    evacuationActive: false,
    treatmentDurationTicks: calculateBaseDuration(eventDef.type, {
      threatRadius: eventDef.threatRadius,
      casualties: eventDef.casualties,
      severity: eventDef.severity,
    }),
  };
  state.events.push(event);

  const typeName = eventTypeNames[event.type] ?? event.type;
  gameRecorder.record({
    tick: state.tick,
    type: TimelineEventType.EVENT_SPAWNED,
    eventId: event.id,
    description: `אירוע חדש: ${typeName} — ${event.locationName}`,
    position: [event.position.x, event.position.y],
    severity: event.severity,
  });

  return state;
}

/**
 * Called each tick. Handles:
 * - Escalation timers (events worsen if not attended)
 * - Chain event spawning (reduced by areaClosed)
 * - Resolution progress (when units are on scene and TREATING)
 * - Per-unit treatmentContribution calculation
 * - Status transitions
 */
export function updateEvents(state: GameState): GameState {
  const newChainEvents: EventDef[] = [];

  for (const event of state.events) {
    // Read status once to avoid TS narrowing issues across mutations
    const currentStatus: EventStatus = event.status;

    // Skip already resolved events
    if (currentStatus === EventStatus.RESOLVED) continue;

    // --- Count on-scene units ACTIVELY TREATING for this event ---
    const onSceneUnits = state.units.filter(
      (u) => u.targetEventId === event.id && u.status === UnitStatus.ON_SCENE,
    );
    const treatingUnits = onSceneUnits.filter(
      (u) => u.phase === UnitPhase.TREATING,
    );
    const hasResponders = onSceneUnits.length > 0;
    const hasTreaters = treatingUnits.length > 0;
    const hasDispatchedUnits = event.assignedUnits.length > 0 || hasResponders;

    // --- Status transitions ---
    if (
      currentStatus === EventStatus.REPORTED &&
      hasDispatchedUnits &&
      !hasResponders
    ) {
      event.status = EventStatus.RESPONDING;
    }

    // --- Resolution progress (only from TREATING units) ---
    if (hasTreaters) {
      if (
        currentStatus === EventStatus.REPORTED ||
        currentStatus === EventStatus.RESPONDING ||
        currentStatus === EventStatus.ESCALATED
      ) {
        event.status = EventStatus.RESPONDING;
      }

      // Record when treatment started (event-level)
      if (event.treatmentStartTick === undefined) {
        event.treatmentStartTick = state.tick;
      }

      // Calculate unit effectiveness multiplier and per-unit contributions
      let totalMultiplier = 0;
      const unitContributions: { unitId: string; raw: number }[] = [];

      for (const unit of treatingUnits) {
        const isMatchingForce = event.requiredForces.includes(unit.forceType);
        const specializationBonus = unit.specialization.includes(event.type)
          ? 1.5
          : 1.0;
        const matchBonus = isMatchingForce ? 1.0 : 0.3;
        const raw = unit.effectiveness * matchBonus * specializationBonus;
        totalMultiplier += raw;
        unitContributions.push({ unitId: unit.id, raw });

        // Update match quality
        unit.matchQuality = isMatchingForce
          ? MatchQuality.FULL
          : unit.specialization.includes(event.type)
            ? MatchQuality.PARTIAL
            : MatchQuality.NONE;
      }

      // Store per-unit contribution fraction
      for (const { unitId, raw } of unitContributions) {
        const unit = state.units.find((u) => u.id === unitId);
        if (unit) {
          unit.treatmentContribution =
            totalMultiplier > 0 ? raw / totalMultiplier : 0;
        }
      }

      // Check if all required force types are present (among treaters)
      const presentForceTypes = new Set(treatingUnits.map((u) => u.forceType));
      const requiredMet = event.requiredForces.filter((f) =>
        presentForceTypes.has(f),
      ).length;
      const requiredTotal = event.requiredForces.length;

      // Bonus for having all required forces
      if (requiredTotal > 0 && requiredMet === requiredTotal) {
        totalMultiplier *= 1.5;
      }

      // Duration-based progress (preferred) or fallback to resolveRate
      let progressIncrement: number;
      if (event.treatmentDurationTicks && event.treatmentDurationTicks > 0) {
        const baseProgress = 100 / event.treatmentDurationTicks;
        progressIncrement = baseProgress * totalMultiplier;
      } else {
        // Legacy fallback using resolveRate
        progressIncrement = event.resolveRate * totalMultiplier;
      }

      event.resolveProgress = Math.min(
        100,
        event.resolveProgress + progressIncrement,
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
    } else {
      // Clear contributions for units not treating
      for (const unit of onSceneUnits) {
        unit.treatmentContribution = 0;
      }
    }

    // --- Escalation timer ---
    if (!hasResponders && currentStatus !== EventStatus.STABILIZED) {
      event.escalationTimer -= 1;

      if (event.escalationTimer <= 0) {
        escalateEvent(state, event.id);
      }
    }

    // --- Chain events (reduced by areaClosed) ---
    if (event.chainEvents) {
      for (const chain of event.chainEvents) {
        const ticksSinceReport = state.tick - event.reportedAt;
        if (ticksSinceReport === chain.delay) {
          // areaClosed reduces chain event probability by 70%
          const effectiveProbability = event.areaClosed
            ? chain.probability * 0.3
            : chain.probability;

          if (Math.random() < effectiveProbability) {
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
    const chainTypeName = eventTypeNames[chainDef.type] ?? chainDef.type;
    gameRecorder.record({
      tick: state.tick,
      type: TimelineEventType.CHAIN_EVENT,
      description: `אירוע משני: ${chainTypeName} — ${chainDef.locationName}`,
      position: [chainDef.position.x, chainDef.position.y],
      severity: chainDef.severity,
    });
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

  const typeName = eventTypeNames[event.type] ?? event.type;
  gameRecorder.record({
    tick: state.tick,
    type: TimelineEventType.EVENT_RESOLVED,
    eventId: event.id,
    description: `אירוע טופל: ${typeName} — ${event.locationName}`,
    position: [event.position.x, event.position.y],
    severity: event.severity,
  });

  // Units will transition to WRAPPING_UP via updateUnits when they detect resolved event
  // Don't force status change here — let the phase system handle it

  return state;
}

/**
 * Close the area around an event (requires police on scene).
 * Reduces chain event probability and population at risk.
 */
export function closeArea(state: GameState, eventId: string): boolean {
  const event = state.events.find((e) => e.id === eventId);
  if (!event || event.areaClosed) return false;

  // Check for police on scene
  const hasPolice = state.units.some(
    (u) =>
      u.targetEventId === eventId &&
      u.status === UnitStatus.ON_SCENE &&
      u.forceType === ForceType.POLICE,
  );

  if (!hasPolice) return false;

  event.areaClosed = true;
  return true;
}

/**
 * Start civilian evacuation at an event (requires evacuation unit on scene).
 */
export function startEvacuation(state: GameState, eventId: string): boolean {
  const event = state.events.find((e) => e.id === eventId);
  if (!event || event.evacuationActive) return false;

  // Check for evacuation unit on scene
  const hasEvacUnit = state.units.some(
    (u) =>
      u.targetEventId === eventId &&
      u.status === UnitStatus.ON_SCENE &&
      u.forceType === ForceType.EVACUATION,
  );

  if (!hasEvacUnit) return false;

  event.evacuationActive = true;
  return true;
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
