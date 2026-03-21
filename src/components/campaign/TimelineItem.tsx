import { Lock, CheckCircle2, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { CampaignScenario } from "@/data/campaign";

type ItemStatus = "completed" | "current" | "locked";

interface TimelineItemProps {
  scenario: CampaignScenario;
  index: number;
  status: ItemStatus;
  grade?: string;
  score?: number;
  isLast: boolean;
}

const gradeColors: Record<string, string> = {
  S: "text-yellow-400",
  A: "text-green-400",
  B: "text-blue-400",
  C: "text-zinc-300",
  D: "text-orange-400",
  F: "text-red-400",
};

export function TimelineItem({
  scenario,
  index,
  status,
  grade,
  score,
  isLast,
}: TimelineItemProps) {
  return (
    <div className="flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
            status === "completed" &&
              "border-green-500 bg-green-500/20 text-green-400",
            status === "current" &&
              "border-amber-500 bg-amber-500/20 text-amber-300",
            status === "locked" && "border-zinc-700 bg-zinc-800 text-zinc-600",
          )}
        >
          {status === "completed" && <CheckCircle2 className="h-5 w-5" />}
          {status === "current" && <Radio className="h-5 w-5" />}
          {status === "locked" && <Lock className="h-4 w-4" />}
        </div>
        {!isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 min-h-6",
              status === "completed" ? "bg-green-500/40" : "bg-zinc-700/50",
            )}
          />
        )}
      </div>

      {/* Content card */}
      <div
        className={cn(
          "mb-4 flex-1 rounded-xl border p-4 transition-colors",
          status === "completed" && "border-green-500/30 bg-zinc-900/60",
          status === "current" && "border-amber-500/40 bg-zinc-900/80",
          status === "locked" && "border-zinc-800 bg-zinc-900/40 opacity-60",
        )}
      >
        <div className="mb-1 flex items-center gap-3">
          <span className="text-xs font-medium text-zinc-500">
            {index + 1}.
          </span>
          <h3
            className={cn(
              "font-semibold",
              status === "locked" ? "text-zinc-500" : "text-zinc-100",
            )}
          >
            {scenario.nameHe}
          </h3>
          {status === "completed" && grade && (
            <Badge variant="success">
              <span className={gradeColors[grade]}>{grade}</span>
              {score !== undefined && (
                <span className="mr-1 text-zinc-400"> | {score}</span>
              )}
            </Badge>
          )}
          {status === "current" && <Badge variant="warning">פעיל</Badge>}
        </div>
        {status === "current" && (
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            {scenario.briefingHe}
          </p>
        )}
      </div>
    </div>
  );
}
