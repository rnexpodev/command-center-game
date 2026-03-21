# Decision Log — Urban Command Center Game

Decisions made during development, with reasoning and Cortex involvement.

---

## 2026-03-22 — Competitive Analysis & Planning Session

### D1: Game Categorization

**Decision:** Categorize as 5 genres:
1. Emergency Dispatch Simulation (primary)
2. Real-Time Tactical Strategy
3. City Crisis Management
4. Serious Game / Training Simulator
5. Israeli Civilian Defense Simulation

**Reasoning:** Web research of 15+ competitor games showed our game sits at the intersection of dispatch gameplay (911 Operator), strategic resource management (EMERGENCY series), city-scale crisis management (Frostpunk), and professional training (ADMS/XVR). The Israeli civilian defense angle is unique — no competitor exists.

**Cortex:** Council query 76b0fd78 submitted for validation.

---

### D2: Improvement Plan Prioritization

**Decision:** 12 plans in 3 priority tiers:
- P1 (do first): Sound Design, After-Action Replay, Career Mode
- P2 (second wave): Radio Comms, Weather/Time, Diegetic UI, Achievements, Performance Analytics
- P3 (third wave): Civilian Behavior, Scenario Editor, Training Mode, Campaign Mode

**Reasoning:**
- P1 items are high-impact, achievable scope, and address the biggest gaps vs competitors
- P2 items are either medium effort or depend on P1 foundations
- P3 items are high effort or need other systems in place first
- Sound Design is P1 because Howler is already installed and audio is the #1 engagement driver per competitor analysis
- After-Action Replay is P1 because ALL professional simulators have it — it's table stakes for serious game credibility
- Career Mode is P1 because persistence drives retention (112 Operator's career mode was its biggest improvement over 911 Operator)

**Cortex:** Prioritization informed by competitor research and municipal command center relationship analysis.

---

### D3: Plan Directory Structure

**Decision:** Use `docs/plans/pending/` → `docs/plans/executed/` workflow.

**Reasoning:** Mirrors the municipal command center project's planning pattern. Plans are numbered for priority order. When a plan is fully implemented and verified, the file moves to `executed/`. This provides clear visibility into what's done and what's next.

**Alternative considered:** Single `docs/plans/` with status in frontmatter. Rejected because physical file location makes status instantly visible in file explorer.

---

### D4: Real Software Alignment

**Decision:** Tag 6 of 12 plans as "Serves Real Software":
- After-Action Replay → debriefing tool
- Radio Communications → comms system
- Weather/Time Effects → environmental factors
- Diegetic UI → command center aesthetic
- Civilian Behavior → population model
- Scenario Editor → event configuration
- Training Mode → professional training
- Performance Analytics → operational analytics

**Reasoning:** The game is explicitly a visual prototype for the municipal command center. These 6 plans create game features that directly inform or can be reused in the real software. This dual purpose justifies the investment — every improvement makes both the game and the real product better.

---

### D5: No Code Changes in This Session

**Decision:** This session is documentation and planning only. No game code modifications.

**Reasoning:** Planning and research should be separated from implementation. Creating 12 detailed plan files with competitive references ensures each improvement is well-specified before coding begins. This prevents scope creep and enables parallel execution across sessions.

---

## 2026-03-20 — Initial Build Decisions

### D6: Tech Stack

**Decision:** React + TypeScript + Vite + Leaflet + Zustand + Tailwind CSS

**Cortex:** Council query with Claude Code CLI. Recommendation was unanimous.
**Reasoning:** Web-based for instant play, no install. Leaflet for interactive maps. Zustand for lightweight state. Vite for fast dev experience.

### D7: Engine/UI Separation

**Decision:** Strict separation between `src/engine/` (pure TS) and `src/components/` (React).

**Cortex:** Council recommended this architecture.
**Reasoning:** Engine can be tested independently, shared with other frontends, and potentially reused in the real municipal software.

### D8: as const Objects Instead of Enums

**Decision:** Use `as const` objects with type extraction pattern instead of TypeScript enums.

**Reasoning:** Required by `erasableSyntaxOnly` in tsconfig. Pattern: `export const Foo = { ... } as const; export type Foo = (typeof Foo)[keyof typeof Foo];`

### D9: Direct State Mutation in Engine

**Decision:** Engine functions mutate GameState directly (no immutability).

**Reasoning:** Performance choice for game simulation. Zustand store creates shallow snapshots before passing to engine, then replaces its state.

### D10: Client-Side Only

**Decision:** No server, no database. All state in memory, tour progress in localStorage.

**Cortex:** Council recommended this approach.
**Reasoning:** Game doesn't need persistence beyond tour state. Keeps deployment simple (static files). Future career mode will use localStorage.
