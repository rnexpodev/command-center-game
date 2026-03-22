# UX Patterns Research: Simulation, Strategy & Dispatch Games

Research compiled from game design analyses, wiki breakdowns, GDC references, and developer postmortems. Each pattern references the specific game that implements it.

---

## 1. Unit Status and Feedback

How games communicate what units are doing, where they are, and when they'll be available.

### StarCraft / StarCraft 2 — Wireframe Health System
- **Single selection**: Large wireframe appears in the command bar showing a silhouette of the unit. The wireframe changes color segment-by-segment as health drops: **green** (high HP), **yellow** (medium), **red** (low/critical).
- **Multi-selection**: Smaller wireframes for each unit in a grid, each independently color-coded by health. Click any small wireframe to sub-select that unit.
- **Selection circles**: Green = yours, yellow = allied/neutral, red = enemy. Immediate friend-or-foe identification without inspecting a panel.
- **Portrait panel**: Animated unit portrait plays idle/talk animations when selected. Gives personality and confirms selection.

### XCOM 2 — Unit Flag System
- Each soldier has a **floating "unit flag"** above their head showing: name, HP pips (color-coded), action point arrows (2 chevrons below HP), cover shield icon (full/half/empty), and status effects (overwatch eye, concealment, poison, etc.).
- **Action point arrows**: 2 rectangular arrows below HP. When 1 AP is spent, one arrow disappears. Soldiers with no AP remaining are visually "dimmed."
- **Overwatch indicator**: A teal eye icon appears on the unit flag. Enemy overwatch shows a red eye. Visible at a glance without selecting the unit.
- **Cover shield**: Full shield = full cover, half-filled = half cover, empty = exposed, yellow = flanked. Appears next to HP on the unit flag itself.
- **Ability bar color coding**: Teal = costs 2 AP (turn-ending), Green = costs 1 AP, Purple = free action, Faded = out of ammo/charges, Red = unavailable during scamper, Yellow = boosted. The color tells you the cost BEFORE you click.

### RimWorld — Colonist Bar + Inspect Panel
- **Top-of-screen colonist bar**: Row of portrait icons for all colonists. Each shows a **mood bar** (blue fill, 0-100%) with three mental break threshold lines. At a glance, you see who's about to snap.
- **Color-coded mood**: Some mods (CM Color Coded Mood Bar) add color gradients to the mood bar itself: green when happy, yellow when stressed, red near break. Base game uses blue fill with the threshold markers.
- **Status icons on portraits**: Bleeding icon (sized by bleed rate), illness icon (when immunity is building), pregnancy icon, drafted icon. These overlay directly on the colonist portrait in the bar.
- **Inspect panel** (bottom of screen): Shows current activity text ("Harvesting corn," "Hauling steel to stockpile"), current location, and the **yellow progress bar** visible when zoomed in on the colonist performing work.
- **Mood target triangle**: A white triangle below the mood bar shows where mood is trending, separate from current mood. Current mood bar slowly moves toward the target — you can predict future mental states.
- **Job queue**: Shift-click to queue multiple tasks. Queued jobs listed in the inspect panel. Press C to clear queue.

### Frostpunk — Emotional State as UI
- **Hope and Discontent** are two SEPARATE bars (not a single spectrum). Hope bar at bottom-left, Discontent at bottom-right. Both can be high simultaneously — deliberate design choice that creates more nuanced state than a binary good/bad.
- **Imprecise emotional feedback**: Resources show exact numbers, but Hope/Discontent only show descriptive labels ("slight," "major") — intentional design to make emotional state feel less calculable and more human.
- **Worker assignment slider**: Drag slider to assign/unassign workers from buildings. The workforce icon in the resource drawer shows current workforce utilization as a fraction. Hover for breakdown.
- **Building status icons**: Cog + down arrow when game auto-adjusts workforce. Visual indicator of system-initiated changes vs player decisions.

### 911 Operator / 112 Operator — Color-Coded Map Icons
- Each unit on the map is a **color-coded icon**: blue = police, white = medical, red = fire. The icon itself IS the status — its position on the map shows location, and a visual trail or movement shows it's en route.
- **Map icon represents the unit type at all times**. No need for a separate status panel to know "what kind of unit is this."
- Multiple colors on an incident icon means multiple service types needed — the incident icon itself communicates required response.

