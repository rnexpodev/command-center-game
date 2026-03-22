# Live Command Center — Design Spec

**Date**: 2026-03-22
**Goal**: Transform the command center from a "click and hope" experience into a transparent, responsive simulation where every action has visible impact and every unit's status is immediately understood.

**Priority order** (from user):
1. Unit transparency — know what every unit is doing, where, and when it returns
2. Action feedback — every click produces visible, audible confirmation
3. Situation awareness — understand the big picture at a glance
4. Event clarity — understand what's happening at each event

---

## Part 1: Engine Changes

### 1.1 Unit Phase System

Add granular phases to `Unit` type alongside existing `status`:

```typescript
export const UnitPhase = {
  IDLE: "idle",
  DISPATCHED: "dispatched",
  EN_ROUTE: "en_route",
  ARRIVING: "arriving",       // 3 ticks: setting up on scene
  TREATING: "treating",       // actively working
  WRAPPING_UP: "wrapping_up", // 3 ticks: packing up after resolution
  RETURNING: "returning",
} as const;
```

New fields on `Unit`:
- `phase: UnitPhase` — granular phase (replaces status for display)
- `treatmentStartTick?: number` — when this unit started treating
- `treatmentContribution: number` — 0-1, this unit's share of treatment progress (computed each tick)
- `matchQuality: "full" | "partial" | "none"` — how well this unit matches the event's needs

Phase transitions in `updateUnits()`:
- `DISPATCHED → EN_ROUTE`: immediate (existing)
- `EN_ROUTE → ARRIVING`: on arrival tick, 3-tick hold
- `ARRIVING → TREATING`: after 3 ticks
- `TREATING → WRAPPING_UP`: when event resolves, 3-tick hold
- `WRAPPING_UP → RETURNING`: after 3 ticks, calculate return travel
- `RETURNING → IDLE`: on base arrival

### 1.2 Per-Unit Treatment Contribution

Each tick in `updateEvents()`, after computing `unitMultiplier`, store per-unit contribution:

```typescript
for (const unit of onSceneUnits) {
  const isMatch = event.requiredForces.includes(unit.forceType);
  const specBonus = unit.specialization.includes(event.type) ? 1.5 : 1.0;
  const matchBonus = isMatch ? 1.0 : 0.3;
  const raw = unit.effectiveness * matchBonus * specBonus;
  unit.treatmentContribution = raw / totalMultiplier; // fraction of total
  unit.matchQuality = isMatch ? "full" : unit.specialization.includes(event.type) ? "partial" : "none";
}
```

### 1.3 Functional Area Actions

**Close Area** (`closeArea` action on GameEvent):
- Requires: at least 1 police unit ON_SCENE
- Effect: sets `event.areaClosed = true`
- Reduces chain event probability by 70% (multiply `chain.probability * 0.3`)
- Reduces `populationAtRisk` contribution from this event's threat zone by 40%
- Radio message: "אזור {location} נחסם — משטרה בשטח"

**Evacuate Civilians** (`evacuateCivilians` action on GameEvent):
- Requires: at least 1 evacuation unit ON_SCENE
- Effect: sets `event.evacuationActive = true`
- Evacuation units move 50 civilians/tick to `evacuated` (existing mechanic, now player-triggered)
- Gradually reduces `panicLevel` (-0.3/tick while active)
- Radio message: "פינוי תושבים החל ב{location}"

New fields on `GameEvent`:
- `areaClosed: boolean` (default false)
- `evacuationActive: boolean` (default false)

### 1.4 Enhanced Radio Messages

Add new radio generators for:
- Unit returning: "{unitName} סיים משימה, חוזר לבסיס. הגעה בעוד {eta}"
- Area closed: "משטרה חסמה את האזור ב{location}"
- Evacuation started: "פינוי תושבים מ{location} — יחידת פינוי בשטח"
- Evacuation progress: "פונו {count} תושבים מ{location}" (every 200 evacuated)
- Unit wrapping up: "{unitName} מסיים טיפול ב{location}, מתפנה"

### 1.5 Situation Summary Data

