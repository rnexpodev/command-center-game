import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";

/** Panic level thresholds and their corresponding colors/labels */
const PANIC_TIERS = [
  { max: 25, label: "רגוע", led: "diegetic-led-green", text: "text-green-400" },
  {
    max: 50,
    label: "מתוח",
    led: "diegetic-led-yellow",
    text: "text-yellow-400",
  },
  {
    max: 75,
    label: "חרדה",
    led: "diegetic-led-orange",
    text: "text-orange-400",
  },
  { max: 100, label: "פאניקה", led: "diegetic-led-red", text: "text-red-400" },
] as const;

function getPanicTier(level: number) {
  return PANIC_TIERS.find((t) => level <= t.max) ?? PANIC_TIERS[3];
}

/** Format large numbers with K suffix for compact display */
function formatPopulation(n: number): string {
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

export function PanicMeter() {
  const civilianState = useGameStore((s) => s.civilianState);
  const { panicLevel, populationAtRisk, evacuated } = civilianState;

  const tier = getPanicTier(panicLevel);
  const panicPercent = Math.round(panicLevel);

  return (
    <div className="flex items-center gap-3 text-sm" data-tour="panic-meter">
      {/* Population at risk */}
      <div className="flex items-center gap-1.5 text-zinc-400">
        <span className="text-zinc-500">בסיכון</span>
        <span
          className={cn(
            populationAtRisk > 0 ? "text-orange-400" : "text-zinc-400",
          )}
        >
          {formatPopulation(populationAtRisk)}
        </span>
      </div>

      {/* Evacuated count (only show when > 0) */}
      {evacuated > 0 && (
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="text-zinc-500">פונו</span>
          <span className="text-green-400">{formatPopulation(evacuated)}</span>
        </div>
      )}

      {/* Panic level with LED indicator */}
      <div className="flex items-center gap-1.5">
        <span className={cn("diegetic-led", tier.led)} />
        <span className={cn("diegetic-mono text-xs", tier.text)}>
          {panicPercent}%
        </span>
        <span className="text-zinc-500">{tier.label}</span>
      </div>
    </div>
  );
}

export default PanicMeter;
