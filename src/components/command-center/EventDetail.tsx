import {
  Flame,
  Building2,
  Car,
  CloudRain,
  Zap,
  Construction,
  AlertTriangle,
  Skull,
  Users,
  Send,
  ShieldOff,
  UserMinus,
  Timer,
  Heart,
  Shield,
  HardHat,
  Wrench,
  HandHeart,
  Truck,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import {
  Badge,
  severityToVariant,
  severityToLabel,
} from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { IconButton } from "@/components/ui/IconButton";
import { EventType, EventStatus, ForceType } from "@/engine/types";

/** Event type names */
const eventTypeNames: Record<string, string> = {
  [EventType.BUILDING_FIRE]: "שריפה במבנה",
  [EventType.BUILDING_COLLAPSE]: "קריסת מבנה",
  [EventType.TRAFFIC_ACCIDENT]: "תאונת דרכים",
  [EventType.GAS_LEAK]: "דליפת גז",
  [EventType.POWER_OUTAGE]: "הפסקת חשמל",
  [EventType.ROAD_BLOCKAGE]: "חסימת כביש",
  [EventType.HAZMAT]: "חומרים מסוכנים",
  [EventType.FLOODING]: "הצפה",
  [EventType.MASS_CASUALTY]: "אירוע רב נפגעים",
  [EventType.EVACUATION_NEEDED]: "פינוי תושבים",
};

/** Event type icons */
const eventTypeIcons: Record<string, React.ReactNode> = {
  [EventType.BUILDING_FIRE]: <Flame className="h-5 w-5" />,
  [EventType.BUILDING_COLLAPSE]: <Building2 className="h-5 w-5" />,
  [EventType.TRAFFIC_ACCIDENT]: <Car className="h-5 w-5" />,
  [EventType.GAS_LEAK]: <CloudRain className="h-5 w-5" />,
  [EventType.POWER_OUTAGE]: <Zap className="h-5 w-5" />,
  [EventType.ROAD_BLOCKAGE]: <Construction className="h-5 w-5" />,
  [EventType.HAZMAT]: <AlertTriangle className="h-5 w-5" />,
  [EventType.FLOODING]: <CloudRain className="h-5 w-5" />,
  [EventType.MASS_CASUALTY]: <Skull className="h-5 w-5" />,
  [EventType.EVACUATION_NEEDED]: <Users className="h-5 w-5" />,
};

/** Force type icons for required forces display */
const forceIcons: Record<string, React.ReactNode> = {
  [ForceType.FIRE]: <Flame className="h-4 w-4" />,
  [ForceType.MAGEN_DAVID]: <Heart className="h-4 w-4" />,
  [ForceType.POLICE]: <Shield className="h-4 w-4" />,
  [ForceType.RESCUE]: <HardHat className="h-4 w-4" />,
  [ForceType.ENGINEERING]: <Wrench className="h-4 w-4" />,
  [ForceType.WELFARE]: <HandHeart className="h-4 w-4" />,
  [ForceType.INFRASTRUCTURE]: <Wrench className="h-4 w-4" />,
  [ForceType.EVACUATION]: <Truck className="h-4 w-4" />,
  [ForceType.HOMEFRONT]: <ShieldCheck className="h-4 w-4" />,
};

const forceNames: Record<string, string> = {
  [ForceType.FIRE]: "כיבוי אש",
  [ForceType.MAGEN_DAVID]: 'מד"א',
  [ForceType.POLICE]: "משטרה",
  [ForceType.RESCUE]: "חילוץ",
  [ForceType.ENGINEERING]: "הנדסה",
  [ForceType.WELFARE]: "רווחה",
  [ForceType.INFRASTRUCTURE]: "תשתיות",
  [ForceType.EVACUATION]: "פינוי",
  [ForceType.HOMEFRONT]: "פיקוד העורף",
};

export function EventDetail() {
  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const selectEvent = useUIStore((s) => s.selectEvent);
  const selectUnit = useUIStore((s) => s.selectUnit);
  const events = useGameStore((s) => s.events);
  const units = useGameStore((s) => s.units);
  const tick = useGameStore((s) => s.tick);

  const event = events.find((e) => e.id === selectedEventId);
  if (!event) return null;

  const assignedUnits = units.filter((u) => event.assignedUnits.includes(u.id));

  // Check which required forces are assigned
  const assignedForceTypes = new Set(assignedUnits.map((u) => u.forceType));

  // Unique required forces
  const requiredForcesUnique = [...new Set(event.requiredForces)];

  // Progress variant based on progress
  function getProgressVariant(progress: number) {
    if (progress >= 80) return "success" as const;
    if (progress >= 40) return "info" as const;
    return "warning" as const;
  }

  // Escalation time remaining
  const escalationRemaining =
    event.escalationTimer > 0
      ? Math.max(0, event.escalationTimer - (tick - event.reportedAt))
      : 0;

  function handleDispatchClick() {
    // Set the panel into "dispatch mode" — user clicks a unit
    selectUnit(null); // reset any existing selection
    // The unit panel will react to selectedEventId being set
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-sm">
      <div className="flex items-start gap-6 px-6 py-4">
        {/* Event info */}
        <div className="min-w-0 flex-1">
          {/* Title row */}
          <div className="mb-3 flex items-center gap-3">
            <span className="text-orange-400">
              {eventTypeIcons[event.type]}
            </span>
            <h3 className="text-lg font-semibold text-zinc-100">
              {eventTypeNames[event.type] ?? event.type}
            </h3>
            <Badge variant={severityToVariant(event.severity)} size="md">
              {severityToLabel(event.severity)}
            </Badge>
            <span className="text-sm text-zinc-500">{event.locationName}</span>

            <button
              onClick={() => selectEvent(null)}
              className="ms-auto rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <p className="mb-3 text-sm leading-relaxed text-zinc-400">
            {event.description}
          </p>

          {/* Threat indicators */}
          <div className="mb-3 flex flex-wrap gap-2">
            {event.fireDanger && (
              <Badge variant="danger" size="sm">
                <Flame className="me-1 h-3 w-3" />
                סכנת שריפה
              </Badge>
            )}
            {event.collapseDanger && (
              <Badge variant="warning" size="sm">
                <Building2 className="me-1 h-3 w-3" />
                סכנת קריסה
              </Badge>
            )}
            {event.blocksRoad && (
              <Badge variant="caution" size="sm">
                <Construction className="me-1 h-3 w-3" />
                כביש חסום
              </Badge>
            )}
            {event.needsEvacuation && (
              <Badge variant="danger" size="sm">
                <UserMinus className="me-1 h-3 w-3" />
                דורש פינוי
              </Badge>
            )}
            {event.casualties > 0 && (
              <Badge variant="danger" size="sm">
                <Skull className="me-1 h-3 w-3" />
                {event.casualties} נפגעים
              </Badge>
            )}
          </div>
        </div>

        {/* Required forces */}
        <div className="w-48 shrink-0">
          <h4 className="mb-2 text-xs font-semibold text-zinc-500">
            כוחות נדרשים
          </h4>
          <div className="flex flex-col gap-1.5">
            {requiredForcesUnique.map((force) => {
              const isAssigned = assignedForceTypes.has(force);
              return (
                <div
                  key={force}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1 text-xs",
                    isAssigned
                      ? "bg-green-500/10 text-green-400"
                      : "bg-zinc-800 text-zinc-500",
                  )}
                >
                  {forceIcons[force]}
                  <span>{forceNames[force] ?? force}</span>
                  {isAssigned && <span className="ms-auto">&#10003;</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress + assigned units */}
        <div className="w-56 shrink-0">
          <h4 className="mb-2 text-xs font-semibold text-zinc-500">
            התקדמות טיפול
          </h4>
          <ProgressBar
            value={event.resolveProgress}
            variant={getProgressVariant(event.resolveProgress)}
            size="md"
            label="התקדמות"
          />

          {/* Escalation timer */}
          {escalationRemaining > 0 && event.status !== EventStatus.RESOLVED && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
              <Timer className="h-3 w-3" />
              <span>החמרה בעוד {Math.ceil(escalationRemaining / 60)} דקות</span>
            </div>
          )}

          {/* Assigned units count */}
          <div className="mt-2 text-xs text-zinc-500">
            <span>כוחות מוצבים: </span>
            <span className="font-medium text-zinc-300">
              {assignedUnits.length}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-col gap-2">
          <IconButton
            variant="info"
            size="sm"
            label="שגר כוחות"
            onClick={handleDispatchClick}
          >
            <Send className="h-4 w-4" />
          </IconButton>
          <IconButton variant="warning" size="sm" label="סגור אזור">
            <ShieldOff className="h-4 w-4" />
          </IconButton>
          <IconButton variant="danger" size="sm" label="פנה תושבים">
            <UserMinus className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
