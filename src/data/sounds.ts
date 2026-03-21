/**
 * Sound asset registry — defines all game sounds with synthesis parameters.
 * Uses Web Audio API tone synthesis instead of external audio files.
 */

export const SoundId = {
  // Alerts by severity
  ALERT_LOW: "alert_low",
  ALERT_MEDIUM: "alert_medium",
  ALERT_HIGH: "alert_high",
  ALERT_CRITICAL: "alert_critical",

  // Unit actions
  DISPATCH: "dispatch",
  UNIT_ARRIVED: "unit_arrived",
  UNIT_RETURNING: "unit_returning",

  // Event lifecycle
  ESCALATION: "escalation",
  RESOLVED: "resolved",
  CHAIN_EVENT: "chain_event",

  // Ambient
  AMBIENT_HUM: "ambient_hum",

  // UI
  CLICK: "click",
  NOTIFICATION: "notification",
} as const;
export type SoundId = (typeof SoundId)[keyof typeof SoundId];

/** Synthesis parameters for each sound */
export interface SoundDef {
  id: SoundId;
  volume: number; // 0-1 relative volume
  /** Tone sequence: array of [frequency, duration_ms, type] */
  tones: Array<{
    freq: number;
    duration: number;
    type: OscillatorType;
    delay?: number;
  }>;
}

export const SOUND_DEFS: Record<SoundId, SoundDef> = {
  // Low severity: gentle double beep
  [SoundId.ALERT_LOW]: {
    id: SoundId.ALERT_LOW,
    volume: 0.3,
    tones: [
      { freq: 440, duration: 100, type: "sine" },
      { freq: 440, duration: 100, type: "sine", delay: 150 },
    ],
  },

  // Medium severity: two-tone alert
  [SoundId.ALERT_MEDIUM]: {
    id: SoundId.ALERT_MEDIUM,
    volume: 0.4,
    tones: [
      { freq: 523, duration: 120, type: "sine" },
      { freq: 659, duration: 120, type: "sine", delay: 140 },
    ],
  },

  // High severity: urgent three-tone
  [SoundId.ALERT_HIGH]: {
    id: SoundId.ALERT_HIGH,
    volume: 0.5,
    tones: [
      { freq: 700, duration: 100, type: "square" },
      { freq: 880, duration: 100, type: "square", delay: 120 },
      { freq: 700, duration: 100, type: "square", delay: 240 },
    ],
  },

  // Critical severity: alarm siren
  [SoundId.ALERT_CRITICAL]: {
    id: SoundId.ALERT_CRITICAL,
    volume: 0.6,
    tones: [
      { freq: 880, duration: 150, type: "sawtooth" },
      { freq: 660, duration: 150, type: "sawtooth", delay: 160 },
      { freq: 880, duration: 150, type: "sawtooth", delay: 320 },
      { freq: 660, duration: 150, type: "sawtooth", delay: 480 },
    ],
  },

  // Dispatch: short rising siren
  [SoundId.DISPATCH]: {
    id: SoundId.DISPATCH,
    volume: 0.35,
    tones: [
      { freq: 400, duration: 80, type: "sine" },
      { freq: 500, duration: 80, type: "sine", delay: 80 },
      { freq: 600, duration: 80, type: "sine", delay: 160 },
      { freq: 800, duration: 120, type: "sine", delay: 240 },
    ],
  },

  // Unit arrived: confirmation ping
  [SoundId.UNIT_ARRIVED]: {
    id: SoundId.UNIT_ARRIVED,
    volume: 0.25,
    tones: [
      { freq: 600, duration: 60, type: "sine" },
      { freq: 800, duration: 100, type: "sine", delay: 80 },
    ],
  },

  // Unit returning: soft descending
  [SoundId.UNIT_RETURNING]: {
    id: SoundId.UNIT_RETURNING,
    volume: 0.15,
    tones: [{ freq: 500, duration: 80, type: "sine" }],
  },

  // Escalation warning: harsh rising
  [SoundId.ESCALATION]: {
    id: SoundId.ESCALATION,
    volume: 0.5,
    tones: [
      { freq: 300, duration: 200, type: "sawtooth" },
      { freq: 600, duration: 200, type: "sawtooth", delay: 200 },
      { freq: 900, duration: 300, type: "sawtooth", delay: 400 },
    ],
  },

  // Resolved: pleasant chime
  [SoundId.RESOLVED]: {
    id: SoundId.RESOLVED,
    volume: 0.3,
    tones: [
      { freq: 523, duration: 100, type: "sine" },
      { freq: 659, duration: 100, type: "sine", delay: 100 },
      { freq: 784, duration: 200, type: "sine", delay: 200 },
    ],
  },

  // Chain event: ominous double pulse
  [SoundId.CHAIN_EVENT]: {
    id: SoundId.CHAIN_EVENT,
    volume: 0.45,
    tones: [
      { freq: 200, duration: 150, type: "square" },
      { freq: 250, duration: 150, type: "square", delay: 200 },
    ],
  },

  // Ambient hum: low continuous tone (played as loop externally)
  [SoundId.AMBIENT_HUM]: {
    id: SoundId.AMBIENT_HUM,
    volume: 0.05,
    tones: [{ freq: 60, duration: 2000, type: "sine" }],
  },

  // UI click
  [SoundId.CLICK]: {
    id: SoundId.CLICK,
    volume: 0.1,
    tones: [{ freq: 1000, duration: 30, type: "sine" }],
  },

  // Notification
  [SoundId.NOTIFICATION]: {
    id: SoundId.NOTIFICATION,
    volume: 0.2,
    tones: [
      { freq: 700, duration: 60, type: "sine" },
      { freq: 900, duration: 80, type: "sine", delay: 80 },
    ],
  },
};
