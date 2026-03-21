import { Save, Download, Upload, RotateCcw } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";

const difficultyLabels = ["", "מדריך", "קל", "בינוני", "קשה"];
const difficultyColors = [
  "",
  "border-blue-500 text-blue-400",
  "border-green-500 text-green-400",
  "border-orange-500 text-orange-400",
  "border-red-500 text-red-400",
];

export function EditorTopBar() {
  const scenarioName = useEditorStore((s) => s.scenarioName);
  const setScenarioName = useEditorStore((s) => s.setScenarioName);
  const difficulty = useEditorStore((s) => s.scenarioDifficulty);
  const setDifficulty = useEditorStore((s) => s.setDifficulty);
  const saveScenario = useEditorStore((s) => s.saveScenario);
  const exportJson = useEditorStore((s) => s.exportJson);
  const importJson = useEditorStore((s) => s.importJson);
  const resetEditor = useEditorStore((s) => s.resetEditor);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImport() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const ok = importJson(text);
      if (!ok) alert("קובץ לא תקין");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const btnBase = cn(
    "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium",
    "transition-colors",
  );

  return (
    <div className="flex items-center gap-3 border-b border-zinc-700 bg-zinc-900/80 px-4 py-2.5">
      {/* Scenario name */}
      <input
        type="text"
        value={scenarioName}
        onChange={(e) => setScenarioName(e.target.value)}
        placeholder="שם התרחיש"
        className={cn(
          "rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5",
          "text-sm text-zinc-200 placeholder:text-zinc-500 w-52",
          "focus:outline-none focus:border-blue-500",
        )}
      />

      {/* Difficulty */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={cn(
              "rounded-md border px-2 py-1 text-xs transition-colors",
              difficulty === d
                ? `${difficultyColors[d]} bg-current/10 border-current`
                : "border-zinc-700 text-zinc-500 hover:border-zinc-500",
            )}
          >
            {difficultyLabels[d]}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <button
        onClick={resetEditor}
        className={cn(
          btnBase,
          "border-zinc-600 text-zinc-400 hover:bg-zinc-800",
        )}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        איפוס
      </button>

      <button
        onClick={handleImport}
        className={cn(
          btnBase,
          "border-zinc-600 text-zinc-400 hover:bg-zinc-800",
        )}
      >
        <Upload className="h-3.5 w-3.5" />
        ייבוא
      </button>

      <button
        onClick={exportJson}
        className={cn(
          btnBase,
          "border-green-500/40 text-green-400 hover:bg-green-500/10",
        )}
      >
        <Download className="h-3.5 w-3.5" />
        ייצוא
      </button>

      <button
        onClick={saveScenario}
        className={cn(
          btnBase,
          "border-blue-500/40 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20",
        )}
      >
        <Save className="h-3.5 w-3.5" />
        שמור
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
