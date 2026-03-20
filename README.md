# חמ"ל עירוני — סימולטור ניהול חירום

Municipal Emergency Command Center simulation game. Manage emergency events in Beer Sheva — dispatch teams, prioritize incidents, prevent escalation.

## Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

Or double-click `Run Game Dev.cmd` (Windows).

## Tech Stack

- **React + TypeScript** — UI framework
- **Vite** — Build tool
- **Leaflet** — Interactive city map
- **Zustand** — State management
- **Tailwind CSS v4** — Styling
- **Framer Motion** — Animations
- **Heebo** — Hebrew font

## Game Features

- 🗺️ Interactive Beer Sheva map with dark tiles
- 🚨 10 emergency event types with Hebrew descriptions
- 🚒 9 force types (Fire, MDA, Police, Rescue, Engineering, Welfare, Infrastructure, Evacuation, Home Front Command)
- ⏱️ Time controls (pause, normal, fast, very fast)
- 📊 Scoring with S-F grade system
- 🔄 Event escalation and chain reactions
- 📋 4 pre-built scenarios

## Scenarios

| Name | Difficulty | Description |
|------|-----------|-------------|
| הדרכה - שריפה בבניין | Tutorial | Single building fire — learn the basics |
| חירום כפול | Easy | Traffic accident + fire simultaneously |
| קריסת מבנה מורכבת | Medium | Building collapse with fire, trapped people, power outage |
| גל אירועים | Hard | Multiple rapid events across the city |

## Architecture

```
src/
├── engine/          # Pure TS game simulation (no React)
│   ├── types.ts     # All game interfaces & enums
│   ├── simulation.ts # Main game loop
│   ├── clock.ts     # Time management
│   ├── events.ts    # Event lifecycle
│   ├── units.ts     # Unit dispatch & movement
│   ├── escalation.ts # Escalation rules
│   └── scoring.ts   # Score calculation
├── data/            # Static game content
│   ├── city.ts      # Beer Sheva map data
│   ├── event-types.ts
│   ├── unit-types.ts
│   └── scenarios/   # 4 scenario definitions
├── store/           # Zustand state stores
├── components/      # React UI components
│   ├── command-center/  # Main game screen
│   ├── scenarios/       # Scenario selection
│   ├── post-game/       # Results screen
│   └── ui/              # Reusable components
└── lib/             # Utilities
```

## Built With Cortex

This project was built as a Cortex evaluation — see `docs/cortex-evaluation.md` for the full assessment.
