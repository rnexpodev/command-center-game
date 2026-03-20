// ===== Game Engine Types =====
// Pure TypeScript — no React imports
// Using `as const` objects instead of `enum` for erasableSyntaxOnly compatibility

/** Event severity levels */
export const Severity = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
} as const;
export type Severity = (typeof Severity)[keyof typeof Severity];

/** Event status lifecycle */
export const EventStatus = {
  REPORTED: "reported",
  RESPONDING: "responding",
  STABILIZED: "stabilized",
  ESCALATED: "escalated",
  RESOLVED: "resolved",
} as const;
export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

/** Unit status */
export const UnitStatus = {
  AVAILABLE: "available",
  DISPATCHED: "dispatched",
  EN_ROUTE: "en_route",
  ON_SCENE: "on_scene",
  RETURNING: "returning",
  UNAVAILABLE: "unavailable",
} as const;
export type UnitStatus = (typeof UnitStatus)[keyof typeof UnitStatus];

/** Unit types (Israeli emergency forces) */
export const ForceType = {
  FIRE: "fire",
  MAGEN_DAVID: "mda",
  POLICE: "police",
  RESCUE: "rescue",
  ENGINEERING: "engineering",
  WELFARE: "welfare",
  INFRASTRUCTURE: "infrastructure",
  EVACUATION: "evacuation",
  HOMEFRONT: "homefront",
} as const;
export type ForceType = (typeof ForceType)[keyof typeof ForceType];

/** Event types */
export const EventType = {
  BUILDING_FIRE: "building_fire",
  BUILDING_COLLAPSE: "building_collapse",
  TRAFFIC_ACCIDENT: "traffic_accident",
  GAS_LEAK: "gas_leak",
  POWER_OUTAGE: "power_outage",
  ROAD_BLOCKAGE: "road_blockage",
  HAZMAT: "hazmat",
  FLOODING: "flooding",
  MASS_CASUALTY: "mass_casualty",
  EVACUATION_NEEDED: "evacuation_needed",
  // Missile strike event types
  MISSILE_DIRECT_HIT: "missile_direct_hit",
  MISSILE_OPEN_AREA: "missile_open_area",
  MISSILE_NEAR_BUILDING: "missile_near_building",
  MISSILE_NEAR_SENSITIVE: "missile_near_sensitive",
  INTERCEPTION_DEBRIS: "interception_debris",
  MISSILE_ROAD_HIT: "missile_road_hit",
  MISSILE_COMPOUND: "missile_compound",
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

/** Game speed multiplier */
export const GameSpeed = {
  PAUSED: 0,
  NORMAL: 1,
  FAST: 2,
  VERY_FAST: 4,
} as const;
export type GameSpeed = (typeof GameSpeed)[keyof typeof GameSpeed];

/** Scenario difficulty */
export const Difficulty = {
  TUTORIAL: "tutorial",
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

/** Map coordinates (lat/lng style) */
export interface Position {
  x: number;
  y: number;
}

/** A single emergency event in the simulation */
export interface GameEvent {
  id: string;
  type: EventType;
  severity: Severity;
  status: EventStatus;
  position: Position;
  locationName: string;
  description: string;
  reportedAt: number;
  requiredForces: ForceType[];
  assignedUnits: string[];
  casualties: number;
  threatRadius: number;
  blocksRoad: boolean;
  fireDanger: boolean;
  collapseDanger: boolean;
  needsEvacuation: boolean;
  infrastructureDamage: boolean;
  escalationTimer: number;
  escalationTarget?: EventType;
  chainEvents?: ChainEventDef[];
  missileExtension?: MissileEventExtension;
  resolveProgress: number;
  resolveRate: number;
  /** Tick when first unit arrived on scene */
  treatmentStartTick?: number;
  /** Total ticks expected for resolution (calculated at spawn) */
  treatmentDurationTicks?: number;
}

/** Definition for a chain event that may spawn from a parent */
export interface ChainEventDef {
  type: EventType;
  delay: number;
  probability: number;
}

/** A progressive information update that reveals data over time (fog of war) */
export interface InformationUpdate {
  tick: number;
  message: string;
  revealsData: Partial<GameEvent>;
}

/** Missile-specific extension data for missile strike events */
export interface MissileEventExtension {
  impactType:
    | "direct"
    | "open_area"
    | "near_building"
    | "near_sensitive"
    | "debris"
    | "road"
    | "compound";
  warheadType: "qassam" | "grad" | "fajr" | "ballistic" | "cruise" | "debris";
  initialUncertainty: boolean;
  informationUpdates: InformationUpdate[];
  civilianPanic: boolean;
  secondaryRisks: string[];
}

/** A dispatched or available unit */
export interface Unit {
  id: string;
  name: string;
  forceType: ForceType;
  status: UnitStatus;
  position: Position;
  basePosition: Position;
  speed: number;
  targetEventId?: string;
  arrivalTick?: number;
  specialization: string[];
  effectiveness: number;
}

/** A wave of events to spawn at a given tick */
export interface ScenarioWave {
  tick: number;
  events: Omit<
    GameEvent,
    "id" | "reportedAt" | "assignedUnits" | "status" | "resolveProgress"
  >[];
}

/** Full scenario definition */
export interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  cityId: string;
  waves: ScenarioWave[];
  durationTicks: number;
  initialUnits: Omit<Unit, "id" | "status" | "targetEventId" | "arrivalTick">[];
}

/** Running score metrics */
export interface ScoreMetrics {
  responseTime: number;
  stabilizationRate: number;
  casualtiesPrevented: number;
  resourceEfficiency: number;
  eventsResolved: number;
  eventsEscalated: number;
  totalScore: number;
  grade: "S" | "A" | "B" | "C" | "D" | "F";
}

/** Full game state */
export interface GameState {
  tick: number;
  speed: GameSpeed;
  events: GameEvent[];
  units: Unit[];
  score: ScoreMetrics;
  cityAlert: Severity;
  activeScenario: Scenario | null;
  isRunning: boolean;
  isComplete: boolean;
  nextEventId: number;
  nextUnitId: number;
}
