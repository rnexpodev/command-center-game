# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Urban Command Center simulation game — a Hebrew RTL emergency management simulator set in Beer Sheva, Israel. The player manages city-wide emergency events by dispatching units, prioritizing incidents, and preventing escalation. Built with React + TypeScript + Vite (not Next.js).

**Genre:** Emergency Dispatch Simulation / Real-Time Tactical Strategy / Serious Game
**Categories:** Emergency Dispatch Simulation, Real-Time Tactical Strategy, City Crisis Management, Serious Game/Training Simulator, Israeli Civilian Defense Simulation
**Competitors:** 911 Operator, 112 Operator, EMERGENCY series, Frostpunk, Command: Modern Operations
**Unique niche:** First Hebrew-language emergency command simulation set in a real Israeli city with missile attack scenarios.
**Dual purpose:** Also serves as a visual prototype for the real municipal command center software at `C:\devprojects\municipal-command-center`.

## Commands

```bash
npm run dev          # Start Vite dev server (default :5173)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build locally
```

There is also `Run Game Dev.cmd` in the repo root — a Windows launcher that checks ports, installs deps, cleans cache, and opens the browser.

No test framework is configured.

## Tech Stack

- **React 19** + **TypeScript 5.9** (strict mode, `erasableSyntaxOnly` — no `enum`, use `as const` objects)
- **Vite 8** with `@vitejs/plugin-react`
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, no `tailwind.config` file — theme in `src/index.css`)
- **Zustand 5** for state management
- **Leaflet** + **react-leaflet** for the interactive city map
- **Framer Motion** for animations
- **Howler** for sound effects
- **Lucide React** for icons
- Path alias: `@/*` → `./src/*`

## Architecture

### Engine / UI Separation

The codebase has a strict split between the **pure TypeScript simulation engine** (`src/engine/`) and the **React UI** (`src/components/`). Engine modules have zero React imports and can be tested independently.

### Engine (`src/engine/`)

Pure functions that mutate `GameState` directly (no immutability — performance choice):

- **`types.ts`** — All type definitions. Uses `as const` objects + type extraction pattern (not enums) for `erasableSyntaxOnly` compatibility.
- **`simulation.ts`** — Main game loop: `createSimulation()`, `startScenario()`, `tickSimulation()`. Each tick spawns events, updates escalation, moves units, recalculates score, checks win/lose.
- **`clock.ts`** — `requestAnimationFrame`-based clock. Controls game speed (Paused/1x/2x/4x).
- **`events.ts`** — Event spawning from scenario waves, escalation timer detection, chain event generation. Duration-based resolution using `treatmentDurationTicks` from treatment-durations data.
- **`units.ts`** — Unit dispatch, movement calculation (distance-based travel time with weather speed modifier), arrival handling.
- **`weather.ts`** — Weather & time-of-day engine: `getSpeedModifier()` returns travel speed multiplier (rain=0.8, sandstorm=0.5, night=0.85), `getEventSpawnModifier()` boosts spawn probability by weather/event-type, `advanceTimeOfDay()` cycles dawn/day/dusk/night every 150 ticks.
- **`escalation.ts`** — Rules for when untreated events worsen (severity increase, casualty growth, chain spawning).
- **`scoring.ts`** — Score calculation across 4 categories (response time, stabilization, resource efficiency, casualty prevention). 0–1000 scale, S/A/B/C/D/F grades.
- **`recorder.ts`** — Singleton `GameRecorder` that records `TimelineEntry` items during gameplay (event spawned/resolved/escalated, unit dispatched/arrived, chain events). Used by the after-action replay in the post-game report.
- **`analytics.ts`** — Pure analytics computation from recorder timeline. `computeAnalytics()` returns response times per event, force utilization, event-type counts, escalation/chain counts, resolution rate, peak concurrent events, and time to first response.
- **`training.ts`** — Training mode engine: manual event injection (`createManualEvent`), extra unit spawning (`addExtraUnits`), event clearing (`clearEvents`), and 4 predefined `TrainingObjective` checks (zero escalations, fast response, full utilization, zero casualties).
- **`achievements.ts`** — Pure achievement condition checker. `checkAchievements(stats, gameResult)` returns newly earned achievement IDs.
- **`civilians.ts`** — Civilian behavior simulation: `updateCivilianState()` called each tick calculates population-at-risk (neighborhoods overlapping event threat zones), panic level (rises with critical/high events, decays when calm), and evacuation progress (evacuation units on scene move civilians to safety).
- **`result-builder.ts`** — Extracts a `GameResult` snapshot from completed `GameState` for career tracking.

### State (`src/store/`)

