# 04 — Radio Communications

| Field | Value |
|-------|-------|
| **Priority** | P2 |
| **Impact** | HIGH |
| **Effort** | MEDIUM |
| **Serves Real Software** | YES (comms system) |

## Objective

Add a text-based radio communication feed simulating command center communications. Radio chatter is the heartbeat of a real command center — it creates urgency, delivers progressive information, and makes the player feel embedded in the operation.

## Competitive Reference

911 Operator's voice calls are its defining mechanic. Command: Modern Operations uses a message log system for situational awareness. Real Israeli command centers (the target domain) use structured radio protocols with unit callsigns and status codes.

## Requirements

- Radio feed panel showing incoming reports and unit status updates
- Messages in Hebrew with military/emergency style (concise, coded language)
- Event reports arrive before full event details are revealed (progressive information disclosure)
- Unit acknowledgments when dispatched (e.g., "יחידה 3, קיבלתי, בדרך")
- Status updates from field units (e.g., "הגענו לזירה", "מתחילים טיפול", "אירוע יוצב")
- Escalation warnings (e.g., "תשומת לב, האירוע מחמיר!")
- Timestamp on each message (game time, not real time)
- Auto-scroll to latest message with manual scroll-back capability
- Optional: text-to-speech for critical messages (Web Speech API)

## Technical Design

### New Files

- **`src/engine/radio.ts`** — Pure TypeScript module. Given a state diff (events spawned, units dispatched, arrivals, escalations, resolutions), generates `RadioMessage[]`. Each message has tick, sender, Hebrew text, priority level, and associated event/unit ID.
- **`src/data/radio-templates.ts`** — Hebrew message templates organized by event type and message trigger. Uses template strings with placeholders for unit names, neighborhoods, and event details. `as const` objects for message categories.
- **`src/components/command-center/RadioFeed.tsx`** — Scrollable radio panel component. Messages appear with a brief typing animation (Framer Motion). Color-coded by priority: white (routine), yellow (important), red (critical).

### Architecture

- Radio messages are generated as a side effect of simulation ticks, similar to the sound system. A Zustand subscription or hook detects state changes and calls `radio.ts` to produce messages.
- Messages are stored in `game-store` (or a dedicated slice) as a capped array (last ~100 messages to prevent memory growth).
- The radio panel sits alongside existing panels in the command center layout. On mobile/narrow screens, it can be toggled as an overlay.
- Clicking a radio message selects the associated event or unit on the map.

### Files to Modify

- **`src/components/command-center/CommandCenter.tsx`** — Add `RadioFeed` panel to the layout.
- **`src/engine/simulation.ts`** — Emit radio message triggers after state changes in each tick.
- **`src/store/game-store.ts`** — Add `radioMessages: RadioMessage[]` field.

### Real Software Benefit

Communication feed is central to real command centers. The Hebrew message templates, protocol structure, and message-to-event linking pattern can be directly reused in the municipal command center software.

## Acceptance Criteria

- [ ] Radio messages appear in real-time matching game events
- [ ] Messages are in correct Hebrew with appropriate military/emergency tone
- [ ] Progressive info: initial report is vague, details sharpen over time
- [ ] Unit acknowledgments appear when dispatch is confirmed
- [ ] Field status updates appear at arrival, treatment start, and resolution
- [ ] Escalation warnings are visually distinct (red, bold)
- [ ] Auto-scroll follows new messages; manual scroll-back pauses auto-scroll
- [ ] Clicking a message selects the related event/unit on the map
- [ ] Message buffer is capped to prevent memory growth
