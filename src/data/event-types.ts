import { EventType, ForceType, Severity } from "../engine/types";

/** Metadata and defaults for each event type */
export interface EventTypeInfo {
  type: EventType;
  nameHe: string;
  descriptionHe: string;
  defaultSeverity: Severity;
  requiredForces: ForceType[];
  escalationTimer: number;
  resolveRate: number;
  threatRadius: number;
  blocksRoad: boolean;
  fireDanger: boolean;
  collapseDanger: boolean;
  needsEvacuation: boolean;
  infrastructureDamage: boolean;
  escalationTarget?: EventType;
  chainEvents?: { type: EventType; delay: number; probability: number }[];
}

export const EVENT_TYPE_INFO: Record<EventType, EventTypeInfo> = {
  [EventType.BUILDING_FIRE]: {
    type: EventType.BUILDING_FIRE,
    nameHe: "שריפה בבניין",
    descriptionHe:
      "שריפה פרצה בבניין מגורים. יש סכנה לחיי אדם ולפשיטת האש לבניינים סמוכים.",
    defaultSeverity: Severity.HIGH,
    requiredForces: [ForceType.FIRE, ForceType.MAGEN_DAVID, ForceType.POLICE],
    escalationTimer: 60,
    resolveRate: 0.8,
    threatRadius: 80,
    blocksRoad: false,
    fireDanger: true,
    collapseDanger: false,
    needsEvacuation: true,
    infrastructureDamage: false,
    chainEvents: [
      { type: EventType.BUILDING_COLLAPSE, delay: 90, probability: 0.3 },
      { type: EventType.EVACUATION_NEEDED, delay: 45, probability: 0.5 },
    ],
  },

  [EventType.BUILDING_COLLAPSE]: {
    type: EventType.BUILDING_COLLAPSE,
    nameHe: "קריסת מבנה",
    descriptionHe:
      "מבנה קרס. חשש ללכודים מתחת להריסות. נדרשים צוותי חילוץ מיידית.",
    defaultSeverity: Severity.CRITICAL,
    requiredForces: [
      ForceType.RESCUE,
      ForceType.MAGEN_DAVID,
      ForceType.FIRE,
      ForceType.POLICE,
      ForceType.ENGINEERING,
    ],
    escalationTimer: 30,
    resolveRate: 0.5,
    threatRadius: 120,
    blocksRoad: true,
    fireDanger: false,
    collapseDanger: true,
    needsEvacuation: true,
    infrastructureDamage: true,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 5, probability: 0.8 },
      { type: EventType.GAS_LEAK, delay: 15, probability: 0.4 },
    ],
  },

  [EventType.TRAFFIC_ACCIDENT]: {
    type: EventType.TRAFFIC_ACCIDENT,
    nameHe: "תאונת דרכים",
    descriptionHe:
      "תאונת דרכים עם נפגעים. כביש חסום חלקית. נדרש טיפול רפואי ופינוי.",
    defaultSeverity: Severity.MEDIUM,
    requiredForces: [ForceType.MAGEN_DAVID, ForceType.POLICE, ForceType.FIRE],
    escalationTimer: 45,
    resolveRate: 1.2,
    threatRadius: 40,
    blocksRoad: true,
    fireDanger: false,
    collapseDanger: false,
    needsEvacuation: false,
    infrastructureDamage: false,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 10, probability: 0.9 },
    ],
  },

  [EventType.GAS_LEAK]: {
    type: EventType.GAS_LEAK,
    nameHe: "דליפת גז",
    descriptionHe:
      "אותרה דליפת גז באזור מגורים. סכנת פיצוץ והרעלה. יש לפנות תושבים.",
    defaultSeverity: Severity.HIGH,
    requiredForces: [ForceType.FIRE, ForceType.ENGINEERING, ForceType.POLICE],
    escalationTimer: 40,
    resolveRate: 0.9,
    threatRadius: 100,
    blocksRoad: false,
    fireDanger: true,
    collapseDanger: false,
    needsEvacuation: true,
    infrastructureDamage: true,
    escalationTarget: EventType.BUILDING_FIRE,
    chainEvents: [
      { type: EventType.EVACUATION_NEEDED, delay: 20, probability: 0.7 },
    ],
  },

  [EventType.POWER_OUTAGE]: {
    type: EventType.POWER_OUTAGE,
    nameHe: "תקלת חשמל",
    descriptionHe:
      "הפסקת חשמל נרחבת באזור. מעליות תקועות, מערכות חיוניות ללא מתח.",
    defaultSeverity: Severity.LOW,
    requiredForces: [ForceType.INFRASTRUCTURE, ForceType.ENGINEERING],
    escalationTimer: 90,
    resolveRate: 1.5,
    threatRadius: 200,
    blocksRoad: false,
    fireDanger: false,
    collapseDanger: false,
    needsEvacuation: false,
    infrastructureDamage: true,
  },

  [EventType.ROAD_BLOCKAGE]: {
    type: EventType.ROAD_BLOCKAGE,
    nameHe: "חסימת כביש",
    descriptionHe: "כביש ראשי חסום. תנועה מופנית למסלולים חלופיים.",
    defaultSeverity: Severity.LOW,
    requiredForces: [ForceType.POLICE, ForceType.ENGINEERING],
    escalationTimer: 120,
    resolveRate: 2.0,
    threatRadius: 30,
    blocksRoad: true,
    fireDanger: false,
    collapseDanger: false,
    needsEvacuation: false,
    infrastructureDamage: false,
  },

  [EventType.HAZMAT]: {
    type: EventType.HAZMAT,
    nameHe: "חומרים מסוכנים",
    descriptionHe:
      "דליפת חומרים מסוכנים. סכנת הרעלה וזיהום סביבתי. נדרש פינוי מידי.",
    defaultSeverity: Severity.CRITICAL,
    requiredForces: [
      ForceType.FIRE,
      ForceType.HOMEFRONT,
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
    ],
    escalationTimer: 35,
    resolveRate: 0.6,
    threatRadius: 150,
    blocksRoad: true,
    fireDanger: true,
    collapseDanger: false,
    needsEvacuation: true,
    infrastructureDamage: true,
    chainEvents: [
      { type: EventType.EVACUATION_NEEDED, delay: 15, probability: 0.8 },
      { type: EventType.MASS_CASUALTY, delay: 40, probability: 0.3 },
    ],
  },

  [EventType.FLOODING]: {
    type: EventType.FLOODING,
    nameHe: "הצפה",
    descriptionHe:
      "הצפה באזור עירוני. מים חודרים למרתפים ולבניינים. תושבים חסומים.",
    defaultSeverity: Severity.MEDIUM,
    requiredForces: [
      ForceType.RESCUE,
      ForceType.INFRASTRUCTURE,
      ForceType.FIRE,
    ],
    escalationTimer: 50,
    resolveRate: 0.7,
    threatRadius: 120,
    blocksRoad: true,
    fireDanger: false,
    collapseDanger: false,
    needsEvacuation: true,
    infrastructureDamage: true,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 20, probability: 0.7 },
      { type: EventType.POWER_OUTAGE, delay: 30, probability: 0.5 },
    ],
  },

  [EventType.MASS_CASUALTY]: {
    type: EventType.MASS_CASUALTY,
    nameHe: "אירוע רב נפגעים",
    descriptionHe: "אירוע עם מספר רב של נפגעים. נדרשים כל צוותי החירום לזירה.",
    defaultSeverity: Severity.CRITICAL,
    requiredForces: [
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
      ForceType.RESCUE,
      ForceType.FIRE,
      ForceType.EVACUATION,
    ],
    escalationTimer: 20,
    resolveRate: 0.4,
    threatRadius: 100,
    blocksRoad: true,
    fireDanger: false,
    collapseDanger: false,
    needsEvacuation: true,
    infrastructureDamage: false,
    chainEvents: [
      { type: EventType.EVACUATION_NEEDED, delay: 10, probability: 0.9 },
    ],
  },

  [EventType.EVACUATION_NEEDED]: {
    type: EventType.EVACUATION_NEEDED,
    nameHe: "פינוי אוכלוסייה",
    descriptionHe: "נדרש פינוי תושבים מאזור סכנה. יש לארגן הסעות ומקלטים.",
    defaultSeverity: Severity.HIGH,
    requiredForces: [ForceType.EVACUATION, ForceType.POLICE, ForceType.WELFARE],
    escalationTimer: 40,
    resolveRate: 0.6,
    threatRadius: 150,
    blocksRoad: false,
    fireDanger: false,
    collapseDanger: false,
    needsEvacuation: true,
    infrastructureDamage: false,
  },

  // ===== Missile Strike Event Types =====

  [EventType.MISSILE_DIRECT_HIT]: {
    type: EventType.MISSILE_DIRECT_HIT,
    nameHe: "פגיעה ישירה",
    descriptionHe:
      "פגיעה ישירה של טיל בבניין. סכנת קריסה, שריפה ולכודים. נדרשים כל צוותי החירום.",
    defaultSeverity: Severity.CRITICAL,
    requiredForces: [
      ForceType.RESCUE,
      ForceType.FIRE,
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
      ForceType.ENGINEERING,
      ForceType.HOMEFRONT,
    ],
    escalationTimer: 30,
    resolveRate: 0.3,
    threatRadius: 150,
    blocksRoad: true,
    fireDanger: true,
    collapseDanger: true,
    needsEvacuation: true,
    infrastructureDamage: true,
    chainEvents: [
      { type: EventType.BUILDING_FIRE, delay: 5, probability: 0.8 },
      { type: EventType.BUILDING_COLLAPSE, delay: 15, probability: 0.6 },
      { type: EventType.GAS_LEAK, delay: 10, probability: 0.5 },
      { type: EventType.ROAD_BLOCKAGE, delay: 3, probability: 0.9 },
      { type: EventType.POWER_OUTAGE, delay: 8, probability: 0.7 },
    ],
  },

  [EventType.MISSILE_OPEN_AREA]: {
    type: EventType.MISSILE_OPEN_AREA,
    nameHe: "נפילה בשטח פתוח",
    descriptionHe:
      "נפילת טיל בשטח פתוח. נזק מוגבל אך ייתכנו נפגעים מרסיסים. נדרש סריקה ואבטחה.",
    defaultSeverity: Severity.LOW,
    requiredForces: [
      ForceType.POLICE,
      ForceType.MAGEN_DAVID,
      ForceType.HOMEFRONT,
    ],
    escalationTimer: 90,
    resolveRate: 1.8,
    threatRadius: 80,
    blocksRoad: false,
    fireDanger: false,
    collapseDanger: false,
    needsEvacuation: false,
    infrastructureDamage: false,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 10, probability: 0.3 },
    ],
  },

  [EventType.MISSILE_NEAR_BUILDING]: {
    type: EventType.MISSILE_NEAR_BUILDING,
    nameHe: "פגיעה ליד מבנה",
    descriptionHe:
      "נפילת טיל בסמוך למבנה. נזק מבני, חלונות מנופצים, ייתכנו נפגעים מרסיסים וזכוכיות.",
    defaultSeverity: Severity.HIGH,
    requiredForces: [
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
      ForceType.FIRE,
      ForceType.ENGINEERING,
    ],
    escalationTimer: 45,
    resolveRate: 0.7,
    threatRadius: 100,
    blocksRoad: true,
    fireDanger: true,
    collapseDanger: false,
    needsEvacuation: true,
    infrastructureDamage: true,
    chainEvents: [
      { type: EventType.BUILDING_FIRE, delay: 10, probability: 0.4 },
      { type: EventType.EVACUATION_NEEDED, delay: 15, probability: 0.6 },
      { type: EventType.POWER_OUTAGE, delay: 12, probability: 0.4 },
    ],
  },

  [EventType.MISSILE_NEAR_SENSITIVE]: {
    type: EventType.MISSILE_NEAR_SENSITIVE,
    nameHe: "פגיעה ליד מוסד רגיש",
    descriptionHe:
      "פגיעת טיל בסמוך למוסד רגיש (בית ספר, בית חולים, מבנה ציבורי). עדיפות גבוהה לאבטחה ופינוי.",
    defaultSeverity: Severity.CRITICAL,
    requiredForces: [
      ForceType.POLICE,
      ForceType.MAGEN_DAVID,
      ForceType.FIRE,
      ForceType.EVACUATION,
      ForceType.WELFARE,
      ForceType.HOMEFRONT,
    ],
    escalationTimer: 20,
    resolveRate: 0.5,
    threatRadius: 200,
    blocksRoad: true,
    fireDanger: true,
    collapseDanger: false,
    needsEvacuation: true,
    infrastructureDamage: true,
    escalationTarget: EventType.MASS_CASUALTY,
    chainEvents: [
      { type: EventType.EVACUATION_NEEDED, delay: 5, probability: 0.9 },
      { type: EventType.MASS_CASUALTY, delay: 20, probability: 0.4 },
      { type: EventType.BUILDING_FIRE, delay: 8, probability: 0.3 },
    ],
  },

  [EventType.INTERCEPTION_DEBRIS]: {
    type: EventType.INTERCEPTION_DEBRIS,
    nameHe: "שברי יירוט",
    descriptionHe:
      "שברי טיל שיורט על ידי כיפת ברזל נפלו באזור מגורים. נזק קל-בינוני, ייתכנו נפגעים.",
    defaultSeverity: Severity.MEDIUM,
    requiredForces: [ForceType.POLICE, ForceType.MAGEN_DAVID, ForceType.FIRE],
    escalationTimer: 60,
    resolveRate: 1.2,
    threatRadius: 60,
    blocksRoad: false,
    fireDanger: true,
    collapseDanger: false,
    needsEvacuation: false,
    infrastructureDamage: false,
    chainEvents: [
      { type: EventType.BUILDING_FIRE, delay: 5, probability: 0.3 },
      { type: EventType.ROAD_BLOCKAGE, delay: 8, probability: 0.2 },
    ],
  },

  [EventType.MISSILE_ROAD_HIT]: {
    type: EventType.MISSILE_ROAD_HIT,
    nameHe: "פגיעה בכביש/צומת",
    descriptionHe:
      "פגיעת טיל בכביש ראשי או צומת. מכתש בכביש, ייתכנו נפגעים ברכבים. חסימת תנועה מוחלטת.",
    defaultSeverity: Severity.HIGH,
    requiredForces: [
      ForceType.POLICE,
      ForceType.MAGEN_DAVID,
      ForceType.ENGINEERING,
      ForceType.INFRASTRUCTURE,
    ],
    escalationTimer: 50,
    resolveRate: 0.6,
    threatRadius: 80,
    blocksRoad: true,
    fireDanger: true,
    collapseDanger: false,
    needsEvacuation: false,
    infrastructureDamage: true,
    chainEvents: [
      { type: EventType.ROAD_BLOCKAGE, delay: 2, probability: 1.0 },
      { type: EventType.POWER_OUTAGE, delay: 15, probability: 0.5 },
      { type: EventType.GAS_LEAK, delay: 10, probability: 0.3 },
    ],
  },

  [EventType.MISSILE_COMPOUND]: {
    type: EventType.MISSILE_COMPOUND,
    nameHe: "אירוע משולב",
    descriptionHe:
      "אירוע מורכב הכולל מספר סוגי נזק — שריפה, קריסה, לכודים ונזק תשתיתי. נדרש ריכוז כל המשאבים.",
    defaultSeverity: Severity.CRITICAL,
    requiredForces: [
      ForceType.RESCUE,
      ForceType.FIRE,
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
      ForceType.ENGINEERING,
      ForceType.INFRASTRUCTURE,
      ForceType.HOMEFRONT,
      ForceType.EVACUATION,
    ],
    escalationTimer: 20,
    resolveRate: 0.2,
    threatRadius: 200,
    blocksRoad: true,
    fireDanger: true,
    collapseDanger: true,
    needsEvacuation: true,
    infrastructureDamage: true,
    chainEvents: [
      { type: EventType.BUILDING_COLLAPSE, delay: 10, probability: 0.7 },
      { type: EventType.BUILDING_FIRE, delay: 3, probability: 0.9 },
      { type: EventType.GAS_LEAK, delay: 8, probability: 0.6 },
      { type: EventType.MASS_CASUALTY, delay: 15, probability: 0.5 },
      { type: EventType.POWER_OUTAGE, delay: 5, probability: 0.8 },
      { type: EventType.ROAD_BLOCKAGE, delay: 2, probability: 0.95 },
      { type: EventType.EVACUATION_NEEDED, delay: 12, probability: 0.8 },
    ],
  },
};

/**
 * Get the display name for an event type in Hebrew.
 */
export function getEventTypeName(type: EventType): string {
  return EVENT_TYPE_INFO[type].nameHe;
}

/**
 * Get the default event definition for spawning.
 */
export function getEventDefaults(type: EventType): EventTypeInfo {
  return EVENT_TYPE_INFO[type];
}