### Command: Modern Operations — Configurable Datablocks
- Each unit/contact on the map has a **datablock** (floating text label) that the player can configure to show: just track number, track + name, full kinematics (speed/heading/altitude), or everything.
- **Color-coded datablocks** by posture: blue = friendly, red = hostile, yellow = unknown. Reduces map clutter in complex scenarios.
- **Unit status column**: Shows weapons inventory summary, throttle/altitude shortcuts, and behavior presets — all accessible without opening additional windows.
- **Range rings**: Selected aircraft show remaining flight range based on current speed and fuel. Visual circle on map = "how far can this unit go before it runs out of fuel."

### Oxygen Not Included — Errands & Priority System
- **Per-duplicant "To Do" list**: Select a duplicant and see their pending errands ranked by priority. Hover over an errand in the list to see why it's prioritized that way.
- **Priority overlay (P key)**: Shows sub-priority numbers (1-9) on every task in the world. Higher number = higher sub-priority within same priority tier.
- **Priority panel (L key)**: Grid showing each duplicant's priority settings per job type. At a glance: who does what, and how urgently.
- **Vitals panel**: Per-duplicant stress, calories, breath, bladder, decor exposure — all as bars with threshold markers.

### They Are Billions — RTS Command Panel
- **Standard RTS bottom panel**: Selected unit/building shows properties, attributes, and available commands. Panel content changes entirely based on selection context.
- **Resource status bar**: Right side shows food, workers, energy, colonists as numbers with icons. Storage capacity for building materials shown alongside.
- **Pause-and-plan**: Space bar pauses the game but allows issuing commands and building — important for managing information density in a defense game.

---

## 2. Action Feedback ("Juice")

How games make dispatch/command actions FEEL impactful.

### Command & Conquer — The Gold Standard of Audio Acknowledgment
- **Unit voice acknowledgments on selection**: "Yes, sir," "Ready and waiting," "Acknowledged." Each unit type has unique voice lines. Clicking a unit FEELS like giving orders because the unit TALKS BACK.
- **Unit voice acknowledgments on move/attack**: Different lines for movement vs attack orders. "Moving out," "On my way," "Attacking!" — confirms the ORDER TYPE through audio.
- **EVA announcements**: "Building," "Unit ready," "Construction complete," "Unit lost." The AI assistant confirms every significant state change. Players learn to rely on audio cues as much as the minimap.
- **Repeated clicking**: Click a unit multiple times and it cycles through increasingly annoyed/funny voice lines. This easter egg is now expected in every RTS.
- **Audio as functional feedback**: Experienced players rely on "Unit under attack" voice cues to react without searching the map. The audio IS the notification system.

### StarCraft 2 — Selection and Command Sounds
- **Selection sound**: Each unit type has a unique selection click sound. Marines sound different from Siege Tanks. The SOUND confirms what you selected.
- **Rally point visual**: Setting a rally point shows a flag and a line from building to point. Visual confirmation that your order registered.
- **Attack animation anticipation**: Units wind up before attacking. The wind-up creates anticipation; the hit creates satisfaction.

### XCOM 2 — Consequence Preview + Dramatic Execution
- **Movement range preview**: Blue outline = 1 AP move range. Yellow outline = dash (2 AP) range. You SEE the consequence before committing. No surprises.
- **Hit percentage display**: Hovering over a target shows exact hit %, crit %, and damage range. The number appearing BEFORE you click is the key — it turns the action into an informed bet.
- **Cinematic kill cam**: When a shot lands (especially kills), the camera swoops to a dramatic angle. The game CELEBRATES your successful action.
- **Environmental destruction feedback**: Missed shots hit cover, walls explode, cars catch fire. Even FAILURES have visible, satisfying consequences.

### Frostpunk — Emotional Weight
- **Sound design tied to temperature**: As the city gets colder, ambient audio shifts. The sound environment communicates danger before numbers do.
- **Law signing ceremony**: When you pass a new law, there's a dramatic presentation with the law text. The WEIGHT of the decision is communicated through presentation, not just a checkbox.
- **Generator startup**: The generator coming online has a satisfying mechanical sequence. The most important action in the game has the most satisfying feedback.

