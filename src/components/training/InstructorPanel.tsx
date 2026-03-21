import { useState } from "react";
import { GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EventInjector } from "./EventInjector";
import { ObjectivesTracker } from "./ObjectivesTracker";
import { QuickActions } from "./QuickActions";

export function InstructorPanel() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex h-full shrink-0 flex-col border-s border-zinc-800 bg-zinc-900/95 transition-all duration-300",
        isCollapsed ? "w-10" : "w-64",
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -start-3 top-4 z-10 flex h-6 w-6 items-center justify-center",
          "rounded-full border border-amber-500/50 bg-zinc-900 text-amber-400",
          "transition-all hover:bg-amber-500/20",
        )}
        title={isCollapsed ? "הרחב לוח מדריך" : "צמצם לוח מדריך"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Collapsed state — just icon */}
      {isCollapsed && (
        <div className="flex h-full flex-col items-center pt-12">
          <GraduationCap className="h-5 w-5 text-amber-400" />
          <span className="mt-2 text-[10px] text-amber-400/60 [writing-mode:vertical-rl]">
            מצב אימון
          </span>
        </div>
      )}

      {/* Expanded content */}
      {!isCollapsed && (
        <div className="flex h-full flex-col overflow-y-auto p-3">
          {/* Header */}
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-amber-400" />
            <h2 className="text-sm font-bold text-amber-300">לוח מדריך</h2>
          </div>

          {/* Sections */}
          <div className="space-y-5">
            <EventInjector />
            <div className="h-px bg-zinc-800" />
            <ObjectivesTracker />
            <div className="h-px bg-zinc-800" />
            <QuickActions />
          </div>
        </div>
      )}
    </div>
  );
}
