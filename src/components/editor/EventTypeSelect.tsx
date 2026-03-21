import { cn } from "@/lib/utils";
import { EVENT_TYPE_INFO } from "@/data/event-types";
import type { EventType } from "@/engine/types";

interface EventTypeSelectProps {
  value: EventType;
  onChange: (type: EventType) => void;
  className?: string;
}

const eventTypeEntries = Object.values(EVENT_TYPE_INFO).map((info) => ({
  value: info.type,
  label: info.nameHe,
}));

export function EventTypeSelect({
  value,
  onChange,
  className,
}: EventTypeSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as EventType)}
      className={cn(
        "rounded border border-zinc-600 bg-zinc-800 px-2 py-1",
        "text-xs text-zinc-200",
        "focus:outline-none focus:border-blue-500",
        className,
      )}
    >
      {eventTypeEntries.map((entry) => (
        <option key={entry.value} value={entry.value}>
          {entry.label}
        </option>
      ))}
    </select>
  );
}
