import { create } from "zustand";
import type { Scenario } from "@/engine/types";
import { Difficulty, EventType, Severity } from "@/engine/types";
import { EVENT_TYPE_INFO } from "@/data/event-types";
import { UNIT_TEMPLATES } from "@/data/unit-types";
import { BEER_SHEVA } from "@/data/city";

// ── Types ────────────────────────────────────────────────────────────────

export interface EditorEvent {
  type: EventType;
  position: [number, number];
  severity: Severity;
  locationName: string;
}

export interface EditorWave {
  tick: number;
  events: EditorEvent[];
}

export interface SavedScenario {
  id: string;
  name: string;
  scenario: Scenario;
  createdAt: number;
}

interface EditorState {
  scenarioName: string;
  scenarioDifficulty: number;
  waves: EditorWave[];
  selectedWaveIndex: number | null;
  savedScenarios: SavedScenario[];
}

// ── Actions ──────────────────────────────────────────────────────────────

interface EditorActions {
  setScenarioName: (name: string) => void;
  setDifficulty: (d: number) => void;
  addWave: () => void;
  removeWave: (index: number) => void;
  selectWave: (index: number | null) => void;
  setWaveTick: (index: number, tick: number) => void;
  addEventToWave: (waveIndex: number, event: EditorEvent) => void;
  removeEventFromWave: (waveIndex: number, eventIndex: number) => void;
  updateEventInWave: (
    waveIndex: number,
    eventIndex: number,
    patch: Partial<EditorEvent>,
  ) => void;
  saveScenario: () => void;
  loadScenario: (id: string) => void;
  deleteScenario: (id: string) => void;
  exportJson: () => void;
  importJson: (json: string) => boolean;
  resetEditor: () => void;
}

export type EditorStore = EditorState & EditorActions;

// ── Helpers ──────────────────────────────────────────────────────────────

const STORAGE_KEY = "editor_saved_scenarios";

function loadSaved(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedScenario[]) : [];
  } catch {
    return [];
  }
}

