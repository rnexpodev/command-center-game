import { cn } from "@/lib/utils";
import { Severity } from "@/engine/types";

interface SeveritySelectProps {
  value: Severity;
  onChange: (severity: Severity) => void;
  className?: string;
}

const severityOptions = [
  { value: Severity.LOW, label: "נמוך", color: "text-blue-400" },
  { value: Severity.MEDIUM, label: "בינוני", color: "text-yellow-400" },
  { value: Severity.HIGH, label: "גבוה", color: "text-orange-400" },
  { value: Severity.CRITICAL, label: "קריטי", color: "text-red-400" },
];

export function SeveritySelect({
  value,
  onChange,
  className,
}: SeveritySelectProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {severityOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded px-2 py-0.5 text-xs border transition-colors",
            value === opt.value
              ? `${opt.color} border-current bg-current/10`
              : "text-zinc-500 border-zinc-700 hover:border-zinc-500",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
