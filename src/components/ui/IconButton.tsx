import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger" | "success" | "warning" | "info" | "ghost";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  children: React.ReactNode;
  label?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700",
  danger: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/40",
  success:
    "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/40",
  warning:
    "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/40",
  info: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/40",
  ghost:
    "bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-transparent",
};

const sizeStyles: Record<string, string> = {
  sm: "h-8 min-w-8 px-2 text-xs gap-1.5",
  md: "h-10 min-w-10 px-3 text-sm gap-2",
  lg: "h-12 min-w-12 px-4 text-base gap-2",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      active,
      label,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg border font-medium",
          "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          active &&
            "ring-2 ring-blue-500 bg-blue-500/20 text-blue-300 border-blue-500/60",
          className,
        )}
        {...props}
      >
        {children}
        {label && <span>{label}</span>}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
