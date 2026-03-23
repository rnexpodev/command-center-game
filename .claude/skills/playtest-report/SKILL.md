---
name: playtest-report
description: Generates structured playtest reports after testing a scenario — captures observations, issues, balance notes, and actionable recommendations.
---

# Playtest Report — Urban Command Center

## Purpose
Structured documentation of a playtest session. Run this after playing through a scenario (manually or via agent-browser) to capture findings while they're fresh.

## Procedure

### Step 1: Session Context
Gather the following:
- Which scenario was played?
- What difficulty / settings?
- Was training mode active?
- Weather and time-of-day settings?
- How many times replayed?

### Step 2: Play Through or Review
If using agent-browser:
1. Start dev server
2. Navigate to scenario selection
3. Launch the scenario
4. Observe gameplay, take screenshots at key moments
5. Complete or fail the scenario
6. Review post-game report

If manual testing:
1. Ask the user to describe what they observed
2. Review the post-game analytics if available

### Step 3: Capture Observations

Document in these categories:

| Category | What to Record |
|----------|---------------|
| **First Impressions** | Initial reaction, clarity of objectives, visual quality |
| **Gameplay Flow** | Did events feel manageable? Were there quiet/hectic moments? |
| **Decision Points** | Moments where the player had meaningful choices |
| **Frustration Points** | Anything confusing, unfair, or broken |
| **UI/UX Issues** | Readability, clickability, information overload/starvation |
| **Audio Feedback** | Were sounds helpful? Missing? Annoying? |
| **Balance Notes** | Specific events/units that felt off |
| **Performance** | FPS drops, lag, animation glitches |

### Step 4: Screenshot Documentation
Save screenshots to `docs/dev-log/screenshots/` with naming:
`YYYY-MM-DD-playtest-[scenario]-[description].png`

### Step 5: Generate Report

```markdown
# דוח פלייטסט — [שם תרחיש] — [תאריך]

## פרטי הפעלה
- **תרחיש:** [שם]
- **רמת קושי:** [קל/בינוני/קשה]
- **מזג אוויר:** [בהיר/גשם/סופת חול/חום]
- **זמן יום:** [בוקר/צהריים/ערב/לילה]
- **מצב אימון:** [כן/לא]
- **תוצאה:** [ניצחון/הפסד] — ציון: [X/1000] דרגה: [S-F]

## רשמים ראשוניים
[2-3 משפטים]

## זרימת המשחק
[תיאור התקדמות המשחק, גלים, רגעי שיא]

## נקודות החלטה
- [החלטה 1: מה עמד לבחירה, מה נבחר, התוצאה]
- [החלטה 2: ...]

## בעיות שנמצאו
| # | סוג | חומרה | תיאור | צילום מסך |
|---|------|--------|--------|-----------|
| 1 | [UI/איזון/באג/ביצועים] | [קריטי/גבוה/בינוני/נמוך] | [תיאור] | [קישור] |

## הערות איזון
[ממצאי איזון ספציפיים]

## המלצות
1. [המלצה + עדיפות]
2. [המלצה + עדיפות]

## צילומי מסך
[רשימת צילומים עם תיאור]
```

### Step 6: Save Report
Save to `docs/studio/playtest-reports/[date]-[scenario]-playtest.md`
