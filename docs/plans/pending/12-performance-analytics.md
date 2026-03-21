# 12 — Performance Analytics

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Impact** | HIGH |
| **Effort** | MEDIUM |
| **Serves Real Software** | YES (operational analytics) |

## Objective

Add a detailed performance analytics dashboard with professional-grade metrics visualization. Move beyond simple score/grade to provide actionable insights into decision-making patterns, resource utilization, and incident management effectiveness.

## Competitive Reference

ADMS (student performance tracking with instructor-facing dashboards), XVR (data-driven assessment with standardized metrics), professional KPI dashboards in real emergency operations centers. Detailed analytics are the primary deliverable of professional training exercises.

## Requirements

- Detailed post-game analytics (beyond current simple score):
  - **Response time histogram**: distribution of response times across all events in the scenario
  - **Timeline chart**: events, dispatches, and resolutions plotted over game ticks on a single timeline
  - **Force utilization chart**: percentage of time each force type was active vs idle
  - **Event heat map**: overlay on city map showing where events concentrated
  - **Escalation cascade tree**: visualization of which events caused which chain events
  - **Casualty attribution**: breakdown of which events caused casualties and contributing factors (late response, wrong forces, no response)
- Comparison view: side-by-side current run vs previous best for the same scenario
- Aggregate analytics: trends across multiple plays of the same scenario
- Export to printable HTML report with all charts rendered
- All chart labels and descriptions in Hebrew

## Technical Design

### New Files

- **`src/engine/analytics.ts`** — Pure TypeScript module for computing detailed metrics from game history. Exports `computeResponseTimeDistribution()`, `computeForceUtilization()`, `computeEscalationCascade()`, `computeCasualtyAttribution()`, `computeEventDensity()`. All functions are pure, receiving `GameState` and game history, returning structured metric objects.
- **`src/components/analytics/AnalyticsDashboard.tsx`** — Root analytics screen, tab-based layout for different chart views.
- **`src/components/analytics/ResponseTimeChart.tsx`** — SVG histogram showing response time distribution with bins.
- **`src/components/analytics/TimelineChart.tsx`** — Horizontal SVG timeline with color-coded event markers (spawn, dispatch, resolve) and connecting lines.
- **`src/components/analytics/ForceUtilization.tsx`** — Stacked bar chart or horizontal bars showing per-force-type active/idle percentage. Uses force-type colors from `map-icons.ts`.
- **`src/components/analytics/EventHeatmap.tsx`** — Leaflet overlay rendering event density as a heat map on the city map.
- **`src/components/analytics/CascadeTree.tsx`** — Tree/graph visualization showing chain event relationships. Root events at top, chain events branching below with arrows.
- **`src/components/analytics/CasualtyBreakdown.tsx`** — Table and bar chart attributing casualties to specific events with cause analysis.
- **`src/components/analytics/ComparisonView.tsx`** — Side-by-side metric comparison between two game sessions.

### Architecture

- Analytics computation is separated from rendering. `src/engine/analytics.ts` contains all metric calculations as pure functions. Components only handle visualization.
- Metric data is computed on-demand from recorded game history (see plan 02 for recording). If the recorder is not yet implemented, analytics falls back to computing from final `GameState` snapshot with reduced detail.
- Charts use inline SVG for histograms, bar charts, and timelines. The event heat map reuses the Leaflet map in read-only mode. No external charting library required — SVG primitives are sufficient for all visualizations.
- Comparison view stores previous session metrics in localStorage (keyed by scenario ID). On game end, current metrics are compared against stored best.
- Print export uses a dedicated CSS stylesheet (`@media print`) that renders all charts at fixed sizes and hides interactive controls. Triggered via `window.print()`.
- Force colors and Hebrew names are sourced from the existing `map-icons.ts` registry to maintain visual consistency.

### Files to Modify

- **`src/engine/types.ts`** — Add analytics types: `ResponseTimeMetrics`, `ForceUtilizationMetrics`, `CascadeNode`, `CasualtyAttribution`, `AnalyticsReport`.
- **`src/components/post-game/PostGameScreen.tsx`** — Add "Analytics" tab alongside existing score report. Mount `AnalyticsDashboard` with game data.
- **`src/store/game-store.ts`** — Ensure game history data is accessible for analytics computation after game end.
- **`src/store/stats-store.ts`** (if created by plan 11) — Store per-scenario best metrics for comparison view.

### Real Software Benefit

Performance analytics directly maps to operational dashboards in the real municipal command center. Response time distributions, force utilization patterns, and casualty attribution are standard KPIs in emergency management. The metric definitions, computation logic, and visualization patterns are all reusable in the production system.

## Acceptance Criteria

- [ ] Response time histogram renders correctly with meaningful bin distribution
- [ ] Timeline chart shows all events, dispatches, and resolutions in chronological order
- [ ] Force utilization chart accurately reflects time each force type spent active vs idle
- [ ] Event heat map overlay shows concentration areas on the city map
- [ ] Escalation cascade tree correctly traces chain event relationships
- [ ] Casualty attribution identifies contributing factors for each casualty-causing event
- [ ] Comparison view shows current run alongside previous best for the same scenario
- [ ] Aggregate trends display across multiple sessions of the same scenario
- [ ] Print export produces a clean, readable HTML document with all charts
- [ ] All data displayed matches actual gameplay events and decisions
- [ ] All labels, descriptions, and headers are in Hebrew
- [ ] Charts render without external dependencies (SVG/Canvas only)
