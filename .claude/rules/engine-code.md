---
path: src/engine/**
---

# Engine Code Standards — Urban Command Center

## Core Principles

Engine modules are **pure TypeScript** — zero React, zero DOM, zero side effects beyond state mutation.

## Rules

### 1. No React Imports
- Never import from `react`, `react-dom`, or any UI library
- Engine modules must be testable without a browser environment
- If you need to communicate with UI, do it through the Zustand store

### 2. Performance First
- Direct mutation of `GameState` (no spread operators for hot paths)
- Avoid `Array.filter().map()` chains — use single-pass loops
- No object allocation inside `tickSimulation()` — reuse objects or use primitives
- Cache computed values that don't change per-tick

### 3. Named Constants, Not Magic Numbers
- All numeric values must be named constants with descriptive names
- Pattern: `const ESCALATION_TIMER_TICKS = 60;`
- Duration, speed, multiplier, threshold values go in `src/data/` when shared

### 4. Type Safety
- Use `as const` objects with type extraction — never `enum`
- Pattern: `export const Foo = { A: 'a', B: 'b' } as const; export type Foo = (typeof Foo)[keyof typeof Foo];`
- All function parameters must be typed (no `any`)

### 5. Pure Functions Preferred
- Functions should take `GameState` (or subset) and return/mutate predictably
- Side effects (sound, recording) happen through explicit recorder/audio modules
- Exception: `GameRecorder` singleton is the only acceptable side effect

### 6. Delta-Time Awareness
- All time-dependent calculations use tick counts, not wall-clock time
- Weather/speed modifiers apply multiplicatively: `baseTicks * speedModifier`
- Never use `Date.now()` or `performance.now()` in engine logic

### 7. Coordinate Convention
- All positions are `[lat, lng]` (latitude first, Beer Sheva center: `[31.2518, 34.7913]`)
- Distance calculations use the Haversine formula from `src/lib/utils.ts`
- Never hardcode coordinates — reference `src/data/city.ts` or `src/data/base-locations.ts`
