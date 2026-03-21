# 03 — Career Mode

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Impact** | HIGH |
| **Effort** | MEDIUM |
| **Serves Real Software** | No |

## Objective

Add persistent career progression with stats tracking across all plays. Career mode transforms isolated scenarios into a connected journey with goals, unlocks, and a sense of mastery over time.

## Competitive Reference

112 Operator has career mode with objectives, emails, and story progression. Emergency HQ has unit leveling and building upgrades. Both games report that career/progression systems are the primary retention mechanism.

## Requirements

- Player profile with persistent stats (localStorage)
- Career stats dashboard: total events resolved, average response time, favorite force type, total play time, best grade per scenario
- Achievement medals for milestones:
  - 100 events resolved
  - S-grade on any hard scenario
  - Zero casualties in a full scenario
  - All force types used in a single scenario
  - Complete all tutorial missions
  - 10+ scenarios completed
- Scenario unlock progression: complete tutorial -> unlock easy -> unlock medium -> unlock hard -> unlock missile
- Star rating per scenario (1-3 stars based on grade: C=1, B=2, A/S=3)
- Career dashboard screen accessible from main menu

## Technical Design

### New Files

- **`src/store/career-store.ts`** — Zustand store with `persist` middleware (localStorage). Holds `CareerState` with player stats, achievement progress, scenario completions, and unlock status.
- **`src/data/achievements.ts`** — Achievement definitions using `as const` objects. Each achievement has an ID, Hebrew name, description, icon, and check function signature.
- **`src/engine/career.ts`** — Pure TypeScript module with achievement checking logic. Takes `CareerState` and latest game result, returns newly unlocked achievements. No React imports.
- **`src/components/career/CareerDashboard.tsx`** — Career overview screen with stats grid, achievement gallery, and scenario progress map.
- **`src/components/career/AchievementToast.tsx`** — Framer Motion animated toast for newly earned achievements.

### Architecture

- After each game ends (win or lose), `career.ts` processes the game result and updates career stats.
- Achievement checks run after stats update; newly triggered achievements are queued for display.
- Scenario selection screen reads `career-store` to determine which scenarios are locked/unlocked and displays star ratings.
- Career dashboard is a new screen value in `ui-store.screen`.

### Files to Modify

- **`src/store/ui-store.ts`** — Add `"career"` to the `screen` type union.
- **`src/components/scenarios/`** — Add star rating display, lock icons, and unlock requirements text per scenario.
- **`src/components/post-game/`** — Trigger career stat update and achievement check after game ends.

## Acceptance Criteria

- [ ] Career stats persist across browser sessions (localStorage)
- [ ] Stats dashboard shows accurate cumulative data after multiple plays
- [ ] Achievements trigger correctly when conditions are met
- [ ] Achievement toast appears with animation when a new achievement is earned
- [ ] Scenarios lock/unlock based on progression rules
- [ ] Star ratings display correctly on scenario selection screen
- [ ] Career dashboard is accessible from the main menu
- [ ] Clearing career data is possible (reset button with confirmation)
