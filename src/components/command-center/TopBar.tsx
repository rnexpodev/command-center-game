import {
  Pause,
  Play,
  FastForward,
  ChevronsRight,
  ArrowRight,
  Radio,
  Users,
  AlertTriangle,
  HelpCircle,
  Volume2,
  VolumeX,
  Timer,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatGameTime } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import { useTourStore } from "@/store/tour-store";
import {
  Badge,
  severityToVariant,
  severityToLabel,
} from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { WeatherIndicator } from "./WeatherIndicator";
import { PanicMeter } from "./PanicMeter";
import { GameSpeed, EventStatus, UnitStatus } from "@/engine/types";

const alertLevelColor: Record<number, string> = {
  1: "text-blue-400",
  2: "text-yellow-400",
  3: "text-orange-400",
  4: "text-red-400",
};

export function TopBar() {
  const tick = useGameStore((s) => s.tick);
  const speed = useGameStore((s) => s.speed);
  const events = useGameStore((s) => s.events);
  const units = useGameStore((s) => s.units);
  const cityAlert = useGameStore((s) => s.cityAlert);
  const isRunning = useGameStore((s) => s.isRunning);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const setSpeed = useGameStore((s) => s.setSpeed);
  const reset = useGameStore((s) => s.reset);
  const setScreen = useUIStore((s) => s.setScreen);
  const startTour = useTourStore((s) => s.startTour);
  const soundEnabled = useUIStore((s) => s.soundEnabled);
  const setSoundEnabled = useUIStore((s) => s.setSoundEnabled);

  const activeEvents = events.filter((e) => e.status !== EventStatus.RESOLVED);
  const activeCount = activeEvents.length;
  const availableUnits = units.filter(
    (u) => u.status === UnitStatus.AVAILABLE,
  ).length;

  // Situation summary computations
  const criticalUnattended = activeEvents.filter(
    (e) => e.assignedUnits.length === 0 && e.severity >= 3,
  ).length;

  const unitsEnRoute = units.filter(
    (u) =>
      u.status === UnitStatus.EN_ROUTE || u.status === UnitStatus.DISPATCHED,
  ).length;

  // Nearest escalation across all active events
  const nearestEscalation = activeEvents
    .filter((e) => e.escalationTimer > 0 && e.status !== EventStatus.STABILIZED)
    .reduce((min, e) => Math.min(min, e.escalationTimer), Infinity);

  function handleBack() {
    reset();
    setScreen("menu");
  }

  function handleSpeedChange(newSpeed: GameSpeed) {
    if (newSpeed === GameSpeed.PAUSED) {
      pauseGame();
    } else {
      if (!isRunning) resumeGame();
      setSpeed(newSpeed);
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/95 px-4 py-2 backdrop-blur-sm">
      {/* Right side: back button + city name */}
      <div className="flex items-center gap-3">
        <IconButton variant="ghost" size="sm" onClick={handleBack} label="חזור">
          <ArrowRight className="h-4 w-4" />
        </IconButton>

        <div className="h-6 w-px bg-zinc-700" />

        <div className="flex items-center gap-2">
          <Radio
            className={cn(
              "h-5 w-5",
              alertLevelColor[cityAlert] ?? "text-zinc-400",
            )}
          />
          <span className="text-lg font-semibold">באר שבע</span>
        </div>

        <Badge variant={severityToVariant(cityAlert)} size="md">
          {severityToLabel(cityAlert)}
        </Badge>

        <div className="h-6 w-px bg-zinc-700" />

        <WeatherIndicator />
      </div>

      {/* Center: clock */}
      <div className="flex items-center gap-6">
        <div className="text-center" data-tour="clock">
          <div className="diegetic-mono text-3xl font-bold tracking-widest text-zinc-100">
            {formatGameTime(tick)}
          </div>
        </div>
      </div>

      {/* Left side: situation summary + speed controls */}
      <div className="flex items-center gap-4">
        {/* Situation summary */}
        <div className="flex items-center gap-3 text-sm" data-tour="status-bar">
          {/* Active events */}
          <div className="flex items-center gap-1.5 text-zinc-400">
            <AlertTriangle
              className={cn(
                "h-4 w-4",
                criticalUnattended > 0
                  ? "text-red-400 animate-pulse"
                  : "text-orange-400",
              )}
            />
            <span
              className={cn(
                criticalUnattended > 0 && "text-red-400 font-semibold",
              )}
            >
              {activeCount}
            </span>
            <span className="text-zinc-500">אירועים</span>
            {criticalUnattended > 0 && (
              <span className="text-red-400 font-semibold text-xs">
                ({criticalUnattended} ללא מענה!)
              </span>
            )}
          </div>

          {/* Available units */}
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Users className="h-4 w-4 text-green-400" />
            <span>{availableUnits}</span>
            <span className="text-zinc-500">/{units.length}</span>
          </div>

          {/* Units en route */}
          {unitsEnRoute > 0 && (
            <div className="flex items-center gap-1 text-yellow-400">
              <Navigation className="h-3.5 w-3.5" />
              <span className="text-xs">{unitsEnRoute} בדרך</span>
            </div>
          )}

          {/* Nearest escalation */}
          {nearestEscalation < Infinity && nearestEscalation < 180 && (
            <div
              className={cn(
                "flex items-center gap-1",
                nearestEscalation < 60
                  ? "text-red-400 font-semibold"
                  : "text-orange-400",
              )}
            >
              <Timer className="h-3.5 w-3.5" />
              <span className="text-xs">
                הסלמה {Math.ceil(nearestEscalation / 60)}׳
              </span>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-zinc-700" />

        {/* Civilian panic & population */}
        <PanicMeter />

        <div className="h-6 w-px bg-zinc-700" />

        {/* Speed controls */}
        <div className="flex items-center gap-1" data-tour="speed-controls">
          <IconButton
            variant="ghost"
            size="sm"
            active={speed === GameSpeed.PAUSED}
            onClick={() => handleSpeedChange(GameSpeed.PAUSED)}
            title="השהה"
          >
            <Pause className="h-4 w-4" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            active={speed === GameSpeed.NORMAL}
            onClick={() => handleSpeedChange(GameSpeed.NORMAL)}
            title="רגיל"
          >
            <Play className="h-4 w-4" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            active={speed === GameSpeed.FAST}
            onClick={() => handleSpeedChange(GameSpeed.FAST)}
            title="מהיר"
          >
            <FastForward className="h-4 w-4" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            active={speed === GameSpeed.VERY_FAST}
            onClick={() => handleSpeedChange(GameSpeed.VERY_FAST)}
            title="מהיר מאוד"
          >
            <ChevronsRight className="h-4 w-4" />
          </IconButton>
        </div>

        <div className="h-6 w-px bg-zinc-700" />

        {/* Sound toggle */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? "השתק" : "הפעל צלילים"}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4 text-zinc-500" />
          )}
        </IconButton>

        {/* Help / restart tour */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={startTour}
          title="סיור מודרך"
          label="עזרה"
        >
          <HelpCircle className="h-4 w-4" />
        </IconButton>
      </div>
    </header>
  );
}

export default TopBar;
