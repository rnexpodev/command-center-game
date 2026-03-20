import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, ArrowDown } from "lucide-react";
import { useTourStore } from "@/store/tour-store";
import { useGameStore } from "@/store/game-store";
import { TourTooltip, type TooltipPosition } from "./TourTooltip";

/** Step configuration for the guided tour */
interface TourStepConfig {
  /** data-tour attribute to target, or null for centered modals */
  target: string | null;
  /** Tooltip position relative to target */
  position: TooltipPosition;
  /** Optional title */
  title?: string;
  /** Body text */
  text: string;
  /** Custom next button label */
  nextLabel?: string;
  /** Whether this is a centered modal (no spotlight) */
  isModal?: boolean;
}

const TOUR_STEPS: TourStepConfig[] = [
  // Step 0: Welcome
  {
    target: null,
    position: "bottom",
    isModal: true,
    title: 'ברוכים הבאים לחמ"ל העירוני!',
    text: "במשחק הזה אתה מנהל מרכז שליטה עירוני. קבל התראות, שגר כוחות וטפל באירועי חירום לפני שהם מחמירים.",
    nextLabel: "בוא נתחיל!",
  },
  // Step 1: Clock
  {
    target: "clock",
    position: "bottom",
    text: "זהו שעון המשחק. הוא מראה כמה זמן עבר מתחילת התרחיש.",
  },
  // Step 2: Speed Controls
  {
    target: "speed-controls",
    position: "bottom",
    text: "כאן שולטים במהירות המשחק. עצור כדי לחשוב, האץ כשממתינים.",
  },
  // Step 3: Status Bar
  {
    target: "status-bar",
    position: "bottom",
    text: "מעקב מהיר: כמה אירועים פעילים וכמה כוחות זמינים.",
  },
  // Step 4: Events Panel
  {
    target: "events-panel",
    position: "left",
    text: "כאן מופיעים כל אירועי החירום. אדום = קריטי, כתום = גבוה. לחץ על אירוע לפרטים.",
  },
  // Step 5: City Map
  {
    target: "city-map",
    position: "top",
    text: "מפת העיר. אירועים מסומנים בנקודות צבעוניות. יחידות מוצגות כאייקונים קטנים. לחץ על סמן לבחירה.",
  },
  // Step 6: Units Panel
  {
    target: "units-panel",
    position: "right",
    text: "פאנל הכוחות. כאן רואים את כל היחידות. ירוק = זמין. לחץ על יחידה זמינה כדי לבחור אותה.",
  },
  // Step 7: Dispatch Workflow
  {
    target: null,
    position: "bottom",
    isModal: true,
    title: "איך משגרים כוחות?",
    text: "DISPATCH_WORKFLOW",
  },
  // Step 8: Event Detail
  {
    target: "event-detail",
    position: "top",
    text: "כשבוחרים אירוע, כאן מופיעים כל הפרטים: תיאור, כוחות נדרשים, התקדמות טיפול, וכפתורי פעולה.",
  },
  // Step 9: Final
  {
    target: null,
    position: "bottom",
    isModal: true,
    title: "מוכן לפעולה! \uD83C\uDF96\uFE0F",
    text: "עכשיו אתה יודע הכל. זכור: תעדף אירועים קריטיים, שלח את הכוח הנכון, ואל תתן לאירועים להחמיר. בהצלחה, מפקד!",
    nextLabel: "סגור והתחל לשחק",
  },
];

/** Gap between the tooltip and the target element */
const TOOLTIP_GAP = 14;

/** Calculate tooltip position based on target element rect */
function calculateTooltipStyle(
  rect: DOMRect,
  position: TooltipPosition,
  tooltipWidth: number,
): React.CSSProperties {
  const style: React.CSSProperties = { position: "fixed" };

  switch (position) {
    case "bottom":
      style.top = rect.bottom + TOOLTIP_GAP;
      style.left = rect.left + rect.width / 2 - tooltipWidth / 2;
      break;
    case "top":
      style.bottom = window.innerHeight - rect.top + TOOLTIP_GAP;
      style.left = rect.left + rect.width / 2 - tooltipWidth / 2;
      break;
    case "left":
      style.top = rect.top + rect.height / 2 - 80;
      style.right = window.innerWidth - rect.left + TOOLTIP_GAP;
      break;
    case "right":
      style.top = rect.top + rect.height / 2 - 80;
      style.left = rect.right + TOOLTIP_GAP;
      break;
  }

  // Clamp horizontal position
  if (style.left !== undefined) {
    const numLeft = typeof style.left === "number" ? style.left : 0;
    style.left = Math.max(
      12,
      Math.min(numLeft, window.innerWidth - tooltipWidth - 12),
    );
  }

  // Clamp vertical position
  if (style.top !== undefined) {
    const numTop = typeof style.top === "number" ? style.top : 0;
    style.top = Math.max(12, numTop);
  }

  return style;
}

/** Dispatch workflow visual content (Step 8) */
function DispatchWorkflowContent() {
  const steps = [
    { num: "1", text: "לחץ על יחידה זמינה (ירוקה)", color: "text-green-400" },
    { num: "2", text: "לחץ על אירוע ברשימה או במפה", color: "text-orange-400" },
    { num: "3", text: "היחידה נשלחת לזירה!", color: "text-blue-400" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-start gap-3">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold ${step.color}`}
          >
            {step.num}
          </span>
          <span className="pt-0.5 text-sm text-zinc-300">{step.text}</span>
          {i < steps.length - 1 && (
            <ArrowDown className="ms-auto h-4 w-4 shrink-0 self-end text-zinc-600" />
          )}
        </div>
      ))}
    </div>
  );
}

