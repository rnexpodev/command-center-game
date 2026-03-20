import { motion } from "framer-motion";
import { Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

export function HeroHeader() {
  const setScreen = useUIStore((s) => s.setScreen);

  return (
    <motion.section
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mb-16 flex w-full max-w-4xl flex-col items-center text-center"
    >
      {/* Glowing background accent */}
      <div className="absolute -top-20 h-40 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="mb-6 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-4"
      >
        <Shield className="h-12 w-12 text-blue-400" />
      </motion.div>

      <h1 className="mb-3 text-5xl font-bold tracking-tight text-zinc-100">
        איך משחקים?
      </h1>
      <p className="mb-8 text-xl text-zinc-400">מדריך למפקד החמ&quot;ל החדש</p>

      <div className="flex gap-4">
        <button
          onClick={() => setScreen("menu")}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-blue-500/40",
            "bg-blue-500/10 px-6 py-3 text-lg font-semibold text-blue-400",
            "transition-all hover:bg-blue-500/20 hover:border-blue-400",
          )}
        >
          <ArrowRight className="h-5 w-5" />
          התחל לשחק
        </button>
        <button
          onClick={() => setScreen("menu")}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-zinc-700",
            "bg-zinc-800/50 px-6 py-3 text-lg font-semibold text-zinc-300",
            "transition-all hover:bg-zinc-700/50 hover:border-zinc-600",
          )}
        >
          <ArrowLeft className="h-5 w-5" />
          חזרה לתפריט
        </button>
      </div>
    </motion.section>
  );
}
