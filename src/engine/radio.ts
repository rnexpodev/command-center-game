/**
 * Radio message generator — produces Hebrew command center communications
 * from game state changes. Pure TypeScript, no React imports.
 */

import { generateId } from "@/lib/utils";
import { Severity } from "./types";
import {
  type RadioMessage,
  RadioPriority,
  EVENT_REPORT_TEMPLATES,
  DEFAULT_REPORT_TEMPLATE,
  DISPATCH_TEMPLATES,
  ARRIVAL_TEMPLATES,
  RESOLVED_TEMPLATES,
  ESCALATION_TEMPLATES,
  CHAIN_EVENT_TEMPLATES,
  RETURNING_TEMPLATES,
  AREA_CLOSED_TEMPLATES,
  EVACUATION_STARTED_TEMPLATES,
} from "@/data/radio-templates";
import { eventTypeNames } from "@/data/map-icons";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? key);
}

function priorityFromSeverity(severity: number): RadioPriority {
  if (severity >= Severity.CRITICAL) return RadioPriority.CRITICAL;
  if (severity >= Severity.HIGH) return RadioPriority.IMPORTANT;
  return RadioPriority.ROUTINE;
}

/** Generate a radio message for a new event */
export function radioEventSpawned(
  tick: number,
  eventId: string,
  eventType: string,
  location: string,
  severity: number,
): RadioMessage {
  const templates = EVENT_REPORT_TEMPLATES[eventType] ?? [
    DEFAULT_REPORT_TEMPLATE,
  ];
  const text = fillTemplate(pick(templates), { location });
  return {
    id: generateId(),
    tick,
    sender: "מוקד",
    text,
    priority: priorityFromSeverity(severity),
    eventId,
  };
}

/** Generate a radio message for unit dispatch */
export function radioUnitDispatched(
  tick: number,
  unitId: string,
  unitName: string,
  eventId: string,
  location: string,
): RadioMessage {
  const text = fillTemplate(pick(DISPATCH_TEMPLATES), {
    unitName,
    location,
  });
  return {
    id: generateId(),
    tick,
    sender: unitName,
    text,
    priority: RadioPriority.ROUTINE,
    eventId,
    unitId,
  };
}

/** Generate a radio message for unit arrival */
export function radioUnitArrived(
  tick: number,
  unitId: string,
  unitName: string,
  location: string,
): RadioMessage {
  const text = fillTemplate(pick(ARRIVAL_TEMPLATES), {
    unitName,
    location,
  });
  return {
    id: generateId(),
    tick,
    sender: unitName,
    text,
    priority: RadioPriority.ROUTINE,
    unitId,
  };
}

/** Generate a radio message for event resolution */
export function radioEventResolved(
  tick: number,
  eventId: string,
  location: string,
): RadioMessage {
  const text = fillTemplate(pick(RESOLVED_TEMPLATES), { location });
  return {
    id: generateId(),
    tick,
    sender: "מוקד",
    text,
    priority: RadioPriority.ROUTINE,
    eventId,
  };
}

/** Generate a radio message for event escalation */
export function radioEventEscalated(
  tick: number,
  eventId: string,
  location: string,
): RadioMessage {
  const text = fillTemplate(pick(ESCALATION_TEMPLATES), { location });
  return {
    id: generateId(),
    tick,
    sender: "מוקד",
    text,
    priority: RadioPriority.CRITICAL,
    eventId,
  };
}

/** Generate a radio message for unit returning to base */
export function radioUnitReturning(
  tick: number,
  unitId: string,
  unitName: string,
): RadioMessage {
  const text = fillTemplate(pick(RETURNING_TEMPLATES), { unitName });
  return {
    id: generateId(),
    tick,
    sender: unitName,
    text,
    priority: RadioPriority.ROUTINE,
    unitId,
  };
}

/** Generate a radio message for area closure */
export function radioAreaClosed(
  tick: number,
  eventId: string,
  location: string,
): RadioMessage {
  const text = fillTemplate(pick(AREA_CLOSED_TEMPLATES), { location });
  return {
    id: generateId(),
    tick,
    sender: "מוקד",
    text,
    priority: RadioPriority.IMPORTANT,
    eventId,
  };
}

/** Generate a radio message for evacuation start */
export function radioEvacuationStarted(
  tick: number,
  eventId: string,
  location: string,
): RadioMessage {
  const text = fillTemplate(pick(EVACUATION_STARTED_TEMPLATES), { location });
  return {
    id: generateId(),
    tick,
    sender: "מוקד",
    text,
    priority: RadioPriority.IMPORTANT,
    eventId,
  };
}

/** Generate a radio message for chain events */
export function radioChainEvent(
  tick: number,
  eventId: string,
  eventType: string,
  location: string,
): RadioMessage {
  const eventTypeName = eventTypeNames[eventType] ?? eventType;
  const text = fillTemplate(pick(CHAIN_EVENT_TEMPLATES), {
    location,
    eventType: eventTypeName,
  });
  return {
    id: generateId(),
    tick,
    sender: "מוקד",
    text,
    priority: RadioPriority.IMPORTANT,
    eventId,
  };
}
