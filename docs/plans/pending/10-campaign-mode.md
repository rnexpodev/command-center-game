# 10 — Campaign Mode

| Field | Value |
|-------|-------|
| **Priority** | P3 |
| **Impact** | MEDIUM |
| **Effort** | HIGH |
| **Serves Real Software** | No |

## Objective

Add a multi-scenario campaign where performance in one scenario affects the next, telling a narrative of escalating crisis in Beer Sheva. Campaign mode provides long-term progression and storytelling that transforms isolated scenarios into a cohesive experience with meaningful consequences.

## Competitive Reference

Rebel Inc (campaign with cross-map consequences and resource carry-over), 112 Operator (career mode with evolving story and city upgrades), Frostpunk (escalating narrative with lasting decisions). Campaign modes are the primary driver of long-term player retention in simulation games.

## Requirements

- Campaign of 6-8 connected scenarios telling a story (escalating crisis in Beer Sheva)
- Story beats between scenarios (Hebrew text briefings with narrative context)
- Carry-over effects: damaged infrastructure from one scenario persists into the next, unit losses carry forward
- Budget system: earn budget from good performance, spend on unit upgrades/repairs between scenarios
- Inter-scenario screen: briefing, budget allocation, unit management, infrastructure status
- Branching: different next-scenario selection based on performance grade (e.g., S-grade unlocks easier path, D-grade faces harder follow-up)
- Campaign progress saved to localStorage with multiple save slots
- Narrative arc: routine emergencies -> major incident -> multi-site crisis -> missile barrage -> recovery operations
- Campaign selection screen accessible from main menu

## Technical Design

### New Files

- **`src/data/campaigns/beer-sheva-crisis.ts`** — Campaign definition: scenario sequence, branching rules, story text (Hebrew), carry-over effect definitions, budget rewards per grade.
- **`src/engine/campaign.ts`** — Pure TypeScript module for carry-over state calculation, budget management, branching logic, and infrastructure damage tracking. Exports `calculateCarryOver()`, `resolveBudget()`, `getNextScenario()`.
- **`src/store/campaign-store.ts`** — Zustand store for campaign progress: current scenario index, accumulated carry-over state, budget balance, save/load to localStorage.
- **`src/components/campaign/CampaignSelect.tsx`** — Campaign selection screen with save slot management.
- **`src/components/campaign/BriefingScreen.tsx`** — Inter-scenario briefing with Hebrew narrative text, situation map, and "Begin Mission" button.
- **`src/components/campaign/BudgetScreen.tsx`** — Between-scenario budget allocation: repair infrastructure, replace lost units, purchase upgrades.
- **`src/components/campaign/CampaignMap.tsx`** — Visual campaign progress showing completed/upcoming scenarios as connected nodes.

### Architecture

- Campaign definitions extend the existing `ScenarioDefinition` type with additional metadata: carry-over rules, budget rewards, branching conditions, and story text.
- Carry-over state is a `CampaignCarryOver` type tracking: damaged neighborhoods (reduced starting infrastructure), lost units (reduced starting roster), accumulated budget, and narrative flags.
- Before each scenario starts, carry-over effects are applied to the initial `GameState`: fewer available units, pre-damaged infrastructure, adjusted difficulty.
- Branching uses the player's grade from the completed scenario to select the next scenario from a branch table. Multiple paths converge at key story beats.
- Budget is earned based on grade (S=1000, A=800, B=600, C=400, D=200) and spent on discrete items: repair neighborhood (200), replace unit (150), upgrade unit type (300).
- Campaign progress persists to localStorage. Three save slots allow multiple concurrent campaigns.

### Files to Modify

- **`src/store/ui-store.ts`** — Add `"campaign-select"`, `"briefing"`, `"budget"` to the screen union type.
- **`src/engine/types.ts`** — Add `CampaignDefinition`, `CampaignCarryOver`, `BudgetItem` types. Add optional `carryOver` field to `GameState` for active campaign effects.
- **`src/components/App.tsx`** (or root router) — Add campaign screen routes.
- **`src/components/scenarios/ScenarioList.tsx`** — Add "Campaign" section linking to campaign selection.
- **`src/engine/simulation.ts`** — Apply carry-over effects during `startScenario()` when in campaign mode.

## Acceptance Criteria

- [ ] Campaign selection screen shows available campaigns with save slots
- [ ] Briefing screen displays Hebrew narrative text between scenarios
- [ ] Performance grade from one scenario determines the next scenario via branching
- [ ] Carry-over effects visibly affect the next scenario (fewer units, damaged areas)
- [ ] Budget is earned based on grade and can be spent on repairs/upgrades
- [ ] Budget screen allows meaningful choices between repair and upgrade options
- [ ] Campaign progress saves to localStorage and survives page reloads
- [ ] Full 6-8 scenario campaign is playable from start to finish
- [ ] Campaign map visually shows progress through the scenario chain
- [ ] Branching creates at least 2 distinct paths through the campaign
