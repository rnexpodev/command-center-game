import { EventType } from "@/engine/types";

interface DurationConfig {
  baseTicks: number;
  minTicks: number;
  maxTicks: number;
}

const durationTable: Record<string, DurationConfig> = {
  [EventType.BUILDING_FIRE]: { baseTicks: 80, minTicks: 80, maxTicks: 300 },
  [EventType.BUILDING_COLLAPSE]: {
    baseTicks: 150,
    minTicks: 150,
    maxTicks: 500,
  },
  [EventType.TRAFFIC_ACCIDENT]: { baseTicks: 40, minTicks: 20, maxTicks: 80 },
  [EventType.GAS_LEAK]: { baseTicks: 60, minTicks: 42, maxTicks: 90 },
  [EventType.POWER_OUTAGE]: { baseTicks: 50, minTicks: 25, maxTicks: 100 },
  [EventType.ROAD_BLOCKAGE]: { baseTicks: 30, minTicks: 30, maxTicks: 30 },
  [EventType.HAZMAT]: { baseTicks: 120, minTicks: 96, maxTicks: 240 },
  [EventType.FLOODING]: { baseTicks: 90, minTicks: 63, maxTicks: 135 },
  [EventType.MASS_CASUALTY]: { baseTicks: 100, minTicks: 50, maxTicks: 200 },
  [EventType.EVACUATION_NEEDED]: {
    baseTicks: 70,
    minTicks: 49,
    maxTicks: 140,
  },
  [EventType.MISSILE_DIRECT_HIT]: {
    baseTicks: 200,
    minTicks: 200,
    maxTicks: 500,
  },
  [EventType.MISSILE_OPEN_AREA]: {
    baseTicks: 35,
    minTicks: 35,
    maxTicks: 35,
  },
  [EventType.MISSILE_NEAR_BUILDING]: {
    baseTicks: 100,
    minTicks: 100,
    maxTicks: 250,
  },
  [EventType.MISSILE_NEAR_SENSITIVE]: {
    baseTicks: 130,
    minTicks: 130,
    maxTicks: 130,
  },
  [EventType.INTERCEPTION_DEBRIS]: {
    baseTicks: 50,
    minTicks: 50,
    maxTicks: 50,
  },
  [EventType.MISSILE_ROAD_HIT]: {
    baseTicks: 80,
    minTicks: 60,
    maxTicks: 120,
  },
  [EventType.MISSILE_COMPOUND]: {
    baseTicks: 250,
    minTicks: 200,
    maxTicks: 400,
  },
};

/**
 * Calculate treatment duration in ticks based on event type and context.
 * Uses threatRadius as area heuristic and casualties for severity scaling.
 */
export function calculateBaseDuration(
  eventType: string,
  context?: {
    threatRadius?: number;
    casualties?: number;
    severity?: number;
  },
): number {
  const config = durationTable[eventType];
  if (!config) return 60; // fallback

  if (!context) return config.baseTicks;

  let duration = config.baseTicks;

  // Scale by threat radius (area size heuristic)
  if (context.threatRadius && context.threatRadius > 0) {
    // Normalize: 50m = small (0.7x), 100m = medium (1x), 200m+ = large (1.5x)
    const areaScale = Math.max(0.7, Math.min(2.0, context.threatRadius / 100));
    duration *= areaScale;
  }

  // Scale by casualties (severity/complexity heuristic)
  if (context.casualties && context.casualties > 0) {
    // Each casualty adds ~10% to duration, capped at 2x
    const casualtyScale = Math.min(2.0, 1 + context.casualties * 0.1);
    duration *= casualtyScale;
  }

  // Scale by severity
  if (context.severity) {
    // Severity 1=0.7x, 2=1x, 3=1.3x, 4=1.6x
    const severityScale = 0.4 + context.severity * 0.3;
    duration *= severityScale;
  }

  // Clamp to configured range
  return Math.round(
    Math.max(config.minTicks, Math.min(config.maxTicks, duration)),
  );
}