### General "Juice" Principles Applied to Strategy Games
- **Screen shake**: Subtle shake on explosions or critical events. In strategy games, used sparingly for high-impact moments (building destroyed, wave arriving).
- **Particle effects**: Smoke, sparks, debris on destruction. Dust kick-up on unit movement. These add physicality.
- **Audio layering**: Background music shifts to reflect danger level. This is more effective than UI indicators for creating emotional response.
- **Timing**: Response under 100ms feels instant. 100-300ms feels responsive. Over 300ms feels laggy. The unit acknowledging your order must happen IMMEDIATELY even if the unit takes time to start moving.
- **Flash on state change**: Brief color flash when a unit changes state (idle to moving, healthy to damaged). Draws attention without requiring the player to read text.

---

## 3. Event/Incident Information Hierarchy

How games display ongoing incidents with multiple assigned units, progress, and remaining time.

### 911 Operator / 112 Operator — Three-Tab Incident Panel
- **Tab 1 - Dialog**: Call transcript and initial report. Appears when incident is first reported.
- **Tab 2 - Info**: Title, brief description, color-coded background (blue/white/red for police/medical/fire), and icons showing what on-site elements to expect. This is the "what do I need to send?" tab.
- **Tab 3 - On Site**: Appears ONLY when teams arrive. Two-column layout: **Teams** (left) and **Incident Elements** (right). Hovering over any team member or incident element draws **connecting lines** between them showing who is handling what. A brief description tooltip appears on hover.
- **Map icon color coding**: Each incident icon on the map uses blue/white/red to indicate which services are needed. Multi-color icons = multi-service response required. The MAP is the primary information display.
- **Incident receiving**: Two types appear at bottom of screen: Green headset = incoming 911 call (requires answering). Red exclamation = reported by other dispatchers/infrastructure (automatic).

### EMERGENCY Series — Direct Unit Manipulation
- Units are controlled directly on the scene (not abstracted through panels). You click individual firefighters, paramedics, police and give them specific tasks on-scene.
- **Visual on-scene state**: Firefighters visibly spray water, paramedics visibly treat patients, police visibly secure perimeters. The action IS the status indicator.
- **Failure conditions displayed**: Casualty dies, personnel injured, fire spreads to prohibited areas, vehicle wrecked — each is a distinct failure type communicated through the event.
- **Multi-branch coordination**: Fire, medical, police, and technical units all operate at the same incident. The spatial arrangement on the map IS the organizational display.

### XCOM 2 — Mission Structure as Information Hierarchy
- **Mission timer** (top right): Turns remaining shown as a number with a timer icon. Guerilla Ops = 6-8 turns, Council Missions = 12 turns. The urgency is always visible.
- **Objective list**: Primary and secondary objectives listed on screen. Completed objectives visually crossed off.
- **Enemy activity indicator**: "Alien Activity" banner appears during enemy turn. The game clearly delineates whose turn it is.
- **After-action report**: Post-mission screen shows: kills per soldier, promotions earned, items recovered, wounded soldiers with recovery timers. This is the "what happened" summary.

### Cities: Skylines — Info Views System
- **17+ info view overlays** accessible from a button cluster in the top-left corner. Each overlay recolors the ENTIRE city map to show one data dimension: electricity, water, pollution, crime, health, education, land value, traffic, etc.
- **Green/gray road coloring**: In service coverage views, green roads = buildings getting positive boost from nearby service. Gray = not covered. The gradient IS the information.
- **Only one overlay at a time**: Switching tools removes the current overlay. This forces focus — you analyze one system, then switch.
- **Chirper notification system**: Bird icon in top-center pops up citizen messages. Controversial design — many found it distracting. Developers added option to disable sound/animation but kept the icon as an important feedback channel.

### Frostpunk — Resource Bar as Incident Indicator
- Resources (coal, food, steel, wood, steam cores) shown as counts in the top bar. When a resource hits zero or critical, the icon pulses/changes color.
- **Book of Laws**: Acts as both a tech tree and an event log. Each law you sign changes available future laws. The consequences cascade visually.

---

## 4. Dashboard/HUD Information Density

How games balance showing everything vs showing what matters.

