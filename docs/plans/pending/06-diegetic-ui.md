# 06 — Diegetic UI

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Impact** | MEDIUM |
| **Effort** | LOW |
| **Serves Real Software** | YES (command center aesthetic) |

## Objective

Polish the UI toward a diegetic "command center console" feel where the interface itself feels like part of the game world. The goal is to make the player feel like they are sitting at a real operational console, not using a web app.

## Competitive Reference

HighFleet (CRT effects, rusty panels, "the interface IS the game") and Command: Modern Operations (dark operational dashboard, satellite imagery feel). Both games are celebrated specifically for how their UI reinforces immersion without sacrificing usability.

## Requirements

- Subtle CRT scanline overlay effect on panels (CSS only, toggleable in settings)
- Screen flicker animation on critical events (brief CSS animation, not distracting)
- Status indicator lights (LED-style dots with glow) replacing some text badges for unit/event statuses
- Panel borders with military/operational styling (thin lines, corner bracket markers)
- Subtle background grid pattern on map area
- Boot-up animation when starting a scenario (brief "system initializing" sequence with progress bars and Hebrew text)
- Operational font adjustments: monospace font for numbers, coordinates, and timestamps; Heebo stays for all Hebrew body text

## Technical Design

### New CSS Classes (src/index.css)

```
.diegetic-panel       — Military-style border with corner markers
.diegetic-scanlines   — CRT scanline overlay (repeating-linear-gradient)
.diegetic-flicker     — Keyframe animation for critical event screen flash
.diegetic-led         — LED indicator dot with box-shadow glow
.diegetic-led--green  — Active/resolved status
.diegetic-led--red    — Critical/escalating status
.diegetic-led--amber  — Warning/in-progress status
.diegetic-grid        — Subtle grid background pattern
.diegetic-mono        — Monospace font for numbers and coordinates
.diegetic-boot        — Boot sequence animation container
```

### Architecture

- **CSS-only approach:** All visual effects are pure CSS (gradients, keyframes, box-shadows). No canvas, no WebGL, no extra dependencies.
- **Toggle:** A `diegeticMode: boolean` in `ui-store` controls whether diegetic classes are applied. When off, the UI looks exactly as it does today.
- **Minimal component changes:** Most changes are `className` additions, not structural. Components conditionally add `.diegetic-*` classes based on the store toggle.
- **Boot animation:** A small Framer Motion sequence in `CommandCenter.tsx` that plays once when a scenario starts — shows "מערכת מתחילה..." with animated progress bars, then fades into the game view.
- **Performance:** Scanline overlay uses `pointer-events: none` and is a single pseudo-element. No per-frame JavaScript.

### Files to Modify

- **`src/index.css`** — Add all `.diegetic-*` CSS classes and keyframe animations.
- **`src/store/ui-store.ts`** — Add `diegeticMode: boolean` preference (default: true).
- **`src/components/command-center/CommandCenter.tsx`** — Add boot sequence and conditional scanline overlay.
- **`src/components/command-center/TopBar.tsx`** — Add diegetic panel styling and LED indicators.
- **`src/components/command-center/EventsPanel.tsx`** — Add diegetic panel border classes.
- **`src/components/command-center/UnitsPanel.tsx`** — Add diegetic panel border classes and LED status dots.

### Real Software Benefit

The dark operational aesthetic directly informs the real command center software's visual design language. CSS classes and design patterns developed here can be ported to the production system's UI framework.

## Acceptance Criteria

- [ ] CRT scanline effect is visible on panels when diegetic mode is on
- [ ] Screen flickers briefly on critical event spawns
- [ ] LED dots replace text badges for at least unit status indicators
- [ ] Panel borders have military corner-marker styling
- [ ] Map area has a subtle grid overlay
- [ ] Boot-up animation plays when starting a scenario (under 3 seconds)
- [ ] Monospace font is used for numbers and coordinates throughout
- [ ] Diegetic mode toggle works — turning it off restores the original look
- [ ] No measurable performance impact (no FPS drop, no layout thrashing)
- [ ] All effects respect RTL layout direction
