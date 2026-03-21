# 11 — Achievements & Statistics

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Impact** | MEDIUM |
| **Effort** | LOW |
| **Serves Real Software** | No |

## Objective

Add an achievement system with medals and a persistent statistics dashboard. Achievements provide short-term goals and recognition, while statistics give players insight into their improvement over time. Together they drive replayability and mastery motivation.

## Competitive Reference

Steam achievements (industry standard player retention), 911 Operator medals (per-mission awards), Emergency HQ progression system (unlock-based advancement). Achievement systems are the lowest-effort, highest-retention feature in simulation games.

## Requirements

- 20-30 achievements across categories:
  - **Performance**: S-grade on any scenario, S-grade on a hard scenario, perfect 1000 score
  - **Speed**: resolve an event under 10 ticks, clear an entire scenario under 200 ticks
  - **Mastery**: use all 9 force types in one scenario, zero escalations, zero casualties in a full scenario
  - **Milestone**: resolve 100/500/1000 total events, play 10/50 scenarios, complete all 4 classic scenarios
  - **Secret**: discover a specific chain event combo, resolve a missile barrage with zero casualties
- Achievement notification popup during gameplay (non-intrusive, auto-dismiss after 3 seconds)
- Achievements gallery accessible from main menu with locked/unlocked states
- Statistics dashboard with charts:
  - Average response time trend across sessions
  - Grade distribution pie/bar chart
  - Most-played scenarios ranking
  - Total events resolved, total casualties, total play time
  - Best score per scenario
- All data persisted to localStorage
- Hebrew labels for all achievements and statistics

## Technical Design

### New Files

- **`src/data/achievements.ts`** — Achievement definitions using `as const` objects. Each achievement has an ID, Hebrew name, Hebrew description, category, icon (from Lucide), condition type, and threshold parameters.
- **`src/engine/achievements.ts`** — Pure TypeScript module for condition checking. Exports `checkAchievements()` which receives game state snapshots and cumulative stats, returns newly unlocked achievement IDs. No React imports.
- **`src/store/stats-store.ts`** — Zustand store for persistent statistics and achievement state. Tracks: unlocked achievement IDs with timestamps, cumulative stats (total events, total scenarios, total play ticks), per-scenario best scores, response time history. Persisted to localStorage.
- **`src/components/achievements/AchievementPopup.tsx`** — Framer Motion animated toast notification for newly unlocked achievements. Slides in from top, auto-dismisses.
- **`src/components/achievements/AchievementGallery.tsx`** — Full-screen gallery showing all achievements in category groups. Locked achievements show silhouette icons and hidden descriptions. Unlocked show full color with unlock date.
- **`src/components/achievements/StatsCharts.tsx`** — Statistics dashboard with simple SVG charts (no external charting library). Bar chart for grades, line chart for response time trend, list for rankings.

### Architecture

- Achievement checking runs at two points: during gameplay (each tick, for in-game achievements like "resolve under 10 ticks") and at game end (for session-level achievements like "S-grade" or "zero casualties").
- The `checkAchievements()` function is pure — it receives current `GameState` and `CumulativeStats`, compares against achievement conditions, and returns new unlocks. The store handles persistence.
- Statistics are updated at game end: `stats-store` receives the final `GameState` and appends to cumulative records.
- Achievement popup is rendered via a Zustand subscription in the game screen. When `stats-store.recentUnlocks` changes, the popup component animates in.
- Charts use inline SVG for simplicity (no external charting dependency). Bar charts, line charts, and simple counters cover all needed visualizations.

### Files to Modify

- **`src/store/ui-store.ts`** — Add `"achievements"` to the screen union type for the gallery/stats screen.
- **`src/engine/simulation.ts`** — Add achievement check hook after each tick and at game end.
- **`src/components/command-center/GameScreen.tsx`** — Mount `AchievementPopup` component.
- **`src/components/App.tsx`** (or root router) — Add achievements screen route.
- **`src/components/scenarios/ScenarioList.tsx`** (or main menu) — Add "Achievements" button linking to gallery.

## Acceptance Criteria

- [ ] At least 20 achievements are defined across all 5 categories
- [ ] Achievements trigger correctly during gameplay (in-game conditions)
- [ ] Achievements trigger correctly at game end (session-level conditions)
- [ ] Popup notification appears for newly unlocked achievements without blocking gameplay
- [ ] Popup auto-dismisses after 3 seconds
- [ ] Achievement gallery shows all achievements with locked/unlocked visual states
- [ ] Secret achievements show hidden descriptions until unlocked
- [ ] Statistics dashboard displays grade distribution chart
- [ ] Statistics dashboard displays response time trend over sessions
- [ ] Statistics dashboard shows per-scenario best scores
- [ ] All achievement and statistics data persists across page reloads
- [ ] All text is in Hebrew
