import type { Scenario } from "../../engine/types";
import { Difficulty, EventType, ForceType, Severity } from "../../engine/types";

/**
 * Tutorial scenario: Single building fire.
 * Teaches basics of dispatching units and resolving events.
 * 3 units available, 1 event.
 */
export const TUTORIAL_SCENARIO: Scenario = {
  id: "tutorial",
  name: "הדרכה - שריפה בבניין",
  description:
    "שריפה פרצה בבניין מגורים בשכונה ד'. שלח את הכוחות המתאימים לזירה וטפל באירוע לפני שהוא מחמיר. תרחיש הדרכה בסיסי.",
  difficulty: Difficulty.TUTORIAL,
  cityId: "beer_sheva",
  durationTicks: 300,

  waves: [
    {
      tick: 5,
      events: [
        {
          type: EventType.BUILDING_FIRE,
          severity: Severity.MEDIUM,
          position: { x: 31.258, y: 34.795 },
          locationName: "רחוב הפלמ\"ח 12, שכונה ד'",
          description:
            "שריפה בקומה 3 בבניין מגורים. עשן כבד נצפה. דיירים מפונים עצמאית.",
          requiredForces: [ForceType.FIRE, ForceType.MAGEN_DAVID],
          casualties: 0,
          threatRadius: 60,
          blocksRoad: false,
          fireDanger: true,
          collapseDanger: false,
          needsEvacuation: true,
          infrastructureDamage: false,
          escalationTimer: 80,
          resolveRate: 1.2,
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
      specialization: ["building_fire", "gas_leak"],
      effectiveness: 1.0,
    },
    {
      name: "אמבולנס 1",
      forceType: ForceType.MAGEN_DAVID,
      position: { x: 31.258, y: 34.8 },
      basePosition: { x: 31.258, y: 34.8 },
      speed: 0.004,
      specialization: ["traffic_accident", "building_fire"],
      effectiveness: 1.0,
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
  ],
};