Six Zustand stores:
- **`game-store.ts`** — Full `GameState` + actions. Engine functions receive state snapshots, mutate them, and the store replaces its state. The clock lives outside the store (not serializable).
- **`ui-store.ts`** — UI-only state: selected event/unit IDs, screen routing (`menu` | `game` | `report` | `tutorial` | `career` | `campaign` | `editor`), notification queue.
- **`tour-store.ts`** — Guided tour progress, persisted to localStorage.
- **`career-store.ts`** — Persistent career stats and achievements, persisted to localStorage. Tracks cumulative events resolved, scenarios played, best grades/scores, and unlocked achievements.
- **`campaign-store.ts`** — Campaign mode progress, persisted to localStorage. Tracks active campaign, current scenario index, completed scenario grades/scores, and bonus units earned.
- **`editor-store.ts`** — Scenario editor state: waves, events, scenario metadata. Supports save/load to localStorage, JSON export/import. `buildScenario()` converts editor state to a real `Scenario` object for the game engine.

### Data (`src/data/`)

Static game content — all data is defined here, not fetched:
- **`city.ts`** — Beer Sheva map: 10 neighborhoods with polygons, 12+ landmarks with coordinates.
- **`event-types.ts`** — 17 event type definitions (10 standard + 7 missile-related) with required forces, escalation timers, chain rules.
- **`unit-types.ts`** — 21 unit templates across 9 force types (Fire, MDA, Police, Rescue, Engineering, Welfare, Infrastructure, Evacuation, Homefront Command).
- **`map-icons.ts`** — Centralized SVG icon registry for map markers (force types + event types), shared color/name records, React icon wrapper components.
- **`base-locations.ts`** — 4 unit home base definitions with map coordinates and assigned force types.
- **`treatment-durations.ts`** — Per-event-type treatment duration tables with context-based scaling (threat radius, casualties, severity).
- **`scenarios/`** — 14 scenario definitions (4 classic + 10 missile-focused) with timed event waves.
- **`achievements.ts`** — 18 achievement definitions across 4 categories (performance, speed, mastery, milestone) with Hebrew names and condition types.
- **`population.ts`** — Per-neighborhood population counts (keyed by neighborhood ID), total city population constant, and 8 public shelter definitions with coordinates and capacity.
- **`campaign.ts`** — Campaign definition: "Operation Beer Sheva Shield" with 6 connected scenarios (tutorial through heavy barrage), briefings in Hebrew, grade requirements, and rewards.

### UI (`src/components/`)

Seven screens driven by `ui-store.screen`:
- **`command-center/`** — Main game screen: TopBar (clock/stats/panic meter), EventsPanel (right), CityMap (center, Leaflet), UnitsPanel (left), EventDetail (bottom). PanicMeter shows population-at-risk, evacuated count, and panic level with color-coded LED indicators.
- **`scenarios/`** — Scenario selection menu.
- **`post-game/`** — Results screen with three tabs: score summary, performance analytics (response times, force utilization, events by type, key metrics), and after-action replay timeline. Replay includes playback controls, tick scrubber, speed adjustment, and filterable event list.
- **`tutorial/`** — Animated onboarding with mission briefs and replay.
- **`tour/`** — 10-step guided tour overlay system.
- **`career/`** — Career dashboard screen: stats summary, achievement grid (locked/unlocked), best grades table per scenario.
- **`campaign/`** — Campaign mode: CampaignSelect (vertical timeline of 6 missions with lock/active/complete states), BriefingModal (dramatic pre-mission overlay with fade-in text), CampaignResultOverlay (pass/fail with grade, rewards, continue/retry actions), TimelineItem (individual mission card).
- **`achievements/`** — Achievement popup toast (animated, gold accent, auto-dismiss) and icon mapper.
- **`training/`** — Training mode instructor panel: collapsible side panel with event injector (type/severity picker + map click placement), live objectives tracker, and quick actions (add units, clear events). Visible only when `trainingMode` is true.
- **`editor/`** — Scenario editor screen: 3-column layout with wave list (right in RTL), mini Leaflet map with click-to-place events (center), and event details panel (left in RTL). Top bar has scenario name/difficulty/save/export/import. Bottom bar has play and cancel. Supports save/load from localStorage and JSON import/export.
- **`ui/`** — Shared primitives (Badge, IconButton, ProgressBar).

### Utilities (`src/lib/utils.ts`)

`cn()` (clsx + tailwind-merge), `formatGameTime()`, distance calculation, unique ID generation.

## Key Patterns

