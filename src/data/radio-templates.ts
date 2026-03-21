/**
 * Hebrew radio message templates for command center communication feed.
 * Templates use {placeholder} syntax replaced at runtime.
 */

export const RadioPriority = {
  ROUTINE: "routine",
  IMPORTANT: "important",
  CRITICAL: "critical",
} as const;
export type RadioPriority = (typeof RadioPriority)[keyof typeof RadioPriority];

export interface RadioMessage {
  id: string;
  tick: number;
  sender: string;
  text: string;
  priority: RadioPriority;
  eventId?: string;
  unitId?: string;
}

/** Templates per event type for initial reports */
export const EVENT_REPORT_TEMPLATES: Record<string, string[]> = {
  building_fire: [
    "דיווח על שריפה ב{location}. עשן נצפה מהמבנה.",
    "שריפה פעילה ב{location}. דורש כוחות כיבוי.",
  ],
  traffic_accident: [
    "תאונת דרכים ב{location}. נפגעים בזירה.",
    "דיווח על תאונה ב{location}. נדרש סיוע רפואי.",
  ],
  building_collapse: [
    "קריסת מבנה ב{location}! חשש ללכודים.",
    "מבנה קרס ב{location}. נדרשים כוחות חילוץ בדחיפות.",
  ],
  gas_leak: [
    "דליפת גז ב{location}. יש לחסום את האזור.",
    "דיווח על ריח גז ב{location}. נדרשת בדיקה.",
  ],
  power_outage: [
    "הפסקת חשמל באזור {location}. בודקים את הסיבה.",
    "תקלה בתשתית חשמל ב{location}.",
  ],
  road_blockage: [
    "חסימת כביש ב{location}. נדרש פינוי.",
    "ציר חסום ב{location}. יש להפנות תנועה.",
  ],
  hazmat: [
    'אירוע חומ"ס ב{location}! יש לחסום ולפנות.',
    "חומרים מסוכנים ב{location}. רדיוס סיכון פעיל.",
  ],
  flooding: ["הצפה ב{location}. מים חודרים למבנים."],
  evacuation_needed: ["נדרש פינוי אוכלוסייה באזור {location}."],
  missile_impact: [
    "פגיעת טיל ב{location}! נזק כבד. נדרשים כל הכוחות.",
    "פגיעה ישירה ב{location}. דיווחים על נפגעים.",
  ],
  missile_near_miss: ["נפילה בשטח פתוח ליד {location}. בודקים נזק."],
  missile_interception_debris: ["שברי יירוט באזור {location}. בודקים שטח."],
};

/** Default template for unknown event types */
export const DEFAULT_REPORT_TEMPLATE =
  "דיווח על אירוע ב{location}. נדרשת בדיקה.";

/** Unit dispatch acknowledgment templates */
export const DISPATCH_TEMPLATES = [
  "{unitName}, קיבלתי. בדרך ל{location}.",
  "{unitName} יוצאת לזירה ב{location}.",
];

/** Unit arrival templates */
export const ARRIVAL_TEMPLATES = [
  "{unitName} הגיעה לזירה ב{location}. מתחילים הערכת מצב.",
  "{unitName} בזירה. מתחילים טיפול.",
];

/** Resolution templates */
export const RESOLVED_TEMPLATES = [
  "אירוע ב{location} יוצב. הכוחות מתפנים.",
  "{location} — אירוע נסגר. חוזרים לכוננות.",
];

/** Escalation warning templates */
export const ESCALATION_TEMPLATES = [
  "תשומת לב! האירוע ב{location} מחמיר!",
  "הסלמה ב{location}! נדרשים כוחות נוספים!",
];

/** Chain event templates */
export const CHAIN_EVENT_TEMPLATES = [
  "אירוע משני ב{location} — {eventType}.",
  "דיווח נוסף מ{location}: {eventType}.",
];
