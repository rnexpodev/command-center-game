import { ForceType, EventType } from "@/engine/types";

// ── SVG Path Data ──────────────────────────────────────────────────────

export const forceTypeSvgPaths: Record<string, string> = {
  [ForceType.FIRE]: "M12 2c-3 5-7 8-7 13a7 7 0 0 0 14 0c0-5-4-8-7-13z",
  [ForceType.MAGEN_DAVID]: "M12 5v14M5 12h14",
  [ForceType.POLICE]: "M12 3l8 4v6c0 5.5-8 9-8 9s-8-3.5-8-9V7z",
  [ForceType.RESCUE]: "M3 18h18M5 18v-7a7 7 0 0 1 14 0v7",
  [ForceType.ENGINEERING]:
    "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l2.3-2.3a5 5 0 0 1-6.5 6.5L7 20l-3-3 6.5-6.5a5 5 0 0 1 6.5-6.5z",
  [ForceType.WELFARE]:
    "M12 21c-5-4.5-10-8-10-12.5C2 5 5 3 8 3c2 0 3.5 1 4 2.5C12.5 4 14 3 16 3c3 0 6 2 6 5.5 0 4.5-5 8-10 12.5z",
  [ForceType.INFRASTRUCTURE]: "M13 2L3 14h8l-1 8 10-12h-8z",
  [ForceType.EVACUATION]:
    "M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M4 12h16M7 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  [ForceType.HOMEFRONT]: "M12 3l8 4v6c0 5.5-8 9-8 9s-8-3.5-8-9V7zM9 12l2 2 4-4",
};

export const eventTypeSvgPaths: Record<string, string> = {
  [EventType.BUILDING_FIRE]: "M12 2c-3 5-7 8-7 13a7 7 0 0 0 14 0c0-5-4-8-7-13z",
  [EventType.BUILDING_COLLAPSE]:
    "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M10 8h1M13 8h1M10 12h1M13 12h1M10 16h1",
  [EventType.TRAFFIC_ACCIDENT]:
    "M7 17h10M5 9l2-4h10l2 4M4 9h16v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zM7 14h.01M17 14h.01",
  [EventType.GAS_LEAK]:
    "M17.5 8A5.5 5.5 0 0 0 7 8.5a4 4 0 0 0 .5 8h10a3 3 0 0 0 0-6z",
  [EventType.POWER_OUTAGE]: "M13 2L3 14h8l-1 8 10-12h-8zM2 2l20 20",
  [EventType.ROAD_BLOCKAGE]: "M4 6h16v10H4zM4 11h16M9 6v10M15 6v10",
  [EventType.HAZMAT]: "M12 3L2 21h20zM12 9v5M12 17h.01",
  [EventType.FLOODING]:
    "M2 6c1.5 1.5 3 2 5 2s3.5-.5 5-2 3-2 5-2 3.5.5 5 2M2 12c1.5 1.5 3 2 5 2s3.5-.5 5-2 3-2 5-2 3.5.5 5 2M2 18c1.5 1.5 3 2 5 2s3.5-.5 5-2 3-2 5-2 3.5.5 5 2",
  [EventType.MASS_CASUALTY]: "M12 5v14M5 12h14M8 8l8 8M16 8l-8 8",
  [EventType.EVACUATION_NEEDED]:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  [EventType.MISSILE_DIRECT_HIT]:
    "M12 2l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2z",
  [EventType.MISSILE_OPEN_AREA]:
    "M12 2l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2z",
  [EventType.MISSILE_NEAR_BUILDING]:
    "M12 2l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2z",
  [EventType.MISSILE_NEAR_SENSITIVE]:
    "M12 2l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2z",
  [EventType.INTERCEPTION_DEBRIS]:
    "M12 2l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2z",
  [EventType.MISSILE_ROAD_HIT]:
    "M12 2l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2z",
  [EventType.MISSILE_COMPOUND]:
    "M12 2l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2z",
};

/** Fill-based icons (flame, heart) — all others use stroke */
const fillBasedForceTypes = new Set<string>([
  ForceType.FIRE,
  ForceType.WELFARE,
]);

const fillBasedEventTypes = new Set<string>([EventType.BUILDING_FIRE]);

// ── SVG Rendering ──────────────────────────────────────────────────────

/**
 * Render an SVG icon as an HTML string (for Leaflet DivIcon).
 * @param pathData - SVG path `d` attribute(s), may contain multiple paths separated by "M"
 * @param size - width/height in pixels
 * @param color - stroke or fill color
 * @param fillBased - if true, uses fill instead of stroke rendering
 */
export function renderSvgIcon(
  pathData: string,
  size: number,
  color: string,
  fillBased = false,
): string {
  const attrs = fillBased
    ? `fill="${color}" stroke="none"`
    : `fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ${attrs}><path d="${pathData}"/></svg>`;
}

// ── Color Records ──────────────────────────────────────────────────────

export const severityColors: Record<number, string> = {
  1: "#3b82f6",
  2: "#eab308",
  3: "#f97316",
  4: "#ef4444",
};

export const forceTypeColors: Record<string, string> = {
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

// ── Hebrew Name Records ────────────────────────────────────────────────

export const eventTypeNames: Record<string, string> = {
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
  [EventType.MISSILE_DIRECT_HIT]: "פגיעה ישירה",
  [EventType.MISSILE_OPEN_AREA]: "נפילה בשטח פתוח",
  [EventType.MISSILE_NEAR_BUILDING]: "נפילה סמוך למבנה",
  [EventType.MISSILE_NEAR_SENSITIVE]: "נפילה ליד מתקן רגיש",
  [EventType.INTERCEPTION_DEBRIS]: "שברי יירוט",
  [EventType.MISSILE_ROAD_HIT]: "פגיעה בכביש",
  [EventType.MISSILE_COMPOUND]: "פגיעה מורכבת",
};

export const forceTypeNames: Record<string, string> = {
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

// ── React Icon Components ──────────────────────────────────────────────

import React from "react";

interface IconProps {
  type: string;
  className?: string;
  size?: number;
  color?: string;
}

export function ForceTypeIcon({
  type,
  className,
  size = 16,
  color,
}: IconProps): React.ReactElement | null {
  const pathData = forceTypeSvgPaths[type];
  if (!pathData) return null;

  const isFillBased = fillBasedForceTypes.has(type);
  const c = color ?? forceTypeColors[type] ?? "currentColor";

  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: isFillBased ? c : "none",
      stroke: isFillBased ? "none" : c,
      strokeWidth: isFillBased ? undefined : 2.5,
      strokeLinecap: isFillBased ? undefined : "round",
      strokeLinejoin: isFillBased ? undefined : "round",
      className,
    },
    React.createElement("path", { d: pathData }),
  );
}

export function EventTypeIcon({
  type,
  className,
  size = 16,
  color,
}: IconProps): React.ReactElement | null {
  const pathData = eventTypeSvgPaths[type];
  if (!pathData) return null;

  const isFillBased = fillBasedEventTypes.has(type);
  const c = color ?? severityColors[3] ?? "currentColor";

  return React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: isFillBased ? c : "none",
      stroke: isFillBased ? "none" : c,
      strokeWidth: isFillBased ? undefined : 2.5,
      strokeLinecap: isFillBased ? undefined : "round",
      strokeLinejoin: isFillBased ? undefined : "round",
      className,
    },
    React.createElement("path", { d: pathData }),
  );
}
