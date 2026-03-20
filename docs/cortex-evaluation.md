# Cortex Evaluation Log — Municipal Emergency Command Center Game

**Project:** חמ"ל עירוני (Municipal Emergency Command Center)
**Start Date:** 2026-03-20
**Approach:** Beginner developer relying entirely on Cortex for guidance
**Studio Project ID:** 47816f4f-bf9c-42d8-aba9-c481530be841

---

## Evaluation Criteria

Each Cortex feature is rated 1-10.

---

## Phase 0: Setup

- [x] Verified Cortex is running
- [x] Created GitHub repo: rnexpodev/command-center-game
- [x] Registered project in Cortex Studio (ID: 47816f4f-bf9c-42d8-aba9-c481530be841)
- [x] Created evaluation log

**Eval:** Setup was smooth. Studio project creation worked with Hebrew text. No issues.

---

## Phase 1: Let Cortex Define the Product

### 1.1 Council Query: "What kind of game is this?"

**Query ID:** 683c0b6b-8bf5-4d60-892f-f2857254b094
**Status:** Complete
**Models:** Llama 3.3 70B (Ollama), Claude Code (CLI), Codex CLI

**Result:**
The Council identified the game as a **Real-Time Crisis Management Simulation** — referencing 911 Operator, Emergency HQ, and This Is the Police. It provided:
- Complete component breakdown (map, event system, dispatch, triage, escalation, scoring, scenario engine)
- Concrete tech stack recommendation: React + TypeScript + Vite + Leaflet + Zustand + shadcn/ui + Tailwind CSS
- RTL architecture guidance (CSS logical properties, map controls stay geographic)
- Recommendation for client-side only with localStorage saves

**Issues:**
- Llama 3.3 70B (Ollama) returned empty responses for all queries — possible model/encoding issue
- Hebrew text got garbled in shell encoding (had to switch to English queries sent via JSON files)
- Codex CLI asked a clarifying question instead of answering directly

**Rating: 8/10** — Excellent domain understanding and practical recommendations from Claude Code CLI. Would be 9/10 if Llama had contributed.

---

### 1.2 Studio Feature Suggestions

**Single-model mode (Llama 3.3 70B):**
All suggestion types returned `null` — 9 out of 9 suggestion types failed:
- features, personas, stories, pages, design-direction, nav-flows, data-models, relationships, tech-stack, phases

**Council mode:**
Returned features, but they were **for Cortex itself** (AI Council Query, Cross-Tool Knowledge Graph, Smart Agent Routing) — completely unrelated to the emergency command center game.

**Eval:** The Studio AI suggestion system failed entirely:
1. The local Llama model can't generate structured JSON responses
2. Council mode lacks project context awareness — it suggested features for the wrong product

**Rating: 1/10** — Non-functional with local models. Council mode shows no domain awareness.

---

### 1.3 Council Query: "What forces exist in Israeli emergency?"

**Query ID:** 493e256e-9a3b-4a43-ace5-2d4eba59f9ef
**Status:** Complete

**Result:**
Extremely comprehensive breakdown of Israeli emergency forces:
- Core services: Fire & Rescue, MDA, United Hatzalah, Police (with YASAM, bomb disposal, Civil Guard)
- Military: IDF Home Front Command (Search & Rescue, CBRN teams)
- Municipal: Engineering, Welfare, Evacuation, Infrastructure (electric, water, gas, telecom), Education
- Specialized: ZAKA, Environmental Protection, Veterinary Services
- Command structure: Municipal Emergency Committee → Municipal Emergency Ops Center

**Rating: 9/10** — Exceptionally detailed and accurate Israeli-specific knowledge. Perfect for building the game's unit roster.

---

### 1.4 Studio Persona/Stories/Pages/Design Suggestions

All returned `null` from Llama 3.3 70B. Not tested further.

**Rating: 0/10** — Completely non-functional.

---

### 1.5 Council Query: "How should I structure the code?"

**Query ID:** c9c4842b-9c49-4fe5-8c14-33137c57d9a1
**Status:** Complete

**Result:**
Claude Code CLI provided a detailed folder structure:
- `src/engine/` — Pure TS game simulation (types, simulation, clock, events, escalation, units, scoring, scenarios, city)
- `src/data/` — Static game content (cities, unit-types, event-types, scenarios, escalation-rules)
- `src/store/` — Zustand stores (game-store, map-store, ui-store)
- `src/map/` — Leaflet integration (CityMap, layers, markers)
- `src/components/` — UI panels (command-bar, events-panel, units-panel, scoreboard)

Core principle: **Engine vs. UI separation** — keep simulation engine as pure TypeScript with zero React imports.

