# 09 — Training Mode

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Impact** | HIGH |
| **Effort** | MEDIUM |
| **Serves Real Software** | YES (professional training) |

## Objective

Add a dedicated training mode with instructor controls, live event injection, and detailed performance analytics. Training mode bridges the gap between a game and a professional drill tool, enabling structured exercises with real-time instructor oversight and comprehensive debriefing.

## Competitive Reference

ADMS (student tracking, after-action review with instructor annotations), TEDS (AI-adaptive scenario difficulty), FEMA VTTX (structured tabletop exercises with facilitator controls). Professional training simulators universally provide instructor override capabilities.

## Requirements

- Training mode toggle (separate from regular play, selected at scenario start)
- Instructor panel: pause/resume, inject events manually, adjust unit count mid-game, set initial conditions
- Event injection: click map to spawn any event type at any time during live play
- Adjustable unit roster: add/remove units mid-scenario from the instructor panel
- Detailed per-event analytics: response time, force match accuracy, escalation avoided (yes/no), casualty count
- Training objectives: configurable goals like "resolve all events under 60 ticks", "maintain zero casualties", "no escalations"
- Objective status displayed live during gameplay (pass/fail per objective)
- Performance export: generate detailed printable HTML report with per-event breakdown
- Debrief mode: step through timeline tick-by-tick with instructor text annotations
- ICS (Incident Command System) / HFC doctrine tips: contextual hints about correct emergency procedures

## Technical Design

### New Files

- **`src/engine/training.ts`** — Pure TypeScript module for objective checking, event injection into running simulation, and training analytics computation. Exports `checkObjectives()`, `injectEvent()`, `computeTrainingMetrics()`.
- **`src/data/training-objectives.ts`** — Objective definitions using `as const` objects. Each objective has an ID, Hebrew display name, condition function reference, and parameters (thresholds, counts).
- **`src/components/training/InstructorPanel.tsx`** — Floating side panel with event injection controls, unit roster adjustment, objective status display, and pause/resume.
- **`src/components/training/ObjectiveTracker.tsx`** — Live objective status badges shown during gameplay.
- **`src/components/training/TrainingReport.tsx`** — Printable HTML report component with detailed per-event analytics tables and objective results.
- **`src/components/training/DebriefTimeline.tsx`** — Tick-by-tick timeline stepper with annotation input fields for instructor notes.

### Architecture

- Training mode is a flag on `GameState` (`trainingMode: boolean`) set at scenario start. When active, the instructor panel is visible and event injection is enabled.
- Event injection reuses existing event spawning logic from `src/engine/events.ts` but bypasses the scenario wave system. Injected events are marked with an `injected: true` flag for analytics.
- Training objectives are evaluated each tick by `checkObjectives()`. Each objective is a pure function receiving current `GameState` and returning pass/fail.
- The debrief mode reuses the after-action replay system (plan 02) with added annotation capability. Annotations are stored as `{ tick: number, text: string }[]`.
- Performance export renders `TrainingReport.tsx` to a printable HTML page using `window.print()` with print-specific CSS.

### Files to Modify

- **`src/engine/types.ts`** — Add `trainingMode` flag to `GameState`, `TrainingObjective` type, `TrainingMetrics` type, `injected` flag on `GameEvent`.
- **`src/engine/simulation.ts`** — Add training hooks: call `checkObjectives()` each tick when training mode is active, support mid-simulation event injection.
- **`src/store/game-store.ts`** — Add training state fields (active objectives, instructor annotations, training metrics).
- **`src/components/command-center/TopBar.tsx`** — Show training mode indicator and objective summary.
- **`src/components/post-game/PostGameScreen.tsx`** — Add training report tab when training mode was active.

### Real Software Benefit

Training mode directly maps to how the real municipal command center system would be used for staff training and emergency drills. Instructor controls, objective tracking, and performance reporting are standard requirements in professional emergency management training platforms.

## Acceptance Criteria

- [ ] Training mode can be toggled on at scenario start
- [ ] Instructor panel is visible only in training mode
- [ ] Instructor can pause/resume the simulation from the panel
- [ ] Clicking the map in training mode injects a new event at that location
- [ ] Injected events behave identically to scenario events (escalation, resolution, scoring)
- [ ] Unit roster can be adjusted mid-scenario (add/remove units)
- [ ] Training objectives display live pass/fail status during gameplay
- [ ] Per-event analytics show response time, force match accuracy, and escalation status
- [ ] Performance report generates a clean printable HTML page
- [ ] Debrief mode allows tick-by-tick stepping with text annotations
- [ ] Doctrine tips appear contextually for relevant event types
