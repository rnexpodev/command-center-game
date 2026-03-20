import { ForceType } from "../engine/types";

/** Template for creating units of each force type */
export interface UnitTemplate {
  forceType: ForceType;
  nameHe: string;
  speed: number;
  specialization: string[];
  effectiveness: number;
}

/** Hebrew force type display names */
export const FORCE_TYPE_NAMES: Record<ForceType, string> = {
  [ForceType.FIRE]: "כיבוי אש",
  [ForceType.MAGEN_DAVID]: 'מד"א',
  [ForceType.POLICE]: "משטרה",
  [ForceType.RESCUE]: "חילוץ והצלה",
  [ForceType.ENGINEERING]: "הנדסה עירונית",
  [ForceType.WELFARE]: "רווחה",
  [ForceType.INFRASTRUCTURE]: "תשתיות",
  [ForceType.EVACUATION]: "פינוי",
  [ForceType.HOMEFRONT]: "פיקוד העורף",
};

/**
 * All available unit templates.
 * Each entry defines a single nameable unit with its capabilities.
 */
export const UNIT_TEMPLATES: UnitTemplate[] = [
  // --- Fire / כיבוי אש ---
  {
    forceType: ForceType.FIRE,
    nameHe: "צוות כיבוי 1",
    speed: 0.003,
    specialization: ["building_fire", "gas_leak", "hazmat"],
    effectiveness: 1.0,
  },
  {
    forceType: ForceType.FIRE,
    nameHe: "מכבית 2",
    speed: 0.0025,
    specialization: ["building_fire", "building_collapse"],
    effectiveness: 1.2,
  },
  {
    forceType: ForceType.FIRE,
    nameHe: "צוות כיבוי 3",
    speed: 0.003,
    specialization: ["building_fire", "hazmat"],
    effectiveness: 1.0,
  },

  // --- MDA / מד"א ---
  {
    forceType: ForceType.MAGEN_DAVID,
    nameHe: "אמבולנס 1",
    speed: 0.004,
    specialization: ["traffic_accident", "mass_casualty"],
    effectiveness: 1.0,
  },
  {
    forceType: ForceType.MAGEN_DAVID,
    nameHe: 'נט"ן 1',
    speed: 0.0035,
    specialization: ["mass_casualty", "building_collapse"],
    effectiveness: 1.5,
  },
  {
    forceType: ForceType.MAGEN_DAVID,
    nameHe: "אמבולנס 2",
    speed: 0.004,
    specialization: ["traffic_accident", "building_fire"],
    effectiveness: 1.0,
  },

  // --- Police / משטרה ---
  {
    forceType: ForceType.POLICE,
    nameHe: "ניידת 1",
    speed: 0.005,
    specialization: ["traffic_accident", "road_blockage"],
    effectiveness: 1.0,
  },
  {
    forceType: ForceType.POLICE,
    nameHe: 'יס"מ 1',
    speed: 0.004,
    specialization: ["mass_casualty", "evacuation_needed"],
    effectiveness: 1.3,
  },
  {
    forceType: ForceType.POLICE,
    nameHe: "ניידת 2",
    speed: 0.005,
    specialization: ["traffic_accident", "road_blockage"],
    effectiveness: 1.0,
  },

  // --- Rescue / חילוץ והצלה ---
  {
    forceType: ForceType.RESCUE,
    nameHe: "צוות חילוץ 1",
    speed: 0.003,
    specialization: ["building_collapse", "flooding"],
    effectiveness: 1.2,
  },
  {
    forceType: ForceType.RESCUE,
    nameHe: "צוות חילוץ 2",
    speed: 0.003,
    specialization: ["building_collapse", "mass_casualty"],
    effectiveness: 1.0,
  },

  // --- Engineering / הנדסה עירונית ---
  {
    forceType: ForceType.ENGINEERING,
    nameHe: "צוות הנדסה 1",
    speed: 0.002,
    specialization: ["building_collapse", "gas_leak", "road_blockage"],
    effectiveness: 1.0,
  },
  {
    forceType: ForceType.ENGINEERING,
    nameHe: "צוות הנדסה 2",
    speed: 0.002,
    specialization: ["power_outage", "flooding"],
    effectiveness: 1.0,
  },

  // --- Welfare / רווחה ---
  {
    forceType: ForceType.WELFARE,
    nameHe: "צוות רווחה 1",
    speed: 0.003,
    specialization: ["evacuation_needed", "mass_casualty"],
    effectiveness: 1.0,
  },

  // --- Infrastructure / תשתיות ---
  {
    forceType: ForceType.INFRASTRUCTURE,
    nameHe: "צוות תשתיות 1",
    speed: 0.002,
    specialization: ["power_outage", "flooding", "gas_leak"],
    effectiveness: 1.0,
  },
  {
    forceType: ForceType.INFRASTRUCTURE,
    nameHe: "צוות תשתיות 2",
    speed: 0.002,
    specialization: ["power_outage", "road_blockage"],
    effectiveness: 1.0,
  },

  // --- Evacuation / פינוי ---
  {
    forceType: ForceType.EVACUATION,
    nameHe: "אוטובוס פינוי 1",
    speed: 0.0025,
    specialization: ["evacuation_needed"],
    effectiveness: 1.0,
  },
  {
    forceType: ForceType.EVACUATION,
    nameHe: "אוטובוס פינוי 2",
    speed: 0.0025,
    specialization: ["evacuation_needed", "mass_casualty"],
    effectiveness: 1.0,
  },

  // --- Homefront Command / פיקוד העורף ---
  {
    forceType: ForceType.HOMEFRONT,
    nameHe: 'צוות פקע"ר 1',
    speed: 0.003,
    specialization: ["hazmat", "building_collapse", "mass_casualty"],
    effectiveness: 1.3,
  },
  {
    forceType: ForceType.HOMEFRONT,
    nameHe: 'צוות פקע"ר 2',
    speed: 0.003,
    specialization: ["hazmat", "evacuation_needed"],
    effectiveness: 1.0,
  },
];

/** Get unit templates by force type */
export function getUnitsByForce(forceType: ForceType): UnitTemplate[] {
  return UNIT_TEMPLATES.filter((t) => t.forceType === forceType);
}

/** Get the Hebrew display name for a force type */
export function getForceTypeName(forceType: ForceType): string {
  return FORCE_TYPE_NAMES[forceType];
}