/** Centered modal for welcome/info/final steps */
function CenteredModal({
  step,
  onNext,
  onPrev,
  onSkip,
}: {
  step: TourStepConfig;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) {
  const currentStep = useTourStore((s) => s.currentStep);
  const totalSteps = useTourStore((s) => s.totalSteps);
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="pointer-events-auto fixed inset-0 z-[10002] flex items-center justify-center"
      dir="rtl"
    >
      <div className="mx-4 w-full max-w-md rounded-2xl border border-blue-500/50 bg-zinc-900/95 p-6 shadow-2xl shadow-blue-500/20 backdrop-blur-md">
        {/* Icon */}
        {isFirst && (
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-500/20 p-3">
              <Rocket className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        )}

        {/* Title */}
        {step.title && (
          <h2 className="mb-3 text-center text-xl font-bold text-zinc-100">
            {step.title}
          </h2>
        )}

        {/* Body */}
        {step.text === "DISPATCH_WORKFLOW" ? (
          <DispatchWorkflowContent />
        ) : (
          <p className="mb-4 text-center text-sm leading-relaxed text-zinc-300">
            {step.text}
          </p>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-zinc-700/50 pt-4">
          <span className="text-xs text-zinc-500">
            שלב {currentStep + 1} מתוך {totalSteps}
          </span>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                הקודם
              </button>
            )}
            {!isLast && !isFirst && (
              <button
                onClick={onSkip}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
              >
                דלג
              </button>
            )}
            <button
              onClick={onNext}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              {step.nextLabel ?? (isLast ? "סיום" : "הבא")}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Spotlight overlay that dims everything except the target element */
function SpotlightOverlay({ rect }: { rect: DOMRect | null }) {
  if (!rect) {
    // Full dim for modals
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-auto fixed inset-0 z-[10000] bg-black/70"
      />
    );
  }

  const padding = 6;
  const x = rect.left - padding;
  const y = rect.top - padding;
  const w = rect.width + padding * 2;
  const h = rect.height + padding * 2;
  const r = 8;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pointer-events-auto fixed inset-0 z-[10000]"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={r} ry={r} fill="black" />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.7)"
          mask="url(#tour-spotlight-mask)"
        />
        {/* Highlight border around the target */}
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={r}
          ry={r}
          fill="none"
          stroke="rgba(59,130,246,0.5)"
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  );
}

export function GuidedTour() {
  const isActive = useTourStore((s) => s.isActive);
  const currentStep = useTourStore((s) => s.currentStep);
  const totalSteps = useTourStore((s) => s.totalSteps);
  const nextStep = useTourStore((s) => s.nextStep);
  const prevStep = useTourStore((s) => s.prevStep);
  const skipTour = useTourStore((s) => s.skipTour);

  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const stepConfig = TOUR_STEPS[currentStep];

  // Pause game when tour starts, resume when it ends
  useEffect(() => {
    if (isActive) {
      pauseGame();
    }
    return () => {
      if (isActive) {
        resumeGame();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Find and measure the target element
  const measureTarget = useCallback(() => {
    if (!isActive || !stepConfig) {
      setTargetRect(null);
      return;
    }

    if (!stepConfig.target) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(`[data-tour="${stepConfig.target}"]`);
    if (el) {
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [isActive, stepConfig]);

  useEffect(() => {
    measureTarget();

    // Re-measure on resize
    window.addEventListener("resize", measureTarget);
    return () => window.removeEventListener("resize", measureTarget);
  }, [measureTarget, currentStep]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isActive) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        skipTour();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        // In RTL: ArrowLeft = next, ArrowRight = prev
        if (e.key === "ArrowLeft") {
          nextStep();
        } else {
          prevStep();
        }
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isActive, nextStep, prevStep, skipTour]);

  if (!isActive || !stepConfig) return null;

  const isModal = stepConfig.isModal ?? false;
  const tooltipWidth = 320;

  const tooltipStyle = targetRect
    ? calculateTooltipStyle(targetRect, stepConfig.position, tooltipWidth)
    : {};

  return (
    <AnimatePresence mode="wait">
      {/* Overlay */}
      <SpotlightOverlay
        key={`overlay-${currentStep}`}
        rect={isModal ? null : targetRect}
      />

      {/* Ensure target element is above the overlay */}
      {targetRect && stepConfig.target && (
        <TargetElevator target={stepConfig.target} />
      )}

      {/* Tooltip or Modal */}
      {isModal ? (
        <CenteredModal
          key={`modal-${currentStep}`}
          step={stepConfig}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTour}
        />
      ) : (
        <TourTooltip
          key={`tooltip-${currentStep}`}
          position={stepConfig.position}
          title={stepConfig.title}
          text={stepConfig.text}
          step={currentStep}
          totalSteps={totalSteps}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTour}
          isFirst={currentStep === 0}
          isLast={currentStep === totalSteps - 1}
          nextLabel={stepConfig.nextLabel}
          style={tooltipStyle}
        />
      )}
    </AnimatePresence>
  );
}

/**
 * Temporarily elevates the target element above the overlay
 * by adding a high z-index and relative positioning.
 */
function TargetElevator({ target }: { target: string }) {
  useEffect(() => {
    const el = document.querySelector(
      `[data-tour="${target}"]`,
    ) as HTMLElement | null;
    if (!el) return;

    const prevPosition = el.style.position;
    const prevZIndex = el.style.zIndex;
    const prevPointerEvents = el.style.pointerEvents;

    el.style.position = "relative";
    el.style.zIndex = "10001";
    el.style.pointerEvents = "none";

    return () => {
      el.style.position = prevPosition;
      el.style.zIndex = prevZIndex;
      el.style.pointerEvents = prevPointerEvents;
    };
  }, [target]);

  return null;
}
