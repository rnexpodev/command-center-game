# 02 — After-Action Replay

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Impact** | HIGH |
| **Effort** | MEDIUM |
| **Serves Real Software** | YES (debriefing tool) |

## Objective

Add post-game timeline replay showing all events, decisions, and outcomes on a map replay. After-action review is the most requested feature in professional emergency simulators and is essential for learning from each session.

## Competitive Reference

ALL professional simulators (ADMS, XVR) have after-action review. This is table stakes for serious games. Military and emergency training programs consider debriefing more valuable than the exercise itself.

## Requirements

- Record all game events with timestamps during gameplay (event spawns, dispatches, arrivals, escalations, resolutions)
- Post-game timeline scrubber showing events on map at each point in time
- Playback speed controls (1x, 2x, 4x, pause)
- Highlight good decisions (fast response times) in green and bad decisions (escalations, casualties) in red
- Show response time per event in the timeline
- Decision markers on timeline (dispatch actions, priority changes)
- Export/screenshot capability for training contexts

## Technical Design

### New Files

- **`src/engine/recorder.ts`** — Pure TypeScript module that records `TimelineEntry[]` during gameplay. Each entry has a tick number, event type (`spawn`, `dispatch`, `arrival`, `escalation`, `resolution`, `casualty`), and associated entity IDs. Uses `as const` objects for entry types.
- **`src/components/post-game/ReplayView.tsx`** — Full replay screen with map and timeline scrubber.
- **`src/components/post-game/TimelineScrubber.tsx`** — Framer Motion animated scrubber bar with tick markers and decision annotations.

### Architecture

- Recorder hooks into simulation tick: after each `tickSimulation()` call, diff the previous and current state to detect meaningful changes and append `TimelineEntry` items.
- Game store extends with `gameHistory: TimelineEntry[]` field, populated during gameplay.
- Replay view reuses `CityMap` component in a read-only mode (no click handlers, no dispatch actions). Map state is reconstructed from timeline entries at the scrubber's current tick.
- Timeline scrubber uses Framer Motion for smooth drag interaction and playback animation.

### Files to Modify

- **`src/engine/simulation.ts`** — Add recording hooks after `tickSimulation()`.
- **`src/store/game-store.ts`** — Add `gameHistory` field and `appendTimelineEntry` action.
- **`src/components/post-game/`** — Add replay tab alongside existing score report.

### Real Software Benefit

After-action review is core to the real municipal command center's debriefing workflow. The `TimelineEntry` recording format and replay logic can be directly reused in the production system.

## Acceptance Criteria

- [ ] All meaningful game events are recorded with tick timestamps
- [ ] Post-game screen has a "Replay" tab alongside score report
- [ ] Timeline scrubber allows dragging to any point in the game
- [ ] Events appear and disappear on the map at their correct times during replay
- [ ] Playback speed controls work (1x, 2x, 4x, pause)
- [ ] Good decisions are visually distinguished from bad decisions
- [ ] Response time is displayed per event in the timeline
- [ ] Replay does not re-trigger sound effects or modify game state
