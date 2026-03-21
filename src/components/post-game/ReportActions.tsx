import { RotateCcw, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportActionsProps {
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export function ReportActions({
  onPlayAgain,
  onBackToMenu,
}: ReportActionsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onPlayAgain}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/20 px-6 py-3",
          "text-sm font-semibold text-blue-300 transition-colors",
          "hover:bg-blue-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        )}
      >
        <RotateCcw className="h-4 w-4" />
        שחק שוב
      </button>
      <button
        onClick={onBackToMenu}
        className={cn(
          "flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3",
          "text-sm font-semibold text-zinc-300 transition-colors",
          "hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500",
        )}
      >
        <Home className="h-4 w-4" />
        חזרה לתפריט
      </button>
    </div>
  );
}