### Factorio — Alt Mode Toggle
- **Alt mode (press Alt)**: Toggles an information overlay on ALL machines showing their current recipe icon, inserter direction arrows, and container contents. This is a BINARY toggle — either every machine shows its recipe, or none do.
- **Why it works**: Alt mode is for BUILDING AND DEBUGGING. Normal mode is for OBSERVING AND ENJOYING. The player controls when they want information density.
- **Research progress bar**: Top-right corner shows current research with a progress bar. Always visible but small. One metric that's always relevant.
- **Production statistics**: Accessible via a dedicated panel. Shows production and consumption rates over different time periods. NOT on the HUD — it's a drill-down.
- **Design philosophy**: "As functional as possible and pleasant to interact with, with a neutral and sober visual style that helps focus on relevant elements without decorative distractions." — Factorio dev team.
- **GUI scale**: GUI scales correctly at all UI scale values. Tested extensively. Information density adapts to screen size.

### Oxygen Not Included — Overlay System (11+ Layers)
- **Research-gated overlays**: Later overlays only appear after researching relevant technology. The information system scales with game complexity — early game has fewer overlays, late game has full suite.
- **Overlay types**: Temperature, oxygen, disease risk, light, decor, plumbing, electrical, automation, conveyor, materials, room, plant growth, exosuit checkpoints. Each completely recolors the visible world.
- **One overlay at a time**: Same as Cities Skylines — forces focused analysis of one system. Prevents information overload from layering.
- **Status icons on duplicants**: Small floating icons above duplicants show current need states (hunger, stress, breath). No need to select them for basic status.

### Prison Architect — Room Overlay + Need Indicators
- **Room designation overlay**: Colored chessboard pattern shows room type. Warning symbol on rooms missing required components, with mouseover listing what's missing.
- **Regime scheduling**: Visual timeline of 24 hours, each hour a block. Select activity type, then click hour blocks. Intuitive visual schedule editor.
- **Prisoner status in reform programs**: Green square = attending, Yellow = on the way, Black = somewhere else. Three states, three colors, at a glance.
- **Alert messages**: Specific failure messages: "ALL ROOMS STAFF ONLY," "NO REGIME TIMESLOT," "NO TEACHERS." Actionable text — tells you WHAT to fix.

### Cities: Skylines — Info View Architecture
- **Top-left info view cluster**: Icons for each overlay type grouped logically. Hover to see name before clicking.
- **Service building coverage**: Green roads show positive effect radius. Not a binary on/off but a gradient showing influence falloff.
- **Resource drawer at top**: Population, money, and key metrics always visible. Detail panels drill down from these numbers.

### Command: Modern Operations — Configurable Information Density
- **Datablock detail levels**: Player chooses per-unit how much information to display: track number only, track + name, track + name + kinematics, or full data. THIS is the most sophisticated approach to information density — per-entity configuration.
- **Posture-colored datablocks**: Blue/red/yellow by friend/foe/unknown. Color does the work of a label.
- **Column shortcuts**: Throttle and altitude presets accessible from the unit status column without opening windows.

### General Best Practices (from Game Developer / Game Wisdom)
- **Consolidate information areas**: Planetary Annihilation was criticized for splitting information across three areas (bottom, top, right side). One or two information zones is better than three+.
- **Idle worker indicators**: Visual mention on the HUD when workers are idle. Events happening off-screen get minimap pings or HUD alerts.
- **Progressive disclosure**: Age of Empires 3 had "different degrees of information reveal" — basic info shown by default, detailed stats on hover/click. Rise of Nations showed all info immediately. Both are valid approaches depending on complexity.
- **Three Layers of Control** (Game Developer article): Macro (whole-map strategy), Wide (visible screen), Micro (individual unit). Each layer needs its own UI support. Supreme Commander 2 and Sins of a Solar Empire succeeded by supporting all three through zoom-level-dependent UI.

---

## 5. Contextual Action Buttons

How games handle buttons that change meaning based on selection context.

### StarCraft — Command Card
- **3x3 grid of action buttons** in the bottom-right panel. Content changes ENTIRELY based on what's selected: building shows production options, unit shows abilities, multiple units show shared commands.
- **Hotkey letters visible on buttons**: Each button shows its keyboard shortcut. Players learn hotkeys by seeing them on buttons, then graduate to keyboard-only.
- **Consistent position**: Attack is always in the same grid position regardless of unit type. Common commands maintain spatial consistency.

