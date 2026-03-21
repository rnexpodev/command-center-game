import type { GameState } from "./types";
import { EventStatus, EventType, Severity } from "./types";
import { gameRecorder, TimelineEventType } from "./recorder";
import { eventTypeNames } from "../data/map-icons";

/** Configuration for how an event escalates */
export interface EscalationRule {
  /** Ticks before escalation if unattended */
  timer: number;
  /** Severity increase on escalation */
  severityIncrease: number;
  /** Event type it morphs into (if any) */
  escalationTarget?: EventType;
  /** Additional casualties per escalation */
  casualtiesPerEscalation: number;
  /** Does the threat radius grow? */
  radiusGrowth: number;
  /** Chain events that can trigger */
  chainEvents?: { type: EventType; delay: number; probability: number }[];
}

/** Escalation rules per event type */
const ESCALATION_RULES: Record<EventType, EscalationRule> = {
  [EventType.BUILDING_FIRE]: {
    timer: 60,
    severityIncrease: 1,
    casualtiesPerEscalation: 2,
    radiusGrowth: 30,
    chainEvents: [
      { type: EventType.BUILDING_COLLAPSE, delay: 90, probability: 0.3 },
      { type: EventType.EVACUATION_NEEDED, delay: 45, probability: 0.5 },
    ],
  },
  [EventType.BUILDING_COLLAPSE]: {
    timer: 30,
    severityIncrease: 1,
    casualtiesPerEscalation: 5,
    radiusGrowth: 20,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 5, probability: 0.8 },
      { type: EventType.GAS_LEAK, delay: 15, probability: 0.4 },
    ],
  },
  [EventType.TRAFFIC_ACCIDENT]: {
    timer: 45,
    severityIncrease: 1,
    casualtiesPerEscalation: 1,
    radiusGrowth: 10,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 10, probability: 0.9 },
    ],
  },
  [EventType.GAS_LEAK]: {
    timer: 40,
    severityIncrease: 1,
    escalationTarget: EventType.BUILDING_FIRE,
    casualtiesPerEscalation: 3,
    radiusGrowth: 50,
    chainEvents: [
      { type: EventType.EVACUATION_NEEDED, delay: 20, probability: 0.7 },
    ],
  },
  [EventType.POWER_OUTAGE]: {
    timer: 90,
    severityIncrease: 1,
    casualtiesPerEscalation: 0,
    radiusGrowth: 100,
  },
  [EventType.ROAD_BLOCKAGE]: {
    timer: 120,
    severityIncrease: 0,
    casualtiesPerEscalation: 0,
    radiusGrowth: 0,
  },
  [EventType.HAZMAT]: {
    timer: 35,
    severityIncrease: 1,
    casualtiesPerEscalation: 4,
    radiusGrowth: 80,
    chainEvents: [
      { type: EventType.EVACUATION_NEEDED, delay: 15, probability: 0.8 },
      { type: EventType.MASS_CASUALTY, delay: 40, probability: 0.3 },
    ],
  },
  [EventType.FLOODING]: {
    timer: 50,
    severityIncrease: 1,
    casualtiesPerEscalation: 1,
    radiusGrowth: 60,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 20, probability: 0.7 },
      { type: EventType.POWER_OUTAGE, delay: 30, probability: 0.5 },
    ],
  },
  [EventType.MASS_CASUALTY]: {
    timer: 20,
    severityIncrease: 1,
    casualtiesPerEscalation: 8,
    radiusGrowth: 10,
    chainEvents: [
      { type: EventType.EVACUATION_NEEDED, delay: 10, probability: 0.9 },
    ],
  },
  [EventType.EVACUATION_NEEDED]: {
    timer: 40,
    severityIncrease: 1,
    casualtiesPerEscalation: 2,
    radiusGrowth: 40,
  },
  // Missile strike escalation rules
  [EventType.MISSILE_DIRECT_HIT]: {
    timer: 25,
    severityIncrease: 1,
    casualtiesPerEscalation: 6,
    radiusGrowth: 40,
    chainEvents: [
      { type: EventType.BUILDING_COLLAPSE, delay: 10, probability: 0.6 },
      { type: EventType.BUILDING_FIRE, delay: 5, probability: 0.7 },
      { type: EventType.ROAD_BLOCKAGE, delay: 8, probability: 0.8 },
      { type: EventType.POWER_OUTAGE, delay: 15, probability: 0.5 },
      { type: EventType.GAS_LEAK, delay: 12, probability: 0.4 },
    ],
  },
  [EventType.MISSILE_OPEN_AREA]: {
    timer: 60,
    severityIncrease: 1,
    casualtiesPerEscalation: 1,
    radiusGrowth: 20,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 10, probability: 0.5 },
    ],
  },
  [EventType.MISSILE_NEAR_BUILDING]: {
    timer: 35,
    severityIncrease: 1,
    casualtiesPerEscalation: 3,
    radiusGrowth: 30,
    chainEvents: [
      { type: EventType.BUILDING_FIRE, delay: 10, probability: 0.4 },
      { type: EventType.EVACUATION_NEEDED, delay: 15, probability: 0.6 },
      { type: EventType.POWER_OUTAGE, delay: 20, probability: 0.3 },
    ],
  },
  [EventType.MISSILE_NEAR_SENSITIVE]: {
    timer: 20,
    severityIncrease: 1,
    casualtiesPerEscalation: 4,
    radiusGrowth: 25,
    chainEvents: [
      { type: EventType.EVACUATION_NEEDED, delay: 5, probability: 0.9 },
      { type: EventType.MASS_CASUALTY, delay: 25, probability: 0.3 },
    ],
  },
  [EventType.INTERCEPTION_DEBRIS]: {
    timer: 50,
    severityIncrease: 1,
    casualtiesPerEscalation: 1,
    radiusGrowth: 15,
    chainEvents: [
      { type: EventType.BUILDING_FIRE, delay: 8, probability: 0.3 },
    ],
  },
  [EventType.MISSILE_ROAD_HIT]: {
    timer: 45,
    severityIncrease: 1,
    casualtiesPerEscalation: 2,
    radiusGrowth: 30,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 3, probability: 0.95 },
      { type: EventType.POWER_OUTAGE, delay: 20, probability: 0.3 },
    ],
  },
  [EventType.MISSILE_COMPOUND]: {
    timer: 20,
    severityIncrease: 1,
    casualtiesPerEscalation: 5,
    radiusGrowth: 50,
    chainEvents: [
      { type: EventType.BUILDING_COLLAPSE, delay: 8, probability: 0.5 },
      { type: EventType.BUILDING_FIRE, delay: 5, probability: 0.8 },
      { type: EventType.GAS_LEAK, delay: 10, probability: 0.5 },
      { type: EventType.EVACUATION_NEEDED, delay: 12, probability: 0.7 },
      { type: EventType.ROAD_BLOCKAGE, delay: 6, probability: 0.9 },
    ],
  },
};

