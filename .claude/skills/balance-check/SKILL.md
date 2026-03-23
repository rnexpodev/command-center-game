---
name: balance-check
description: Reviews game balance across all simulation parameters — escalation, treatment, scoring, units, weather. Produces a structured balance report with recommendations.
---

# Balance Check — Urban Command Center

## Purpose
Systematic review of all balance-affecting parameters to ensure fair, challenging, and fun gameplay. Run this after modifying any engine data or before a playtest session.

## Procedure

### Step 1: Gather Current Values
Read these files to collect all balance parameters:
- `src/data/event-types.ts` — escalation timers, required forces, chain rules
- `src/data/treatment-durations.ts` — base/min/max ticks per event type
- `src/data/unit-types.ts` — unit speeds, force types
- `src/data/base-locations.ts` — base positions (affects response times)
- `src/engine/weather.ts` — speed modifiers, spawn modifiers
- `src/engine/scoring.ts` — score category weights, grade thresholds
- `src/engine/escalation.ts` — escalation rules, chain spawn probabilities
- `src/engine/civilians.ts` — panic rates, evacuation speed
- `src/data/scenarios/` — wave timing, event density per scenario

### Step 2: Analyze Balance Dimensions

For each dimension, assess on a 1-5 scale (1=too easy, 3=balanced, 5=too hard):

| Dimension | What to Check |
|-----------|---------------|
| **Response Time Pressure** | Can units reach events before escalation? Average travel time vs. escalation timer. |
| **Force Coverage** | Are there enough units of each type? Any force type that's always short? |
| **Escalation Fairness** | Do players have realistic time to react? Chain events reasonable? |
| **Treatment Duration** | Do events resolve in a satisfying timeframe? Too fast = boring, too slow = frustrating. |
| **Score Achievability** | Can a skilled player get S rank? Can a novice get at least C? |
| **Weather Impact** | Do weather modifiers create interesting choices without being punishing? |
| **Civilian Systems** | Is panic rate responsive but not overwhelming? Evacuation meaningful? |
| **Scenario Difficulty Curve** | Does difficulty increase smoothly across scenarios? |

### Step 3: Cross-Reference
- Compare fastest unit travel time to shortest escalation timer
- Check if any event type is impossible to treat with available units
- Verify score weights add to 1000 across categories
- Check that chain events don't create unrecoverable spirals

### Step 4: Generate Report
Output a balance report in Hebrew with this structure:

```markdown
# דוח איזון — [תאריך]

## סיכום
[ציון כללי 1-5, תיאור קצר]

## ממצאים לפי ממד
### לחץ זמן תגובה: [1-5]
[ניתוח]

### כיסוי כוחות: [1-5]
[ניתוח]

[... continue for all dimensions]

## בעיות קריטיות
- [בעיה 1]
- [בעיה 2]

## המלצות
1. [שינוי מומלץ + ערכים ספציפיים]
2. [שינוי מומלץ + ערכים ספציפיים]

## השוואה לדוח קודם
[מה השתנה מאז הדוח האחרון]
```

### Step 5: Save Report
Save to `docs/studio/balance-reports/[date]-balance.md`
