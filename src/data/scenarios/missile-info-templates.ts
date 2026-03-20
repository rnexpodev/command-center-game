/**
 * Hebrew information update templates for missile scenarios.
 * Used by missile scenarios to create progressive "fog of war" updates.
 *
 * Placeholders:
 *   {location} — neighborhood or street name
 *   {count}    — number (casualties, trapped, etc.)
 *   {radius}   — evacuation radius in meters
 *   {type}     — infrastructure type (חשמל, מים, גז)
 */

// ===== Siren & Initial Phase =====

export const INFO_SIREN = 'אזעקת צבע אדום. תושבים בממ"ד ובמקלטים.';

export const INFO_SIREN_EXTENDED =
  "צבע אדום, צבע אדום — באר שבע, אופקים, נתיבות. היכנסו למרחב המוגן.";

export const INFO_INTERCEPTIONS = "דווח על יירוטים מעל העיר. נבדקות נפילות.";

export const INFO_EXPLOSION_HEARD = "נשמעה נפילה באזור {location}. בודקים.";

export const INFO_MULTIPLE_EXPLOSIONS =
  "נשמעו מספר נפילות באזורים שונים בעיר. כוחות פונים לסריקה.";

// ===== Confirmation Phase =====

export const INFO_SMOKE_VISIBLE = "נצפה עמוד עשן באזור {location}.";

export const INFO_CONFIRMED_IMPACT = "אושרה פגיעה ב{location}. כוחות בדרך.";

export const INFO_CONFIRMED_OPEN_AREA =
  "אושרה נפילה בשטח פתוח ליד {location}. ללא נפגעים ראשוניים.";

export const INFO_CONFIRMED_NEAR_BUILDING =
  "אושרה פגיעה בסמוך למבנה ב{location}. נבדק נזק מבני.";

export const INFO_CONFIRMED_DEBRIS = "אותרו שברי יירוט על גג מבנה ב{location}.";

// ===== Casualties & Trapped =====

export const INFO_CASUALTIES_REPORTED = 'דווח על {count} נפגעים. מד"א בזירה.';

export const INFO_WALKING_WOUNDED =
  "דווח על {count} פצועים קלים. רובם מזכוכיות ורסיסים.";

export const INFO_TRAPPED_CONFIRMED =
  "אושרו לכודים מתחת להריסות. צוותי חילוץ בדרך.";

export const INFO_TRAPPED_COUNT =
  "לפי הערכה ראשונית, {count} לכודים מתחת להריסות.";

export const INFO_NO_CASUALTIES = "סריקה ראשונית — ללא נפגעים.";

// ===== Fire & Structural =====

export const INFO_FIRE_STARTED = "פרצה שריפה כתוצאה מהפגיעה. צוותי כיבוי בדרך.";

export const INFO_FIRE_SPREAD = "השריפה מתפשטת. נדרשים כוחות כיבוי נוספים.";

export const INFO_STRUCTURE_UNSAFE = "מהנדס העיר קבע: המבנה מסוכן. יש להרחיק.";

export const INFO_PARTIAL_COLLAPSE = "דווח על קריסה חלקית של קומות עליונות.";

export const INFO_GAS_LEAK_DETECTED =
  "אותרה דליפת גז באזור הפגיעה. סכנת פיצוץ.";

// ===== Evacuation & Public =====

export const INFO_EVACUATION_ORDERED =
  "הוחלט על פינוי תושבים ברדיוס {radius} מטר.";

export const INFO_CIVILIAN_PANIC =
  "תושבים בפאניקה ברחובות. משטרה מנסה לשלוט במצב.";

export const INFO_PARENTS_ARRIVING =
  "הורים מגיעים למוסד החינוך. נדרש ניהול קהל.";

export const INFO_SHELTER_FULL =
  "המקלט הציבורי ב{location} מלא. מפנים למקלט חלופי.";

// ===== Infrastructure =====

export const INFO_INFRA_DAMAGE = "נמצאה פגיעה בקו {type}. מתאמים טיפול.";

export const INFO_POWER_OUT = "הפסקת חשמל באזור הפגיעה. מעליות תקועות.";

export const INFO_WATER_MAIN_BREAK = "צינור מים ראשי נפגע. הצפה ברחוב.";

export const INFO_ROAD_CRATER =
  "מכתש בכביש כתוצאה מהפגיעה. תנועה חסומה לחלוטין.";

// ===== All Clear & Resolution =====

export const INFO_ALL_CLEAR = "פיקוד העורף הודיע: ירידה למרחב מוגן בוטלה.";

export const INFO_SCENE_SECURED = "הזירה מאובטחת. הכוחות ממשיכים בטיפול.";

export const INFO_AREA_REOPENED = "הכביש/אזור נפתח מחדש לתנועה.";

export const INFO_RESCUE_COMPLETE =
  "כל הלכודים חולצו. פינוי נפגעים לבית חולים.";

// ===== Situation Escalation =====

export const INFO_SECOND_BARRAGE_WARNING =
  "אזהרה: ייתכן מטח נוסף. כוחות בכוננות.";

export const INFO_MASS_CASUALTY_DECLARED =
  'הוכרז אירוע רב-נפגעים. הופעל פרוטוקול אר"ן.';

export const INFO_HOSPITAL_ALERT = "בית חולים סורוקה הופעל לקליטת נפגעים.";

export const INFO_IDF_REQUESTED = 'ביקשנו תגבור כוחות מפקע"ר וצה"ל.';

export const INFO_SITUATION_UNCLEAR =
  "המצב עדיין לא ברור. ממתינים לדיווח מהזירה.";

export const INFO_FALSE_REPORT = "דיווח ראשוני לא אומת. ייתכן והתברר כשגוי.";

/**
 * Replace placeholders in a template string.
 */
export function fillTemplate(
  template: string,
  vars: Record<string, string | number>,
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }
  return result;
}
