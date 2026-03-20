import { useEffect, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import {
  EventStatus,
  UnitStatus,
  type GameEvent,
  type Unit,
} from "@/engine/types";
import {
  severityColors,
  forceTypeColors,
  eventTypeSvgPaths,
  forceTypeSvgPaths,
  renderSvgIcon,
  eventTypeNames,
} from "@/data/map-icons";
import { baseLocations, baseSvgPaths } from "@/data/base-locations";

/** Beer Sheva center coordinates */
const BEER_SHEVA_CENTER: [number, number] = [31.25, 34.79];

/** Dark basemap tiles */
const DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

/** Status dot colors for unit markers */
const statusDotColors: Record<string, string> = {
  [UnitStatus.AVAILABLE]: "#22c55e",
  [UnitStatus.DISPATCHED]: "#eab308",
  [UnitStatus.EN_ROUTE]: "#eab308",
  [UnitStatus.ON_SCENE]: "#3b82f6",
  [UnitStatus.RETURNING]: "#71717a",
};

// ── Icon cache ──────────────────────────────────────────────────────────────

const iconCache = new Map<string, L.DivIcon>();

function clearIconCache() {
  iconCache.clear();
}

/** Create a rich event marker icon with SVG icon and progress ring */
function createEventIcon(
  eventType: string,
  severity: number,
  isSelected: boolean,
  isUnattended: boolean,
  resolveProgress: number,
): L.DivIcon {
  const progressBucket = Math.floor(resolveProgress / 5) * 5;
  const cacheKey = `evt-${eventType}-${severity}-${isSelected ? 1 : 0}-${isUnattended ? 1 : 0}-${progressBucket}`;

  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const size = isSelected ? 36 : 28;
  const color = severityColors[severity] ?? "#71717a";
  const svgPath =
    eventTypeSvgPaths[eventType] ?? eventTypeSvgPaths.building_fire;
  const iconSize = Math.round(size * 0.5);
  const iconSvg = renderSvgIcon(
    svgPath,
    iconSize,
    "#fff",
    eventType === "building_fire",
  );

  // SVG progress ring
  const ringRadius = (size - 4) / 2;
  const circumference = 2 * Math.PI * ringRadius;
  const dashOffset = circumference * (1 - progressBucket / 100);
  const progressRing =
    progressBucket > 0
      ? `<svg style="position:absolute;inset:0;width:${size}px;height:${size}px;transform:rotate(-90deg);" viewBox="0 0 ${size} ${size}">
          <circle cx="${size / 2}" cy="${size / 2}" r="${ringRadius}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="${circumference}" stroke-dashoffset="${dashOffset}" class="progress-ring-circle" opacity="0.9"/>
        </svg>`
      : "";

  const pulseClass = isUnattended ? "marker-pulse" : "";
  const borderColor = isSelected ? "#fff" : "rgba(255,255,255,0.3)";
  const bgOpacity = isSelected ? "33" : "20";
  const glowSize = isSelected ? 14 : 8;

  const html = `
    <div class="${pulseClass}" style="position:relative;width:${size}px;height:${size}px;">
      <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color}${bgOpacity};border:2px solid ${borderColor};box-shadow:0 0 ${glowSize}px ${color};display:flex;align-items:center;justify-content:center;">
        ${iconSvg}
      </div>
      ${progressRing}
    </div>
  `;

  const totalSize = size + 4;
  const icon = L.divIcon({
    className: "custom-event-marker",
    html,
    iconSize: [totalSize, totalSize],
    iconAnchor: [totalSize / 2, totalSize / 2],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}

/** Create a rich unit marker icon with SVG icon and status dot */
function createUnitIcon(
  forceType: string,
  status: string,
  isSelected: boolean,
): L.DivIcon {
  const cacheKey = `unit-${forceType}-${status}-${isSelected ? 1 : 0}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const size = isSelected ? 26 : 20;
  const color = forceTypeColors[forceType] ?? "#71717a";
  const svgPath = forceTypeSvgPaths[forceType] ?? forceTypeSvgPaths.police;
  const iconSize = Math.round(size * 0.55);
  const isFillBased = forceType === "fire" || forceType === "welfare";
  const iconSvg = renderSvgIcon(svgPath, iconSize, "#fff", isFillBased);

  const dotColor = statusDotColors[status] ?? "#71717a";
  const borderColor = isSelected ? "#fff" : "rgba(255,255,255,0.5)";
  const opacity = status === "available" ? "1" : "0.85";

  const html = `
    <div style="position:relative;width:${size}px;height:${size}px;opacity:${opacity};">
      <div style="width:${size}px;height:${size}px;border-radius:4px;background:${color};border:1.5px solid ${borderColor};box-shadow:0 0 4px ${color};display:flex;align-items:center;justify-content:center;">
        ${iconSvg}
      </div>
      <div style="position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:50%;background:${dotColor};border:1.5px solid #18181b;"></div>
    </div>
  `;

  const totalSize = size + 6;
  const icon = L.divIcon({
    className: "custom-unit-marker",
    html,
    iconSize: [totalSize, totalSize],
    iconAnchor: [totalSize / 2, totalSize / 2],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}

/** Create a base building marker icon */
function createBaseIcon(baseId: string): L.DivIcon {
  const cacheKey = `base-${baseId}`;
  const cached = iconCache.get(cacheKey);
  if (cached) return cached;

  const size = 32;
  const svgPath = baseSvgPaths[baseId] ?? baseSvgPaths["municipal-compound"];
  const iconSvg = renderSvgIcon(svgPath, 18, "rgba(255,255,255,0.6)");

  const html = `
    <div style="width:${size}px;height:${size}px;border-radius:6px;background:rgba(39,39,42,0.7);border:1px solid rgba(113,113,122,0.4);display:flex;align-items:center;justify-content:center;">
      ${iconSvg}
    </div>
  `;

  const icon = L.divIcon({
    className: "custom-base-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  iconCache.set(cacheKey, icon);
  return icon;
}

// ── MapFlyTo: only fly when a DIFFERENT event is selected ───────────────────

function MapFlyTo({ eventId }: { eventId: string | null }) {
  const map = useMap();
  const events = useGameStore((s) => s.events);
  const prevEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!eventId || eventId === prevEventIdRef.current) return;
    prevEventIdRef.current = eventId;

    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    // Only zoom in, never zoom out. Floor at 14.
    const currentZoom = map.getZoom();
    const targetZoom = Math.max(14, currentZoom);
    map.flyTo([event.position.x, event.position.y], targetZoom, {
      duration: 0.5,
    });
  }, [eventId, events, map]);

  return null;
}

// ── Route lines ─────────────────────────────────────────────────────────────

function RouteLines({
  units,
  events,
  selectedEventId,
}: {
  units: Unit[];
  events: GameEvent[];
  selectedEventId: string | null;
}) {
  const lines = useMemo(() => {
    const result: {
      key: string;
      positions: [number, number][];
      color: string;
      weight: number;
      opacity: number;
      dashArray: string;
    }[] = [];

    for (const unit of units) {
      const color = forceTypeColors[unit.forceType] ?? "#71717a";

      if (unit.status === UnitStatus.EN_ROUTE && unit.targetEventId) {
        const target = events.find((e) => e.id === unit.targetEventId);
        if (target) {
          result.push({
            key: `route-${unit.id}`,
            positions: [
              [unit.position.x, unit.position.y],
              [target.position.x, target.position.y],
            ],
            color,
            weight: 2,
            opacity: 0.6,
            dashArray: "8, 6",
          });
        }
      }

      if (unit.status === UnitStatus.ON_SCENE && unit.targetEventId) {
        const target = events.find((e) => e.id === unit.targetEventId);
        if (target) {
          result.push({
            key: `scene-${unit.id}`,
            positions: [
              [unit.position.x, unit.position.y],
              [target.position.x, target.position.y],
            ],
            color,
            weight: 1.5,
            opacity: 0.25,
            dashArray: "4, 4",
          });
        }
      }

      if (unit.status === UnitStatus.RETURNING) {
        result.push({
          key: `return-${unit.id}`,
          positions: [
            [unit.position.x, unit.position.y],
            [unit.basePosition.x, unit.basePosition.y],
          ],
          color,
          weight: 1.5,
          opacity: 0.2,
          dashArray: "4, 8",
        });
      }
    }

    // Selected event highlight lines
    if (selectedEventId) {
      const selectedEvent = events.find((e) => e.id === selectedEventId);
      if (selectedEvent) {
        for (const unitId of selectedEvent.assignedUnits) {
          const unit = units.find((u) => u.id === unitId);
          if (unit) {
            result.push({
              key: `highlight-${unit.id}`,
              positions: [
                [selectedEvent.position.x, selectedEvent.position.y],
                [unit.position.x, unit.position.y],
              ],
              color: "#ffffff",
              weight: 2.5,
              opacity: 0.7,
              dashArray: "6, 4",
            });
          }
        }
      }
    }

    return result;
  }, [units, events, selectedEventId]);

  return (
    <>
      {lines.map((line) => (
        <Polyline
          key={line.key}
          positions={line.positions}
          pathOptions={{
            color: line.color,
            weight: line.weight,
            opacity: line.opacity,
            dashArray: line.dashArray,
          }}
        />
      ))}
    </>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function CityMap() {
  const events = useGameStore((s) => s.events);
  const units = useGameStore((s) => s.units);
  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const selectedUnitId = useUIStore((s) => s.selectedUnitId);
  const selectEvent = useUIStore((s) => s.selectEvent);
  const selectUnit = useUIStore((s) => s.selectUnit);
  const dispatchUnit = useGameStore((s) => s.dispatchUnit);
  const scenarioRef = useRef(useGameStore.getState().activeScenario?.id);

  // Clear icon cache on scenario change
  const currentScenarioId = useGameStore((s) => s.activeScenario?.id);
  useEffect(() => {
    if (currentScenarioId !== scenarioRef.current) {
      clearIconCache();
      scenarioRef.current = currentScenarioId;
    }
  }, [currentScenarioId]);

  const activeEvents = events.filter((e) => e.status !== EventStatus.RESOLVED);
  const visibleUnits = units.filter((u) => u.status !== UnitStatus.UNAVAILABLE);

  // Count available units per base for popup
  const baseUnitCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const base of baseLocations) {
      counts[base.id] = units.filter(
        (u) =>
          u.status === UnitStatus.AVAILABLE &&
          base.forceTypes.includes(u.forceType),
      ).length;
    }
    return counts;
  }, [units]);

  function handleEventMarkerClick(eventId: string) {
    if (selectedUnitId) {
      dispatchUnit(selectedUnitId, eventId);
      selectUnit(null);
      selectEvent(eventId);
      return;
    }
    selectEvent(selectedEventId === eventId ? null : eventId);
  }

  function handleUnitMarkerClick(unit: Unit) {
    if (unit.status === UnitStatus.AVAILABLE && selectedEventId) {
      dispatchUnit(unit.id, selectedEventId);
      return;
    }
    selectUnit(selectedUnitId === unit.id ? null : unit.id);
  }

  return (
    <div className="h-full w-full" data-tour="city-map">
      <MapContainer
        center={BEER_SHEVA_CENTER}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer url={DARK_TILE_URL} />
        <MapFlyTo eventId={selectedEventId} />

        {/* 1. Threat radius circles (back-most) */}
        {activeEvents
          .filter((e) => e.threatRadius > 0)
          .map((event) => (
            <Circle
              key={`radius-${event.id}`}
              center={[event.position.x, event.position.y]}
              radius={event.threatRadius}
              pathOptions={{
                color: severityColors[event.severity] ?? "#71717a",
                fillColor: severityColors[event.severity] ?? "#71717a",
                fillOpacity: 0.08,
                weight: 1,
                opacity: 0.3,
              }}
            />
          ))}

        {/* 2-5. Route lines (return, on-scene, en-route, highlight) */}
        <RouteLines
          units={visibleUnits}
          events={activeEvents}
          selectedEventId={selectedEventId}
        />

        {/* 6. Base markers */}
        {baseLocations.map((base) => (
          <Marker
            key={base.id}
            position={[base.position.x, base.position.y]}
            icon={createBaseIcon(base.id)}
            interactive={true}
          >
            <Popup>
              <div
                dir="rtl"
                className="text-sm"
                style={{ fontFamily: "Heebo, sans-serif" }}
              >
                <strong>{base.nameHe}</strong>
                <div style={{ color: "#71717a", fontSize: "12px" }}>
                  כוחות זמינים: {baseUnitCounts[base.id] ?? 0}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 7. Event markers */}
        {activeEvents.map((event) => {
          const isSelected = selectedEventId === event.id;
          const isUnattended =
            event.status === EventStatus.REPORTED &&
            event.assignedUnits.length === 0;

          return (
            <Marker
              key={event.id}
              position={[event.position.x, event.position.y]}
              icon={createEventIcon(
                event.type,
                event.severity,
                isSelected,
                isUnattended,
                event.resolveProgress,
              )}
              eventHandlers={{
                click: () => handleEventMarkerClick(event.id),
              }}
            >
              <Popup>
                <div
                  dir="rtl"
                  className="text-sm"
                  style={{ fontFamily: "Heebo, sans-serif" }}
                >
                  <strong>{eventTypeNames[event.type] ?? event.type}</strong>
                  <div style={{ color: "#71717a" }}>{event.locationName}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 8. Unit markers (front-most) */}
        {visibleUnits.map((unit) => {
          const isSelected = selectedUnitId === unit.id;

          return (
            <Marker
              key={unit.id}
              position={[unit.position.x, unit.position.y]}
              icon={createUnitIcon(unit.forceType, unit.status, isSelected)}
              eventHandlers={{
                click: () => handleUnitMarkerClick(unit),
              }}
            >
              <Popup>
                <div
                  dir="rtl"
                  className="text-sm"
                  style={{ fontFamily: "Heebo, sans-serif" }}
                >
                  <strong>{unit.name}</strong>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default CityMap;
