import { cn } from "@/lib/utils";
import type { Severity, Difficulty } from "@/engine/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "danger" | "warning" | "caution" | "info" | "success" | "neutral";
  size?: "sm" | "md";
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  danger: "bg-red-500/20 text-red-400 border-red-500/40",
  warning: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  caution: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  info: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  success: "bg-green-500/20 text-green-400 border-green-500/40",
  neutral: "bg-zinc-500/20 text-zinc-400 border-zinc-500/40",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  pulse,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantStyles[variant],
        pulse && "animate-pulse",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Map severity enum to badge variant */
export function severityToVariant(severity: Severity): BadgeProps["variant"] {
  const map: Record<number, BadgeProps["variant"]> = {
    1: "info",
    2: "caution",
    3: "warning",
    4: "danger",
  };
  return map[severity] ?? "neutral";
}

/** Map severity to Hebrew label */
export function severityToLabel(severity: Severity): string {
  const map: Record<number, string> = {
    1: "נמוך",
    2: "בינוני",
    3: "גבוה",
    4: "קריטי",
  };
  return map[severity] ?? "לא ידוע";
}

/** Map difficulty to badge variant */
export function difficultyToVariant(
  difficulty: Difficulty,
): BadgeProps["variant"] {
  const map: Record<string, BadgeProps["variant"]> = {
    tutorial: "info",
    easy: "success",
    medium: "warning",
    hard: "danger",
  };
  return map[difficulty] ?? "neutral";
}

/** Map difficulty to Hebrew label */
export function difficultyToLabel(difficulty: Difficulty): string {
  const map: Record<string, string> = {
    tutorial: "מדריך",
    easy: "קל",
    medium: "בינוני",
    hard: "קשה",
  };
  return map[difficulty] ?? "לא ידוע";
}

export default Badge;
