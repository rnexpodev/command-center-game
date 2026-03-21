import { Trash2, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

export function SavedScenariosPanel() {
  const savedScenarios = useEditorStore((s) => s.savedScenarios);
  const loadScenario = useEditorStore((s) => s.loadScenario);
  const deleteScenario = useEditorStore((s) => s.deleteScenario);

  if (savedScenarios.length === 0) return null;

  return (
    <div className="border-t border-zinc-700 px-4 py-3">
      <h4 className="text-xs font-semibold text-zinc-400 mb-2">
        תרחישים שמורים
      </h4>
      <div className="space-y-1.5 max-h-32 overflow-y-auto">
        {savedScenarios.map((s) => (
          <div
            key={s.id}
            className={cn(
              "flex items-center justify-between rounded-md border",
              "border-zinc-700 bg-zinc-800/50 px-2 py-1.5",
            )}
          >
            <span className="text-xs text-zinc-300 truncate flex-1 min-w-0">
              {s.name}
            </span>
            <div className="flex items-center gap-1 shrink-0 mr-2">
              <button
                onClick={() => loadScenario(s.id)}
                className="p-1 rounded text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                title="טען"
              >
                <FolderOpen className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => deleteScenario(s.id)}
                className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="מחק"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
