# תיעוד Hooks — מערכת סטודיו

## סקירה כללית

Hooks הם סקריפטים שרצים אוטומטית בנקודות מפתח בתהליך העבודה עם Claude Code. הם מוגדרים ב-`.claude/settings.json`.

---

## 1. Session Start Hook

**קובץ:** `.claude/hooks/session-start.sh`
**מתי רץ:** בפתיחת כל שיחה חדשה (`startup`, `resume`)
**מטרה:** לספק context מלא לתחילת עבודה

### מה הוא עושה:

#### א. שחזור מצב קודם
בודק אם קיים `production/session-state/active.md` ומציג את תוכנו. קובץ זה נוצר אוטומטית על ידי ה-Pre-Compact hook.

#### ב. בדיקת בריאות הפרויקט
- **node_modules** — מתריע אם חסר
- **Build cache** — מתריע אם ישן מ-24 שעות
- **שינויים לא committed** — מציג כמות

#### ג. פעילות אחרונה
מציג 5 commits אחרונים כדי לתת הקשר.

#### ד. זיהוי פערים
- ספירת מודולי engine
- בדיקת DEV-LOG.md
- ספירת קבצים עם TODO/FIXME/HACK

### פלט לדוגמה:
```
=== Urban Command Center — Session Start ===

📋 Previous session state found:
---
# Session State — Auto-saved before context compaction
> Generated: 2026-03-23 14:30:00
## Git State
- Branch: master
- Last commit: 507a609 feat: live command center
- Active areas: engine ui
---

🔍 Project Health Check:
  📝 3 uncommitted changes

📊 Recent Activity (last 5 commits):
  507a609 feat: live command center
  d2ba143 docs: add Cortex QA report
  ...

🔎 Gap Detection:
  Engine modules: 16
  Last dev log: none
  ⚠️  2 files with TODO/FIXME markers

✅ No critical gaps detected.
=== Ready ===
```

---

## 2. Pre-Compact Hook

**קובץ:** `.claude/hooks/pre-compact.sh`
**מתי רץ:** לפני דחיסת context window
**מטרה:** שמירת מצב עבודה שישרוד את הדחיסה

### מה הוא עושה:
1. אוסף מצב Git: branch, commit אחרון, קבצים ששונו
2. מזהה אזורי עבודה פעילים (engine/ui/data/store)
3. כותב הכל ל-`production/session-state/active.md`

### הקובץ שנוצר:
```markdown
# Session State — Auto-saved before context compaction
> Generated: 2026-03-23 14:30:00

## Git State
- Branch: master
- Last commit: 507a609 feat: live command center
- Active areas: engine ui

## Modified Files (unstaged)
src/engine/simulation.ts
src/components/command-center/TopBar.tsx

## Staged Files
none

## Untracked Files
none

## Recovery Instructions
1. Read this file to restore context
2. Check git status for current state
3. Review modified files listed above
4. Continue from where the previous session left off
```

---

## 3. Validate Commit Hook

**קובץ:** `.claude/hooks/validate-commit.sh`
**מתי רץ:** לפני commit (צריך להגדיר כ-pre-commit hook ב-Git)
**מטרה:** לתפוס בעיות קוד נפוצות לפני שהן נכנסות ל-repository

### בדיקות:

| # | בדיקה | חומרה | נתיב | מה מחפש |
|---|--------|--------|------|---------|
| 1 | מספרים קסומים | ⚠️ אזהרה | `src/engine/` | מספרים ≥10 שאינם קבועים |
| 2 | React ב-engine | ❌ שגיאה | `src/engine/` | `import React`, `from 'react'` |
| 3 | טקסט אנגלי | ⚠️ אזהרה | `src/components/` | מחרוזות אנגליות (לא className) |
| 4 | CSS פיזי (LTR) | ⚠️ אזהרה | `src/components/` | `margin-left`, `padding-right`, `text-left` |
| 5 | שימוש ב-enum | ❌ שגיאה | `src/**/*.ts` | `export enum`, `enum ` |
| 6 | קוד debug | ⚠️ אזהרה | `src/**/*.ts(x)` | `console.log`, `debugger` |
| 7 | קואורדינטות hardcoded | ⚠️ אזהרה | `src/**/*.ts(x)` | `31.XXX`, `34.XXX` מחוץ ל-data/ |

### קודי יציאה:
- `0` — הכל בסדר (אזהרות בלבד)
- `1` — נמצאו שגיאות (commit נחסם)

### פלט לדוגמה:
```
=== Commit Validation ===
🔧 Checking engine files...
  ⚠️  src/engine/events.ts — possible magic numbers:
    42: const threshold = 150;
🎨 Checking UI files...
  ⚠️  src/components/TopBar.tsx — possible hardcoded English text:
    15: title='Game Over'
📦 Checking TypeScript patterns...
  ❌ src/engine/types.ts — enum detected:
    3: export enum Status {

=== Results ===
  Errors: 1
  Warnings: 2
❌ Commit validation failed — fix errors above.
```

---

## הגדרות ב-settings.json

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/session-start.sh"
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/pre-compact.sh"
          }
        ]
      }
    ]
  }
}
```

### הפעלת Validate Commit כ-Git Hook
כדי שה-validate-commit ירוץ אוטומטית לפני כל git commit:
```bash
# צור .git/hooks/pre-commit
echo '#!/bin/bash
bash .claude/hooks/validate-commit.sh' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```
