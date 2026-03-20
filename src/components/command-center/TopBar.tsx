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

  const activeEvents = events.filter(
    (e) => e.status !== EventStatus.RESOLVED,
  ).length;
  const availableUnits = units.filter(
    (u) => u.status === UnitStatus.AVAILABLE,
  ).length;

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
      </div>

      {/* Center: clock */}
      <div className="flex items-center gap-6">
        <div className="text-center" data-tour="clock">
          <div className="font-mono text-3xl font-bold tracking-widest text-zinc-100">
            {formatGameTime(tick)}
          </div>
        </div>
      </div>

      {/* Left side: stats + speed controls */}
      <div className="flex items-center gap-4">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm" data-tour="status-bar">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <span>{activeEvents}</span>
            <span className="text-zinc-500">אירועים</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Users className="h-4 w-4 text-green-400" />
            <span>{availableUnits}</span>
            <span className="text-zinc-500">זמינים</span>
          </div>
        </div>

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
