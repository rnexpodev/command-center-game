---
path: src/store/**
---

# Store Code Standards — Urban Command Center

## Core Principles

Zustand stores are the bridge between the pure engine and React UI. They manage state snapshots and expose typed actions.

## Rules

### 1. Store Structure
- Each store in its own file with `create()` from Zustand
- Export a typed hook: `export const useGameStore = create<GameStore>(...)`
- State type defined as interface at top of file

### 2. Engine Integration Pattern
- Game store creates shallow snapshots before passing to engine functions
- Engine functions mutate the snapshot directly (performance choice)
- Store replaces its state with the mutated snapshot via `set()`
- Clock lives outside the store (not serializable)

### 3. Persistence
- Use `persist` middleware for stores that save to localStorage (career, campaign, tour, editor)
- Game store is NOT persisted (transient session state)
- UI store is NOT persisted (screen routing, selections)

### 4. Actions
- Actions are defined inside `create()`, not as separate functions
- Action names follow verb pattern: `dispatchUnit`, `recallUnit`, `closeArea`
- Actions that affect game state should call engine functions, not mutate directly

### 5. Selectors
- Prefer fine-grained selectors to prevent unnecessary re-renders
- Pattern: `const events = useGameStore(s => s.events)`
- Never subscribe to the entire store in a component
