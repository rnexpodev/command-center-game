# Cortex Development Trace — Urban Command Center Game

**Project:** Urban Command Center (חמ"ל עירוני)
**Date:** 2026-03-22
**Cortex Studio Project ID:** e0edbd05-c909-4b5d-a2b4-addc5ffb70d1

---

## Session: 2026-03-22 — Competitive Analysis & Improvement Roadmap

### Objective
Use Cortex as the development intelligence system to:
1. Categorize the game in appropriate market segments
2. Research competitors and professional training simulators
3. Create 12 detailed improvement plans
4. Establish structured plan tracking (pending → executed)

### Cortex Usage Timeline

| Time | Action | Cortex Feature | Result |
|------|--------|---------------|--------|
| Start | Verify Cortex health | API health check | Running on 127.0.0.1:3141 (note: `localhost` didn't resolve, needed explicit IP) |
| +1min | Register project in Studio | Project Studio API | Created project e0edbd05 with features, tech stack |
| +2min | Submit categorization validation | Council Query | Query 76b0fd78 submitted, awaiting synthesis |
| +5min | Web research on competitors | External (Claude Code) | 15+ games analyzed, 20+ web searches |
| +10min | Create improvement plans | Plan from research | 12 plans prioritized in docs/plans/pending/ |
| +15min | Council query check | Council API | Query still processing |
| +20min | Cortex server crashed | API unavailable | Port 3141 no longer responding — previous instance died |

### What Worked Well

1. **Cortex API health check** — Confirmed service is running, caught port binding issue quickly
2. **Project Studio registration** — Created project with full feature list and tech stack via API
3. **Council query submission** — Submitted categorization validation query successfully
4. **Previous Cortex evaluation** (from initial build) — docs/cortex-evaluation.md provided valuable context about what Cortex features work and which don't

### Issues Encountered

1. **`localhost` vs `127.0.0.1`** — `curl localhost:3141` failed but `curl 127.0.0.1:3141` worked. Likely a DNS/hosts file issue on this Windows machine.
2. **Server startup delay** — tsx watch for the API server took longer than expected to compile. The frontend (Vite) started in 516ms but the server showed no output for 30+ seconds. Port was eventually bound by a previous instance.
3. **Council processing time** — Query submitted but synthesis takes 60-90 seconds (as documented in cortex-improvements.md). For non-interactive batch work, this is acceptable.

### Cortex Improvements Discovered

1. **Project Studio API should accept repo path** — When registering a project, there's no field to link it to a local git repository path. The session auto-linking via path substring works, but explicit linking would be more reliable.
2. **Council should have a "quick mode"** — For simple validation queries, the full research → query → review → synthesize pipeline is overkill. A single-model quick response would be useful.
3. **API should bind to both localhost and 127.0.0.1** — Or at least document which to use.
4. **Server stability** — Cortex API server crashed mid-session without warning. The tsx watch process stopped responding. Need better process supervision or health monitoring.

### Decisions Made (see DECISION-LOG.md)
- Game categorization into 5 categories
- Priority ordering of 12 improvement plans
- Plan directory structure (pending/executed)
- Which plans serve the real software (6 of 12)

### Baseline State
- TypeScript: clean (0 errors)
- Build: passing
- Tests: no test framework configured
- Game: fully playable with 14 scenarios

---

## Previous Sessions

### 2026-03-20 — Initial Game Build (documented in cortex-evaluation.md)
- Council guided tech stack selection (React + TypeScript + Vite + Leaflet + Zustand)
- Council provided Israeli emergency forces breakdown
- Council recommended engine/UI separation architecture
- Studio suggestions failed (Llama 3.3 70B returns null)
- PRD export created empty documents
- Built complete game from Council guidance alone