/** Get escalation rules for a given event type */
export function getEscalationRules(eventType: EventType): EscalationRule {
  return ESCALATION_RULES[eventType];
}

/** Check if an event should escalate based on its timer */
export function checkEscalation(
  event: { escalationTimer: number; status: EventStatus },
  _tick: number,
): boolean {
  if (
    event.status === EventStatus.RESOLVED ||
    event.status === EventStatus.STABILIZED
  ) {
    return false;
  }
  return event.escalationTimer <= 0;
}

/**
 * Escalate an event: increase severity, add casualties,
 * grow radius, potentially morph type, refresh timer.
 */
export function escalateEvent(state: GameState, eventId: string): GameState {
  const event = state.events.find((e) => e.id === eventId);
  if (!event) return state;

  const rules = getEscalationRules(event.type);

  // Increase severity (cap at CRITICAL)
  const newSev = Math.min(
    Severity.CRITICAL,
    event.severity + rules.severityIncrease,
  ) as Severity;
  event.severity = newSev;

  // Add casualties
  event.casualties += rules.casualtiesPerEscalation;

  // Grow threat radius
  event.threatRadius += rules.radiusGrowth;

  // Morph event type if escalation target is defined
  if (rules.escalationTarget) {
    event.type = rules.escalationTarget;
    event.escalationTarget = undefined;
    // Reload chain events from new type
    const newRules = getEscalationRules(event.type);
    event.chainEvents = newRules.chainEvents ?? [];
  }

  // Mark as escalated
  event.status = EventStatus.ESCALATED;

  const typeName = eventTypeNames[event.type] ?? event.type;
  gameRecorder.record({
    tick: state.tick,
    type: TimelineEventType.EVENT_ESCALATED,
    eventId: event.id,
    description: `אירוע החמיר: ${typeName} — חומרה ${event.severity}`,
    position: [event.position.x, event.position.y],
    severity: event.severity,
  });

  // Reset escalation timer for next potential escalation
  const newRules = getEscalationRules(event.type);
  event.escalationTimer = newRules.timer;

  return state;
}
