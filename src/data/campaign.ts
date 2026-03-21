/** Campaign mode — "Operation Beer Sheva Shield" */

export interface CampaignScenario {
  id: string;
  nameHe: string;
  briefingHe: string;
  scenarioId: string;
  requiredGrade: string;
  rewards: { bonusUnits?: number; budgetBonus?: number };
}

export interface Campaign {
  id: string;
  nameHe: string;
  descriptionHe: string;
  scenarios: CampaignScenario[];
}

/** Grade comparison — returns true if `grade` meets or exceeds `required` */
export function gradePassesRequirement(
  grade: string,
  required: string,
): boolean {
  const order = ["F", "D", "C", "B", "A", "S"];
  return order.indexOf(grade) >= order.indexOf(required);
}

export const CAMPAIGN_BEER_SHEVA_SHIELD: Campaign = {
  id: "beer_sheva_shield",
  nameHe: "מבצע מגן באר שבע",
  descriptionHe:
    "שישה תרחישים מקושרים שמובילים אותך ממשימת שגרה ראשונה ועד מתקפת טילים כבדה על העיר. כל משימה דורשת ציון מינימלי כדי להתקדם.",
  scenarios: [
    {
      id: "cs_1_routine",
      nameHe: "שגרה",
      briefingHe:
        "יום רגיל בחמ\"ל באר שבע. שריפה פרצה בבניין מגורים בשכונה ד'. זו המשימה הראשונה שלך — הוכח שאתה מוכן.",
      scenarioId: "tutorial",
      requiredGrade: "D",
      rewards: { bonusUnits: 1 },
    },
    {
      id: "cs_2_dual",
      nameHe: "אירוע כפול",
      briefingHe:
        "שתי קריאות חירום בו-זמנית. תאונת דרכים בצפון העיר ושריפה בדרום. עליך לפצל כוחות ולנהל סדרי עדיפויות.",
      scenarioId: "dual_emergency",
      requiredGrade: "C",
      rewards: { bonusUnits: 2 },
    },
    {
      id: "cs_3_collapse",
      nameHe: "קריסה מורכבת",
      briefingHe:
        "בניין ישן קרס בשכונת העיר העתיקה. האירוע מייצר שרשרת של שריפות, חסימות וחילוץ לכודים. זה מבחן אמיתי לתיאום כוחות.",
      scenarioId: "complex_single",
      requiredGrade: "C",
      rewards: { bonusUnits: 2, budgetBonus: 500 },
    },
    {
      id: "cs_4_surge",
      nameHe: "גל אירועים",
      briefingHe:
        "גל חום כבד פוקד את באר שבע. אירועים מתרבים ברחבי העיר — שריפות, הצפות ואירועי חום. משאבים מוגבלים, תעדוף הוא המפתח.",
      scenarioId: "surge",
      requiredGrade: "C",
      rewards: { bonusUnits: 3, budgetBonus: 1000 },
    },
    {
      id: "cs_5_missile_med",
      nameHe: "מתקפת טילים",
      briefingHe:
        "צבע אדום! מטח טילים קצר פוגע באזורי מגורים. הדיווחים מעורפלים ומשתנים. זהה פגיעות, תעדף נפגעים, ומנע הסלמה.",
      scenarioId: "missile_short_barrage",
      requiredGrade: "C",
      rewards: { bonusUnits: 3, budgetBonus: 1500 },
    },
    {
      id: "cs_6_heavy",
      nameHe: "מתקפה כבדה",
      briefingHe:
        "מטח טילים כבד על כל רחבי באר שבע. עשרות פגיעות, שריפות ומבנים קורסים. זו השעה שלך — הצל את העיר.",
      scenarioId: "missile_heavy_barrage",
      requiredGrade: "D",
      rewards: { budgetBonus: 2000 },
    },
  ],
};

export const ALL_CAMPAIGNS: Campaign[] = [CAMPAIGN_BEER_SHEVA_SHIELD];
