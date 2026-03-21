// ===== Game Recorder =====
// Pure TypeScript — records timeline entries during gameplay for after-action replay.

export const TimelineEventType = {
  EVENT_SPAWNED: "event_spawned",
  EVENT_ESCALATED: "event_escalated",
  EVENT_RESOLVED: "event_resolved",
  UNIT_DISPATCHED: "unit_dispatched",
  UNIT_ARRIVED: "unit_arrived",
  CHAIN_EVENT: "chain_event",
} as const;
export type TimelineEventType =
  (typeof TimelineEventType)[keyof typeof TimelineEventType];

export interface TimelineEntry {
  tick: number;
  type: TimelineEventType;
  eventId?: string;
  unitId?: string;
  description: string;
  position?: [number, number];
  severity?: number;
}

/** Records game events for after-action replay */
class GameRecorder {
  private entries: TimelineEntry[] = [];

  record(entry: TimelineEntry): void {
    this.entries.push(entry);
  }

  getTimeline(): TimelineEntry[] {
    return this.entries;
  }

  getEntriesAtTick(tick: number): TimelineEntry[] {
    return this.entries.filter((e) => e.tick === tick);
  }

  getMaxTick(): number {
    if (this.entries.length === 0) return 0;
    return Math.max(...this.entries.map((e) => e.tick));
  }

  reset(): void {
    this.entries = [];
  }
}

/** Singleton recorder instance — shared across engine and UI */
export const gameRecorder = new GameRecorder();
