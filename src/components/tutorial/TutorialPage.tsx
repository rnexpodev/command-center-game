import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { HeroHeader } from "./HeroHeader";
import { GameFlowTimeline } from "./GameFlowTimeline";
import { MissileReplay } from "./MissileReplay";
import { CommanderTips } from "./CommanderTips";
import { LegendSection } from "./LegendSection";

export function TutorialPage() {
  const setScreen = useUIStore((s) => s.setScreen);

  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center bg-zinc-950 px-4 py-12"
    >
      <HeroHeader />

      {/* Divider */}
      <div className="mb-16 h-px w-full max-w-4xl bg-gradient-to-l from-transparent via-zinc-700 to-transparent" />

      <GameFlowTimeline />
      <MissileReplay />
      <CommanderTips />
      <LegendSection />

      {/* Footer CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 flex w-full max-w-4xl flex-col items-center gap-6 text-center"
      >
        <div className="h-px w-full bg-gradient-to-l from-transparent via-zinc-700 to-transparent" />
        <h2 className="mt-6 text-2xl font-bold text-zinc-100">
          מוכן? בחר תרחיש והתחל!
        </h2>
        <button
          onClick={() => setScreen("menu")}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-blue-500/40",
            "bg-blue-500/10 px-8 py-4 text-lg font-bold text-blue-400",
            "transition-all hover:bg-blue-500/20 hover:border-blue-400",
            "hover:shadow-lg hover:shadow-blue-500/10",
          )}
        >
          <Rocket className="h-5 w-5" />
          לבחירת תרחיש
        </button>
      </motion.section>
    </div>
  );
}

export default TutorialPage;