### Age of Empires — Context-Sensitive Command Panel
- Dave Pottinger (lead designer): "If you have a game that plays like StarCraft or Age of Empires, you're going to end up with a UI like those games because that UI works pretty well for controlling that type of game."
- **Building selected**: Shows units that can be trained, technologies that can be researched, and building-specific actions.
- **Unit selected**: Shows movement, attack, patrol, garrison, and unit-specific abilities.
- **Multiple selection**: Shows only actions ALL selected units share. Unit-specific abilities disappear.

### XCOM 2 — Ability Bar with State
- **Horizontal ability bar** at bottom when a soldier is selected. Each ability has: icon, name, AP cost (encoded as color: teal/green/purple), and current usability state.
- **Faded icons**: Out of ammo or no charges remaining. Communicates "this exists but isn't available right now" vs "this doesn't exist for this unit."
- **Hover tooltips**: Full description, stats, and consequences on hover BEFORE clicking. The tooltip is the documentation.
- **Range indicators**: Abilities with limited range show circular range indicators on the map. Medikit range, stun range, etc. — the SPATIAL consequence is previewed.

### They Are Billions — Unified Command Panel
- All commands available for selected elements show their **command key** on the button (A for attack, P for patrol). Visual button + keyboard shortcut.
- The "main area" of the UI changes depending on selection: unit properties/attributes/commands when a unit is selected, building info/production when a building is selected.

### Command & Conquer — Sidebar Production
- **Persistent sidebar**: Unlike the context-sensitive bottom panel of StarCraft, C&C uses a SIDEBAR that always shows available production. You don't need to select a building to queue production.
- **Right-click to build, left-click to place**: Two-step process that separates "what to make" from "where to put it."
- **Tab-organized**: Infantry, vehicles, buildings, aircraft as tabs. The sidebar provides global production access regardless of what's selected on the map.

### General Pattern: Tooltip/Hover as Action Preview
- **XCOM**: Hover over target to see hit %, crit %, damage range before shooting.
- **Strategy game tooltips**: The tooltip pattern is universal — show the consequence BEFORE the player commits. This is the most important UX pattern for action buttons.
- **Design Patterns site**: "Hovering over all possible actions to evaluate the action in context with the selected target via tooltips" — the hover state IS the decision-making interface.

---

## 6. Timeline/Progress Visualization

How games show multi-phase operations (travel, arrive, work, complete, return).

### XCOM 2 — Geoscape Strategic Timeline
- **Scanning progress**: Click a location to start scanning. A progress indicator shows time passing. Time advances ONLY while scanning — the player controls the clock.
- **Mission timers**: Available missions show expiration timers on the strategic map. "3 days remaining" creates urgency to interrupt scanning.
- **Research progress**: Current research shows as a progress bar in the research panel. Estimated completion time shown.
- **Avatar Project progress bar**: Red segments filling a bar at the top of the geoscape. Each segment represents one step toward game over. This is the "global threat timeline."
- **Soldier recovery timers**: Wounded soldiers show "X days until available" in the barracks. You can see WHEN each asset becomes available again.
- **After-action report**: Every mission ends with a structured report: soldiers deployed, kills, loot recovered, promotions, injuries + recovery time.

### RimWorld — Activity Text + Progress Bar
- **Current activity text**: "Sowing rice," "Hauling steel," "Tending to injuries." Plain text in the inspect panel tells you exactly what a colonist is doing RIGHT NOW.
- **Yellow progress bar**: Visible when zoomed in on a working colonist. Fills up as the task progresses. When full, the colonist checks for the next task.
- **Work priority table**: Grid of colonist names (rows) vs work types (columns). Numbers 1-4 set priority. The ENTIRE colony's work allocation visible in one screen.
- **Caravan progress**: When colonists travel off-map, a progress indicator shows how far they've traveled on the world map.

### Factorio — Production Chain Visualization
- **Machine status lights (community proposed/modded)**: Green = running non-stop, Yellow = output blocked, Red = missing ingredients. Three states, three colors.
- **Research progress bar**: Always visible in top-right. Shows current tech and fill progress.
- **Crafting queue**: Player's personal crafting shows items being made with individual progress bars.
- **Belt and inserter animation**: The production chain IS the visualization. Items physically move on belts. Inserters pick up and place items. Bottlenecks are VISIBLE as backed-up belts.

