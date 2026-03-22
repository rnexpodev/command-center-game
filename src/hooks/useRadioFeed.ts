/**
 * Hook that monitors game state and generates radio messages.
 * Similar pattern to useSoundEffects — reacts to state diffs.
 */

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/game-store";
import { EventStatus, UnitStatus, UnitPhase } from "@/engine/types";
import type { RadioMessage } from "@/data/radio-templates";
import {
  radioEventSpawned,
  radioUnitDispatched,
  radioUnitArrived,
  radioEventResolved,
  radioEventEscalated,
  radioUnitReturning,
  radioAreaClosed,
  radioEvacuationStarted,
} from "@/engine/radio";

const MAX_MESSAGES = 100;

export function useRadioFeed(): RadioMessage[] {
  const events = useGameStore((s) => s.events);
  const units = useGameStore((s) => s.units);
  const tick = useGameStore((s) => s.tick);
  const isRunning = useGameStore((s) => s.isRunning);

  const [messages, setMessages] = useState<RadioMessage[]>([]);
  const prevEventIds = useRef(new Set<string>());
  const prevEventStatuses = useRef(new Map<string, string>());
  const prevEventSeverities = useRef(new Map<string, number>());
  const prevUnitStatuses = useRef(new Map<string, string>());
  const prevUnitPhases = useRef(new Map<string, string>());
  const prevAreaClosed = useRef(new Map<string, boolean>());
  const prevEvacActive = useRef(new Map<string, boolean>());

  // Reset when game restarts
  useEffect(() => {
    if (!isRunning) {
      setMessages([]);
      prevEventIds.current.clear();
      prevEventStatuses.current.clear();
      prevEventSeverities.current.clear();
      prevUnitStatuses.current.clear();
      prevUnitPhases.current.clear();
      prevAreaClosed.current.clear();
      prevEvacActive.current.clear();
    }
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    const batch: RadioMessage[] = [];

    // New events
    for (const event of events) {
      if (!prevEventIds.current.has(event.id)) {
        batch.push(
          radioEventSpawned(
            tick,
            event.id,
            event.type,
            event.locationName,
            event.severity,
          ),
        );
      }
    }

    // Event status & severity changes
    for (const event of events) {
      const prevStatus = prevEventStatuses.current.get(event.id);
      if (prevStatus && prevStatus !== event.status) {
        if (event.status === EventStatus.RESOLVED) {
          batch.push(radioEventResolved(tick, event.id, event.locationName));
        }
      }
      const prevSev = prevEventSeverities.current.get(event.id);
      if (prevSev !== undefined && event.severity > prevSev) {
        batch.push(radioEventEscalated(tick, event.id, event.locationName));
      }

      // Area closed
      const wasClosed = prevAreaClosed.current.get(event.id);
      if (!wasClosed && event.areaClosed) {
        batch.push(radioAreaClosed(tick, event.id, event.locationName));
      }

      // Evacuation started
      const wasEvac = prevEvacActive.current.get(event.id);
      if (!wasEvac && event.evacuationActive) {
        batch.push(radioEvacuationStarted(tick, event.id, event.locationName));
      }
    }

    // Unit status and phase changes
    for (const unit of units) {
      const prevStatus = prevUnitStatuses.current.get(unit.id);
      const prevPhase = prevUnitPhases.current.get(unit.id);

      if (prevStatus && prevStatus !== unit.status) {
        // Dispatched → en route
        if (
          unit.status === UnitStatus.EN_ROUTE &&
          prevStatus === UnitStatus.AVAILABLE
        ) {
          const target = events.find((e) => e.assignedUnits.includes(unit.id));
          if (target) {
            batch.push(
              radioUnitDispatched(
                tick,
                unit.id,
                unit.name,
                target.id,
                target.locationName,
              ),
            );
          }
        }
        // Arrived on scene
        else if (unit.status === UnitStatus.ON_SCENE) {
          const target = events.find((e) => e.assignedUnits.includes(unit.id));
          batch.push(
            radioUnitArrived(
              tick,
              unit.id,
              unit.name,
              target?.locationName ?? "",
            ),
          );
        }
      }

      // Unit started returning (phase change)
      if (prevPhase && prevPhase !== unit.phase) {
        if (
          unit.phase === UnitPhase.RETURNING &&
          prevPhase === UnitPhase.WRAPPING_UP
        ) {
          batch.push(radioUnitReturning(tick, unit.id, unit.name));
        }
      }
    }

    if (batch.length > 0) {
      setMessages((prev) => [...batch, ...prev].slice(0, MAX_MESSAGES));
    }

    // Update refs for next comparison
    prevEventIds.current = new Set(events.map((e) => e.id));
    prevEventStatuses.current = new Map(events.map((e) => [e.id, e.status]));
    prevEventSeverities.current = new Map(
      events.map((e) => [e.id, e.severity]),
    );
    prevUnitStatuses.current = new Map(units.map((u) => [u.id, u.status]));
    prevUnitPhases.current = new Map(units.map((u) => [u.id, u.phase]));
    prevAreaClosed.current = new Map(events.map((e) => [e.id, e.areaClosed]));
    prevEvacActive.current = new Map(
      events.map((e) => [e.id, e.evacuationActive]),
    );
  }, [events, units, tick, isRunning]);

  return messages;
}
