---
path: src/components/**
---

# UI Code Standards — Urban Command Center

## Core Principles

All UI is **Hebrew RTL** with dark theme. Components consume state from Zustand stores — they never run simulation logic.

## Rules

### 1. Hebrew First
- All user-visible text must be in Hebrew
- Use `nameHe` fields from data types
- No hardcoded English strings in the UI (comments and classNames are fine)
- Error messages, tooltips, labels — all Hebrew

### 2. RTL Layout
- Use logical CSS properties: `ms-*`/`me-*` (margin-start/end), `ps-*`/`pe-*` (padding-start/end)
- Never use `ml-*`/`mr-*`/`pl-*`/`pr-*` (physical direction)
- For `translateX` animations, swap values for RTL (see CLAUDE.md RTL Switch section)
- Use `text-right` only when explicitly needed (default is RTL)

### 3. Dark Theme Tokens
- Background: `zinc-950`, `zinc-900`, `zinc-800`
- Text: `zinc-100`, `zinc-300`, `zinc-400`
- Operational colors: red (critical/fire), orange (warning), blue (info/police), green (resolved)
- Always use opacity/alpha for overlays, not solid colors

### 4. No Engine Logic in UI
- Components read from `useGameStore()` and call store actions
- Never import from `src/engine/` directly in components
- Exception: type imports from `src/engine/types.ts` are fine

### 5. Accessibility
- All interactive elements need `aria-label` in Hebrew
- Color is never the only indicator — use icons, text, or patterns alongside color
- Touch targets minimum 44×44px
- Keyboard navigation for all interactive panels

### 6. Component Size
- Maximum 150 lines per component file
- Extract sub-components when a file exceeds this
- One component per file (plus small helper components)

### 7. Animation Standards
- Use Framer Motion for complex animations
- Use Tailwind `transition-*` for simple state changes
- Respect `prefers-reduced-motion` — always provide reduced-motion alternatives
- Map overlays use CSS opacity transitions (weather tints, night mode)
