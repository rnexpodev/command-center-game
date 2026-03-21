/**
 * React hook that monitors game state changes and triggers appropriate sounds.
 * Sounds are a side effect of state changes — no sound logic in the engine.
 */

import { useEffect, useRef } from "react";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { audioManager, getAlertSoundForSeverity } from "@/engine/audio";
import { SoundId } from "@/data/sounds";
import { EventStatus, UnitStatus } from "@/engine/types";

export function useSoundEffects(): void {
  const events = useGameStore((s) => s.events);
  const units = useGameStore((s) => s.units);
  const isRunning = useGameStore((s) => s.isRunning);
  const soundEnabled = useUIStore((s) => s.soundEnabled);
  const soundVolume = useUIStore((s) => s.soundVolume);

  // Track previous state for diff detection
  const prevEventsRef = useRef<typeof events>([]);
  const prevUnitsRef = useRef<typeof units>([]);
  const prevEventIds = useRef(new Set<string>());
  const prevEventStatuses = useRef(new Map<string, string>());
  const prevUnitStatuses = useRef(new Map<string, string>());

  // Sync mute/volume with audio manager
  useEffect(() => {
    audioManager.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    audioManager.setVolume(soundVolume);
  }, [soundVolume]);

  // Start/stop ambient when game starts/stops
  useEffect(() => {
    if (isRunning && soundEnabled) {
      audioManager.startAmbient();
    } else {
      audioManager.stopAmbient();
    }
    return () => audioManager.stopAmbient();
  }, [isRunning, soundEnabled]);

  // Detect state changes and trigger sounds
  useEffect(() => {
    if (!soundEnabled || !isRunning) return;

    const currentEventIds = new Set(events.map((e) => e.id));
    const currentEventStatuses = new Map(events.map((e) => [e.id, e.status]));
    const currentUnitStatuses = new Map(units.map((u) => [u.id, u.status]));

    // New events spawned
    for (const event of events) {
      if (!prevEventIds.current.has(event.id)) {
        audioManager.play(getAlertSoundForSeverity(event.severity));
      }
    }

    // Event status changes
    for (const event of events) {
      const prevStatus = prevEventStatuses.current.get(event.id);
      if (prevStatus && prevStatus !== event.status) {
        if (event.status === EventStatus.RESOLVED) {
          audioManager.play(SoundId.RESOLVED);
        } else if (
          event.status === EventStatus.REPORTED &&
          prevStatus !== EventStatus.REPORTED
        ) {
          // Chain event spawned (status reverted or new sub-event)
          audioManager.play(SoundId.CHAIN_EVENT);
        }
      }

      // Escalation: severity increased
      if (prevEventsRef.current.length > 0) {
        const prevEvent = prevEventsRef.current.find((e) => e.id === event.id);
        if (prevEvent && event.severity > prevEvent.severity) {
          audioManager.play(SoundId.ESCALATION);
        }
      }
    }

    // Unit status changes
    for (const unit of units) {
      const prevStatus = prevUnitStatuses.current.get(unit.id);
      if (prevStatus && prevStatus !== unit.status) {
        if (
          unit.status === UnitStatus.EN_ROUTE &&
          prevStatus === UnitStatus.AVAILABLE
        ) {
          audioManager.play(SoundId.DISPATCH);
        } else if (unit.status === UnitStatus.ON_SCENE) {
          audioManager.play(SoundId.UNIT_ARRIVED);
        } else if (unit.status === UnitStatus.RETURNING) {
          audioManager.play(SoundId.UNIT_RETURNING);
        }
      }
    }

    // Update refs for next comparison
    prevEventsRef.current = events;
    prevUnitsRef.current = units;
    prevEventIds.current = currentEventIds;
    prevEventStatuses.current = currentEventStatuses;
    prevUnitStatuses.current = currentUnitStatuses;
  }, [events, units, soundEnabled, isRunning]);
}
