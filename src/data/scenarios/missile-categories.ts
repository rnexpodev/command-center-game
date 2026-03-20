import type { MissileEventExtension } from "../../engine/types";
import { EventType, ForceType, Severity } from "../../engine/types";

/**
 * Missile impact category definitions.
 * Used as blueprints for procedural scenario generation.
 *
 * Each category defines severity ranges, possible damages, required forces,
 * and escalation triggers. A scenario generator can pick a category,
 * roll random values within its ranges, and produce a unique event.
 */

export interface MissileImpactCategory {
  id: string;
  nameHe: string;
  descriptionHe: string;
  severityRange: [min: Severity, max: Severity];
  impactType: MissileEventExtension["impactType"];
  possibleWarheads: MissileEventExtension["warheadType"][];
  /** Weighted list of possible damage types that can occur */
  possibleDamages: {
    type: EventType;
    weight: number;
    descriptionHe: string;
  }[];
  requiredForces: ForceType[];
  /** Ticks before escalation if no response */
  escalationWindow: [min: number, max: number];
  escalationTargets: EventType[];
  /** Sub-variations within this category */
  subVariations: {
    id: string;
    nameHe: string;
    modifiers: {
      severityBonus?: number;
      extraForces?: ForceType[];
      extraRisks?: string[];
    };
  }[];
  secondaryRisks: string[];
  /** Whether initial report is uncertain */
  startsUncertain: boolean;
  /** Civilian panic likelihood (0-1) */
  panicProbability: number;
}

