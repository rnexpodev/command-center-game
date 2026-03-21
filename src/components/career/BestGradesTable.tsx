import { cn } from "@/lib/utils";
import { useCareerStore } from "@/store/career-store";
import { ALL_SCENARIOS } from "@/data/scenarios";

const gradeColors: Record<string, string> = {
  S: "text-yellow-300 bg-yellow-500/10",
  A: "text-green-400 bg-green-500/10",
  B: "text-blue-400 bg-blue-500/10",
  C: "text-orange-400 bg-orange-500/10",
  D: "text-red-400 bg-red-500/10",
  F: "text-red-500 bg-red-500/10",
};

export function BestGradesTable() {
  const bestGrades = useCareerStore((s) => s.bestGradePerScenario);
  const bestScores = useCareerStore((s) => s.bestScorePerScenario);

  const played = ALL_SCENARIOS.filter((s) => s.id in bestGrades);
  if (played.length === 0) return null;

  return (
    <div className="w-full max-w-2xl">
      <h2 className="mb-3 text-lg font-bold text-zinc-200">שיאים אישיים</h2>
      <div className="overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/60">
              <th className="px-4 py-2.5 text-start font-semibold text-zinc-400">
                תרחיש
              </th>
              <th className="px-4 py-2.5 text-center font-semibold text-zinc-400">
                דירוג
              </th>
              <th className="px-4 py-2.5 text-center font-semibold text-zinc-400">
                ניקוד
              </th>
            </tr>
          </thead>
          <tbody>
            {played.map((scenario) => (
              <tr
                key={scenario.id}
                className="border-b border-zinc-800/50 last:border-0"
              >
                <td className="px-4 py-2.5 text-zinc-200">{scenario.name}</td>
                <td className="px-4 py-2.5 text-center">
                  <span
                    className={cn(
                      "inline-block min-w-[2rem] rounded px-2 py-0.5 text-xs font-bold",
                      gradeColors[bestGrades[scenario.id]] ?? "text-zinc-500",
                    )}
                  >
                    {bestGrades[scenario.id]}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center font-mono text-zinc-300">
                  {bestScores[scenario.id] ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
