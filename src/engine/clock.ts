import { GameSpeed } from "./types";

export interface ClockManager {
  /** Start the clock loop */
  start: () => void;
  /** Stop the clock loop */
  stop: () => void;
  /** Set game speed */
  setSpeed: (speed: GameSpeed) => void;
  /** Get current speed */
  getSpeed: () => GameSpeed;
  /** Whether the clock is running */
  isRunning: () => boolean;
  /** Destroy the clock (cleanup) */
  destroy: () => void;
}

/**
 * Create a game clock that fires `onTick` at intervals based on speed.
 * At NORMAL speed, one tick fires every ~1000ms.
 * At FAST (2x), every ~500ms. At VERY_FAST (4x), every ~250ms.
 * PAUSED = no ticks.
 */
export function createClock(onTick: () => void): ClockManager {
  let speed: GameSpeed = GameSpeed.NORMAL;
  let running = false;
  let rafId: number | null = null;
  let lastTickTime = 0;

  const BASE_INTERVAL_MS = 1000; // 1 tick per second at normal speed

  function getIntervalMs(): number {
    if (speed === GameSpeed.PAUSED) return Infinity;
    return BASE_INTERVAL_MS / speed;
  }

  function loop(timestamp: number) {
    if (!running) return;

    if (speed !== GameSpeed.PAUSED) {
      const interval = getIntervalMs();
      const elapsed = timestamp - lastTickTime;

      if (elapsed >= interval) {
        // Fire as many ticks as elapsed time allows (catchup)
        const ticksToFire = Math.floor(elapsed / interval);
        for (let i = 0; i < ticksToFire; i++) {
          onTick();
        }
        lastTickTime = timestamp - (elapsed % interval);
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastTickTime = performance.now();
      rafId = requestAnimationFrame(loop);
    },

    stop() {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },

    setSpeed(newSpeed: GameSpeed) {
      speed = newSpeed;
    },

    getSpeed() {
      return speed;
    },

    isRunning() {
      return running;
    },

    destroy() {
      this.stop();
    },
  };
}
