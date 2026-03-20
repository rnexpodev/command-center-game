import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, X } from "lucide-react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TourTooltipProps {
  position: TooltipPosition;
  title?: string;
  text: string;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
  /** Custom label for the next/finish button */
  nextLabel?: string;
  /** Absolute coordinates for positioning */
  style?: React.CSSProperties;
}

/** Arrow that points from the tooltip toward the highlighted element */
function TooltipArrow({ position }: { position: TooltipPosition }) {
  const base = "absolute w-0 h-0 border-solid border-transparent";

  switch (position) {
    case "top":
      return (
        <div
          className={base}
          style={{
            bottom: -10,
            left: "50%",
            transform: "translateX(-50%)",
            borderWidth: "10px 10px 0 10px",
            borderTopColor: "rgba(59, 130, 246, 0.6)",
          }}
        />
      );
    case "bottom":
      return (
        <div
          className={base}
          style={{
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            borderWidth: "0 10px 10px 10px",
            borderBottomColor: "rgba(59, 130, 246, 0.6)",
          }}
        />
      );
    case "left":
      return (
        <div
          className={base}
          style={{
            right: -10,
            top: "50%",
            transform: "translateY(-50%)",
            borderWidth: "10px 0 10px 10px",
            borderLeftColor: "rgba(59, 130, 246, 0.6)",
          }}
        />
      );
    case "right":
      return (
        <div
          className={base}
          style={{
            left: -10,
            top: "50%",
            transform: "translateY(-50%)",
            borderWidth: "10px 10px 10px 0",
            borderRightColor: "rgba(59, 130, 246, 0.6)",
          }}
        />
      );
  }
}

export function TourTooltip({
  position,
  title,
  text,
  step,
  totalSteps,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
  nextLabel,
  style,
}: TourTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="pointer-events-auto absolute z-[10002] w-80"
      style={style}
      dir="rtl"
    >
      <div className="relative rounded-xl border border-blue-500/60 bg-zinc-900/95 p-4 shadow-2xl shadow-blue-500/20 backdrop-blur-md">
        {/* Pulsing glow border */}
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-blue-400/30 animate-pulse" />

        {/* Arrow */}
        <TooltipArrow position={position} />

        {/* Skip button */}
        <button
          onClick={onSkip}
          className="absolute start-2 top-2 rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          title="דלג"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="mb-3 pe-1">
          {title && (
            <h3 className="mb-2 text-base font-bold text-zinc-100">{title}</h3>
          )}
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
            {text}
          </p>
        </div>

        {/* Footer: step counter + nav buttons */}
        <div className="flex items-center justify-between border-t border-zinc-700/50 pt-3">
          <span className="text-xs text-zinc-500">
            שלב {step + 1} מתוך {totalSteps}
          </span>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                <ChevronRight className="h-3.5 w-3.5" />
                הקודם
              </button>
            )}
            <button
              onClick={onNext}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
            >
              {nextLabel ?? (isLast ? "סיום" : "הבא")}
              {!isLast && <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
