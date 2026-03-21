import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Film } from "lucide-react";
import { gameRecorder } from "@/engine/recorder";
import { TimelineEventType } from "@/engine/recorder";
import { ReplayControls, ReplaySpeed } from "./replay-controls";
import { TimelineEntryCard } from "./timeline-entry-card";

/** Tick-based filter — show entries up to and including currentTick */
export function ReplayView() {
  const timeline = useMemo(() => gameRecorder.getTimeline(), []);
  const maxTick = useMemo(() => gameRecorder.getMaxTick(), []);

  const [currentTick, setCurrentTick] = useState(0);
  const [speed, setSpeed] = useState<ReplaySpeed>(ReplaySpeed.PAUSED);
  const [filter, setFilter] = useState<TimelineEventType | "all">("all");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Playback timer
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (speed === ReplaySpeed.PAUSED || currentTick >= maxTick) {
      return;
    }

    const ms = Math.max(50, 500 / speed);
    intervalRef.current = setInterval(() => {
      setCurrentTick((prev) => {
        const next = prev + 1;
        if (next >= maxTick) {
          setSpeed(ReplaySpeed.PAUSED);
          return maxTick;
        }
        return next;
      });
    }, ms);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [speed, maxTick, currentTick]);

  // Auto-scroll to bottom when tick advances
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [currentTick]);

  const handleSetTick = useCallback((tick: number) => {
    setCurrentTick(tick);
  }, []);

  const handleSetSpeed = useCallback((newSpeed: ReplaySpeed) => {
    setSpeed(newSpeed);
  }, []);

  // Entries up to current tick
  const visibleEntries = useMemo(() => {
    return timeline.filter((e) => {
      if (e.tick > currentTick) return false;
      if (filter !== "all" && e.type !== filter) return false;
      return true;
    });
  }, [timeline, currentTick, filter]);

  const filterOptions: { value: TimelineEventType | "all"; label: string }[] = [
    { value: "all", label: "הכל" },
    { value: TimelineEventType.EVENT_SPAWNED, label: "אירועים" },
    { value: TimelineEventType.EVENT_ESCALATED, label: "החמרות" },
    { value: TimelineEventType.EVENT_RESOLVED, label: "טופלו" },
    { value: TimelineEventType.UNIT_DISPATCHED, label: "שליחות" },
    { value: TimelineEventType.UNIT_ARRIVED, label: "הגעות" },
    { value: TimelineEventType.CHAIN_EVENT, label: "אירועי שרשרת" },
  ];

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-zinc-500">
        <Film className="h-10 w-10" />
        <p className="text-sm">אין נתוני הקלטה זמינים</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {/* Playback controls */}
      <ReplayControls
        currentTick={currentTick}
        maxTick={maxTick}
        speed={speed}
        onSetTick={handleSetTick}
        onSetSpeed={handleSetSpeed}
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              filter === opt.value
                ? "border-blue-500/40 bg-blue-500/20 text-blue-300"
                : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Timeline entries */}
      <div
        ref={listRef}
        className="flex max-h-[400px] flex-col gap-2 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/50 p-3"
      >
        {visibleEntries.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-600">
            אין אירועים בנקודת זמן זו
          </p>
        ) : (
          visibleEntries.map((entry, i) => (
            <TimelineEntryCard
              key={`${entry.tick}-${entry.type}-${i}`}
              entry={entry}
            />
          ))
        )}
      </div>

      {/* Stats */}
      <p className="text-center text-xs text-zinc-600">
        {visibleEntries.length} / {timeline.length} אירועים מוצגים
      </p>
    </div>
  );
}
