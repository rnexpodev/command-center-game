import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  MapPin,
  Flame,
  Truck,
  AlertTriangle,
  HelpCircle,
  CheckCircle,
  Award,
  Play,
  Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Frame {
  clock: string;
  title: string;
  text: string;
  icon: React.ReactNode;
  bgAccent: string;
}

const frames: Frame[] = [
  {
    clock: "00:00",
    title: "אזעקה",
    text: "צבע אדום! אזעקה בבאר שבע. תושבים במקלטים.",
    icon: <Siren className="h-10 w-10" />,
    bgAccent: "text-red-400 bg-red-500/10 border-red-500/40",
  },
  {
    clock: "00:10",
    title: "דיווח ראשוני",
    text: "דיווח ראשוני: נשמעה נפילה באזור שכונה ד'. פרטים מתבררים.",
    icon: <MapPin className="h-10 w-10" />,
    bgAccent: "text-yellow-400 bg-yellow-500/10 border-yellow-500/40",
  },
  {
    clock: "00:20",
    title: "מידע מתבהר",
    text: "אושרה פגיעה במבנה מגורים. נצפה עשן. יש דיווחים על נפגעים.",
    icon: <Flame className="h-10 w-10" />,
    bgAccent: "text-orange-400 bg-orange-500/10 border-orange-500/40",
  },
  {
    clock: "00:25",
    title: "שיגור כוחות",
    text: "שוגרו: צוות כיבוי, אמבולנס, ניידת משטרה. זמן הגעה: 3 דקות.",
    icon: <Truck className="h-10 w-10" />,
    bgAccent: "text-blue-400 bg-blue-500/10 border-blue-500/40",
  },
  {
    clock: "01:00",
    title: "אירוע משני",
    text: "דיווח חדש: דליפת גז ברחוב סמוך. נדרשת הקצאת כוחות נוספים!",
    icon: <AlertTriangle className="h-10 w-10" />,
    bgAccent: "text-orange-400 bg-orange-500/10 border-orange-500/40",
  },
  {
    clock: "01:15",
    title: "החלטה",
    text: "שני אירועים, כוחות מוגבלים. מה עדיף — לטפל בדליפת הגז או לחזק את הכיבוי?",
    icon: <HelpCircle className="h-10 w-10" />,
    bgAccent: "text-purple-400 bg-purple-500/10 border-purple-500/40",
  },
  {
    clock: "03:00",
    title: "ייצוב",
    text: "השריפה כובתה. הלכודים חולצו. דליפת הגז נעצרה. המצב יציב.",
    icon: <CheckCircle className="h-10 w-10" />,
    bgAccent: "text-green-400 bg-green-500/10 border-green-500/40",
  },
  {
    clock: "סיום",
    title: "סיכום",
    text: "ציון: A — תגובה מהירה, הקצאת כוחות נכונה, מניעת הסלמה",
    icon: <Award className="h-10 w-10" />,
    bgAccent: "text-amber-400 bg-amber-500/10 border-amber-500/40",
  },
];

const INTERVAL = 3500;

export function MissileReplay() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  const advance = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % frames.length);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(advance, INTERVAL);
    return () => clearInterval(timer);
  }, [playing, advance]);

  const frame = frames[activeIdx];

  return (
    <section className="mb-20 w-full max-w-4xl">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-2 text-center text-3xl font-bold text-zinc-100"
      >
        תרחיש טילים — דוגמה
      </motion.h2>
      <p className="mb-8 text-center text-sm text-zinc-500">
        צפו במהלך קבלת ההחלטות בזמן אמת
      </p>

      {/* Replay card */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80">
        {/* Clock header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
          <span className="font-mono text-lg font-bold text-zinc-300">
            {frame.clock}
          </span>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-zinc-700"
          >
            {playing ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {playing ? "עצור" : "המשך"}
          </button>
        </div>

        {/* Frame content */}
        <div className="flex min-h-[180px] items-center justify-center px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className={cn("rounded-2xl border p-4", frame.bgAccent)}>
                {frame.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-100">{frame.title}</h3>
              <p className="max-w-md text-sm leading-relaxed text-zinc-400">
                {frame.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 border-t border-zinc-800 px-6 py-4">
          {frames.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === activeIdx
                  ? "w-8 bg-blue-500"
                  : "w-2.5 bg-zinc-700 hover:bg-zinc-600",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
