import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEditorStore, type EditorEvent } from "@/store/editor-store";
import { EventType, Severity } from "@/engine/types";
import {
  severityColors,
  eventTypeSvgPaths,
  renderSvgIcon,
} from "@/data/map-icons";

const BEER_SHEVA_CENTER: [number, number] = [31.25, 34.79];
const DARK_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const iconCache = new Map<string, L.DivIcon>();

function createEditorEventIcon(eventType: string, severity: number): L.DivIcon {
  const key = `editor-${eventType}-${severity}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  const size = 28;
  const color = severityColors[severity] ?? "#71717a";
  const svgPath =
    eventTypeSvgPaths[eventType] ?? eventTypeSvgPaths.building_fire;
  const iconSvg = renderSvgIcon(
    svgPath,
    14,
    "#fff",
    eventType === "building_fire",
  );

  const html = `
    <div style="width:${size}px;height:${size}px;border-radius:50%;background:${color}33;border:2px solid ${color};box-shadow:0 0 8px ${color};display:flex;align-items:center;justify-content:center;">
      ${iconSvg}
    </div>
  `;

  const icon = L.divIcon({
    className: "editor-event-marker",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

  iconCache.set(key, icon);
  return icon;
}

/** Click handler that adds events to the selected wave */
function MapClickHandler() {
  const selectedWaveIndex = useEditorStore((s) => s.selectedWaveIndex);
  const addEventToWave = useEditorStore((s) => s.addEventToWave);

  useMapEvents({
    click(e) {
      if (selectedWaveIndex === null) return;

      const newEvent: EditorEvent = {
        type: EventType.BUILDING_FIRE,
        position: [e.latlng.lat, e.latlng.lng],
        severity: Severity.MEDIUM,
        locationName: "מיקום חדש",
      };
      addEventToWave(selectedWaveIndex, newEvent);
    },
  });

  return null;
}

export function EditorMap() {
  const waves = useEditorStore((s) => s.waves);
  const selectedWaveIndex = useEditorStore((s) => s.selectedWaveIndex);

  const currentEvents =
    selectedWaveIndex !== null ? (waves[selectedWaveIndex]?.events ?? []) : [];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-zinc-700">
      <MapContainer
        center={BEER_SHEVA_CENTER}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer url={DARK_TILE_URL} />
        <MapClickHandler />

        {currentEvents.map((ev, idx) => (
          <Marker
            key={`editor-ev-${idx}`}
            position={[ev.position[0], ev.position[1]]}
            icon={createEditorEventIcon(ev.type, ev.severity)}
          />
        ))}
      </MapContainer>

      {selectedWaveIndex === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60 pointer-events-none">
          <p className="text-zinc-400 text-sm">בחר גל כדי להוסיף אירועים</p>
        </div>
      )}
    </div>
  );
}
