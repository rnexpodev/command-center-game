import { Clock, Target, Layers, AlertTriangle, Link2, Zap } from "lucide-react";
import type { GameAnalytics } from "@/engine/analytics";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function MetricCard({ icon, label, value, color }: MetricCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
      <span className={color}>{icon}</span>
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xl font-bold text-zinc-100">{value}</span>
    </div>
  );
}

interface AnalyticsMetricsProps {
  analytics: GameAnalytics;
}

export function AnalyticsMetrics({ analytics }: AnalyticsMetricsProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      <MetricCard
        icon={<Clock className="h-5 w-5" />}
        label="זמן תגובה ממוצע"
        value={`${analytics.avgResponseTime} טיקים`}
        color="text-blue-400"
      />
      <MetricCard
        icon={<Target className="h-5 w-5" />}
        label="שיעור טיפול"
        value={`${Math.round(analytics.resolutionRate * 100)}%`}
        color="text-green-400"
      />
      <MetricCard
        icon={<Layers className="h-5 w-5" />}
        label="שיא אירועים מקבילים"
        value={analytics.peakActiveEvents}
        color="text-cyan-400"
      />
      <MetricCard
        icon={<AlertTriangle className="h-5 w-5" />}
        label="אירועים שהוחמרו"
        value={analytics.escalationCount}
        color="text-orange-400"
      />
      <MetricCard
        icon={<Link2 className="h-5 w-5" />}
        label="אירועי שרשרת"
        value={analytics.chainEventCount}
        color="text-red-400"
      />
      <MetricCard
        icon={<Zap className="h-5 w-5" />}
        label="זמן לתגובה ראשונה"
        value={`${analytics.ticksToFirstResponse} טיקים`}
        color="text-yellow-400"
      />
    </div>
  );
}
