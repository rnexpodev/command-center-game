import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

const ReplaySpeed = {
  PAUSED: 0,
  NORMAL: 1,
  FAST: 2,
  VERY_FAST: 4,
} as const;
type ReplaySpeed = (typeof ReplaySpeed)[keyof typeof ReplaySpeed];

interface ReplayControlsProps {
  currentTick: number;
  maxTick: number;
  speed: ReplaySpeed;
  onSetTick: (tick: number) => void;
  onSetSpeed: (speed: ReplaySpeed) => void;
}

const speedLabels: Record<number, string> = {
  0: "עצור",
  1: "x1",
  2: "x2",
  4: "x4",
};

export function ReplayControls({
  currentTick,
  maxTick,
  speed,
  onSetTick,
  onSetSpeed,
}: ReplayControlsProps) {
  function togglePlay() {
    onSetSpeed(
      speed === ReplaySpeed.PAUSED ? ReplaySpeed.NORMAL : ReplaySpeed.PAUSED,
    );
  }

  function cycleSpeed() {
    if (speed === ReplaySpeed.NORMAL) onSetSpeed(ReplaySpeed.FAST);
    else if (speed === ReplaySpeed.FAST) onSetSpeed(ReplaySpeed.VERY_FAST);
    else onSetSpeed(ReplaySpeed.NORMAL);
  }

  function skipBack() {
    onSetTick(Math.max(0, currentTick - 10));
  }

  function skipForward() {
    onSetTick(Math.min(maxTick, currentTick + 10));
  }

  const hours = Math.floor(currentTick / 60);
  const minutes = currentTick % 60;
  const timeStr = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Scrubber */}
      <input
        type="range"
        min={0}
        max={maxTick}
        value={currentTick}
        onChange={(e) => onSetTick(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-blue-500"
      />

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <span className="min-w-[60px] text-sm font-mono text-zinc-400">
          {timeStr}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={skipBack}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            title="אחורה 10 טיקים"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            onClick={togglePlay}
            className={cn(
              "rounded-xl p-3 transition-colors",
              speed !== ReplaySpeed.PAUSED
                ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
            )}
            title={speed !== ReplaySpeed.PAUSED ? "עצור" : "נגן"}
          >
            {speed !== ReplaySpeed.PAUSED ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={skipForward}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            title="קדימה 10 טיקים"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={cycleSpeed}
          className="min-w-[48px] rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300 transition-colors hover:bg-zinc-700"
          title="שנה מהירות"
        >
          {speedLabels[speed] ?? "x1"}
        </button>
      </div>
    </div>
  );
}

export { ReplaySpeed };
