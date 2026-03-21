# 01 — Sound Design

| Field | Value |
|-------|-------|
| **Priority** | P1 |
| **Impact** | HIGH |
| **Effort** | LOW |
| **Serves Real Software** | No |

## Objective

Add immersive sound design using Howler.js (already installed). Audio feedback transforms a visual-only experience into a tense, atmospheric command center simulation where every alert, dispatch, and escalation is felt.

## Competitive Reference

911 Operator's voice-acted calls are the #1 engagement driver. Audio feedback is the single cheapest way to dramatically increase immersion in simulation games.

## Requirements

- Alert sounds for new events (differentiated by severity: low, medium, high, critical)
- Siren sounds when units are dispatched
- Ambient command center background audio (low hum, radio static, keyboard clicks)
- Escalation warning sounds (increasing urgency tone when events worsen)
- Resolution success sounds (confirmation chime when events are resolved)
- Sound settings panel (mute toggle, master volume slider)
- Event-type specific sounds (fire crackling, explosion boom, siren types per force)

## Technical Design

### New Files

- **`src/engine/audio.ts`** — Sound event definitions mapped to game events. Pure TypeScript, no React imports. Defines `SoundEvent` type and `getSoundForGameEvent()` logic.
- **`src/data/sounds.ts`** — Sound asset registry. Maps `SoundId` constants (`as const` objects, no enums) to file paths, volume defaults, and loop settings.
- **`src/components/ui/SoundSettings.tsx`** — Volume slider and mute toggle component.
- **`public/sounds/`** — Directory for audio assets (`.mp3` or `.webm` files).

### Architecture

- Audio manager class wraps Howler with preloading, sprite support, and volume control.
- Zustand subscription in a React hook (`useSoundEffects`) listens to game-store changes and triggers sounds via the audio manager.
- No sound logic inside engine tick functions — sounds are a side effect of state changes, handled at the UI layer.

### Files to Modify

- **`src/store/ui-store.ts`** — Add `soundEnabled: boolean` and `soundVolume: number` to preferences.
- **`src/components/command-center/TopBar.tsx`** — Add sound mute toggle button.

## Acceptance Criteria

- [ ] New events produce severity-appropriate alert sounds
- [ ] Dispatching a unit plays a siren/dispatch sound
- [ ] Ambient background audio plays during gameplay
- [ ] Escalation triggers a distinct warning sound
- [ ] Event resolution plays a success chime
- [ ] Mute toggle silences all audio immediately
- [ ] Volume slider adjusts all sound levels
- [ ] No audio lag or overlapping sound glitches during rapid events
- [ ] Sound preferences persist across page reloads (localStorage via Zustand)