Codex CLI asked a clarifying question about optimization target (frontend-first vs expandable vs game-engine style).

**Rating: 9/10** — Excellent, actionable architecture recommendation. The engine/UI separation principle is exactly right.

---

### 1.6 PRD Export

**PRD ID:** 527fe969-3e63-4313-944f-6b9c2345f8a5
**Status:** Draft (0/5 sections)

The Studio export created a PRD shell but with zero content. The PRD title had encoding issues (showed as "PRD: ??"? ??????").

**Rating: 1/10** — PRD export creates empty shells. Hebrew encoding broken.

---

## Phase 2-5: Building the Game

### Approach Taken

Based on Council guidance, we built the game with:
- **Tech stack:** React + TypeScript + Vite + Leaflet + Zustand + Tailwind CSS (exactly as Council recommended)
- **Architecture:** Engine/UI separation (as Council recommended)
- **Forces:** Based on Council's Israeli emergency forces list
- **Scenarios:** 4 pre-built scenarios (tutorial, dual emergency, complex collapse, surge)

### What Was Built

1. **Game engine** (7 modules): types, simulation loop, clock, events, units, escalation, scoring
2. **Data layer**: event types, unit types, city data (Beer Sheva), 4 scenarios
3. **UI components** (14 files): scenario select, command center layout, top bar, events panel, units panel, event detail, city map, notifications, post-game report, reusable UI components
4. **Full Hebrew RTL** with Heebo font and operational color coding

### Build Verification

- TypeScript: clean (0 errors)
- Vite build: success (567KB JS, 174KB gzipped)
- Browser test: all screens functional
- Dispatch workflow: select unit → click event → unit travels → event resolves

---

## Overall Cortex Evaluation Summary

| Feature | Rating | Notes |
|---------|--------|-------|
| Council Queries (domain understanding) | 9/10 | Excellent Israeli emergency knowledge, practical tech recommendations |
| Council Queries (code architecture) | 9/10 | Engine/UI separation, detailed folder structure |
| Council Queries (general) | 8/10 | Great when Claude Code CLI responds; Llama contributes nothing |
| Studio Feature Suggestions (single model) | 0/10 | All returned null — Llama can't generate structured JSON |
| Studio Feature Suggestions (council mode) | 1/10 | Generated features for wrong product (Cortex, not the game) |
| Studio Persona/Stories/Pages/Design | 0/10 | All non-functional with local model |
| Studio Data Model Suggestions | 0/10 | Non-functional |
| PRD Export | 1/10 | Creates empty shell, Hebrew encoding broken |
| Prompt Generation | N/A | Not tested (PRD prerequisite failed) |
| Overall Beginner Experience | 4/10 | Council is excellent, but Studio is useless without a capable model |

### Key Findings

**What Works Well:**
1. Council queries with CLI models (Claude Code, Codex) provide excellent, actionable guidance
2. Domain awareness is strong — accurate Israeli emergency management knowledge
3. Multi-model synthesis works when models actually respond
4. Research phase (web search, package lookup) attempts are visible but need API keys

**What Doesn't Work:**
1. **Local Llama model is non-functional for structured output** — returns empty responses for all Studio suggestions
2. **Studio lacks project context** — council-mode suggestions generated features for Cortex itself, not the game
3. **Hebrew encoding is broken** in PRD titles and council questions sent through the shell
4. **PRD export creates empty documents** — no AI generation for PRD sections
5. **No fallback to template suggestions** — when AI fails, the template fallback also returns null

**Critical Improvement Areas:**
1. Studio suggestions need a capable model (not just Llama 3.3 via Ollama) or much better prompting
2. Studio needs to inject project context (idea text, description) into suggestion prompts
3. PRD export should auto-generate content using AI, not just create empty shells
4. Hebrew/UTF-8 encoding must be fixed throughout the pipeline
5. Need graceful degradation when models fail — show meaningful fallback suggestions

---

## Conclusion

**Cortex Council is a powerful tool** — it gave genuinely useful, domain-specific guidance that shaped the entire project architecture. A beginner developer would benefit greatly from asking the Council questions and following its recommendations.

**Cortex Studio is currently unusable** for actual product development. Every AI-powered suggestion returned null or irrelevant content. The feature is architecturally sound (the API routes, JSON schema, suggestion types are well-designed) but the AI integration doesn't produce useful output with the available local model.

**Recommendation:** Focus on making Studio work with remote API models (Anthropic, OpenAI) as a priority. The Studio suggestion types (features, personas, data models, pages, design direction) are the right abstractions — they just need a model that can generate structured output reliably.
