import type { Scenario } from "../../engine/types";
import {
  Difficulty,
  EventType,
  ForceType,
  Severity,
  Weather,
} from "../../engine/types";

/**
 * Complex single-incident scenario: Building collapse.
 * A building collapses, triggering fire, trapped people,
 * downed power lines, and a road blockage.
 * Tests multi-force coordination on a single cascading incident.
 */
export const COMPLEX_SINGLE_SCENARIO: Scenario = {
  id: "complex_single",
  name: "קריסת מבנה מורכבת",
  description:
    "בניין בן 5 קומות קרס ברמות. לכודים מתחת להריסות, שריפה פרצה בעקבות דליפת גז, קו חשמל נפל על הכביש. נדרש תיאום בין כל הגורמים.",
  difficulty: Difficulty.MEDIUM,
  cityId: "beer_sheva",
  durationTicks: 450,
  weather: Weather.SANDSTORM,

  waves: [
    // Wave 1: The collapse itself
    {
      tick: 5,
      events: [
        {
          type: EventType.BUILDING_COLLAPSE,
          severity: Severity.CRITICAL,
          position: { x: 31.265, y: 34.812 },
          locationName: "רחוב יצחק רבין 8, רמות",
          description:
            "בניין בן 5 קומות קרס. לפחות 15 לכודים מתחת להריסות. נדרש חילוץ מידי.",
          requiredForces: [
            ForceType.RESCUE,
            ForceType.MAGEN_DAVID,
            ForceType.FIRE,
            ForceType.POLICE,
            ForceType.ENGINEERING,
          ],
          casualties: 3,
          threatRadius: 120,
          blocksRoad: true,
          fireDanger: false,
          collapseDanger: true,
          needsEvacuation: true,
          infrastructureDamage: true,
          escalationTimer: 30,
          resolveRate: 0.4,
          chainEvents: [
            { type: EventType.GAS_LEAK, delay: 15, probability: 0.9 },
            { type: EventType.ROAD_BLOCKAGE, delay: 5, probability: 1.0 },
          ],
        },
      ],
    },

    // Wave 2: Fire breaks out from gas leak
    {
      tick: 25,
      events: [
        {
          type: EventType.BUILDING_FIRE,
          severity: Severity.HIGH,
          position: { x: 31.2655, y: 34.8125 },
          locationName: "סמוך לבניין שקרס, רמות",
          description:
            "שריפה פרצה בעקבות דליפת גז מהבניין שקרס. האש מתפשטת לבניינים סמוכים.",
          requiredForces: [ForceType.FIRE, ForceType.MAGEN_DAVID],
          casualties: 0,
          threatRadius: 80,
          blocksRoad: false,
          fireDanger: true,
          collapseDanger: false,
          needsEvacuation: true,
          infrastructureDamage: false,
          escalationTimer: 50,
          resolveRate: 0.8,
        },
      ],
    },

    // Wave 3: Power outage from downed lines
    {
      tick: 40,
      events: [
        {
          type: EventType.POWER_OUTAGE,
          severity: Severity.MEDIUM,
          position: { x: 31.264, y: 34.81 },
          locationName: "רחוב הרצל, רמות",
          description:
            "קו חשמל נפל מהבניין שקרס. הפסקת חשמל נרחבת בשכונת רמות.",
          requiredForces: [ForceType.INFRASTRUCTURE, ForceType.ENGINEERING],
          casualties: 0,
          threatRadius: 200,
          blocksRoad: true,
          fireDanger: false,
          collapseDanger: false,
          needsEvacuation: false,
          infrastructureDamage: true,
          escalationTimer: 90,
          resolveRate: 1.5,
        },
      ],
    },

    // Wave 4: Evacuation needed
    {
      tick: 60,
      events: [
        {
          type: EventType.EVACUATION_NEEDED,
          severity: Severity.HIGH,
          position: { x: 31.266, y: 34.814 },
          locationName: "בניינים סמוכים, רמות",
          description:
            "יש לפנות תושבים מ-3 בניינים סמוכים לאתר הקריסה בשל סכנת קריסה נוספת.",
          requiredForces: [
            ForceType.EVACUATION,
            ForceType.POLICE,
            ForceType.WELFARE,
          ],
          casualties: 0,
          threatRadius: 150,
          blocksRoad: false,
          fireDanger: false,
          collapseDanger: true,
          needsEvacuation: true,
          infrastructureDamage: false,
          escalationTimer: 45,
          resolveRate: 0.7,
        },
      ],
    },
  ],

  initialUnits: [
    {
      name: "צוות כיבוי 1",
      forceType: ForceType.FIRE,
      position: { x: 31.248, y: 34.793 },
      basePosition: { x: 31.248, y: 34.793 },
      speed: 0.003,
      specialization: ["building_fire", "gas_leak", "hazmat"],
      effectiveness: 1.0,
    },
    {
      name: "מכבית 2",
      forceType: ForceType.FIRE,
      position: { x: 31.248, y: 34.793 },
      basePosition: { x: 31.248, y: 34.793 },
      speed: 0.0025,
      specialization: ["building_fire", "building_collapse"],
      effectiveness: 1.2,
    },
    {
      name: "אמבולנס 1",
      forceType: ForceType.MAGEN_DAVID,
      position: { x: 31.258, y: 34.8 },
      basePosition: { x: 31.258, y: 34.8 },
      speed: 0.004,
      specialization: ["traffic_accident", "mass_casualty"],
      effectiveness: 1.0,
    },
    {
      name: 'נט"ן 1',
      forceType: ForceType.MAGEN_DAVID,
      position: { x: 31.258, y: 34.8 },
      basePosition: { x: 31.258, y: 34.8 },
      speed: 0.0035,
      specialization: ["mass_casualty", "building_collapse"],
      effectiveness: 1.5,
    },
    {
      name: "ניידת 1",
      forceType: ForceType.POLICE,
      position: { x: 31.251, y: 34.789 },
      basePosition: { x: 31.251, y: 34.789 },
      speed: 0.005,
      specialization: ["traffic_accident", "road_blockage"],
      effectiveness: 1.0,
    },
    {
      name: 'יס"מ 1',
      forceType: ForceType.POLICE,
      position: { x: 31.251, y: 34.789 },
      basePosition: { x: 31.251, y: 34.789 },
      speed: 0.004,
      specialization: ["mass_casualty", "evacuation_needed"],
      effectiveness: 1.3,
    },
    {
      name: "צוות חילוץ 1",
      forceType: ForceType.RESCUE,
      position: { x: 31.248, y: 34.793 },
      basePosition: { x: 31.248, y: 34.793 },
      speed: 0.003,
      specialization: ["building_collapse", "flooding"],
      effectiveness: 1.2,
    },
    {
      name: "צוות הנדסה 1",
      forceType: ForceType.ENGINEERING,
      position: { x: 31.252, y: 34.791 },
      basePosition: { x: 31.252, y: 34.791 },
      speed: 0.002,
      specialization: ["building_collapse", "gas_leak", "road_blockage"],
      effectiveness: 1.0,
    },
    {
      name: "צוות תשתיות 1",
      forceType: ForceType.INFRASTRUCTURE,
      position: { x: 31.245, y: 34.798 },
      basePosition: { x: 31.245, y: 34.798 },
      speed: 0.002,
      specialization: ["power_outage", "flooding", "gas_leak"],
      effectiveness: 1.0,
    },
    {
      name: "אוטובוס פינוי 1",
      forceType: ForceType.EVACUATION,
      position: { x: 31.252, y: 34.791 },
      basePosition: { x: 31.252, y: 34.791 },
      speed: 0.0025,
      specialization: ["evacuation_needed"],
      effectiveness: 1.0,
    },
    {
      name: "צוות רווחה 1",
      forceType: ForceType.WELFARE,
      position: { x: 31.252, y: 34.791 },
      basePosition: { x: 31.252, y: 34.791 },
      speed: 0.003,
      specialization: ["evacuation_needed", "mass_casualty"],
      effectiveness: 1.0,
    },
  ],
};
