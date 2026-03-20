import type { Scenario } from "../../engine/types";
import { Difficulty, EventType, ForceType, Severity } from "../../engine/types";

/**
 * Surge scenario: Multiple rapid events across the city.
 * Tests the player's ability to manage load under pressure.
 * Events keep coming in waves, requiring constant reprioritization.
 */
export const SURGE_SCENARIO: Scenario = {
  id: "surge",
  name: "גל אירועים",
  description:
    "סערה חזקה פוקדת את באר שבע. אירועי חירום מתפרצים ברחבי העיר בקצב מהיר. כל הכוחות מגויסים. תעדף, נהל ושלוט.",
  difficulty: Difficulty.HARD,
  cityId: "beer_sheva",
  durationTicks: 600,

  waves: [
    // Wave 1 (tick 5): Flooding + power outage
    {
      tick: 5,
      events: [
        {
          type: EventType.FLOODING,
          severity: Severity.MEDIUM,
          position: { x: 31.243, y: 34.791 },
          locationName: "העיר העתיקה, נחל באר שבע",
          description:
            "הצפה מנחל באר שבע. מים חודרים לחנויות ולבתי מגורים בעיר העתיקה.",
          requiredForces: [
            ForceType.RESCUE,
            ForceType.INFRASTRUCTURE,
            ForceType.FIRE,
          ],
          casualties: 0,
          threatRadius: 120,
          blocksRoad: true,
          fireDanger: false,
          collapseDanger: false,
          needsEvacuation: true,
          infrastructureDamage: true,
          escalationTimer: 50,
          resolveRate: 0.7,
          chainEvents: [
            { type: EventType.ROAD_BLOCKAGE, delay: 15, probability: 0.8 },
            { type: EventType.POWER_OUTAGE, delay: 25, probability: 0.6 },
          ],
        },
        {
          type: EventType.POWER_OUTAGE,
          severity: Severity.LOW,
          position: { x: 31.27, y: 34.775 },
          locationName: "נווה זאב",
          description:
            "הפסקת חשמל נרחבת בנווה זאב בעקבות הסערה. מעליות תקועות.",
          requiredForces: [ForceType.INFRASTRUCTURE, ForceType.ENGINEERING],
          casualties: 0,
          threatRadius: 250,
          blocksRoad: false,
          fireDanger: false,
          collapseDanger: false,
          needsEvacuation: false,
          infrastructureDamage: true,
          escalationTimer: 90,
          resolveRate: 1.5,
        },
      ],
    },

    // Wave 2 (tick 40): Traffic accident
    {
      tick: 40,
      events: [
        {
          type: EventType.TRAFFIC_ACCIDENT,
          severity: Severity.HIGH,
          position: { x: 31.255, y: 34.785 },
          locationName: "צומת שכונה ג', שד' בן גוריון",
          description: "תאונה רב-רכבית בצומת. כביש חלקלק מהגשם. 4 נפגעים.",
          requiredForces: [
            ForceType.MAGEN_DAVID,
            ForceType.POLICE,
            ForceType.FIRE,
          ],
          casualties: 1,
          threatRadius: 40,
          blocksRoad: true,
          fireDanger: false,
          collapseDanger: false,
          needsEvacuation: false,
          infrastructureDamage: false,
          escalationTimer: 35,
          resolveRate: 1.0,
        },
      ],
    },

    // Wave 3 (tick 80): Gas leak
    {
      tick: 80,
      events: [
        {
          type: EventType.GAS_LEAK,
          severity: Severity.HIGH,
          position: { x: 31.25, y: 34.788 },
          locationName: "רחוב הכלניות, שכונה ב'",
          description: "צינור גז נפגע מהסערה. ריח גז חזק ברחוב. חשש לפיצוץ.",
          requiredForces: [
            ForceType.FIRE,
            ForceType.ENGINEERING,
            ForceType.POLICE,
          ],
          casualties: 0,
          threatRadius: 100,
          blocksRoad: false,
          fireDanger: true,
          collapseDanger: false,
          needsEvacuation: true,
          infrastructureDamage: true,
          escalationTimer: 40,
          escalationTarget: EventType.BUILDING_FIRE,
          resolveRate: 0.9,
          chainEvents: [
            {
              type: EventType.EVACUATION_NEEDED,
              delay: 20,
              probability: 0.7,
            },
          ],
        },
      ],
    },

    // Wave 4 (tick 130): Building fire + road blockage
    {
      tick: 130,
      events: [
        {
          type: EventType.BUILDING_FIRE,
          severity: Severity.HIGH,
          position: { x: 31.262, y: 34.808 },
          locationName: "סמוך לבית ספר מקיף אלון, רמות",
          description:
            "שריפה בבניין סמוך לבית הספר. תלמידים בסכנה. נדרש פינוי מידי.",
          requiredForces: [
            ForceType.FIRE,
            ForceType.MAGEN_DAVID,
            ForceType.POLICE,
          ],
          casualties: 0,
          threatRadius: 80,
          blocksRoad: false,
          fireDanger: true,
          collapseDanger: false,
          needsEvacuation: true,
          infrastructureDamage: false,
          escalationTimer: 45,
          resolveRate: 0.8,
          chainEvents: [
            {
              type: EventType.EVACUATION_NEEDED,
              delay: 25,
              probability: 0.8,
            },
          ],
        },
        {
          type: EventType.ROAD_BLOCKAGE,
          severity: Severity.MEDIUM,
          position: { x: 31.235, y: 34.805 },
          locationName: "האזור התעשייתי",
          description: "עץ נפל על הכביש הראשי של האזור התעשייתי. חסימה מלאה.",
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

    // Wave 5 (tick 200): Hazmat incident
    {
      tick: 200,
      events: [
        {
          type: EventType.HAZMAT,
          severity: Severity.CRITICAL,
          position: { x: 31.236, y: 34.807 },
          locationName: "מפעל כימיקלים, אזור תעשייה",
          description:
            "דליפת חומרים מסוכנים ממפעל באזור התעשייה. ענן רעיל נע לכיוון שכונות מגורים.",
          requiredForces: [
            ForceType.FIRE,
            ForceType.HOMEFRONT,
            ForceType.MAGEN_DAVID,
            ForceType.POLICE,
          ],
          casualties: 0,
          threatRadius: 200,
          blocksRoad: true,
          fireDanger: true,
          collapseDanger: false,
          needsEvacuation: true,
          infrastructureDamage: true,
          escalationTimer: 30,
          resolveRate: 0.5,
          chainEvents: [
            {
              type: EventType.EVACUATION_NEEDED,
              delay: 12,
              probability: 0.9,
            },
            {
              type: EventType.MASS_CASUALTY,
              delay: 35,
              probability: 0.4,
            },
          ],
        },
      ],
    },

    // Wave 6 (tick 300): Mass casualty
    {
      tick: 300,
      events: [
        {
          type: EventType.MASS_CASUALTY,
          severity: Severity.CRITICAL,
          position: { x: 31.245, y: 34.812 },
          locationName: "קניון הנגב (גרנד קניון)",
          description:
            "פינוי המוני מהקניון בעקבות פאניקה. דיווחים על עשרות נפגעים מרמיסה.",
          requiredForces: [
            ForceType.MAGEN_DAVID,
            ForceType.POLICE,
            ForceType.RESCUE,
            ForceType.FIRE,
            ForceType.EVACUATION,
          ],
          casualties: 8,
          threatRadius: 100,
          blocksRoad: true,
          fireDanger: false,
          collapseDanger: false,
          needsEvacuation: true,
          infrastructureDamage: false,
          escalationTimer: 20,
          resolveRate: 0.4,
          chainEvents: [
            {
              type: EventType.EVACUATION_NEEDED,
              delay: 8,
              probability: 1.0,
            },
          ],
        },
      ],
    },
  ],

  initialUnits: [
    // Fire (3 units)
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
      name: "צוות כיבוי 3",
      forceType: ForceType.FIRE,
      position: { x: 31.248, y: 34.793 },
      basePosition: { x: 31.248, y: 34.793 },
      speed: 0.003,
      specialization: ["building_fire", "hazmat"],
      effectiveness: 1.0,
    },

    // MDA (3 units)
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
      name: "אמבולנס 2",
      forceType: ForceType.MAGEN_DAVID,
      position: { x: 31.258, y: 34.8 },
      basePosition: { x: 31.258, y: 34.8 },
      speed: 0.004,
      specialization: ["traffic_accident", "building_fire"],
      effectiveness: 1.0,
    },

    // Police (3 units)
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
      name: "ניידת 2",
      forceType: ForceType.POLICE,
      position: { x: 31.251, y: 34.789 },
      basePosition: { x: 31.251, y: 34.789 },
      speed: 0.005,
      specialization: ["traffic_accident", "road_blockage"],
      effectiveness: 1.0,
    },

    // Rescue (2 units)
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
      name: "צוות חילוץ 2",
      forceType: ForceType.RESCUE,
      position: { x: 31.248, y: 34.793 },
      basePosition: { x: 31.248, y: 34.793 },
      speed: 0.003,
      specialization: ["building_collapse", "mass_casualty"],
      effectiveness: 1.0,
    },

    // Engineering (2 units)
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
      name: "צוות הנדסה 2",
      forceType: ForceType.ENGINEERING,
      position: { x: 31.252, y: 34.791 },
      basePosition: { x: 31.252, y: 34.791 },
      speed: 0.002,
      specialization: ["power_outage", "flooding"],
      effectiveness: 1.0,
    },

    // Infrastructure (2 units)
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
      name: "צוות תשתיות 2",
      forceType: ForceType.INFRASTRUCTURE,
      position: { x: 31.245, y: 34.798 },
      basePosition: { x: 31.245, y: 34.798 },
      speed: 0.002,
      specialization: ["power_outage", "road_blockage"],
      effectiveness: 1.0,
    },

    // Welfare
    {
      name: "צוות רווחה 1",
      forceType: ForceType.WELFARE,
      position: { x: 31.252, y: 34.791 },
      basePosition: { x: 31.252, y: 34.791 },
      speed: 0.003,
      specialization: ["evacuation_needed", "mass_casualty"],
      effectiveness: 1.0,
    },

    // Evacuation (2 units)
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
      name: "אוטובוס פינוי 2",
      forceType: ForceType.EVACUATION,
      position: { x: 31.252, y: 34.791 },
      basePosition: { x: 31.252, y: 34.791 },
      speed: 0.0025,
      specialization: ["evacuation_needed", "mass_casualty"],
      effectiveness: 1.0,
    },

    // Homefront Command (2 units)
    {
      name: 'צוות פקע"ר 1',
      forceType: ForceType.HOMEFRONT,
      position: { x: 31.248, y: 34.793 },
      basePosition: { x: 31.248, y: 34.793 },
      speed: 0.003,
      specialization: ["hazmat", "building_collapse", "mass_casualty"],
      effectiveness: 1.3,
    },
    {
      name: 'צוות פקע"ר 2',
      forceType: ForceType.HOMEFRONT,
      position: { x: 31.248, y: 34.793 },
      basePosition: { x: 31.248, y: 34.793 },
      speed: 0.003,
      specialization: ["hazmat", "evacuation_needed"],
      effectiveness: 1.0,
    },
  ],
};
