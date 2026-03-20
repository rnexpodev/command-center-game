import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";

const typeConfig: Record<
  string,
  { icon: React.ReactNode; bg: string; border: string; text: string }
> = {
  info: {
    icon: <Info className="h-4 w-4" />,
    bg: "bg-blue-500/10",
    border: "border-blue-500/40",
    text: "text-blue-300",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    bg: "bg-orange-500/10",
    border: "border-orange-500/40",
    text: "text-orange-300",
  },
  critical: {
    icon: <XCircle className="h-4 w-4" />,
    bg: "bg-red-500/10",
    border: "border-red-500/40",
    text: "text-red-300",
  },
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    bg: "bg-green-500/10",
    border: "border-green-500/40",
    text: "text-green-300",
  },
};

/** Auto-dismiss after N ms */
const AUTO_DISMISS_MS = 5000;

export function NotificationToast() {
  const notifications = useUIStore((s) => s.notifications);
  const dismissNotification = useUIStore((s) => s.dismissNotification);

  // Filter out dismissed notifications
  const visibleNotifications = notifications.filter((n) => !n.dismissed);

  // Auto-dismiss old notifications
  useEffect(() => {
    if (visibleNotifications.length === 0) return;

    const timers = visibleNotifications.map((n) =>
      setTimeout(() => dismissNotification(n.id), AUTO_DISMISS_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, [visibleNotifications, dismissNotification]);

  return (
    <div className="pointer-events-none fixed start-4 top-16 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {visibleNotifications.slice(0, 5).map((notification) => {
          const config = typeConfig[notification.type] ?? typeConfig.info;

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: -100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-md",
                config.bg,
                config.border,
              )}
            >
              <span className={config.text}>{config.icon}</span>
              <span className={cn("text-sm font-medium", config.text)}>
                {notification.message}
              </span>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="ms-2 rounded p-0.5 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default NotificationToast;
