// Achievement definitions — pure data, no React imports

export const AchievementCategory = {
  PERFORMANCE: "performance",
  SPEED: "speed",
  MASTERY: "mastery",
  MILESTONE: "milestone",
} as const;
export type AchievementCategory =
  (typeof AchievementCategory)[keyof typeof AchievementCategory];

/** Condition types for checking achievement unlock */
export type AchievementCondition =
  | { type: "grade"; grade: string; difficulty?: string }
  | { type: "score"; min: number }
  | { type: "resolveUnderTicks"; maxTicks: number }
  | { type: "scenarioUnderTicks"; maxTicks: number }
  | { type: "allForceTypes" }
  | { type: "zeroEscalations" }
  | { type: "zeroCasualties" }
  | { type: "flawless" }
  | { type: "firstScenario" }
  | { type: "totalEventsResolved"; count: number }
  | { type: "totalScenariosPlayed"; count: number }
  | { type: "allClassicScenarios" };

export interface AchievementDef {
  id: string;
  nameHe: string;
  descriptionHe: string;
  category: AchievementCategory;
  icon: string;
  condition: AchievementCondition;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // --- Performance ---
  {
    id: "grade_s",
    nameHe: "דרגת S",
    descriptionHe: "השג דירוג S בתרחיש כלשהו",
    category: AchievementCategory.PERFORMANCE,
    icon: "Trophy",
    condition: { type: "grade", grade: "S" },
  },
  {
    id: "commander_excellence",
    nameHe: "מפקד מצטיין",
    descriptionHe: "השג דירוג S בתרחיש ברמת קשה",
    category: AchievementCategory.PERFORMANCE,
    icon: "Medal",
    condition: { type: "grade", grade: "S", difficulty: "hard" },
  },
  {
    id: "perfect_score",
    nameHe: "ציון מושלם",
    descriptionHe: "השג 1000 נקודות בתרחיש",
    category: AchievementCategory.PERFORMANCE,
    icon: "Star",
    condition: { type: "score", min: 1000 },
  },
  {
    id: "grade_a_streak",
    nameHe: "תותח",
    descriptionHe: "השג דירוג A או יותר בכל תרחיש קלאסי",
    category: AchievementCategory.PERFORMANCE,
    icon: "Flame",
    condition: { type: "allClassicScenarios" },
  },

  // --- Speed ---
  {
    id: "lightning",
    nameHe: "ברק",
    descriptionHe: "טפל באירוע תוך פחות מ-10 טיקים",
    category: AchievementCategory.SPEED,
    icon: "Zap",
    condition: { type: "resolveUnderTicks", maxTicks: 10 },
  },
  {
    id: "fast_as_arrow",
    nameHe: "מהיר כחץ",
    descriptionHe: "סיים תרחיש תוך פחות מ-200 טיקים",
    category: AchievementCategory.SPEED,
    icon: "Timer",
    condition: { type: "scenarioUnderTicks", maxTicks: 200 },
  },
  {
    id: "speed_demon",
    nameHe: "שד מהירות",
    descriptionHe: "סיים תרחיש תוך פחות מ-100 טיקים",
    category: AchievementCategory.SPEED,
    icon: "Gauge",
    condition: { type: "scenarioUnderTicks", maxTicks: 100 },
  },

  // --- Mastery ---
  {
    id: "versatile",
    nameHe: "רב-גוני",
    descriptionHe: "השתמש בכל 9 סוגי הכוחות בתרחיש אחד",
    category: AchievementCategory.MASTERY,
    icon: "Users",
    condition: { type: "allForceTypes" },
  },
  {
    id: "zero_escalations",
    nameHe: "אפס הסלמות",
    descriptionHe: "סיים תרחיש ללא הסלמה אחת",
    category: AchievementCategory.MASTERY,
    icon: "ShieldCheck",
    condition: { type: "zeroEscalations" },
  },
  {
    id: "zero_casualties",
    nameHe: "אפס נפגעים",
    descriptionHe: "סיים תרחיש ללא נפגע אחד",
    category: AchievementCategory.MASTERY,
    icon: "HeartPulse",
    condition: { type: "zeroCasualties" },
  },
  {
    id: "flawless",
    nameHe: "ללא רבב",
    descriptionHe: "סיים תרחיש ללא הסלמות וללא נפגעים",
    category: AchievementCategory.MASTERY,
    icon: "Crown",
    condition: { type: "flawless" },
  },

  // --- Milestone ---
  {
    id: "first_step",
    nameHe: "צעד ראשון",
    descriptionHe: "סיים את התרחיש הראשון שלך",
    category: AchievementCategory.MILESTONE,
    icon: "Footprints",
    condition: { type: "firstScenario" },
  },
  {
    id: "hundred_events",
    nameHe: "מאה אירועים",
    descriptionHe: "טפל ב-100 אירועים סה״כ",
    category: AchievementCategory.MILESTONE,
    icon: "Target",
    condition: { type: "totalEventsResolved", count: 100 },
  },
  {
    id: "persistent",
    nameHe: "מתמיד",
    descriptionHe: "שחק 10 תרחישים",
    category: AchievementCategory.MILESTONE,
    icon: "Repeat",
    condition: { type: "totalScenariosPlayed", count: 10 },
  },
  {
    id: "veteran",
    nameHe: "וותיק",
    descriptionHe: "שחק 50 תרחישים",
    category: AchievementCategory.MILESTONE,
    icon: "Award",
    condition: { type: "totalScenariosPlayed", count: 50 },
  },
  {
    id: "all_classics",
    nameHe: "כל התרחישים",
    descriptionHe: "סיים את כל ארבעת התרחישים הקלאסיים",
    category: AchievementCategory.MILESTONE,
    icon: "CheckCircle",
    condition: { type: "allClassicScenarios" },
  },
  {
    id: "fifty_events",
    nameHe: "חמישים אירועים",
    descriptionHe: "טפל ב-50 אירועים סה״כ",
    category: AchievementCategory.MILESTONE,
    icon: "TrendingUp",
    condition: { type: "totalEventsResolved", count: 50 },
  },
];

/** Map of achievement ID → definition for quick lookup */
export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));