Add computed helper (not stored in state, computed in component or selector):
```typescript
interface SituationSummary {
  criticalUnattended: number;  // critical events with no units
  unitsEnRoute: number;        // units traveling to events
  nearestEscalation: number;   // ticks until next escalation (any event)
  totalOnScene: number;        // units currently treating
}
```

---

## Part 2: UI — Units Panel Upgrade

### 2.1 Rich Unit Cards

Replace flat unit rows with information-dense cards:

**Available unit:**
- Force icon + name + green "זמין" dot
- Base location (small text)

**En-route unit:**
- Force icon + name + yellow arrow icon
- Progress bar: distance traveled / total distance, ETA countdown "הגעה בעוד 2:40"
- Target event name (clickable → selects event)

**Treating unit:**
- Force icon + name + blue pulse icon
- Treatment progress bar with percentage
- Match quality indicator: ★ מתאים / ½ חלקי / ✗ לא מתאים
- Contribution: "תרומה: 42%"
- Target event name (clickable)

**Returning unit:**
- Force icon + name + gray arrow icon
- ETA to base: "חוזר לבסיס — 1:50"

### 2.2 Sorting

New sort order (active units first):
1. TREATING / ON_SCENE — most relevant
2. EN_ROUTE — waiting for arrival
3. ARRIVING / WRAPPING_UP — transitional
4. RETURNING — will be available soon (show ETA)
5. AVAILABLE — ready to dispatch

### 2.3 Hover Tooltip

Rich tooltip on hover:
- Unit name, force type, speed
- Specializations
- If active: target event, distance, ETA, match quality
- If available: "לחץ לבחירה, ואז לחץ על אירוע לשליחה"

---

## Part 3: UI — EventDetail Drawer

### 3.1 Expandable Drawer

Replace the flat bottom panel with an animated drawer:
- Default: collapsed (existing height, ~120px)
- Click expand button or tab: expands to ~40% of screen height
- Three tabs at the top of the drawer

### 3.2 Tab: Status (מצב)

Enhanced version of current EventDetail:
- Event type icon + name + severity badge + location
- Description text
- Threat indicators (existing badges)
- Progress bar (larger, with percentage text)
- Treatment timeline: elapsed / expected with visual bar
- Escalation countdown (red, prominent when < 2 minutes)
- Area status badges: "אזור חסום" (green) / "פינוי פעיל" (blue)

### 3.3 Tab: Forces on Scene (כוחות בשטח)

Per-unit breakdown:
```
┌─────────────────────────────────────────────┐
│ כוחות נדרשים:                               │
│ ✓ כיבוי אש    ✓ מד"א    ✗ משטרה [שגר]    │
├─────────────────────────────────────────────┤
│ כוחות מוקצים:                               │
│                                             │
│ 🚒 כח כיבוי 3     ⚡ מטפל   42%   ★ מתאים │
│    ━━━━━━━━━━━━░░░  תרומה: 42%              │
│                                             │
│ 🚑 אמבולנס 7      → בדרך   ETA 1:30       │
│    ━━━━━━░░░░░░░░░  ½ חלקי                  │
│                                             │
│ [+ שגר כוח נוסף]                            │
└─────────────────────────────────────────────┘
```

Missing required forces shown in red with inline "שגר" button that opens dispatch flow.

### 3.4 Tab: Timeline (ציר זמן)

Chronological event history from the recorder:
```
08:00  ⚡ אירוע דווח — שריפה ברמת בקע
08:02  → כח כיבוי 3 נשלח
08:05  ✓ כח כיבוי 3 הגיע לזירה
08:06  → אמבולנס 7 נשלח
08:08  ⚠ הסלמה — חומרה עלתה
08:10  ✓ אמבולנס 7 הגיע
08:15  ✓ אירוע יוצב (50%)
08:22  ✓ אירוע טופל
```

Uses existing `gameRecorder` timeline, filtered to this event's ID.

---

## Part 4: UI — Action Feedback

### 4.1 Dispatch Feedback

When a unit is dispatched:
1. **Visual**: Unit card flashes blue briefly (200ms)
2. **Map**: Dashed route line appears with animation (grows from unit to target)
3. **Radio**: Dispatch message appears in RadioFeed
4. **Notification**: Toast "כח כיבוי 3 נשלח לרמת בקע — ETA 2:40"
5. **Sound**: Existing dispatch sound (already implemented in useSoundEffects)

