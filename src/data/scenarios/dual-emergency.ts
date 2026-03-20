import type { Scenario } from "../../engine/types";
import { Difficulty, EventType, ForceType, Severity } from "../../engine/types";

/**
 * Dual emergency scenario: Traffic accident + building fire simultaneously.
 * Tests the player's ability to prioritize and split resources
 * between two active events on opposite sides of the city.
 */
export const DUAL_EMERGENCY_SCENARIO: Scenario = {
  id: "dual_emergency",
  name: "חירום כפול",
  description:
    "תאונת דרכים חמורה בצומת אומר ובמקביל שריפה פרצה בבניין בנווה נוי. שני האירועים דורשים תגובה מידית. תעדף את המשאבים בחוכמה.",
  difficulty: Difficulty.EASY,
  cityId: "beer_sheva",
  durationTicks: 400,

  waves: [
    // Wave 1: Both events spawn almost simultaneously
    {
      tick: 5,
      events: [
        {
          type: EventType.TRAFFIC_ACCIDENT,
          severity: Severity.HIGH,
          position: { x: 31.26, y: 34.82 },
          locationName: "צומת אומר, כביש 40",
          description:
            "תאונה חזיתית בצומת אומר. 3 כלי רכב מעורבים. לפחות 5 נפגעים, 2 לכודים.",
          requiredForces: [
            ForceType.MAGEN_DAVID,
            ForceType.POLICE,
            ForceType.FIRE,
          ],
          casualties: 2,
          threatRadius: 50,
          blocksRoad: true,
          fireDanger: false,
          collapseDanger: false,
          needsEvacuation: false,
          infrastructureDamage: false,
          escalationTimer: 40,
          resolveRate: 1.0,
          chainEvents: [
            { type: EventType.ROAD_BLOCKAGE, delay: 8, probability: 1.0 },
          ],
        },
      ],
    },
    {
      tick: 10,
      events: [
        {
          type: EventType.BUILDING_FIRE,
          severity: Severity.HIGH,
          position: { x: 31.238, y: 34.778 },
          locationName: "רחוב הנשיא 45, נווה נוי",
          description:
            "שריפה בקומה 4 בבניין מגורים בנווה נוי. משפחות עם ילדים לכודות בקומות עליונות.",
          requiredForces: [
            ForceType.FIRE,
            ForceType.MAGEN_DAVID,
            ForceType.POLICE,
          ],
          casualties: 0,
          threatRadius: 70,
          blocksRoad: false,
          fireDanger: true,
          collapseDanger: false,
          needsEvacuation: true,
          infrastructureDamage: false,
          escalationTimer: 55,
          resolveRate: 0.9,
          chainEvents: [
            {
              type: EventType.EVACUATION_NEEDED,
              delay: 35,
              probability: 0.6,
            },
          ],
        },
      ],
    },

    // Wave 2: Road blockage from accident (if chain didn't fire)
    {
      tick: 50,
      events: [
        {
          type: EventType.ROAD_BLOCKAGE,
          severity: Severity.LOW,
          position: { x: 31.259, y: 34.818 },
          locationName: "כביש 40 לכיוון אומר",
          description: "פקק תנועה כבד בעקבות התאונה. חסימה מוחלטת בכביש 40.",
          requiredForces: [ForceType.POLICE, ForceType.ENGINEERING],
          casualties: 0,
          threatRadius: 30,
          blocksRoad: true,
          fireDanger: false,
          collapseDanger: false,
          needsEvacuation: false,
          infrastructureDamage: false,
          escalationTimer: 120,
          resolveRate: 2.0,
        },
      ],
    },
  ],

  initialUnits: [
    // Fire units
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
      name: "צוות כיבוי 3",
      forceType: ForceType.FIRE,
      position: { x: 31.248, y: 34.793 },
      basePosition: { x: 31.248, y: 34.793 },
      speed: 0.003,
      specialization: ["building_fire", "hazmat"],
      effectiveness: 1.0,
    },

    // MDA units
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
      name: "אמבולנס 2",
      forceType: ForceType.MAGEN_DAVID,
      position: { x: 31.258, y: 34.8 },
      basePosition: { x: 31.258, y: 34.8 },
      speed: 0.004,
      specialization: ["traffic_accident", "building_fire"],
      effectiveness: 1.0,
    },

    // Police units
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
      name: "ניידת 2",
      forceType: ForceType.POLICE,
      position: { x: 31.251, y: 34.789 },
      basePosition: { x: 31.251, y: 34.789 },
      speed: 0.005,
      specialization: ["traffic_accident", "road_blockage"],
      effectiveness: 1.0,
    },

    // Engineering
    {
      name: "צוות הנדסה 1",
      forceType: ForceType.ENGINEERING,
      position: { x: 31.252, y: 34.791 },
      basePosition: { x: 31.252, y: 34.791 },
      speed: 0.002,
      specialization: ["road_blockage", "building_collapse"],
      effectiveness: 1.0,
    },

    // Evacuation
    {
      name: "אוטובוס פינוי 1",
      forceType: ForceType.EVACUATION,
      position: { x: 31.252, y: 34.791 },
      basePosition: { x: 31.252, y: 34.791 },
      speed: 0.0025,
      specialization: ["evacuation_needed"],
      effectiveness: 1.0,
    },
  ],
};
