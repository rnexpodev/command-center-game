import { motion } from "framer-motion";
import { Layers, AlertTriangle, Send, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  detail: React.ReactNode;
}

const steps: Step[] = [
  {
    icon: <Layers className="h-6 w-6" />,
    title: "בחר תרחיש",
    description:
      "בחר אחד מ-14 תרחישים ברמות קושי שונות — מהדרכה בסיסית ועד מתקפת טילים בליסטיים",
    color: "blue",
    detail: <ScenarioMockup />,
  },
  {
    icon: <AlertTriangle className="h-6 w-6" />,
    title: "קבל התראות",
    description: "אירועי חירום צצים על המפה. כל אירוע מסומן בצבע לפי חומרה:",
    color: "orange",
    detail: <SeverityLegendMini />,
  },
  {
    icon: <Send className="h-6 w-6" />,
    title: "שגר כוחות",
    description:
      "בחר יחידה זמינה מפאנל הכוחות ← לחץ על אירוע ← היחידה נשלחת לזירה",
    color: "green",
    detail: <DispatchFlow />,
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "נהל את המצב",
    description:
      "אירועים מתפתחים. אם לא טופלו בזמן — הם מחמירים ויוצרים אירועי משנה. תעדף בחוכמה!",
    color: "yellow",
    detail: <EscalationDemo />,
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "קבל ציון",
    description:
      "בסיום התרחיש תקבל הערכת ביצוע: זמן תגובה, שיעור ייצוב, ניצול משאבים וציון כולל",
    color: "purple",
    detail: <GradeBadges />,
  },
];

const colorMap: Record<
  string,
  { border: string; bg: string; text: string; line: string }
> = {
  blue: {
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    line: "bg-blue-500/30",
  },
  orange: {
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    line: "bg-orange-500/30",
  },
  green: {
    border: "border-green-500/40",
    bg: "bg-green-500/10",
    text: "text-green-400",
    line: "bg-green-500/30",
  },
  yellow: {
    border: "border-yellow-500/40",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    line: "bg-yellow-500/30",
  },
  purple: {
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    line: "bg-purple-500/30",
  },
};

export function GameFlowTimeline() {
  return (
    <section className="mb-20 w-full max-w-4xl">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-10 text-center text-3xl font-bold text-zinc-100"
      >
        מהלך המשחק
      </motion.h2>

      <div className="relative flex flex-col gap-8">
        {steps.map((step, i) => {
          const c = colorMap[step.color];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex gap-6"
            >
              {/* Timeline dot & line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
                    c.border,
                    c.bg,
                    c.text,
                  )}
                >
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div className={cn("mt-2 h-full w-0.5 flex-1", c.line)} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <h3 className={cn("mb-1 text-xl font-bold", c.text)}>
                  {i + 1}. {step.title}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  {step.detail}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Mini sub-components for step details ---------- */

function ScenarioMockup() {
  const cards = [
    {
      name: "שריפה במפעל",
      diff: "קל",
      color: "text-green-400 border-green-500/40",
    },
    {
      name: "רעידת אדמה",
      diff: "בינוני",
      color: "text-orange-400 border-orange-500/40",
    },
    {
      name: "מתקפת טילים",
      diff: "קשה",
      color: "text-red-400 border-red-500/40",
    },
  ];
  return (
    <div className="flex gap-3">
      {cards.map((c) => (
        <div
          key={c.name}
          className={cn(
            "flex-1 rounded-lg border bg-zinc-800/50 px-3 py-2 text-center text-xs",
            c.color,
          )}
        >
          <div className="font-semibold">{c.name}</div>
          <div className="mt-1 text-zinc-500">{c.diff}</div>
        </div>
      ))}
    </div>
  );
}

function SeverityLegendMini() {
  const items = [
    { label: "קריטי", emoji: "\uD83D\uDD34", color: "text-red-400" },
    { label: "גבוה", emoji: "\uD83D\uDFE0", color: "text-orange-400" },
    { label: "בינוני", emoji: "\uD83D\uDFE1", color: "text-yellow-400" },
    { label: "נמוך", emoji: "\uD83D\uDD35", color: "text-blue-400" },
  ];
  return (
    <div className="flex justify-around">
      {items.map((it) => (
        <motion.div
          key={it.label}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className={cn(
            "flex items-center gap-1.5 text-sm font-medium",
            it.color,
          )}
        >
          <span className="text-lg">{it.emoji}</span>
          {it.label}
        </motion.div>
      ))}
    </div>
  );
}

function DispatchFlow() {
  const flowSteps = ["בחר יחידה", "לחץ על אירוע", "היחידה נשלחת"];
  return (
    <div className="flex items-center justify-center gap-2">
      {flowSteps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400"
          >
            {s}
          </motion.div>
          {i < flowSteps.length - 1 && <span className="text-zinc-600">←</span>}
        </div>
      ))}
    </div>
  );
}

function EscalationDemo() {
  const levels = [
    {
      label: "בינוני",
      color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    },
    {
      label: "גבוה",
      color: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    },
    { label: "קריטי", color: "bg-red-500/20 text-red-400 border-red-500/40" },
  ];
  return (
    <div className="flex items-center justify-center gap-3">
      {levels.map((lv, i) => (
        <div key={lv.label} className="flex items-center gap-3">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.3 }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-bold",
              lv.color,
            )}
          >
            {lv.label}
          </motion.span>
          {i < levels.length - 1 && <span className="text-zinc-600">→</span>}
        </div>
      ))}
    </div>
  );
}

function GradeBadges() {
  const grades = [
    { grade: "S", color: "text-amber-300 border-amber-400/50 bg-amber-400/10" },
    { grade: "A", color: "text-green-400 border-green-500/50 bg-green-500/10" },
    { grade: "B", color: "text-blue-400 border-blue-500/50 bg-blue-500/10" },
    { grade: "C", color: "text-zinc-400 border-zinc-500/50 bg-zinc-500/10" },
  ];
  return (
    <div className="flex items-center justify-center gap-4">
      {grades.map((g, i) => (
        <motion.div
          key={g.grade}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl border-2 text-xl font-black",
            g.color,
          )}
        >
          {g.grade}
        </motion.div>
      ))}
    </div>
  );
}
