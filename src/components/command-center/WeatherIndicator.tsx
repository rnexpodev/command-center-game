import {
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  Sunrise,
  Sunset,
  Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useGameStore } from "@/store/game-store";
import { Weather, TimeOfDay } from "@/engine/types";

/** Weather icon + Hebrew label lookup */
const weatherConfig: Record<
  Weather,
  { icon: LucideIcon; label: string; color: string }
> = {
  [Weather.CLEAR]: { icon: Sun, label: "בהיר", color: "text-yellow-400" },
  [Weather.RAIN]: { icon: CloudRain, label: "גשם", color: "text-blue-400" },
  [Weather.SANDSTORM]: {
    icon: Wind,
    label: "סופת חול",
    color: "text-amber-400",
  },
  [Weather.HEATWAVE]: {
    icon: Thermometer,
    label: "גל חום",
    color: "text-red-400",
  },
};

/** Time-of-day icon + Hebrew label lookup */
const timeConfig: Record<
  TimeOfDay,
  { icon: LucideIcon; label: string; color: string }
> = {
  [TimeOfDay.DAWN]: { icon: Sunrise, label: "שחר", color: "text-orange-300" },
  [TimeOfDay.DAY]: { icon: Sun, label: "יום", color: "text-yellow-300" },
  [TimeOfDay.DUSK]: { icon: Sunset, label: "ערב", color: "text-orange-400" },
  [TimeOfDay.NIGHT]: { icon: Moon, label: "לילה", color: "text-indigo-300" },
};

export function WeatherIndicator() {
  const weather = useGameStore((s) => s.weather);
  const timeOfDay = useGameStore((s) => s.timeOfDay);

  const wCfg = weatherConfig[weather];
  const tCfg = timeConfig[timeOfDay];
  const WeatherIcon = wCfg.icon;
  const TimeIcon = tCfg.icon;

  return (
    <div className="flex items-center gap-3 text-sm">
      {/* Weather */}
      <div className="flex items-center gap-1.5">
        <WeatherIcon className={`h-4 w-4 ${wCfg.color}`} />
        <span className="text-zinc-400">{wCfg.label}</span>
      </div>

      <div className="h-4 w-px bg-zinc-700" />

      {/* Time of day */}
      <div className="flex items-center gap-1.5">
        <TimeIcon className={`h-4 w-4 ${tCfg.color}`} />
        <span className="text-zinc-400">{tCfg.label}</span>
      </div>
    </div>
  );
}