- **All UI text is Hebrew.** Entity names use `nameHe` fields. The HTML root has `lang="he" dir="rtl"`.
- **`as const` objects instead of enums** — required by `erasableSyntaxOnly` in tsconfig. The pattern is: `export const Foo = { ... } as const; export type Foo = (typeof Foo)[keyof typeof Foo];`
- **Direct state mutation in engine** — engine functions mutate `GameState` properties directly for performance. The Zustand store creates shallow snapshots before passing state to engine functions, then replaces its state.
- **Screen routing via Zustand** — no React Router. `ui-store.screen` switches between `"menu"`, `"game"`, `"report"`, `"tutorial"`, `"career"`, `"editor"`.
- **Dark theme** — zinc-950 background with operational color coding: red (critical/fire), orange (warning), blue (info/police), green (resolved). Custom CSS variables and animations defined in `src/index.css`.
- **Map coordinates** — Beer Sheva center: `[31.2518, 34.7913]`. All positions are `[lat, lng]` arrays.
- **Map icons** — SVG icon registry in `src/data/map-icons.ts` provides both HTML strings (for Leaflet DivIcon) and React components (for sidebar panels). Icons, colors, and Hebrew names are centralized here — no duplication across components.
- **Map markers** — Event markers show type-specific SVG icons with severity-colored backgrounds and SVG progress rings. Unit markers show force-type icons with status dots. Icon cache (`Map<string, L.DivIcon>`) prevents per-tick DOM recreation.
- **Route lines** — Polylines connect units to their targets: dashed for EN_ROUTE, dotted for ON_SCENE, faint for RETURNING. Selected events show white highlight lines to all assigned units.
- **Base buildings** — 4 static base markers (fire station, police, hospital, municipal) show unit home locations on the map.
- **Treatment durations** — Duration-based resolution replaces flat `resolveRate`. Each event type has base/min/max tick durations scaled by threat radius, casualties, and severity. `GameEvent.treatmentStartTick` and `treatmentDurationTicks` track treatment timeline.
- **Game recorder** — Singleton `gameRecorder` in `src/engine/recorder.ts` automatically records timeline entries during simulation. Reset on scenario start. Accessed by the post-game replay via `gameRecorder` export from `game-store.ts`.
- **Civilian state** — `GameState.civilianState` tracks city-wide panic (0–100), population at risk (civilians in event threat zones), and evacuated count. Updated each tick by `civilians.ts`. Panic rises with critical/high events, decays when calm. Population at risk uses neighborhood proximity to active events.
- **Training mode** — `GameState.trainingMode` flag toggled on the scenario selection screen. When active, the InstructorPanel appears in the command center layout. Instructors can inject events (dropdown + map click), track 4 predefined objectives live, add extra units, and clear all events. Map click injection uses a shared pending-injection state between the EventInjector component and a `useMapEvents` hook in CityMap.
- **Weather & time of day** — `GameState.weather` (clear/rain/sandstorm/heatwave) and `GameState.timeOfDay` (dawn/day/dusk/night) affect gameplay. Weather slows unit travel (rain 0.8x, sandstorm 0.5x) and boosts certain event spawns. Time advances every 150 ticks. Scenarios can set `weather` and `startTimeOfDay`. TopBar shows weather/time indicators via `WeatherIndicator` component. Map has CSS overlay tints (blue for rain, amber for sandstorm, dark for night, orange for dawn/dusk).

## Domain Concepts

- **Escalation** — Events have timers; unhandled events increase in severity, grow casualties, and can spawn chain events.
- **Chain Events** — Some event types (e.g., building collapse) automatically spawn secondary events (fire, road blockage).
- **Force Matching** — Each event type requires specific force types. Score rewards correct matching, not just fast dispatch.
- **Scenario Waves** — Scenarios define timed waves of events. Events spawn at specific ticks during the simulation.
- **Fog of War** — Missile events have initial uncertainty; details reveal progressively.

## Documentation

- **`docs/GAME-IDENTITY.md`** — Game categories, competitive positioning, unique value propositions
- **`docs/COMPETITIVE-ANALYSIS.md`** — 15+ competitor game analyses across 4 tiers with actionable conclusions
- **`docs/plans/`** — Improvement plans directory: `pending/` (plans) and `executed/` (completed: 01-sound-design, 02-after-action-replay, 06-diegetic-ui)
- **`docs/process/CORTEX-DEVELOPMENT-TRACE.md`** — Cortex usage timeline and issues
- **`docs/process/DECISION-LOG.md`** — All architectural and product decisions with reasoning
- **`docs/cortex-evaluation.md`** — Cortex feature ratings from initial build
- **`docs/cortex-improvements.md`** — Cortex improvement suggestions from field use
- **`docs/info.md`** — Original Hebrew product specification

## Cortex Integration

Project is registered in Cortex Studio (ID: `e0edbd05-c909-4b5d-a2b4-addc5ffb70d1`). Cortex at `C:\devprojects\cortex` provides:
- **Council** for architectural and product decisions
- **Project Studio** for feature tracking
- **Error tracking** for issue discovery
- **Session ingestion** for development history
