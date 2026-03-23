# יומן פיתוח — חמ"ל עירוני

## 2026-03-23 — הטמעת מערכת סטודיו

**סוג:** תשתית פיתוח
**מה:** אימוץ רכיבים מ-Claude Code Game Studios (3,149 כוכבים) והתאמתם לפרויקט
**למה:** לארגן את תהליך הפיתוח עם כלים, כללים, ותהליכי עבודה מובנים

### מה נוסף:

#### Hooks (אוטומציה)
- `session-start.sh` — טעינת מצב קודם + בריאות פרויקט + זיהוי פערים
- `pre-compact.sh` — שמירת מצב עבודה לפני דחיסת context
- `validate-commit.sh` — ולידציית קוד: magic numbers, React ב-engine, enums, debug code

#### Rules (כללי קוד)
- `engine-code.md` — TypeScript טהור, ביצועים, אפס React
- `ui-code.md` — עברית, RTL, נגישות, dark theme
- `data-files.md` — `as const`, שמות עבריים, אפס לוגיקה
- `store-code.md` — דפוסי Zustand, הפרדה מ-engine

#### Skills (פקודות)
- `/balance-check` — סקירת איזון שיטתית
- `/playtest-report` — דוח פלייטסט מובנה
- `/design-review` — תהליך החלטה: שאלה→אופציות→החלטה→טיוטה→אישור

#### תיעוד
- `docs/studio/README.md` — סקירה כללית של המערכת
- `docs/studio/WORKFLOW-GUIDE.md` — מדריך תהליכי עבודה
- `docs/studio/HOOKS-REFERENCE.md` — תיעוד hooks מפורט
- `docs/studio/RULES-REFERENCE.md` — תיעוד כללי קוד
- `docs/studio/SKILLS-REFERENCE.md` — תיעוד skills

#### צילומי מסך (7 מסכים)
- `01-main-menu.png` — מסך בחירת תרחישים
- `02-command-center-game.png` — חמ"ל ראשי (ריק)
- `03-command-center-active.png` — חמ"ל ראשי (פעיל)
- `04-career-screen.png` — מסך קריירה
- `05-campaign-screen.png` — מסך מבצע
- `06-editor-screen.png` — עורך תרחישים
- `07-tutorial-screen.png` — מסך הדרכה

### מקור השראה:
[Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) — תבנית קונפיגורציית Claude Code לפיתוח משחקים עם 48 סוכנים, 37 פקודות, 8 hooks, ו-11 כללים. אימצנו את הרכיבים הרלוונטיים לסטאק Vite+React+TypeScript+Zustand.
