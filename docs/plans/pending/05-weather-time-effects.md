# 05 — Weather & Time-of-Day Effects

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Impact** | MEDIUM |
| **Effort** | MEDIUM |
| **Serves Real Software** | YES (environmental factors) |

## Objective

Add weather and time-of-day systems that affect both gameplay mechanics and visual presentation. Real emergencies are heavily weather-dependent — a sandstorm in Beer Sheva changes everything about response planning.

## Competitive Reference

112 Operator uses real historical weather data affecting incident types and response times. Cities: Skylines has weather affecting disaster types and severity. Both demonstrate that environmental systems add strategic depth without requiring new content.

## Requirements

- **Time of day:** dawn / day / dusk / night cycle with visual map changes
  - Map tile dimming and overlay color shifts per time phase
  - Clock display in TopBar reflects current time of day
- **Weather types:** clear, rain, sandstorm (Beer Sheva specific), heatwave
- **Gameplay effects:**
  - Rain: slower unit travel (+20%), increased road accident probability
  - Night: slower response (+15%), reduced visibility (fog of war radius increase)
  - Sandstorm: much slower travel (+40%), infrastructure stress events spawn
  - Heatwave: increased medical event probability, slower outdoor treatment
- Scenario definitions include weather and start time settings
- Visual indicators on map (weather overlay) and in TopBar (weather icon + label)
- Weather can change mid-scenario based on scenario wave definitions

## Technical Design

### New Files

- **`src/engine/weather.ts`** — Pure TypeScript module. Defines `Weather` and `TimeOfDay` as `as const` objects. Exports modifier functions: `getTravelTimeModifier(weather, timeOfDay)`, `getSpawnProbabilityModifier(weather, eventType)`, `getTreatmentModifier(weather, eventType)`.
- **`src/components/command-center/WeatherOverlay.tsx`** — CSS overlay on the map area for visual weather effects (rain particles via CSS animation, sandstorm dust tint, night dimming).

### Architecture

- `GameState` is extended with `weather: Weather` and `timeOfDay: TimeOfDay` fields.
- Each simulation tick, `weather.ts` modifiers are applied to travel time calculations in `units.ts` and event spawn probability in `events.ts`.
- Time of day advances based on tick count (configurable ticks-per-hour in scenario).
- Weather transitions are defined in scenario wave data: `{ tick: 200, weather: 'sandstorm' }`.
- Map visual changes use CSS classes on the map container, not Leaflet tile swaps (simpler, no extra tile loading).

### Files to Modify

- **`src/engine/types.ts`** — Add `Weather` and `TimeOfDay` types to `GameState`.
- **`src/engine/units.ts`** — Apply travel time modifiers from `weather.ts`.
- **`src/engine/events.ts`** — Apply spawn probability modifiers from `weather.ts`.
- **`src/data/scenarios/`** — Add `weather` and `startTime` fields to scenario definitions.
- **`src/components/command-center/TopBar.tsx`** — Add weather icon and time-of-day display.
- **`src/components/command-center/CityMap.tsx`** — Apply weather overlay and night dimming classes.

### Real Software Benefit

Real emergencies are heavily weather-dependent. The modifier system and environmental factor modeling directly inform the real municipal command center's resource planning algorithms.

## Acceptance Criteria

- [ ] Weather type is displayed in the TopBar with an appropriate icon
- [ ] Time of day advances during gameplay and is reflected visually on the map
- [ ] Rain visually affects the map (overlay effect) and slows unit travel measurably
- [ ] Night visually dims the map and increases response times
- [ ] Sandstorm has the strongest gameplay impact and distinct visual effect
- [ ] Heatwave increases medical event frequency
- [ ] Scenarios can define starting weather and time, plus mid-game weather changes
- [ ] Weather modifiers are applied consistently in engine calculations (verifiable in replay)
- [ ] No performance degradation from weather visual effects
