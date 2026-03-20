import type { Position } from "@/engine/types";
import { ForceType } from "@/engine/types";

export interface BaseLocation {
  id: string;
  name: string;
  nameHe: string;
  position: Position;
  forceTypes: ForceType[];
}

export const baseLocations: BaseLocation[] = [
  {
    id: "fire-station",
    name: "Fire Station",
    nameHe: "תחנת כיבוי",
    position: { x: 31.248, y: 34.793 },
    forceTypes: [ForceType.FIRE, ForceType.RESCUE, ForceType.HOMEFRONT],
  },
  {
    id: "police-station",
    name: "Police Station",
    nameHe: "תחנת משטרה",
    position: { x: 31.251, y: 34.789 },
    forceTypes: [ForceType.POLICE],
  },
  {
    id: "soroka-hospital",
    name: "Soroka Hospital",
    nameHe: "בית חולים סורוקה",
    position: { x: 31.258, y: 34.8 },
    forceTypes: [ForceType.MAGEN_DAVID],
  },
  {
    id: "municipal-compound",
    name: "Municipal Compound",
    nameHe: "מתחם העירייה",
    position: { x: 31.252, y: 34.791 },
    forceTypes: [
      ForceType.ENGINEERING,
      ForceType.WELFARE,
      ForceType.EVACUATION,
      ForceType.INFRASTRUCTURE,
    ],
  },
];

export const baseSvgPaths: Record<string, string> = {
  "fire-station":
    "M3 21h18M5 21V7l7-4 7 4v14M9 9h2M13 9h2M9 13h2M13 13h2M10 21v-4h4v4",
  "police-station": "M3 21h18M5 21V8l7-5 7 5v13M10 12h4M12 10v4M8 21v-4h8v4",
  "soroka-hospital": "M3 21h18M5 21V7l7-4 7 4v14M12 7v6M9 10h6M9 17h6",
  "municipal-compound":
    "M3 21h18M4 21V9h6v12M10 21V5h4v16M14 21V9h6v12M7 12h1M7 15h1M12 8h1M12 11h1M12 14h1M17 12h1M17 15h1",
};
