import {
  Trophy,
  Medal,
  Star,
  Flame,
  Zap,
  Timer,
  Gauge,
  Users,
  ShieldCheck,
  HeartPulse,
  Crown,
  Footprints,
  Target,
  Repeat,
  Award,
  CheckCircle,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Trophy,
  Medal,
  Star,
  Flame,
  Zap,
  Timer,
  Gauge,
  Users,
  ShieldCheck,
  HeartPulse,
  Crown,
  Footprints,
  Target,
  Repeat,
  Award,
  CheckCircle,
  TrendingUp,
};

interface AchievementIconProps {
  name: string;
  className?: string;
}

export function AchievementIcon({ name, className }: AchievementIconProps) {
  const Icon = iconMap[name] ?? HelpCircle;
  return <Icon className={className} />;
}