### 4.2 Arrival Feedback

When a unit arrives on scene:
1. **Visual**: Event card in EventsPanel gets brief green border flash
2. **Map**: Route line transitions from dashed to solid
3. **Radio**: Arrival message
4. **Notification**: Toast "כח כיבוי 3 הגיע לזירה"

### 4.3 Action Button Tooltips

Before clicking, show what will happen:

**"שגר כוחות"** tooltip:
- "בחר כוח זמין ולחץ כאן לשליחה" (when no unit selected)
- "שלח {unitName} — ETA {time}, התאמה: {quality}" (when unit selected)

**"סגור אזור"** tooltip:
- "דורש משטרה בזירה" (when no police on scene — button disabled)
- "חסימת אזור — מפחית סיכון להסלמה ב-70%" (when police present)

**"פנה תושבים"** tooltip:
- "דורש יחידת פינוי בזירה" (when no evac unit — button disabled)
- "פינוי {X} תושבים באזור הסיכון" (when evac unit present)

### 4.4 Button States

Action buttons get proper enabled/disabled states:
- **Disabled**: grayed out, tooltip explains why
- **Enabled**: colored, tooltip explains effect
- **Active**: after clicking, shows active state (e.g., "אזור חסום ✓")

---

## Part 5: UI — TopBar Situation Summary

### 5.1 Enhanced Stats Section

Replace current simple counters with richer summary:

```
⚠ 3 אירועים (1 ללא מענה!)  |  👥 8/15 זמינים  |  ⏱ הסלמה בעוד 1:30  |  🚗 4 בדרך
```

- **Critical unattended count**: red pulsing number when > 0
- **Available/total units**: existing, keep
- **Nearest escalation**: countdown to next escalation across all events (red when < 2 min)
- **Units en-route**: how many units are currently traveling

### 5.2 Unattended Alert

When critical events have no units assigned for > 30 ticks:
- TopBar shows persistent red flash on the event count
- Helps player notice things they missed

---

## Part 6: UI — EventsPanel Enhancements

### 6.1 Missing Forces Indicator

Each event card shows which required forces are missing:
- Small colored dots under the event name: green dot = force assigned, red dot = force missing
- At a glance: "this event needs attention" without opening EventDetail

### 6.2 Escalation Countdown on Cards

Events approaching escalation (< 2 minutes) show a small red timer on the card itself, not just in EventDetail.

---

## Part 7: Radio Feed Enhancements

### 7.1 New Message Types

Add radio messages for:
- Unit returning to base (with ETA)
- Area closed by police
- Evacuation started / progress milestones
- Unit wrapping up

These use existing `radioXxx()` generator pattern in `src/engine/radio.ts`.

### 7.2 Unit ID Linking

Radio messages with `unitId` become clickable → clicking selects that unit in UnitsPanel + zooms map.

---

## Architecture Notes

### Files Modified (Engine)
- `src/engine/types.ts` — Add UnitPhase, new Unit fields, new GameEvent fields
- `src/engine/units.ts` — ARRIVING/WRAPPING_UP phase logic, compute treatmentContribution
- `src/engine/events.ts` — areaClosed effect on chain events, evacuationActive effect
- `src/engine/radio.ts` — New message generators
- `src/data/radio-templates.ts` — New templates
- `src/store/game-store.ts` — New actions: closeArea, evacuateCivilians

### Files Modified (UI)
- `src/components/command-center/UnitsPanel.tsx` — Rich cards, new sorting, tooltips
- `src/components/command-center/EventDetail.tsx` — Drawer with tabs
- `src/components/command-center/EventsPanel.tsx` — Force dots, escalation timer
- `src/components/command-center/TopBar.tsx` — Situation summary
- `src/components/command-center/CommandCenter.tsx` — Drawer layout accommodation
- `src/hooks/useRadioFeed.ts` — Track new phase transitions

### Files Created
- None (all changes in existing files)

### No Changes To
- Map rendering (CityMap.tsx) — existing route lines and markers are sufficient
- Scoring engine — no scoring formula changes
- Scenarios/data files — no content changes
- Sound system — existing sounds cover the actions
