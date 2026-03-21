# 08 — Scenario Editor

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Impact** | HIGH |
| **Effort** | HIGH |
| **Serves Real Software** | YES (event configuration) |

## Objective

Add an in-game scenario editor allowing users to create custom event waves with visual timeline and map placement. Custom scenarios enable both game replayability and real-world drill planning where administrators define emergency response exercises.

## Competitive Reference

911 Operator (any-city maps via OpenStreetMap), ADMS Scene Builder (drag-and-drop event placement), professional emergency simulators (fully customizable scenario authoring). Scenario editors are the #1 feature that separates toy simulators from professional training tools.

## Requirements

- Visual timeline editor for placing events on a tick-based timeline
- Event placement on map (click to set location coordinates)
- Event type selection with all 17 types (10 standard + 7 missile-related)
- Configure per-event: severity, required forces override, timing (spawn tick)
- Wave grouping (group related events into named waves with labels)
- Save/load custom scenarios to localStorage
- Share scenario via JSON export/import (copy/paste or file download)
- Preview mode (dry-run simulation without scoring)
- Simple UI layout: timeline on bottom, map in center, event palette on side
- Validation: warn if scenario has no events, overlapping locations, or impossible force requirements

## Technical Design

### New Files

- **`src/store/editor-store.ts`** — Zustand store for editor state: placed events, selected event for editing, timeline zoom level, active wave, dirty/saved status.
- **`src/components/editor/ScenarioEditor.tsx`** — Root editor screen component. Composes timeline, map, and palette.
- **`src/components/editor/TimelineEditor.tsx`** — Horizontal timeline with tick markers, draggable event blocks, wave grouping brackets. Uses Framer Motion for drag interactions.
- **`src/components/editor/EventPlacer.tsx`** — Map click handler for placing events. Shows ghost marker at cursor position with event type icon.
- **`src/components/editor/EventPalette.tsx`** — Side panel listing all 17 event types as draggable/clickable cards with icons from `map-icons.ts`.
- **`src/components/editor/EventConfigPanel.tsx`** — Configuration form for a selected event: severity, timing, force overrides.
- **`src/components/editor/ScenarioMetaForm.tsx`** — Scenario name, description, difficulty, and duration fields.

### Architecture

- Editor screen is a new value `"editor"` in `ui-store.screen`. Accessible from the main menu alongside scenario selection.
- Custom scenarios are saved as JSON matching the existing `ScenarioDefinition` type from `src/engine/types.ts`, ensuring full compatibility with the game engine.
- The CityMap component is reused in edit mode with click-to-place behavior instead of dispatch behavior. A `mode` prop or wrapper controls interaction.
- JSON export produces a self-contained file that can be imported. Import validates the JSON against the `ScenarioDefinition` shape before accepting.
- Preview mode starts a normal simulation with scoring disabled and a "back to editor" button.

### Files to Modify

- **`src/store/ui-store.ts`** — Add `"editor"` to the screen union type.
- **`src/engine/types.ts`** — Ensure `ScenarioDefinition` and `EventWave` types are flexible enough for custom content. Add optional metadata fields (author, description, version).
- **`src/components/App.tsx`** (or root router) — Add editor screen route.
- **`src/components/scenarios/ScenarioList.tsx`** — Add "Custom Scenarios" section and "Create New" button.

### Real Software Benefit

Scenario configuration is directly applicable to the real system where administrators define emergency response plans and drill scenarios. The `ScenarioDefinition` JSON format serves as a portable exercise definition standard.

## Acceptance Criteria

- [ ] Can create a new scenario from scratch via the editor screen
- [ ] Clicking the map places an event at the clicked coordinates
- [ ] All 17 event types are available in the palette
- [ ] Events can be configured with severity, timing, and force requirements
- [ ] Events can be grouped into named waves on the timeline
- [ ] Timeline supports drag-to-reposition events across ticks
- [ ] Scenarios save to localStorage and appear in the scenario selection menu
- [ ] JSON export produces valid, importable scenario files
- [ ] JSON import validates and loads external scenario files
- [ ] Preview mode runs the scenario without scoring
- [ ] Can create a scenario with 5+ events, save it, reload it, and play it successfully