### They Are Billions — Wave Countdown System
- **Pre-wave announcement**: "Zombie swarm detected near the colony from the [direction]." Appears with a **countdown timer** in game hours. Music changes to signal danger.
- **8-hour advance warning**: Standard waves announced 8 hours before arrival. Final wave gets 24 hours.
- **Minimap skull marker**: Once the wave spawns, a yellow skull appears on the minimap showing approach direction.
- **Escalating tension**: The countdown timer + music change + directional warning creates anticipation. You know WHAT's coming, FROM WHERE, and WHEN. The only unknown is HOW BIG.

### Frostpunk — Temperature Drop Timeline
- **Temperature forecast**: Shows upcoming temperature changes as a timeline/graph. You can see that a storm is coming days in advance.
- **Storm countdown**: Before a major storm hits, the game shows a timer and the projected temperature drop. This is the "prepare now" signal.
- **Building construction progress**: Each building under construction shows a progress indicator. Workers assigned speed up the progress.

### XCOM 2 Tactical — Turn-Based Phase Visualization
- **Turn structure**: Each turn is clearly delineated. "XCOM Turn" and "Alien Turn" banners. The phase system IS the timeline.
- **Action point consumption**: Visual depletion of AP arrows as you use them. You always know how many actions remain.
- **Timer missions**: Turn counter in top-right counts DOWN. Each turn spent is visually one step closer to failure.

### 911 Operator — Travel and On-Site Phases
- **Three distinct phases visible in UI**: Unit on map moving toward incident (travel), incident panel switches to On-Site tab (arrival), resolution happens through on-site management (work).
- **Map movement**: Unit icon physically moves across the map toward the incident. The spatial distance IS the ETA visualization.

### General Patterns for Multi-Phase Operations
- **Phase indicators**: Show current phase (travel/on-scene/treating/returning) with distinct visual states. XCOM uses AP arrows, RimWorld uses activity text, 911 Operator uses tab switches.
- **Countdown vs count-up**: Timers counting DOWN (XCOM mission timer, They Are Billions wave) create urgency. Progress bars filling UP (Factorio research, RimWorld work) create satisfaction. Use both for different emotional effects.
- **Spatial visualization**: 911 Operator and EMERGENCY show travel as physical movement on the map. The map IS the timeline for travel phases.
- **Dashed/dotted lines**: Common pattern for showing unit-to-target connections. Different line styles can indicate different phases (solid = on scene, dashed = traveling, dotted = returning).

---

## Key Takeaways for Command Center Game

### Highest-Impact Patterns to Implement

1. **Unit voice/audio acknowledgment on dispatch** (C&C pattern) — Even simple audio confirmation ("Unit dispatched," "En route") transforms clicking a button into giving an order.

2. **XCOM-style ability color coding** — Color-code action buttons by consequence type, not just by action. "This will cost you time" vs "this is free" communicated through color alone.

3. **Three-tab incident panel** (911 Operator) — Dialog/Info/On-Site tab structure maps directly to the event lifecycle in the Command Center game.

4. **Hover-to-preview consequences** — Before dispatching, show: ETA, travel time, which event types this unit can handle, current distance. The decision information appears on HOVER, not after clicking.

5. **Alt-mode style information toggle** (Factorio) — Let players toggle between "clean map view" and "full information overlay" with one keypress.

6. **Unit flag system** (XCOM) — Small floating indicators above each unit on the map showing: health, current state (idle/traveling/treating), and a tiny progress indicator. No need to select for basic status.

7. **Countdown timers with directional warnings** (They Are Billions) — For missile waves, show: timer, direction, and estimated severity. The anticipation is the gameplay.

8. **Color-coded multi-service icons** (911 Operator) — Event icons on the map should visually encode which force types are needed through color segments, not just text.

9. **Phase-distinct line styles** — Dashed polylines for traveling, solid for on-scene, dotted for returning. Already partially implemented — ensure visual distinction is strong.

10. **Consolidated information zones** — Keep all contextual information in 1-2 screen areas. Don't scatter unit info, event info, and action buttons across 3+ zones.