function persistSaved(scenarios: SavedScenario[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
}

const DIFF_MAP: Record<number, Difficulty> = {
  1: "tutorial" as Difficulty,
  2: "easy" as Difficulty,
  3: "medium" as Difficulty,
  4: "hard" as Difficulty,
};

/** Convert editor state to a real Scenario object */
export function buildScenario(state: EditorState): Scenario {
  const difficulty =
    DIFF_MAP[state.scenarioDifficulty] ?? ("medium" as Difficulty);
  const maxTick = state.waves.reduce((m, w) => Math.max(m, w.tick), 0);

  return {
    id: `custom_${Date.now().toString(36)}`,
    name: state.scenarioName || "תרחיש מותאם אישית",
    description: `תרחיש מותאם אישית עם ${state.waves.length} גלים`,
    difficulty,
    cityId: "beer_sheva",
    durationTicks: maxTick + 300,
    waves: state.waves.map((w) => ({
      tick: w.tick,
      events: w.events.map((ev) => {
        const info = EVENT_TYPE_INFO[ev.type];
        return {
          type: ev.type,
          severity: ev.severity,
          position: { x: ev.position[0], y: ev.position[1] },
          locationName: ev.locationName,
          description: info.descriptionHe,
          requiredForces: info.requiredForces,
          casualties: 0,
          threatRadius: info.threatRadius,
          blocksRoad: info.blocksRoad,
          fireDanger: info.fireDanger,
          collapseDanger: info.collapseDanger,
          needsEvacuation: info.needsEvacuation,
          infrastructureDamage: info.infrastructureDamage,
          escalationTimer: info.escalationTimer,
          escalationTarget: info.escalationTarget,
          chainEvents: info.chainEvents,
          resolveRate: info.resolveRate,
        };
      }),
    })),
    initialUnits: UNIT_TEMPLATES.map((t) => ({
      name: t.nameHe,
      forceType: t.forceType,
      position: { ...BEER_SHEVA.center },
      basePosition: { ...BEER_SHEVA.center },
      speed: t.speed,
      specialization: t.specialization,
      effectiveness: t.effectiveness,
    })),
  };
}

// ── Store ────────────────────────────────────────────────────────────────

export const useEditorStore = create<EditorStore>((set, get) => ({
  scenarioName: "",
  scenarioDifficulty: 2,
  waves: [{ tick: 5, events: [] }],
  selectedWaveIndex: 0,
  savedScenarios: loadSaved(),

  setScenarioName: (name) => set({ scenarioName: name }),
  setDifficulty: (d) => set({ scenarioDifficulty: d }),

  addWave() {
    set((s) => {
      const lastTick =
        s.waves.length > 0 ? s.waves[s.waves.length - 1].tick : 0;
      const newWaves = [...s.waves, { tick: lastTick + 30, events: [] }];
      return { waves: newWaves, selectedWaveIndex: newWaves.length - 1 };
    });
  },

  removeWave(index) {
    set((s) => {
      const newWaves = s.waves.filter((_, i) => i !== index);
      const newSel =
        s.selectedWaveIndex === index
          ? null
          : s.selectedWaveIndex !== null && s.selectedWaveIndex > index
            ? s.selectedWaveIndex - 1
            : s.selectedWaveIndex;
      return { waves: newWaves, selectedWaveIndex: newSel };
    });
  },

  selectWave: (index) => set({ selectedWaveIndex: index }),

  setWaveTick(index, tick) {
    set((s) => {
      const newWaves = s.waves.map((w, i) =>
        i === index ? { ...w, tick } : w,
      );
      return { waves: newWaves };
    });
  },

  addEventToWave(waveIndex, event) {
    set((s) => {
      const newWaves = s.waves.map((w, i) =>
        i === waveIndex ? { ...w, events: [...w.events, event] } : w,
      );
      return { waves: newWaves };
    });
  },

  removeEventFromWave(waveIndex, eventIndex) {
    set((s) => {
      const newWaves = s.waves.map((w, i) =>
        i === waveIndex
          ? { ...w, events: w.events.filter((_, ei) => ei !== eventIndex) }
          : w,
      );
      return { waves: newWaves };
    });
  },

  updateEventInWave(waveIndex, eventIndex, patch) {
    set((s) => {
      const newWaves = s.waves.map((w, i) =>
        i === waveIndex
          ? {
              ...w,
              events: w.events.map((ev, ei) =>
                ei === eventIndex ? { ...ev, ...patch } : ev,
              ),
            }
          : w,
      );
      return { waves: newWaves };
    });
  },

  saveScenario() {
    const s = get();
    const scenario = buildScenario(s);
    const saved: SavedScenario = {
      id: scenario.id,
      name: s.scenarioName || "תרחיש מותאם אישית",
      scenario,
      createdAt: Date.now(),
    };
    const list = [saved, ...s.savedScenarios.filter((x) => x.id !== saved.id)];
    persistSaved(list);
    set({ savedScenarios: list });
  },

  loadScenario(id) {
    const found = get().savedScenarios.find((s) => s.id === id);
    if (!found) return;
    const sc = found.scenario;
    const diffNum =
      Object.entries(DIFF_MAP).find(([, v]) => v === sc.difficulty)?.[0] ?? "2";
    set({
      scenarioName: sc.name,
      scenarioDifficulty: Number(diffNum),
      waves: sc.waves.map((w) => ({
        tick: w.tick,
        events: w.events.map((ev) => ({
          type: ev.type,
          position: [ev.position.x, ev.position.y] as [number, number],
          severity: ev.severity,
          locationName: ev.locationName,
        })),
      })),
      selectedWaveIndex: 0,
    });
  },

  deleteScenario(id) {
    set((s) => {
      const list = s.savedScenarios.filter((x) => x.id !== id);
      persistSaved(list);
      return { savedScenarios: list };
    });
  },

  exportJson() {
    const scenario = buildScenario(get());
    const blob = new Blob([JSON.stringify(scenario, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scenario.name || "scenario"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJson(json: string): boolean {
    try {
      const sc = JSON.parse(json) as Scenario;
      if (!sc.waves || !sc.name) return false;
      const diffNum =
        Object.entries(DIFF_MAP).find(([, v]) => v === sc.difficulty)?.[0] ??
        "2";
      set({
        scenarioName: sc.name,
        scenarioDifficulty: Number(diffNum),
        waves: sc.waves.map((w) => ({
          tick: w.tick,
          events: w.events.map((ev) => ({
            type: ev.type as EventType,
            position: [ev.position.x, ev.position.y] as [number, number],
            severity: ev.severity as Severity,
            locationName: ev.locationName,
          })),
        })),
        selectedWaveIndex: 0,
      });
      return true;
    } catch {
      return false;
    }
  },

  resetEditor() {
    set({
      scenarioName: "",
      scenarioDifficulty: 2,
      waves: [{ tick: 5, events: [] }],
      selectedWaveIndex: 0,
    });
  },
}));