export const MISSILE_IMPACT_CATEGORIES: MissileImpactCategory[] = [
  // ===== 1. Direct Hit on Residential Building =====
  {
    id: "direct_residential",
    nameHe: "פגיעה ישירה במבנה מגורים",
    descriptionHe: "טיל פוגע ישירות בבניין מגורים. סכנת קריסה, שריפה, לכודים.",
    severityRange: [Severity.HIGH, Severity.CRITICAL],
    impactType: "direct",
    possibleWarheads: ["qassam", "grad", "fajr"],
    possibleDamages: [
      {
        type: EventType.BUILDING_FIRE,
        weight: 0.8,
        descriptionHe: "שריפה בקומות שנפגעו",
      },
      {
        type: EventType.BUILDING_COLLAPSE,
        weight: 0.5,
        descriptionHe: "קריסה חלקית או מלאה של המבנה",
      },
      {
        type: EventType.GAS_LEAK,
        weight: 0.4,
        descriptionHe: "דליפת גז מצנרת שנפגעה",
      },
      {
        type: EventType.POWER_OUTAGE,
        weight: 0.6,
        descriptionHe: "ניתוק חשמל באזור",
      },
      {
        type: EventType.ROAD_BLOCKAGE,
        weight: 0.7,
        descriptionHe: "הריסות חוסמות את הכביש",
      },
    ],
    requiredForces: [
      ForceType.FIRE,
      ForceType.RESCUE,
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
      ForceType.ENGINEERING,
      ForceType.HOMEFRONT,
    ],
    escalationWindow: [25, 40],
    escalationTargets: [EventType.BUILDING_COLLAPSE, EventType.MASS_CASUALTY],
    subVariations: [
      {
        id: "upper_floors",
        nameHe: "פגיעה בקומות עליונות",
        modifiers: {
          extraRisks: [
            "סכנת נפילת חלקי בניין לרחוב",
            "קושי בגישה לקומות גבוהות",
          ],
        },
      },
      {
        id: "ground_floor",
        nameHe: "פגיעה בקומת קרקע",
        modifiers: {
          severityBonus: 1,
          extraRisks: ["חשש לפגיעה ביסודות המבנה", "סכנת קריסה מוחלטת"],
        },
      },
      {
        id: "pre_1992",
        nameHe: 'מבנה ישן (לפני תקן ממ"ד)',
        modifiers: {
          severityBonus: 1,
          extraForces: [ForceType.EVACUATION],
          extraRisks: ['אין ממ"ד — תושבים חשופים', "מבנה ישן — עמידות מופחתת"],
        },
      },
    ],
    secondaryRisks: [
      "לכודים מתחת להריסות",
      "שריפה מתפשטת לבניינים סמוכים",
      "דליפת גז מסכנת חיים",
      "הריסות חוסמות גישה לכוחות הצלה",
    ],
    startsUncertain: false,
    panicProbability: 0.7,
  },

  // ===== 2. Open Area Impact =====
  {
    id: "open_area",
    nameHe: "נפילה בשטח פתוח",
    descriptionHe: "טיל נופל בשטח פתוח — פארק, מגרש, אדמה חקלאית. נזק מוגבל.",
    severityRange: [Severity.LOW, Severity.MEDIUM],
    impactType: "open_area",
    possibleWarheads: ["qassam", "grad"],
    possibleDamages: [
      {
        type: EventType.ROAD_BLOCKAGE,
        weight: 0.2,
        descriptionHe: "מכתש בכביש סמוך",
      },
    ],
    requiredForces: [ForceType.POLICE, ForceType.HOMEFRONT],
    escalationWindow: [60, 120],
    escalationTargets: [],
    subVariations: [
      {
        id: "near_playground",
        nameHe: "ליד מגרש משחקים",
        modifiers: {
          severityBonus: 1,
          extraForces: [ForceType.MAGEN_DAVID, ForceType.WELFARE],
          extraRisks: ["ילדים באזור בזמן הנפילה"],
        },
      },
      {
        id: "park",
        nameHe: "בפארק ציבורי",
        modifiers: {
          extraForces: [ForceType.MAGEN_DAVID],
          extraRisks: ["מטיילים ורצים באזור"],
        },
      },
    ],
    secondaryRisks: ["רסיסים באזור רחב", "פאניקה בקרב תושבים"],
    startsUncertain: true,
    panicProbability: 0.3,
  },

  // ===== 3. Near Residential Building =====
  {
    id: "near_residential",
    nameHe: "פגיעה בסמוך למבנה מגורים",
    descriptionHe:
      "טיל נופל בסמוך למבנה מגורים. נזק מבני חיצוני, זכוכיות מנופצות, ייתכנו נפגעים.",
    severityRange: [Severity.MEDIUM, Severity.HIGH],
    impactType: "near_building",
    possibleWarheads: ["qassam", "grad", "fajr"],
    possibleDamages: [
      {
        type: EventType.BUILDING_FIRE,
        weight: 0.3,
        descriptionHe: "שריפה מרסיסים חמים",
      },
      {
        type: EventType.POWER_OUTAGE,
        weight: 0.4,
        descriptionHe: "פגיעה בקו חשמל",
      },
      {
        type: EventType.EVACUATION_NEEDED,
        weight: 0.5,
        descriptionHe: "פינוי בניין שנפגע מבנית",
      },
    ],
    requiredForces: [
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
      ForceType.FIRE,
      ForceType.ENGINEERING,
    ],
    escalationWindow: [35, 60],
    escalationTargets: [EventType.BUILDING_COLLAPSE],
    subVariations: [
      {
        id: "shattered_glass",
        nameHe: "חלונות מנופצים — נפגעים מזכוכית",
        modifiers: {
          extraForces: [ForceType.MAGEN_DAVID],
          extraRisks: ["פצועים רבים מזכוכית מנופצת"],
        },
      },
      {
        id: "structural_crack",
        nameHe: "סדק מבני — חשש לקריסה",
        modifiers: {
          severityBonus: 1,
          extraForces: [ForceType.RESCUE],
          extraRisks: ["סדקים במבנה — חשש ליציבות"],
        },
      },
    ],
    secondaryRisks: [
      "זכוכיות מנופצות בכל הרחוב",
      "נפגעים קלים מרסיסים",
      "תושבים בהלם",
    ],
    startsUncertain: true,
    panicProbability: 0.5,
  },

  // ===== 4. Near Sensitive Institution =====
  {
    id: "near_sensitive",
    nameHe: "פגיעה ליד מוסד רגיש",
    descriptionHe:
      "טיל נופל בסמוך לבית ספר, בית חולים, או מבנה ציבורי. עדיפות מבצעית גבוהה.",
    severityRange: [Severity.HIGH, Severity.CRITICAL],
    impactType: "near_sensitive",
    possibleWarheads: ["qassam", "grad", "fajr", "ballistic"],
    possibleDamages: [
      {
        type: EventType.EVACUATION_NEEDED,
        weight: 0.9,
        descriptionHe: "פינוי מיידי של המוסד",
      },
      {
        type: EventType.MASS_CASUALTY,
        weight: 0.4,
        descriptionHe: "נפגעים רבים במוסד",
      },
      {
        type: EventType.BUILDING_FIRE,
        weight: 0.3,
        descriptionHe: "שריפה במוסד",
      },
    ],
    requiredForces: [
      ForceType.POLICE,
      ForceType.MAGEN_DAVID,
      ForceType.FIRE,
      ForceType.EVACUATION,
      ForceType.WELFARE,
      ForceType.HOMEFRONT,
    ],
    escalationWindow: [15, 25],
    escalationTargets: [EventType.MASS_CASUALTY],
    subVariations: [
      {
        id: "school_hours",
        nameHe: "בית ספר בשעות פעילות",
        modifiers: {
          severityBonus: 1,
          extraForces: [ForceType.WELFARE],
          extraRisks: ["מאות ילדים במוסד", "הורים מגיעים בפאניקה"],
        },
      },
      {
        id: "hospital_adjacent",
        nameHe: "ליד בית חולים",
        modifiers: {
          extraRisks: ["חולים מאושפזים באזור סכנה", "פגיעה אפשרית בציוד חיוני"],
        },
      },
      {
        id: "government",
        nameHe: "ליד מבנה ממשלתי",
        modifiers: {
          extraForces: [ForceType.POLICE],
          extraRisks: ["חשש לפגיעה ממוקדת — אבטחה מוגברת"],
        },
      },
    ],
    secondaryRisks: [
      "פינוי מורכב של אוכלוסייה רגישה",
      "פאניקת הורים",
      "חשיפה תקשורתית גבוהה",
      "מורל ציבורי",
    ],
    startsUncertain: false,
    panicProbability: 0.9,
  },

  // ===== 5. Interception Debris =====
  {
    id: "interception_debris",
    nameHe: "שברי יירוט",
    descriptionHe:
      "שברים מטיל שיורט נופלים לעיר. נזק נקודתי, ייתכנו מספר מוקדים.",
    severityRange: [Severity.LOW, Severity.MEDIUM],
    impactType: "debris",
    possibleWarheads: ["debris"],
    possibleDamages: [
      {
        type: EventType.BUILDING_FIRE,
        weight: 0.3,
        descriptionHe: "שריפה מחלק מנוע בוער",
      },
      {
        type: EventType.ROAD_BLOCKAGE,
        weight: 0.2,
        descriptionHe: "שברים על הכביש",
      },
    ],
    requiredForces: [ForceType.POLICE, ForceType.FIRE, ForceType.MAGEN_DAVID],
    escalationWindow: [50, 90],
    escalationTargets: [],
    subVariations: [
      {
        id: "roof_impact",
        nameHe: "פגיעה בגג מבנה",
        modifiers: {
          extraRisks: ["חדירה דרך הגג לדירה"],
        },
      },
      {
        id: "car_hit",
        nameHe: "פגיעה ברכב חונה",
        modifiers: {
          extraRisks: ["שריפת רכב", "דליפת דלק"],
        },
      },
      {
        id: "multiple_debris",
        nameHe: "מספר נקודות נפילה",
        modifiers: {
          extraForces: [ForceType.POLICE],
          extraRisks: ["פיזור כוחות למספר מוקדים"],
        },
      },
    ],
    secondaryRisks: ["שברים מפוזרים באזור רחב", "חומרים רעילים מהמנוע"],
    startsUncertain: true,
    panicProbability: 0.4,
  },

  // ===== 6. Road / Junction Hit =====
  {
    id: "road_hit",
    nameHe: "פגיעה בכביש או צומת",
    descriptionHe: "טיל פוגע בכביש ראשי או צומת. מכתש, ייתכנו נפגעים ברכבים.",
    severityRange: [Severity.MEDIUM, Severity.HIGH],
    impactType: "road",
    possibleWarheads: ["qassam", "grad"],
    possibleDamages: [
      {
        type: EventType.ROAD_BLOCKAGE,
        weight: 1.0,
        descriptionHe: "מכתש בכביש — חסימה מוחלטת",
      },
      {
        type: EventType.POWER_OUTAGE,
        weight: 0.4,
        descriptionHe: "פגיעה בתשתית חשמל תת-קרקעית",
      },
      {
        type: EventType.GAS_LEAK,
        weight: 0.3,
        descriptionHe: "פגיעה בצינור גז",
      },
    ],
    requiredForces: [
      ForceType.POLICE,
      ForceType.MAGEN_DAVID,
      ForceType.ENGINEERING,
      ForceType.INFRASTRUCTURE,
    ],
    escalationWindow: [40, 70],
    escalationTargets: [EventType.GAS_LEAK],
    subVariations: [
      {
        id: "vehicles_hit",
        nameHe: "פגיעה ברכבים נוסעים",
        modifiers: {
          severityBonus: 1,
          extraForces: [ForceType.RESCUE, ForceType.FIRE],
          extraRisks: ["לכודים ברכבים", "דליפת דלק — סכנת שריפה"],
        },
      },
      {
        id: "intersection",
        nameHe: "צומת ראשי — שיבוש תנועה עירוני",
        modifiers: {
          extraRisks: [
            "עומסי תנועה בכל העיר",
            "עיכוב הגעת כוחות לאירועים אחרים",
          ],
        },
      },
    ],
    secondaryRisks: [
      "שיבוש תנועה עירוני",
      "עיכוב כוחות חירום",
      "סכנת דליפת דלק",
    ],
    startsUncertain: false,
    panicProbability: 0.4,
  },

  // ===== 7. Critical Infrastructure =====
  {
    id: "critical_infrastructure",
    nameHe: "פגיעה בתשתית קריטית",
    descriptionHe:
      "טיל פוגע ליד תחנת משנה חשמלית, מתקן מים, או תשתית חיונית אחרת.",
    severityRange: [Severity.HIGH, Severity.CRITICAL],
    impactType: "near_building",
    possibleWarheads: ["grad", "fajr", "ballistic"],
    possibleDamages: [
      {
        type: EventType.POWER_OUTAGE,
        weight: 0.8,
        descriptionHe: "הפסקת חשמל נרחבת",
      },
      {
        type: EventType.FLOODING,
        weight: 0.5,
        descriptionHe: "פיצוץ צינור מים ראשי",
      },
      {
        type: EventType.GAS_LEAK,
        weight: 0.4,
        descriptionHe: "דליפת גז מקו ראשי",
      },
      {
        type: EventType.HAZMAT,
        weight: 0.3,
        descriptionHe: "חומרים מסוכנים באזור תעשייתי",
      },
    ],
    requiredForces: [
      ForceType.INFRASTRUCTURE,
      ForceType.ENGINEERING,
      ForceType.FIRE,
      ForceType.POLICE,
      ForceType.HOMEFRONT,
    ],
    escalationWindow: [30, 50],
    escalationTargets: [EventType.MASS_CASUALTY, EventType.HAZMAT],
    subVariations: [
      {
        id: "power_substation",
        nameHe: "תחנת משנה חשמלית",
        modifiers: {
          extraRisks: [
            "הפסקת חשמל לאלפי בתים",
            "מעליות תקועות עם לכודים",
            "מערכות חיוניות ללא מתח",
          ],
        },
      },
      {
        id: "water_facility",
        nameHe: "מתקן מים",
        modifiers: {
          extraRisks: ["הצפה ברחובות סמוכים", "הפסקת אספקת מים לשכונות"],
        },
      },
      {
        id: "gas_main",
        nameHe: "קו גז ראשי",
        modifiers: {
          severityBonus: 1,
          extraForces: [ForceType.EVACUATION],
          extraRisks: ["סכנת פיצוץ — פינוי מיידי", "גז מתפשט באזור מגורים"],
        },
      },
    ],
    secondaryRisks: [
      "כשל מדורג בתשתיות",
      "אלפי תושבים ללא שירות חיוני",
      "עומס על בית חולים (מכשירים חיוניים)",
    ],
    startsUncertain: false,
    panicProbability: 0.6,
  },

  // ===== 8. Commercial Area =====
  {
    id: "commercial_area",
    nameHe: "פגיעה באזור מסחרי",
    descriptionHe: "טיל פוגע ליד קניון, שוק, או אזור מסחרי עם ריכוז אנשים.",
    severityRange: [Severity.HIGH, Severity.CRITICAL],
    impactType: "near_building",
    possibleWarheads: ["qassam", "grad", "fajr"],
    possibleDamages: [
      {
        type: EventType.MASS_CASUALTY,
        weight: 0.5,
        descriptionHe: "נפגעים רבים מזכוכיות ורסיסים",
      },
      {
        type: EventType.BUILDING_FIRE,
        weight: 0.4,
        descriptionHe: "שריפה בחנויות",
      },
      {
        type: EventType.ROAD_BLOCKAGE,
        weight: 0.7,
        descriptionHe: "חסימת כבישים מהריסות",
      },
      {
        type: EventType.EVACUATION_NEEDED,
        weight: 0.8,
        descriptionHe: "פינוי קניון/שוק",
      },
    ],
    requiredForces: [
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
      ForceType.FIRE,
      ForceType.EVACUATION,
      ForceType.WELFARE,
    ],
    escalationWindow: [20, 35],
    escalationTargets: [EventType.MASS_CASUALTY],
    subVariations: [
      {
        id: "mall",
        nameHe: "קניון — מאות אנשים בפנים",
        modifiers: {
          severityBonus: 1,
          extraForces: [ForceType.RESCUE],
          extraRisks: ["פאניקה בקניון סגור", "דריכה ובהלת המונים"],
        },
      },
      {
        id: "open_market",
        nameHe: "שוק פתוח — חשיפה מרבית",
        modifiers: {
          extraRisks: [
            "פצועים רבים ללא מקלט קרוב",
            "דוכנים הרוסים חוסמים מעבר",
          ],
        },
      },
    ],
    secondaryRisks: [
      "פצועים הולכי רגל רבים",
      "פאניקה והמונים",
      "זכוכיות חזיתות חנויות",
      "חסימת כבישי גישה",
    ],
    startsUncertain: false,
    panicProbability: 0.9,
  },

  // ===== 9. Compound / Multi-effect =====
  {
    id: "compound",
    nameHe: "אירוע משולב",
    descriptionHe:
      "פגיעת טיל שגורמת למספר סוגי נזק בו-זמנית — שריפה, קריסה, לכודים, תשתיות.",
    severityRange: [Severity.CRITICAL, Severity.CRITICAL],
    impactType: "compound",
    possibleWarheads: ["fajr", "ballistic"],
    possibleDamages: [
      {
        type: EventType.BUILDING_COLLAPSE,
        weight: 0.7,
        descriptionHe: "קריסת מבנה",
      },
      {
        type: EventType.BUILDING_FIRE,
        weight: 0.9,
        descriptionHe: "שריפה נרחבת",
      },
      {
        type: EventType.GAS_LEAK,
        weight: 0.6,
        descriptionHe: "דליפת גז",
      },
      {
        type: EventType.MASS_CASUALTY,
        weight: 0.5,
        descriptionHe: "נפגעים רבים",
      },
      {
        type: EventType.POWER_OUTAGE,
        weight: 0.8,
        descriptionHe: "הפסקת חשמל",
      },
      {
        type: EventType.ROAD_BLOCKAGE,
        weight: 0.9,
        descriptionHe: "חסימת כבישים",
      },
    ],
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
    escalationWindow: [15, 25],
    escalationTargets: [EventType.MASS_CASUALTY, EventType.BUILDING_COLLAPSE],
    subVariations: [
      {
        id: "pancake_collapse",
        nameHe: "קריסת פנקייק — לכודים בכל הקומות",
        modifiers: {
          extraRisks: ["חילוץ מורכב — שעות עבודה", "סכנה למחלצים"],
        },
      },
    ],
    secondaryRisks: [
      "מספר זירות בו-זמנית",
      "מחסור במשאבים",
      "קושי בתעדוף",
      "הכוחות לא מספיקים",
    ],
    startsUncertain: false,
    panicProbability: 1.0,
  },

  // ===== 10. Ballistic Missile (Large Warhead) =====
  {
    id: "ballistic",
    nameHe: "טיל בליסטי — ראש נפץ גדול",
    descriptionHe:
      "פגיעת טיל בליסטי עם ראש נפץ כבד. הרס נרחב, מספר בלוקים מושפעים.",
    severityRange: [Severity.CRITICAL, Severity.CRITICAL],
    impactType: "direct",
    possibleWarheads: ["ballistic"],
    possibleDamages: [
      {
        type: EventType.BUILDING_COLLAPSE,
        weight: 0.9,
        descriptionHe: "קריסת מבנים ברדיוס רחב",
      },
      {
        type: EventType.BUILDING_FIRE,
        weight: 0.9,
        descriptionHe: "שריפות במספר מבנים",
      },
      {
        type: EventType.MASS_CASUALTY,
        weight: 0.8,
        descriptionHe: "עשרות נפגעים",
      },
      {
        type: EventType.POWER_OUTAGE,
        weight: 0.9,
        descriptionHe: "הפסקת חשמל בכל האזור",
      },
      {
        type: EventType.ROAD_BLOCKAGE,
        weight: 0.95,
        descriptionHe: "כבישים חסומים לחלוטין",
      },
      {
        type: EventType.GAS_LEAK,
        weight: 0.6,
        descriptionHe: "דליפות גז מרובות",
      },
      {
        type: EventType.FLOODING,
        weight: 0.4,
        descriptionHe: "פיצוץ צנרת מים",
      },
    ],
    requiredForces: [
      ForceType.RESCUE,
      ForceType.FIRE,
      ForceType.MAGEN_DAVID,
      ForceType.POLICE,
      ForceType.ENGINEERING,
      ForceType.INFRASTRUCTURE,
      ForceType.HOMEFRONT,
      ForceType.EVACUATION,
      ForceType.WELFARE,
    ],
    escalationWindow: [10, 20],
    escalationTargets: [EventType.MASS_CASUALTY],
    subVariations: [
      {
        id: "residential_block",
        nameHe: "בלוק מגורים שלם",
        modifiers: {
          extraRisks: ["עשרות לכודים", "חיפוש בהריסות נרחבות"],
        },
      },
      {
        id: "mixed_use",
        nameHe: "אזור מעורב מגורים ומסחר",
        modifiers: {
          extraRisks: ["נפגעים בחנויות וברחוב", "פינוי מורכב"],
        },
      },
    ],
    secondaryRisks: [
      "הרס נרחב — מספר בלוקים",
      "עשרות לכודים",
      'פרוטוקול אר"ן',
      "צורך בתגבור ארצי",
      "פינוי בתי חולים",
    ],
    startsUncertain: false,
    panicProbability: 1.0,
  },
];
