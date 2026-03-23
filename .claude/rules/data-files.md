---
path: src/data/**
---

# Data File Standards — Urban Command Center

## Core Principles

Data files define all static game content. They are the single source of truth for game balance, map data, and entity definitions.

## Rules

### 1. As Const Pattern
- All data objects use `as const` satisfies
- Pattern: `export const EVENT_TYPES = { ... } as const satisfies Record<string, EventType>;`
- Never use `enum` (violates `erasableSyntaxOnly`)

### 2. Hebrew Names Required
- Every entity needs `nameHe` field with Hebrew name
- Descriptions, flavor text, tooltips — all in Hebrew
- IDs and keys can be English (machine-readable)

### 3. Balance Values Are Constants
- Escalation timers, treatment durations, speed modifiers — all named constants
- Document the rationale for each value with a comment
- Group related constants: `// --- Escalation Config ---`

### 4. Coordinate Data
- All map coordinates follow `[lat, lng]` convention
- Beer Sheva center: `[31.2518, 34.7913]`
- Polygon data for neighborhoods uses arrays of `[lat, lng]` pairs
- Include a comment with the real-world location name

### 5. Scenario Definitions
- Each scenario file exports a `Scenario` type object
- Waves are time-ordered by `tick` field
- Event positions must reference known neighborhoods or landmarks
- Include difficulty metadata and Hebrew description

### 6. No Logic
- Data files contain only definitions, not behavior
- No functions, no conditionals, no loops
- Exception: simple computed constants (e.g., `TOTAL_POPULATION = Object.values(POPULATION).reduce(...)`)
