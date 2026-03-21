// ===== Performance Analytics Engine =====
// Pure TypeScript — computes detailed metrics from game recorder timeline.

import type { TimelineEntry } from "./recorder";
import { TimelineEventType } from "./recorder";
import type { GameEvent, Unit } from "./types";
import { EventStatus, UnitStatus } from "./types";

export interface EventResponseMetric {
  eventId: string;
  eventType: string;
  location: string;
  responseTicks: number;
}

export interface ForceUtilizationMetric {
  activeTicks: number;
  totalTicks: number;
  percent: number;
}

export interface GameAnalytics {
  responseTimeByEvent: EventResponseMetric[];
  avgResponseTime: number;
  forceUtilization: Record<string, ForceUtilizationMetric>;
  eventsByType: Record<string, number>;
  escalationCount: number;
  chainEventCount: number;
  resolutionRate: number;
  peakActiveEvents: number;
  ticksToFirstResponse: number;
}

/** Compute response time per event from timeline entries */
function computeResponseTimes(
  timeline: TimelineEntry[],
  events: GameEvent[],
): EventResponseMetric[] {
  const spawnTicks = new Map<string, number>();
  const dispatchTicks = new Map<string, number>();

  for (const entry of timeline) {
    if (!entry.eventId) continue;
    if (entry.type === TimelineEventType.EVENT_SPAWNED) {
      spawnTicks.set(entry.eventId, entry.tick);
    }
    if (entry.type === TimelineEventType.UNIT_DISPATCHED) {
      if (!dispatchTicks.has(entry.eventId)) {
        dispatchTicks.set(entry.eventId, entry.tick);
      }
    }
  }

  const results: EventResponseMetric[] = [];
  for (const event of events) {
    const spawn = spawnTicks.get(event.id) ?? event.reportedAt;
    const dispatch = dispatchTicks.get(event.id);
    if (dispatch !== undefined) {
      results.push({
        eventId: event.id,
        eventType: event.type,
        location: event.locationName,
        responseTicks: dispatch - spawn,
      });
    }
  }

  return results.sort((a, b) => b.responseTicks - a.responseTicks);
}

/** Compute force utilization from units and total ticks */
function computeForceUtil(
  timeline: TimelineEntry[],
  units: Unit[],
  totalTicks: number,
): Record<string, ForceUtilizationMetric> {
  const activeByForce = new Map<string, number>();

  for (const unit of units) {
    const force = unit.forceType;
    const isActive =
      unit.status !== UnitStatus.AVAILABLE &&
      unit.status !== UnitStatus.UNAVAILABLE;
    const prev = activeByForce.get(force) ?? 0;
    activeByForce.set(force, prev + (isActive ? 1 : 0));
  }

  // Count dispatch entries per force type as activity proxy
  const dispatchCounts = new Map<string, number>();
  for (const entry of timeline) {
    if (entry.type === TimelineEventType.UNIT_DISPATCHED && entry.unitId) {
      const unit = units.find((u) => u.id === entry.unitId);
      if (unit) {
        const prev = dispatchCounts.get(unit.forceType) ?? 0;
        dispatchCounts.set(unit.forceType, prev + 1);
      }
    }
  }

  const result: Record<string, ForceUtilizationMetric> = {};
  const forceTypes = new Set(units.map((u) => u.forceType));

  for (const force of forceTypes) {
    const forceUnits = units.filter((u) => u.forceType === force);
    const maxCapacity = forceUnits.length * totalTicks;
    const dispatches = dispatchCounts.get(force) ?? 0;
    // Estimate active ticks: each dispatch ~= average travel + scene time
    const avgTaskTicks = Math.min(totalTicks * 0.4, 30);
    const activeTicks = Math.min(dispatches * avgTaskTicks, maxCapacity);
    const percent = maxCapacity > 0 ? (activeTicks / maxCapacity) * 100 : 0;

    result[force] = {
      activeTicks: Math.round(activeTicks),
      totalTicks: maxCapacity,
      percent: Math.round(percent),
    };
  }

  return result;
}

/** Compute all analytics from timeline and game state */
export function computeAnalytics(
  timeline: TimelineEntry[],
  totalTicks: number,
  events: GameEvent[],
  units: Unit[],
): GameAnalytics {
  const responseTimeByEvent = computeResponseTimes(timeline, events);

  const avgResponseTime =
    responseTimeByEvent.length > 0
      ? responseTimeByEvent.reduce((s, r) => s + r.responseTicks, 0) /
        responseTimeByEvent.length
      : 0;

  const forceUtilization = computeForceUtil(timeline, units, totalTicks);

  // Count events by type
  const eventsByType: Record<string, number> = {};
  for (const event of events) {
    eventsByType[event.type] = (eventsByType[event.type] ?? 0) + 1;
  }

  // Escalation and chain counts from timeline
  let escalationCount = 0;
  let chainEventCount = 0;
  for (const entry of timeline) {
    if (entry.type === TimelineEventType.EVENT_ESCALATED) escalationCount++;
    if (entry.type === TimelineEventType.CHAIN_EVENT) chainEventCount++;
  }

  // Resolution rate
  const resolved = events.filter(
    (e) => e.status === EventStatus.RESOLVED,
  ).length;
  const resolutionRate = events.length > 0 ? resolved / events.length : 0;

  // Peak active events — scan timeline for concurrent active events
  const activeAtTick = new Map<number, number>();
  for (const entry of timeline) {
    if (entry.type === TimelineEventType.EVENT_SPAWNED) {
      const current = activeAtTick.get(entry.tick) ?? 0;
      activeAtTick.set(entry.tick, current + 1);
    }
  }
  // Simple approach: count spawn/resolve to track running total
  let running = 0;
  let peak = 0;
  const sorted = [...timeline].sort((a, b) => a.tick - b.tick);
  for (const entry of sorted) {
    if (entry.type === TimelineEventType.EVENT_SPAWNED) running++;
    if (entry.type === TimelineEventType.EVENT_RESOLVED) running--;
    if (running > peak) peak = running;
  }

  // Ticks to first response
  const firstDispatch = timeline.find(
    (e) => e.type === TimelineEventType.UNIT_DISPATCHED,
  );
  const ticksToFirstResponse = firstDispatch ? firstDispatch.tick : 0;

  return {
    responseTimeByEvent,
    avgResponseTime: Math.round(avgResponseTime),
    forceUtilization,
    eventsByType,
    escalationCount,
    chainEventCount,
    resolutionRate,
    peakActiveEvents: peak,
    ticksToFirstResponse,
  };
}
