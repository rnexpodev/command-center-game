import { useState, useEffect } from "react";
import { Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefingModalProps {
  scenarioName: string;
  briefingText: string;
  missionNumber: number;
  totalMissions: number;
  onStart: () => void;
}

export function BriefingModal({
  scenarioName,
  briefingText,
  missionNumber,
  totalMissions,
  onStart,
}: BriefingModalProps) {
  const [visible, setVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => setTextVisible(true), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div
        className={cn(
          "flex max-w-lg flex-col items-center gap-6 rounded-2xl",
          "border border-zinc-700/50 bg-zinc-900/95 p-10 text-center",
          "shadow-2xl transition-all duration-700",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
      >
        {/* Mission number */}
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
          <Crosshair className="h-4 w-4" />
          <span>
            משימה {missionNumber} מתוך {totalMissions}
          </span>
        </div>

        {/* Scenario name */}
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">
          {scenarioName}
        </h2>

        {/* Divider */}
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        {/* Briefing text */}
        <p
          className={cn(
            "max-w-md text-lg leading-relaxed text-zinc-300 transition-all duration-700",
            textVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2",
          )}
        >
          {briefingText}
        </p>

        {/* Start button */}
        <button
          onClick={onStart}
          className={cn(
            "mt-4 rounded-xl border border-amber-500/50 bg-amber-500/20 px-8 py-3",
            "text-lg font-bold text-amber-300 transition-all",
            "hover:bg-amber-500/30 hover:border-amber-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
          )}
        >
          התחל
        </button>
      </div>
    </div>
  );
}
