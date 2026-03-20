import { motion } from "framer-motion";
import {
  Flame,
  Heart,
  ShieldAlert,
  Wrench,
  HardHat,
  Users,
  Zap,
  Bus,
  Siren,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LegendSection() {
  return (
    <section className="mb-20 w-full max-w-4xl">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 text-center text-3xl font-bold text-zinc-100"
      >
        מקרא
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LegendCard title="חומרת אירוע">
          <LegendRow color="bg-red-500" label="קריטי" />
          <LegendRow color="bg-orange-500" label="גבוה" />
          <LegendRow color="bg-yellow-500" label="בינוני" />
          <LegendRow color="bg-blue-500" label="נמוך" />
        </LegendCard>

        <LegendCard title="סטטוס יחידה">
          <LegendRow color="bg-green-500" label="זמין" />
          <LegendRow color="bg-yellow-500" label="בדרך" />
          <LegendRow color="bg-blue-500" label="בזירה" />
          <LegendRow color="bg-zinc-500" label="לא זמין" />
        </LegendCard>

        <LegendCard title="סוגי כוחות">
          <ForceRow
            icon={<Flame className="h-4 w-4 text-orange-400" />}
            label="כיבוי"
          />
          <ForceRow
            icon={<Heart className="h-4 w-4 text-red-400" />}
            label='מד"א'
          />
          <ForceRow
            icon={<ShieldAlert className="h-4 w-4 text-blue-400" />}
            label="משטרה"
          />
          <ForceRow
            icon={<HardHat className="h-4 w-4 text-yellow-400" />}
            label="חילוץ"
          />
          <ForceRow
            icon={<Wrench className="h-4 w-4 text-zinc-400" />}
            label="הנדסה"
          />
          <ForceRow
            icon={<Users className="h-4 w-4 text-purple-400" />}
            label="רווחה"
          />
          <ForceRow
            icon={<Zap className="h-4 w-4 text-amber-400" />}
            label="תשתיות"
          />
          <ForceRow
            icon={<Bus className="h-4 w-4 text-green-400" />}
            label="פינוי"
          />
          <ForceRow
            icon={<Siren className="h-4 w-4 text-red-300" />}
            label="פיקוד העורף"
          />
        </LegendCard>

        <LegendCard title="סטטוס אירוע">
          <StatusRow label="דווח" desc="אירוע חדש — ממתין לטיפול" />
          <StatusRow label="בטיפול" desc="כוחות בדרך או בזירה" />
          <StatusRow label="יוצב" desc="האירוע בשליטה" />
          <StatusRow label="הוחמר" desc="לא טופל בזמן — התדרדר" />
          <StatusRow label="טופל" desc="הסתיים בהצלחה" />
        </LegendCard>
      </div>
    </section>
  );
}

function LegendCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5"
    >
      <h3 className="mb-4 text-base font-bold text-zinc-200">{title}</h3>
      <div className="flex flex-col gap-2.5">{children}</div>
    </motion.div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("h-3 w-3 rounded-full", color)} />
      <span className="text-sm text-zinc-300">{label}</span>
    </div>
  );
}

function ForceRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm text-zinc-300">{label}</span>
    </div>
  );
}

function StatusRow({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 rounded bg-zinc-700 px-2 py-0.5 text-xs font-semibold text-zinc-200">
        {label}
      </span>
      <span className="text-sm text-zinc-400">{desc}</span>
    </div>
  );
}
