# תיעוד כללי קוד — מערכת סטודיו

## סקירה כללית

כללי קוד (Rules) הם קבצי Markdown ב-`.claude/rules/` שמחילים סטנדרטים שונים על חלקים שונים של הקוד. Claude Code קורא אותם אוטומטית לפי הנתיב של הקובץ הנערך.

---

## 1. Engine Code — `src/engine/**`

**קובץ:** `.claude/rules/engine-code.md`

### עקרון מנחה
מודולי Engine הם TypeScript טהור — אפס React, אפס DOM, אפס side effects מעבר למוטציית state.

### הכללים:

| # | כלל | דוגמה טובה | דוגמה גרועה |
|---|------|-----------|------------|
| 1 | אפס React imports | `import { GameState } from './types'` | `import React from 'react'` |
| 2 | ביצועים קודמים | מוטציה ישירה של state | `{...state, events: state.events.map(...)}` |
| 3 | קבועים עם שם | `const ESCALATION_TIMER = 60` | `if (timer > 60)` |
| 4 | `as const` לא `enum` | `const Phase = {...} as const` | `enum Phase {...}` |
| 5 | פונקציות טהורות | `tick(state): void` | `tick(): void { this.state... }` |
| 6 | מבוסס ticks | `travelTicks * speedModifier` | `Date.now() - startTime` |
| 7 | קואורדינטות מ-data | `import { CITY_CENTER } from '@/data/city'` | `const center = [31.25, 34.79]` |

### מודולי Engine קיימים:
```
src/engine/
├── types.ts          ← הגדרות טיפוסים (UnitPhase, MatchQuality, etc.)
├── simulation.ts     ← לולאת משחק ראשית
├── clock.ts          ← שעון rAF עם מהירויות
├── events.ts         ← ספאון, הסלמה, שרשרת
├── units.ts          ← dispatch, תנועה, הגעה
├── weather.ts        ← מזג אוויר ושעות יום
├── escalation.ts     ← כללי הסלמה
├── scoring.ts        ← חישוב ציונים ודרגות
├── recorder.ts       ← הקלטת timeline
├── analytics.ts      ← חישוב אנליטיקס
├── training.ts       ← מצב אימון
├── achievements.ts   ← בדיקת הישגים
├── civilians.ts      ← התנהגות אזרחים
├── result-builder.ts ← בניית תוצאת משחק
├── audio.ts          ← ניהול אודיו
└── radio.ts          ← הודעות רדיו
```

---

## 2. UI Code — `src/components/**`

**קובץ:** `.claude/rules/ui-code.md`

### עקרון מנחה
כל ה-UI בעברית RTL עם ערכת צבעים כהה. קומפוננטות צורכות state מ-Zustand — לעולם לא מריצות לוגיקת סימולציה.

### הכללים:

| # | כלל | דוגמה טובה | דוגמה גרועה |
|---|------|-----------|------------|
| 1 | עברית בלבד | `<h1>מרכז פיקוד</h1>` | `<h1>Command Center</h1>` |
| 2 | CSS לוגי (RTL) | `ms-4`, `pe-2` | `ml-4`, `pr-2` |
| 3 | טוקני Dark theme | `bg-zinc-950 text-zinc-100` | `bg-white text-black` |
| 4 | אפס engine ב-UI | `useGameStore(s => s.events)` | `import { tickSimulation }` |
| 5 | נגישות | `aria-label="סגור חלון"` | `<div onClick={...}>` |
| 6 | מקסימום 150 שורות | חילוץ sub-components | קובץ של 500 שורות |
| 7 | אנימציות מכבדות | `prefers-reduced-motion` | אנימציות ללא fallback |

### מסכי UI קיימים:
```
src/components/
├── command-center/   ← מסך משחק ראשי (מפה, אירועים, יחידות)
├── scenarios/        ← בחירת תרחיש
├── post-game/        ← דוח תוצאות (ציון, אנליטיקס, replay)
├── tutorial/         ← הדרכה מונפשת
├── tour/             ← סיור מודרך 10 שלבים
├── career/           ← לוח קריירה והישגים
├── campaign/         ← מצב קמפיין (6 משימות)
├── training/         ← פאנל מדריך
├── editor/           ← עורך תרחישים
├── achievements/     ← פופאפ הישג
└── ui/               ← פרימיטיבים (Badge, IconButton, ProgressBar)
```

---

## 3. Data Files — `src/data/**`

**קובץ:** `.claude/rules/data-files.md`

### עקרון מנחה
קבצי data מגדירים את כל התוכן הסטטי. הם מקור האמת היחיד לאיזון, מפה, והגדרות ישויות.

### הכללים:

| # | כלל | דוגמה טובה | דוגמה גרועה |
|---|------|-----------|------------|
| 1 | `as const satisfies` | `{...} as const satisfies Record<...>` | `enum EventType {...}` |
| 2 | שמות עבריים | `nameHe: 'שריפה'` | ללא שם עברי |
| 3 | ערכי איזון כקבועים | `BASE_DURATION: 120 // ticks` | `duration: 120` (ללא תיעוד) |
| 4 | קואורדינטות [lat, lng] | `position: [31.2518, 34.7913]` | `position: {x: 31, y: 34}` |
| 5 | תרחישים עם metadata | `difficulty: 'hard', nameHe: '...'` | תרחיש ללא תיאור |
| 6 | אפס לוגיקה | קבועים וטיפוסים בלבד | פונקציות בקבצי data |

---

## 4. Store Code — `src/store/**`

**קובץ:** `.claude/rules/store-code.md`

### עקרון מנחה
Stores הם הגשר בין ה-engine הטהור ל-React UI. הם מנהלים snapshots ומחשפים actions מוקלדים.

### הכללים:

| # | כלל | דוגמה טובה | דוגמה גרועה |
|---|------|-----------|------------|
| 1 | store בקובץ נפרד | `game-store.ts`, `ui-store.ts` | כל ה-stores בקובץ אחד |
| 2 | דפוס engine integration | store → snapshot → engine mutates → set() | engine import ב-component |
| 3 | persist לcareer/campaign | `persist(...)` middleware | career store ללא persist |
| 4 | actions בתוך create() | `create<Store>((set) => ({ dispatch: ... }))` | פונקציות חיצוניות |
| 5 | selectors ממוקדים | `useGameStore(s => s.events)` | `useGameStore()` (כל ה-store) |

### Stores קיימים:
```
src/store/
├── game-store.ts     ← GameState + actions (dispatch, recall, close area)
├── ui-store.ts       ← UI state (selected IDs, screen routing, notifications)
├── tour-store.ts     ← guided tour progress (persisted)
├── career-store.ts   ← career stats + achievements (persisted)
├── campaign-store.ts ← campaign progress (persisted)
└── editor-store.ts   ← scenario editor state (persisted)
```
