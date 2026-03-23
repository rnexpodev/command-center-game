# מערכת סטודיו — Urban Command Center

## מה זה?

מערכת סטודיו היא אוסף של **כלים, כללים, ותהליכי עבודה** שמארגנים את פיתוח המשחק עם Claude Code. המערכת מבוססת על רעיונות מ-[Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) — תבנית פופולרית (3,149 כוכבים) שמדמה אולפן משחקים מקצועי.

מהמקור (שתוכנן למנועי Godot/Unity/Unreal) אימצנו את מה שרלוונטי לסטאק שלנו: **Vite + React + TypeScript + Zustand + Leaflet**.

## מה כולל?

### Hooks (אוטומציה)
| Hook | קובץ | מתי רץ | מה עושה |
|------|-------|---------|---------|
| **Session Start** | `.claude/hooks/session-start.sh` | פתיחת שיחה | טוען מצב קודם, בודק בריאות הפרויקט, מזהה פערים |
| **Pre-Compact** | `.claude/hooks/pre-compact.sh` | לפני דחיסת context | שומר מצב עבודה נוכחי לקובץ שיחזור |
| **Validate Commit** | `.claude/hooks/validate-commit.sh` | לפני commit | בודק מספרים קסומים, React בengine, enum, debug code |

### Rules (כללי קוד לפי נתיב)
| כלל | נתיב | עיקרון |
|------|-------|--------|
| **Engine Code** | `src/engine/**` | TypeScript טהור, ביצועים, אפס React |
| **UI Code** | `src/components/**` | עברית, RTL, נגישות, dark theme |
| **Data Files** | `src/data/**` | `as const`, שמות עבריים, ללא לוגיקה |
| **Store Code** | `src/store/**` | דפוסי Zustand, הפרדה מ-engine |

### Skills (פקודות /slash)
| פקודה | מטרה |
|--------|-------|
| `/balance-check` | סקירת איזון שיטתית של כל פרמטרי המשחק |
| `/playtest-report` | יצירת דוח פלייטסט מובנה אחרי בדיקה |
| `/design-review` | תהליך החלטה מובנה: שאלה → אופציות → החלטה → טיוטה → אישור |

### Templates (תבניות מסמכים)
| תבנית | קובץ | שימוש |
|--------|-------|-------|
| דוח איזון | `.claude/docs/templates/balance-report.md` | תבנית לדוח `/balance-check` |
| דוח פלייטסט | `.claude/docs/templates/playtest-report.md` | תבנית לדוח `/playtest-report` |
| ADR | `.claude/docs/templates/adr.md` | תיעוד החלטה ארכיטקטונית |

## מבנה קבצים

```
.claude/
├── settings.json              ← קונפיגורציית hooks
├── hooks/
│   ├── session-start.sh       ← טעינת מצב + בדיקת פערים
│   ├── pre-compact.sh         ← שמירת מצב לפני דחיסה
│   └── validate-commit.sh     ← ולידציית קוד לפני commit
├── rules/
│   ├── engine-code.md         ← כללים ל-src/engine/
│   ├── ui-code.md             ← כללים ל-src/components/
│   ├── data-files.md          ← כללים ל-src/data/
│   └── store-code.md          ← כללים ל-src/store/
├── skills/
│   ├── balance-check/SKILL.md ← סקירת איזון
│   ├── playtest-report/SKILL.md ← דוח פלייטסט
│   └── design-review/SKILL.md  ← סקירת עיצוב
└── docs/
    └── templates/
        ├── balance-report.md   ← תבנית דוח איזון
        ├── playtest-report.md  ← תבנית דוח פלייטסט
        └── adr.md              ← תבנית החלטה ארכיטקטונית

production/
└── session-state/
    └── active.md              ← מצב סשן שמור (gitignored)

docs/studio/
├── README.md                  ← המסמך הזה
├── WORKFLOW-GUIDE.md          ← מדריך תהליכי עבודה
├── HOOKS-REFERENCE.md         ← תיעוד מפורט של hooks
├── RULES-REFERENCE.md         ← תיעוד מפורט של כללים
├── SKILLS-REFERENCE.md        ← תיעוד מפורט של skills
├── balance-reports/           ← דוחות איזון
├── playtest-reports/          ← דוחות פלייטסט
└── decisions/                 ← החלטות ארכיטקטוניות (ADRs)
```

## מקור ההשראה

הפרויקט [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) מכיל 48 סוכנים, 37 פקודות, 8 hooks, ו-11 כללים. מתוך כל אלה, אימצנו את מה שרלוונטי:

| מה אימצנו | למה |
|-----------|------|
| Session state hooks | שורד context compaction — קריטי לסשנים ארוכים |
| Commit validation | מונע magic numbers, enums, ו-React ב-engine |
| Path-scoped rules | סטנדרטים שונים ל-engine (ביצועים) ו-UI (RTL/נגישות) |
| Balance review skill | איזון escalation/scoring/treatment הוא אתגר מרכזי |
| Playtest report skill | מבנה מסודר לתיעוד בדיקות |
| Design review protocol | שאלה→אופציות→החלטה מונע טעויות |
| ADR template | תיעוד החלטות לטווח ארוך |

| מה לא אימצנו | למה |
|-------------|------|
| היררכיית 48 סוכנים | הפרויקט קטן מספיק לסוכן אחד |
| Engine-specific agents | אנחנו Vite+React, לא Godot/Unity/Unreal |
| Asset validation hooks | אין לנו asset pipeline |
| Network/shader rules | לא רלוונטי לפרויקט web |
| Team orchestration | overkill לפרויקט של מפתח יחיד |
