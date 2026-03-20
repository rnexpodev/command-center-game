# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Urban Command Center simulation game — a Hebrew RTL emergency management simulator set in Beer Sheva, Israel. The player manages city-wide emergency events by dispatching units, prioritizing incidents, and preventing escalation. Built with React + TypeScript + Vite (not Next.js).

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
- **`units.ts`** — Unit dispatch, movement calculation (distance-based travel time), arrival handling.
- **`escalation.ts`** — Rules for when untreated events worsen (severity increase, casualty growth, chain spawning).
- **`scoring.ts`** — Score calculation across 4 categories (response time, stabilization, resource efficiency, casualty prevention). 0–1000 scale, S/A/B/C/D/F grades.

### State (`src/store/`)

Three Zustand stores:
- **`game-store.ts`** — Full `GameState` + actions. Engine functions receive state snapshots, mutate them, and the store replaces its state. The clock lives outside the store (not serializable).
- **`ui-store.ts`** — UI-only state: selected event/unit IDs, screen routing (`menu` | `game` | `report` | `tutorial`), notification queue.
- **`tour-store.ts`** — Guided tour progress, persisted to localStorage.

### Data (`src/data/`)

Static game content — all data is defined here, not fetched:
- **`city.ts`** — Beer Sheva map: 10 neighborhoods with polygons, 12+ landmarks with coordinates.
- **`event-types.ts`** — 17 event type definitions (10 standard + 7 missile-related) with required forces, escalation timers, chain rules.
- **`unit-types.ts`** — 21 unit templates across 9 force types (Fire, MDA, Police, Rescue, Engineering, Welfare, Infrastructure, Evacuation, Homefront Command).
- **`map-icons.ts`** — Centralized SVG icon registry for map markers (force types + event types), shared color/name records, React icon wrapper components.
- **`base-locations.ts`** — 4 unit home base definitions with map coordinates and assigned force types.
- **`treatment-durations.ts`** — Per-event-type treatment duration tables with context-based scaling (threat radius, casualties, severity).
- **`scenarios/`** — 14 scenario definitions (4 classic + 10 missile-focused) with timed event waves.

### UI (`src/components/`)

Four screens driven by `ui-store.screen`:
- **`command-center/`** — Main game screen: TopBar (clock/stats), EventsPanel (right), CityMap (center, Leaflet), UnitsPanel (left), EventDetail (bottom).
- **`scenarios/`** — Scenario selection menu.
- **`post-game/`** — Results screen with score breakdown and grade.
- **`tutorial/`** — Animated onboarding with mission briefs and replay.
- **`tour/`** — 10-step guided tour overlay system.
- **`ui/`** — Shared primitives (Badge, IconButton, ProgressBar).

### Utilities (`src/lib/utils.ts`)

`cn()` (clsx + tailwind-merge), `formatGameTime()`, distance calculation, unique ID generation.

## Key Patterns

- **All UI text is Hebrew.** Entity names use `nameHe` fields. The HTML root has `lang="he" dir="rtl"`.
- **`as const` objects instead of enums** — required by `erasableSyntaxOnly` in tsconfig. The pattern is: `export const Foo = { ... } as const; export type Foo = (typeof Foo)[keyof typeof Foo];`
- **Direct state mutation in engine** — engine functions mutate `GameState` properties directly for performance. The Zustand store creates shallow snapshots before passing state to engine functions, then replaces its state.
- **Screen routing via Zustand** — no React Router. `ui-store.screen` switches between `"menu"`, `"game"`, `"report"`, `"tutorial"`.
- **Dark theme** — zinc-950 background with operational color coding: red (critical/fire), orange (warning), blue (info/police), green (resolved). Custom CSS variables and animations defined in `src/index.css`.
- **Map coordinates** — Beer Sheva center: `[31.2518, 34.7913]`. All positions are `[lat, lng]` arrays.
- **Map icons** — SVG icon registry in `src/data/map-icons.ts` provides both HTML strings (for Leaflet DivIcon) and React components (for sidebar panels). Icons, colors, and Hebrew names are centralized here — no duplication across components.
- **Map markers** — Event markers show type-specific SVG icons with severity-colored backgrounds and SVG progress rings. Unit markers show force-type icons with status dots. Icon cache (`Map<string, L.DivIcon>`) prevents per-tick DOM recreation.
- **Route lines** — Polylines connect units to their targets: dashed for EN_ROUTE, dotted for ON_SCENE, faint for RETURNING. Selected events show white highlight lines to all assigned units.
- **Base buildings** — 4 static base markers (fire station, police, hospital, municipal) show unit home locations on the map.
- **Treatment durations** — Duration-based resolution replaces flat `resolveRate`. Each event type has base/min/max tick durations scaled by threat radius, casualties, and severity. `GameEvent.treatmentStartTick` and `treatmentDurationTicks` track treatment timeline.

## Domain Concepts

- **Escalation** — Events have timers; unhandled events increase in severity, grow casualties, and can spawn chain events.
- **Chain Events** — Some event types (e.g., building collapse) automatically spawn secondary events (fire, road blockage).
- **Force Matching** — Each event type requires specific force types. Score rewards correct matching, not just fast dispatch.
- **Scenario Waves** — Scenarios define timed waves of events. Events spawn at specific ticks during the simulation.
- **Fog of War** — Missile events have initial uncertainty; details reveal progressively.
