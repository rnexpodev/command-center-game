import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGameStore } from "@/store/game-store";
import { useUIStore } from "@/store/ui-store";
import {
  Severity,
  EventStatus,
  ForceType,
  UnitStatus,
  type GameEvent,
} from "@/engine/types";

/** Beer Sheva center coordinates */
const BEER_SHEVA_CENTER: [number, number] = [31.25, 34.79];

/** Dark basemap tiles */
const DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

/** Severity-based colors for event markers */
const severityColors: Record<number, string> = {
  [Severity.LOW]: "#3b82f6",
  [Severity.MEDIUM]: "#eab308",
  [Severity.HIGH]: "#f97316",
  [Severity.CRITICAL]: "#ef4444",
};

/** Force type colors for unit markers */
const forceTypeColors: Record<string, string> = {
  [ForceType.FIRE]: "#ef4444",
  [ForceType.MAGEN_DAVID]: "#f87171",
  [ForceType.POLICE]: "#3b82f6",
  [ForceType.RESCUE]: "#f97316",
  [ForceType.ENGINEERING]: "#eab308",
  [ForceType.WELFARE]: "#ec4899",
  [ForceType.INFRASTRUCTURE]: "#f59e0b",
  [ForceType.EVACUATION]: "#22c55e",
  [ForceType.HOMEFRONT]: "#06b6d4",
};

/** Create a custom event marker icon */
function createEventIcon(
  color: string,
  isSelected: boolean,
  isUnattended: boolean,
): L.DivIcon {
  const size = isSelected ? 20 : 14;
  const pulseClass = isUnattended ? "animate-ping" : "";

  return L.divIcon({
    className: "custom-event-marker",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        ${isUnattended ? `<div class="${pulseClass}" style="position:absolute;inset:-4px;border-radius:50%;background:${color};opacity:0.4;"></div>` : ""}
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.3)"};box-shadow:0 0 ${isSelected ? "12" : "6"}px ${color};"></div>
      </div>
    `,
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
  });
}

/** Create a unit marker icon */
function createUnitIcon(color: string, isSelected: boolean): L.DivIcon {
  const size = 10;

  return L.divIcon({
    className: "custom-unit-marker",
    html: `
      <div style="width:${size}px;height:${size}px;border-radius:2px;background:${color};border:1.5px solid ${isSelected ? "#fff" : "rgba(255,255,255,0.5)"};transform:rotate(45deg);box-shadow:0 0 4px ${color};"></div>
    `,
    iconSize: [size + 4, size + 4],
    iconAnchor: [(size + 4) / 2, (size + 4) / 2],
  });
}

/** Component to handle map fly-to on event selection */
function MapFlyTo({ event }: { event: GameEvent | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (event) {
      map.flyTo([event.position.x, event.position.y], 15, {
        duration: 0.5,
      });
    }
  }, [event, map]);

  return null;
}

export function CityMap() {
  const events = useGameStore((s) => s.events);
  const units = useGameStore((s) => s.units);
  const selectedEventId = useUIStore((s) => s.selectedEventId);
  const selectedUnitId = useUIStore((s) => s.selectedUnitId);
  const selectEvent = useUIStore((s) => s.selectEvent);
  const selectUnit = useUIStore((s) => s.selectUnit);
  const dispatchUnit = useGameStore((s) => s.dispatchUnit);

  const activeEvents = events.filter((e) => e.status !== EventStatus.RESOLVED);
  const visibleUnits = units.filter((u) => u.status !== UnitStatus.UNAVAILABLE);
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  function handleEventMarkerClick(eventId: string) {
    // If a unit is selected, dispatch it to this event
    if (selectedUnitId) {
      dispatchUnit(selectedUnitId, eventId);
      selectUnit(null);
      selectEvent(eventId);
      return;
    }
    selectEvent(selectedEventId === eventId ? null : eventId);
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={BEER_SHEVA_CENTER}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer url={DARK_TILE_URL} />

        <MapFlyTo event={selectedEvent} />

        {/* Event markers */}
        {activeEvents.map((event) => {
          const color = severityColors[event.severity] ?? "#71717a";
          const isSelected = selectedEventId === event.id;
          const isUnattended =
            event.status === EventStatus.REPORTED &&
            event.assignedUnits.length === 0;

          return (
            <Marker
              key={event.id}
              position={[event.position.x, event.position.y]}
              icon={createEventIcon(color, isSelected, isUnattended)}
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
                  <strong>{event.locationName}</strong>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Threat radius circles */}
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

        {/* Unit markers */}
        {visibleUnits.map((unit) => {
          const color = forceTypeColors[unit.forceType] ?? "#71717a";
          const isSelected = selectedUnitId === unit.id;

          return (
            <Marker
              key={unit.id}
              position={[unit.position.x, unit.position.y]}
              icon={createUnitIcon(color, isSelected)}
              eventHandlers={{
                click: () => {
                  if (unit.status === UnitStatus.AVAILABLE) {
                    selectUnit(selectedUnitId === unit.id ? null : unit.id);
                  }
                },
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