---

## Sources

- [911 Operator Incident Panel Wiki](https://911-operator.fandom.com/wiki/Incident_Panel)
- [911 Operator Incidents Wiki](https://911-operator.fandom.com/wiki/Incidents)
- [XCOM 2 Tactical Combat UI Wiki](https://xcom.fandom.com/wiki/Tactical_combat_UI_(XCOM_2))
- [XCOM 2 Geoscape Wiki](https://xcom.fandom.com/wiki/Geoscape_(XCOM_2))
- [Strategy Game Battle UI by treeform](https://medium.com/@treeform/strategy-game-battle-ui-3b313ffd3769)
- [UI Strategy Game Design Dos and Don'ts - GameDeveloper](https://www.gamedeveloper.com/design/ui-strategy-game-design-dos-and-don-ts)
- [Three Layers of Control in Strategy Games - GameDeveloper](https://www.gamedeveloper.com/design/the-three-layers-of-control-in-strategy-games-)
- [UI and UX in Tactical Games - Medium](https://medium.com/games-r-ux/ui-and-ux-in-tactical-games-three-considerations-82c546e9e48)
- [Let's Talk RTS User Interface - Dave Pottinger Interview](https://waywardstrategy.com/2015/05/04/lets-talk-rts-user-interface-part-1-interview-with-dave-pottinger/)
- [Building a Better RTS Part 2 - PolarOrbit](http://www.polarorbit.net/2015/03/building-a-better-rts-part-2/)
- [Juice in Game Design - Blood Moon Interactive](https://www.bloodmooninteractive.com/articles/juice.html)
- [Game Feel - GameDesignSkills](https://gamedesignskills.com/game-design/game-feel/)
- [Factorio Friday Facts #212 - GUI Update Part 1](https://factorio.com/blog/post/fff-212)
- [Factorio Friday Facts #277 - GUI Progress Update](https://factorio.com/blog/post/fff-277)
- [Factorio Friday Facts #348 - The Final GUI Update](https://www.factorio.com/blog/post/fff-348)
- [Oxygen Not Included Overlays Wiki](https://oxygennotincluded.wiki.gg/wiki/Overlays)
- [ONI Priority System Wiki](https://oxygennotincluded.wiki.gg/wiki/Priority)
- [Cities: Skylines Info Views Wiki](https://skylines.paradoxwikis.com/Info_views)
- [Prison Architect User Interface Wiki](https://prisonarchitect.paradoxwikis.com/User_interface)
- [Prison Architect Regime Wiki](https://prisonarchitect.paradoxwikis.com/Regime)
- [Command: Modern Operations UI Part II](https://command.matrixgames.com/?p=4975)
- [Command: Modern Operations Manual Addendum](https://command.matrixgames.com/?page_id=2697)
- [They Are Billions GUI Reveal - ModDB](https://www.moddb.com/games/they-are-billions/news/revealing-the-they-are-billions-gui)
- [They Are Billions Swarms Wiki](https://they-are-billions.fandom.com/wiki/Swarms)
- [RimWorld Work Wiki](https://rimworldwiki.com/wiki/Work)
- [RimWorld Mood Wiki](https://rimworldwiki.com/wiki/Mood)
- [Frostpunk Hope Wiki](https://frostpunk.fandom.com/wiki/Hope)
- [Frostpunk Game UI Database](https://www.gameuidatabase.com/gameData.php?id=38)
- [EMERGENCY series Wikipedia](https://en.wikipedia.org/wiki/Emergency_(video_game_series))
- [C&C EVA Voice - INAIRSPACE](https://inairspace.com/blogs/learn-with-inair/command-and-conquer-eva-voice-how-an-ai-announcer-became-iconic)
- [StarCraft Wireframes - StarEdit Network Wiki](https://staredit-network.fandom.com/wiki/Changing_Unit_Wireframes)
- [StarCraft In-Game UI - GitHub Wiki](https://github.com/crandino/StarCraft/wiki/In-Game-UI)
- [Game UI Database](https://www.gameuidatabase.com/)
- [Interface In Game](https://interfaceingame.com/)
- [112 Operator Review - Strategy Informer](https://www.thestrategyinformer.com/game-reviews/112-operator-review/)
