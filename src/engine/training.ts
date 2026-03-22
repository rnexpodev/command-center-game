// ===== Training Mode Engine =====
// Pure TypeScript — no React imports

import type { EventType, GameState, Position, Severity } from "./types";
import { EventStatus, MatchQuality, UnitPhase, UnitStatus } from "./types";
import { generateId } from "../lib/utils";
import { EVENT_TYPE_INFO } from "../data/event-types";
import { UNIT_TEMPLATES } from "../data/unit-types";
import { baseLocations } from "../data/base-locations";
import { spawnEvent } from "./events";

/**
 * Create and spawn a manual event at the given position.
 * Used by the instructor to inject events during gameplay.
 */
export function createManualEvent(
  state: GameState,
  type: EventType,
  position: Position,
  severity: Severity,
): void {
  const info = EVENT_TYPE_INFO[type];

  const eventDef = {
    type,
    severity,
    position,
    locationName: `${info.nameHe} (ידני)`,
    description: info.descriptionHe,
    requiredForces: info.requiredForces,
    casualties: 0,
    threatRadius: info.threatRadius,
    blocksRoad: info.blocksRoad,
    fireDanger: info.fireDanger,
    collapseDanger: info.collapseDanger,
    needsEvacuation: info.needsEvacuation,
    infrastructureDamage: info.infrastructureDamage,
    escalationTimer: info.escalationTimer,
    escalationTarget: info.escalationTarget,
    chainEvents: info.chainEvents,
    resolveRate: info.resolveRate,
  };

  spawnEvent(state, eventDef);
}

/**
 * Add 5 extra units (one from each major force type) to the game.
 * Uses base locations to set realistic positions.
 */
export function addExtraUnits(state: GameState): void {
  const templates = UNIT_TEMPLATES.slice(0, 5);

  for (const template of templates) {
    const base =
      baseLocations.find((b) => b.forceTypes.includes(template.forceType)) ??
      baseLocations[0];

    state.units.push({
      id: generateId("unit"),
      name: `${template.nameHe} (אימון)`,
      forceType: template.forceType,
      status: UnitStatus.AVAILABLE,
      phase: UnitPhase.IDLE,
      position: { ...base.position },
      basePosition: { ...base.position },
      speed: template.speed,
      specialization: template.specialization,
      effectiveness: template.effectiveness,
      targetEventId: undefined,
      arrivalTick: undefined,
      treatmentContribution: 0,
      matchQuality: MatchQuality.NONE,
    });
  }
}

/**
 * Clear all active events and release all units back to base.
 */
export function clearEvents(state: GameState): void {
  for (const event of state.events) {
    if (event.status !== EventStatus.RESOLVED) {
      event.status = EventStatus.RESOLVED;
      event.resolveProgress = 100;
    }
  }

  for (const unit of state.units) {
    if (unit.targetEventId) {
      unit.status = UnitStatus.RETURNING;
      unit.targetEventId = undefined;
      unit.arrivalTick = undefined;
    }
  }
}

/** A training objective that can be checked against game state */
export interface TrainingObjective {
  id: string;
  nameHe: string;
  descriptionHe: string;
  check: (state: GameState) => boolean;
}

/** Predefined training objectives */
export const TRAINING_OBJECTIVES: TrainingObjective[] = [
  {
    id: "zero_escalations",
    nameHe: "אפס הסלמות",
    descriptionHe: "סיים ללא אירועי הסלמה",
    check: (s) => s.score.eventsEscalated === 0,
  },
  {
    id: "fast_response",
    nameHe: "תגובה מהירה",
    descriptionHe: "הגב לכל אירוע תוך 20 טיקים",
    check: (s) =>
      s.events.every(
        (e) =>
          e.status === EventStatus.REPORTED ||
          e.assignedUnits.length > 0 ||
          (e.treatmentStartTick !== undefined &&
            e.treatmentStartTick - e.reportedAt <= 20),
      ),
  },
  {
    id: "full_utilization",
    nameHe: "ניצול מלא",
    descriptionHe: "השתמש בכל סוגי הכוחות לפחות פעם אחת",
    check: (s) => {
      const usedTypes = new Set(
        s.units
          .filter((u) => u.status !== UnitStatus.AVAILABLE)
          .map((u) => u.forceType),
      );
      const allTypes = new Set(s.units.map((u) => u.forceType));
      return allTypes.size > 0 && usedTypes.size >= allTypes.size;
    },
  },
  {
    id: "zero_casualties",
    nameHe: "אפס נפגעים",
    descriptionHe: "סיים ללא נפגעים",
    check: (s) => s.events.every((e) => e.casualties === 0),
  },
];
