import { create } from "zustand";

/** A notification message shown in the UI */
export interface GameNotification {
  id: string;
  message: string;
  type: "info" | "warning" | "critical" | "success";
  timestamp: number;
  dismissed: boolean;
}

/** Active panel in the sidebar */
export type ActivePanel = "events" | "units" | "detail";

/** UI-only state (no game logic) */
interface UIState {
  selectedEventId: string | null;
  selectedUnitId: string | null;
  activePanel: ActivePanel;
  notifications: GameNotification[];
  showPostGame: boolean;
  screen: "menu" | "game" | "report";
}

/** UI actions */
interface UIActions {
  selectEvent: (eventId: string | null) => void;
  selectUnit: (unitId: string | null) => void;
  setActivePanel: (panel: ActivePanel) => void;
  addNotification: (message: string, type: GameNotification["type"]) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  setShowPostGame: (show: boolean) => void;
  setScreen: (screen: "menu" | "game" | "report") => void;
  reset: () => void;
}

export type UIStore = UIState & UIActions;

let notificationCounter = 0;

export const useUIStore = create<UIStore>((set) => ({
  // --- Initial state ---
  selectedEventId: null,
  selectedUnitId: null,
  activePanel: "events",
  notifications: [],
  showPostGame: false,
  screen: "menu",

  // --- Actions ---

  selectEvent(eventId: string | null) {
    set({
      selectedEventId: eventId,
      activePanel: eventId ? "detail" : "events",
      selectedUnitId: null,
    });
  },

  selectUnit(unitId: string | null) {
    set({
      selectedUnitId: unitId,
      activePanel: unitId ? "detail" : "units",
      selectedEventId: null,
    });
  },

  setActivePanel(panel: ActivePanel) {
    set({ activePanel: panel });
  },

  addNotification(message: string, type: GameNotification["type"]) {
    notificationCounter += 1;
    const notification: GameNotification = {
      id: `notif_${notificationCounter}`,
      message,
      type,
      timestamp: Date.now(),
      dismissed: false,
    };

    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50),
    }));
  },

  dismissNotification(id: string) {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, dismissed: true } : n,
      ),
    }));
  },

  clearNotifications() {
    set({ notifications: [] });
  },

  setShowPostGame(show: boolean) {
    set({ showPostGame: show });
  },

  setScreen(screen: "menu" | "game" | "report") {
    set({
      screen,
      selectedEventId: null,
      selectedUnitId: null,
    });
  },

  reset() {
    notificationCounter = 0;
    set({
      selectedEventId: null,
      selectedUnitId: null,
      activePanel: "events",
      notifications: [],
      showPostGame: false,
      screen: "menu",
    });
  },
}));
