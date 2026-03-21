/**
 * Audio engine — synthesizes game sounds using Web Audio API.
 * Pure TypeScript, no React imports. Maps game events to sound triggers.
 */

import { SoundId, SOUND_DEFS, type SoundDef } from "@/data/sounds";
import { Severity } from "./types";

/** Audio manager using Web Audio API for tone synthesis */
class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private _muted = false;
  private _volume = 0.5;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  get muted(): boolean {
    return this._muted;
  }

  get volume(): number {
    return this._volume;
  }

  setMuted(muted: boolean): void {
    this._muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : this._volume;
    }
    if (muted) {
      this.stopAmbient();
    }
  }

  setVolume(volume: number): void {
    this._volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && !this._muted) {
      this.masterGain.gain.value = this._volume;
    }
  }

  /** Play a sound by its ID */
  play(soundId: SoundId): void {
    if (this._muted) return;
    const def = SOUND_DEFS[soundId];
    if (!def) return;
    this.synthesize(def);
  }

  /** Synthesize a sound from its definition */
  private synthesize(def: SoundDef): void {
    const ctx = this.getContext();
    if (!this.masterGain) return;

    for (const tone of def.tones) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = tone.type;
      osc.frequency.value = tone.freq;
      gain.gain.value = def.volume;

      osc.connect(gain);
      gain.connect(this.masterGain);

      const startTime = ctx.currentTime + (tone.delay || 0) / 1000;
      const endTime = startTime + tone.duration / 1000;

      // Fade out to avoid clicks
      gain.gain.setValueAtTime(def.volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);

      osc.start(startTime);
      osc.stop(endTime + 0.01);
    }
  }

  /** Start ambient background hum */
  startAmbient(): void {
    if (this._muted || this.ambientOsc) return;

    const ctx = this.getContext();
    if (!this.masterGain) return;

    this.ambientOsc = ctx.createOscillator();
    this.ambientGain = ctx.createGain();

    this.ambientOsc.type = "sine";
    this.ambientOsc.frequency.value = 60;
    this.ambientGain.gain.value = 0.03;

    this.ambientOsc.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);
    this.ambientOsc.start();
  }

  /** Stop ambient background hum */
  stopAmbient(): void {
    if (this.ambientOsc) {
      this.ambientOsc.stop();
      this.ambientOsc.disconnect();
      this.ambientOsc = null;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
  }

  /** Clean up all audio resources */
  destroy(): void {
    this.stopAmbient();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
    }
  }
}

/** Singleton audio manager */
export const audioManager = new AudioManager();

/** Get the appropriate alert sound for an event severity */
export function getAlertSoundForSeverity(severity: number): SoundId {
  switch (severity) {
    case Severity.CRITICAL:
      return SoundId.ALERT_CRITICAL;
    case Severity.HIGH:
      return SoundId.ALERT_HIGH;
    case Severity.MEDIUM:
      return SoundId.ALERT_MEDIUM;
    default:
      return SoundId.ALERT_LOW;
  }
}
