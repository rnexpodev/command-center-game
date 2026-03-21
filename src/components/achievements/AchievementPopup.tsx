import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ACHIEVEMENT_MAP } from "@/data/achievements";
import { useCareerStore } from "@/store/career-store";
import { AchievementIcon } from "./AchievementIcon";

export function AchievementPopup() {
  const pendingAchievements = useCareerStore((s) => s.pendingAchievements);
  const clearPending = useCareerStore((s) => s.clearPendingAchievements);
  const [visible, setVisible] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (pendingAchievements.length === 0) return;

    // Defer state update to avoid synchronous setState in effect
    const frame = requestAnimationFrame(() => {
      setVisible(pendingAchievements);
    });

    timerRef.current = setTimeout(() => {
      setVisible([]);
      clearPending();
    }, 4000);

    return () => {
      cancelAnimationFrame(frame);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pendingAchievements, clearPending]);

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 flex flex-col gap-2">
      <AnimatePresence>
        {visible.map((id) => {
          const def = ACHIEVEMENT_MAP.get(id);
          if (!def) return null;
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center gap-3 rounded-xl border border-yellow-600/50 bg-zinc-900/95 px-5 py-3 shadow-lg shadow-yellow-900/20 backdrop-blur"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-yellow-500/40 bg-yellow-500/10">
                <AchievementIcon
                  name={def.icon}
                  className="h-5 w-5 text-yellow-400"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-yellow-300">
                  {def.nameHe}
                </p>
                <p className="text-xs text-zinc-400">{def.descriptionHe}</p>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
