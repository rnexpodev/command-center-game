import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** Value between 0 and 100 */
  value: number;
  variant?: "danger" | "warning" | "caution" | "info" | "success";
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

const barColors: Record<string, string> = {
  danger: "bg-red-500",
  warning: "bg-orange-500",
  caution: "bg-yellow-500",
  info: "bg-blue-500",
  success: "bg-green-500",
};

export function ProgressBar({
  value,
  variant = "info",
  size = "sm",
  label,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-400">
          <span>{label}</span>
          <span className="font-mono">{Math.round(clamped)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-zinc-800",
          size === "sm" ? "h-2" : "h-3",
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            barColors[variant],
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
