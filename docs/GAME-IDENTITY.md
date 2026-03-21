# Game Identity & Categorization

## Game Identity

| Field | Value |
|-------|-------|
| **Name** | Urban Command Center |
| **Hebrew Name** | חמ"ל עירוני |
| **Genre** | Emergency Dispatch Simulation / Real-Time Tactical Strategy |
| **Platform** | Web (React + Vite, instant play, no install) |
| **Language** | Hebrew (RTL-first) |
| **Setting** | Beer Sheva, Israel |
| **Player Role** | Emergency commander managing city-wide incidents |

## Categories

| # | Category | Fit | Reference Games |
|--:|----------|-----|-----------------|
| 1 | **Emergency Dispatch Simulation** (primary) | Core gameplay loop: receive incident reports, dispatch appropriate units, manage multiple simultaneous events across a real city map. Player success depends on fast triage and correct force matching. | 911 Operator, 112 Operator, Dispatch |
| 2 | **Real-Time Tactical Strategy** | No pause-and-plan — events escalate in real time. Players must balance limited resources across the map, prioritize by severity, and react to cascading chain events. | EMERGENCY series (EMERGENCY HQ, EMERGENCY 20), Incident Commander |
| 3 | **City Crisis Management** | City-scale scope with interconnected systems. A building collapse spawns fires and road blockages; unhandled events cascade into neighborhood-wide crises. Resource scarcity forces hard tradeoffs. | Frostpunk (crisis resource management), Cities: Skylines Natural Disasters DLC |
| 4 | **Serious Game / Training Simulator** | Realistic Israeli emergency doctrine: 9 force types matching real services, treatment durations based on incident complexity, escalation timers reflecting actual response windows. Suitable for municipal emergency preparedness training. | ADMS (Advanced Disaster Management Simulator), XVR Simulation, TEDS (Tactical Emergency Decision Simulator), FEMA VTTX (Virtual Tabletop Exercise) |
| 5 | **Israeli Civilian Defense Simulation** | First game to simulate Israeli Home Front Command doctrine, Iron Dome interception scenarios, and multi-agency response to missile attacks on a real Israeli city. No existing competitor in this space. | None — first of its kind |

## Competitive Positioning Statement

> "The first Hebrew-language emergency command simulation set in a real Israeli city, combining the accessible dispatch gameplay of 911 Operator with the crisis management depth of Frostpunk and professional training authenticity."

## Unique Value Propositions

1. **Only Hebrew-language emergency management game** — Zero competitors in the Israeli market. Not a localization; built Hebrew-first with authentic IDF/Home Front Command terminology.
2. **Beer Sheva authenticity** — Real neighborhoods (Ramot, Old City, Neve Ze'ev, etc.), real landmarks, real base locations. Players learn actual city geography.
3. **Missile attack scenarios** — Globally unique. Simulates Iron Dome interceptions, Home Front Command response doctrine, shelter-in-place mechanics, and multi-impact incident management.
4. **Web-based instant play** — No installation, no app store, no download. Works on any device with a modern browser. Competitors are desktop-only or mobile-only.
5. **Treatment duration system** — Context-sensitive resolution times scaled by threat radius, casualties, and severity. More nuanced than any competitor's flat "send units and wait" model.
6. **Dual purpose: game + visual prototype** — Simultaneously a playable game and a functional prototype for real municipal command center software, validating UX patterns with real users before enterprise development.

## Competitive Advantages

What Urban Command Center does better than existing games:

- **Hebrew-first, not a localization** — UI, terminology, and content designed natively in Hebrew RTL, not retrofitted from English.
- **Chain events with realistic cascading mechanics** — Building collapse triggers fire + road blockage; gas leak escalates to explosion. Competitors treat events as isolated incidents.
- **9 force types matching real Israeli emergency services** — Fire, MDA (ambulance), Police, Rescue, Engineering, Welfare, Infrastructure, Evacuation, and Home Front Command. Competitors typically offer 3-4 generic unit types.
- **Distance-based travel time and force matching scoring** — Score rewards sending the right units, not just the fastest. Travel time is calculated from actual map distance, not instant deployment.
- **Web-based accessibility** — 911 Operator requires Steam; EMERGENCY HQ is mobile-only; XVR requires dedicated hardware. Urban Command Center runs in any browser.

## Known Gaps

What competitors do better (improvement roadmap):

| Gap | Description | Best-in-Class Competitor |
|-----|-------------|--------------------------|
| **Sound design** | No ambient city sounds, radio chatter, or dynamic audio feedback | EMERGENCY series (rich environmental audio) |
| **After-action replay** | No timeline replay to review decisions post-game | XVR Simulation (full session replay with instructor annotations) |
| **Career progression** | No persistent progression, unlocks, or campaign mode | 911 Operator (career mode with city upgrades) |
| **Weather & time of day** | No environmental conditions affecting gameplay | EMERGENCY 20 (weather, day/night cycles) |
| **Diegetic UI** | Interface is functional, not immersive — no radio static, paper maps, or in-world screens | Papers, Please (masterclass in diegetic UI design) |
| **Civilian simulation** | No simulated population movement, traffic, or crowd behavior | Cities: Skylines (full agent-based population simulation) |
| **Achievements & rewards** | No achievement system or collectibles | 911 Operator (Steam achievements, medals) |
| **Scenario editor** | Players cannot create custom scenarios | ADMS (full scenario authoring toolkit) |
| **Training analytics** | No instructor dashboard, performance export, or competency tracking | XVR Simulation (detailed trainee analytics and reporting) |

## Dual Purpose: Game + Real Software Prototype

Urban Command Center serves a dual role:

1. **Playable game** — A complete, standalone emergency management simulator designed for entertainment and educational value.
2. **Visual prototype** — A functional UX prototype for the real municipal command center software being developed at `C:\devprojects\municipal-command-center`.

The game validates core interaction patterns and domain concepts before they are implemented in the enterprise system. Shared concepts between the game and the real software include:

- **Incident management** — Event lifecycle from detection through dispatch, treatment, and resolution.
- **Force dispatch** — Unit selection, assignment, travel tracking, and availability management.
- **Escalation logic** — Time-based severity increases, chain reactions, and casualty growth.
- **Map-based situational awareness** — Leaflet-based interactive map with real-time markers, route lines, and geographic context.
- **Role-based operations** — Different force types with distinct capabilities and response protocols.
- **Hebrew RTL interface** — Full right-to-left layout with authentic Hebrew emergency terminology.

Insights from player behavior in the game directly inform the design of the professional system. If a game mechanic feels unintuitive to casual players, the corresponding enterprise feature likely needs redesign.

## Current Stats

| Metric | Value |
|--------|-------|
| Event types | 17 (10 standard + 7 missile-related) |
| Unit templates | 21 across 9 force types |
| Scenarios | 14 (4 classic + 10 missile-focused) |
| Scoring dimensions | 4 categories, 0-1000 scale, S/A/B/C/D/F grades |
| Beer Sheva neighborhoods | 10 |
| Landmarks | 12+ |
| Unit base locations | 4 |
| Guided tour steps | 10 |
| Interface language | Full Hebrew RTL |
