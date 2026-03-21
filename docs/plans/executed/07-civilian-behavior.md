# 07 — Civilian Behavior

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Impact** | MEDIUM |
| **Effort** | HIGH |
| **Serves Real Software** | YES (population model) |

## Objective

Add civilian population simulation showing evacuation, panic, and shelter behavior. Population modeling transforms the game from a unit-dispatch puzzle into a human-centered emergency management experience where every decision affects lives on the ground.

## Competitive Reference

Frostpunk (societal tension meter driving gameplay pressure), This War of Mine (civilian morale as core mechanic), Cities: Skylines Natural Disasters (evacuation buses, shelter capacity tracking). Real-world municipal emergency management systems track population-at-risk as the primary metric.

## Requirements

- Population density per neighborhood (data-driven, reflecting real Beer Sheva demographics)
- Evacuation mechanics: order evacuation of an area, civilians move to shelters over time
- Shelter capacity limits (modeled after Beer Sheva public shelters)
- Panic spread: untreated events near populated areas increase panic level
- Civilian compliance rate (not everyone evacuates immediately — compliance varies by severity and trust)
- Population at risk indicator per event (how many civilians fall within the threat radius)
- Morale/panic city-wide meter visible in the top bar
- Map visualization: population density heatmap layer (toggleable)
- Shelter markers on map showing capacity and current occupancy

## Technical Design

### New Files

- **`src/engine/civilians.ts`** — Pure TypeScript module for population state management, evacuation logic, panic calculation, and compliance modeling. No React imports. Exports `tickCivilians()` called from the main simulation loop, `orderEvacuation()`, and `calculatePanicLevel()`.
- **`src/data/population.ts`** — Per-neighborhood population counts, shelter locations with coordinates and capacity, compliance rate constants, panic spread parameters. Uses `as const` objects for shelter status types.
- **`src/components/command-center/PopulationHeatmap.tsx`** — Leaflet heatmap overlay layer for population density visualization. Toggleable via map controls.
- **`src/components/command-center/PanicMeter.tsx`** — City-wide panic/morale gauge for the top bar.

### Architecture

- `CivilianState` is a new sub-state within `GameState`, containing per-neighborhood population counts, shelter occupancy, active evacuations, and city-wide panic level.
- Each tick, `tickCivilians()` processes active evacuations (moving population from neighborhoods to shelters), updates panic based on active untreated events near populated areas, and applies compliance decay (panic reduces compliance).
- Evacuation is a player action (new `EVACUATE_AREA` action type) that targets a neighborhood. Civilians move gradually over multiple ticks based on distance to nearest shelter and compliance rate.
- Shelter capacity is hard-capped. When shelters are full, overflow civilians remain exposed, increasing population-at-risk metrics.
- Panic is calculated per-neighborhood and aggregated city-wide. Factors: untreated event count, event severity, proximity to population centers, duration of exposure.

### Files to Modify

- **`src/engine/types.ts`** — Add `CivilianState`, `Shelter`, `EvacuationOrder`, `PanicLevel` types. Extend `GameState` with `civilianState` field.
- **`src/engine/simulation.ts`** — Call `tickCivilians()` within the main tick loop after event processing.
- **`src/data/city.ts`** — Add population count to each neighborhood definition.
- **`src/components/command-center/CityMap.tsx`** — Integrate heatmap layer toggle and shelter markers.
- **`src/components/command-center/TopBar.tsx`** — Add panic meter display.
- **`src/components/command-center/EventDetail.tsx`** — Show population-at-risk count per event.

### Real Software Benefit

Population modeling and evacuation planning are core to real municipal emergency management. Shelter capacity data maps directly to Beer Sheva's actual public shelter infrastructure. The panic/compliance model reflects real behavioral research on civilian response to emergencies.

## Acceptance Criteria

- [ ] Each neighborhood has a defined population density visible on the heatmap
- [ ] Player can issue evacuation orders for specific neighborhoods
- [ ] Civilians move to shelters over multiple ticks after evacuation order
- [ ] Shelter capacity is tracked and prevents overcrowding
- [ ] Compliance rate reduces evacuation speed realistically
- [ ] Panic level increases when events are untreated near populated areas
- [ ] City-wide panic meter is visible in the top bar during gameplay
- [ ] Population-at-risk count is displayed per event in the event detail panel
- [ ] Heatmap layer can be toggled on/off without performance issues
- [ ] Panic affects gameplay (e.g., reduced compliance, chain panic events)
