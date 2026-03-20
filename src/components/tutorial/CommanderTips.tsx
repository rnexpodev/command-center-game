import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tip {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

const tips: Tip[] = [
  {
    emoji: "\uD83C\uDFAF",
    title: "תעדף לפי חומרה",
    description: "אירוע קריטי שלא מטופל מחמיר מהר. אל תתעלם מהאדומים.",
    color: "border-red-500/30 hover:border-red-400/50",
  },
  {
    emoji: "\u26A1",
    title: "שלח את הכוח הנכון",
    description:
      'כיבוי לשריפה, מד"א לנפגעים, חילוץ ללכודים. התאמה נכונה = טיפול מהיר.',
    color: "border-yellow-500/30 hover:border-yellow-400/50",
  },
  {
    emoji: "\u23F1\uFE0F",
    title: "שלוט במהירות",
    description:
      "השתמש בכפתורי המהירות. עצור כשצריך להחליט, האץ כשהכוחות בדרך.",
    color: "border-blue-500/30 hover:border-blue-400/50",
  },
  {
    emoji: "\uD83D\uDDFA\uFE0F",
    title: "השתמש במפה",
    description: "לחץ על אירוע במפה כדי לראות פרטים. הקרב והרחק לתמונת מצב.",
    color: "border-green-500/30 hover:border-green-400/50",
  },
  {
    emoji: "\uD83D\uDD04",
    title: "צפה להסלמה",
    description:
      "אירועים שלא מטופלים יוצרים אירועי משנה. שריפה הופכת לקריסה, קריסה ללכודים.",
    color: "border-orange-500/30 hover:border-orange-400/50",
  },
  {
    emoji: "\uD83D\uDE80",
    title: "תרחישי טילים",
    description:
      "בתרחישי טילים, המידע הראשוני חלקי. חכה לעדכונים לפני שתשלח את כל הכוחות.",
    color: "border-purple-500/30 hover:border-purple-400/50",
  },
];

export function CommanderTips() {
  return (
    <section className="mb-20 w-full max-w-4xl">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 text-center text-3xl font-bold text-zinc-100"
      >
        טיפים למפקד
      </motion.h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip, i) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={cn(
              "rounded-xl border bg-zinc-900/60 p-5 transition-colors",
              tip.color,
            )}
          >
            <span className="mb-3 block text-2xl">{tip.emoji}</span>
            <h3 className="mb-2 text-base font-bold text-zinc-100">
              {tip.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              {tip.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
