import type { Position } from "../engine/types";

/** A neighborhood or district in the city */
export interface Neighborhood {
  id: string;
  nameHe: string;
  position: Position;
  population: number;
}

/** A key landmark (station, hospital, school, etc.) */
export interface Landmark {
  id: string;
  nameHe: string;
  type:
    | "fire_station"
    | "police_station"
    | "hospital"
    | "school"
    | "government"
    | "commercial";
  position: Position;
}

/** Full city data */
export interface CityData {
  id: string;
  nameHe: string;
  center: Position;
  neighborhoods: Neighborhood[];
  landmarks: Landmark[];
}

/**
 * Beer Sheva city data.
 * Coordinates are based around the real Beer Sheva center [31.25, 34.79].
 * x = latitude, y = longitude.
 */
export const BEER_SHEVA: CityData = {
  id: "beer_sheva",
  nameHe: "באר שבע",
  center: { x: 31.252, y: 34.791 },

  neighborhoods: [
    {
      id: "old_city",
      nameHe: "העיר העתיקה",
      position: { x: 31.243, y: 34.791 },
      population: 12000,
    },
    {
      id: "neve_noi",
      nameHe: "נווה נוי",
      position: { x: 31.238, y: 34.778 },
      population: 18000,
    },
    {
      id: "ramot",
      nameHe: "רמות",
      position: { x: 31.265, y: 34.812 },
      population: 35000,
    },
    {
      id: "neve_zeev",
      nameHe: "נווה זאב",
      position: { x: 31.27, y: 34.775 },
      population: 25000,
    },
    {
      id: "dalet",
      nameHe: "שכונה ד'",
      position: { x: 31.258, y: 34.795 },
      population: 15000,
    },
    {
      id: "gimmel",
      nameHe: "שכונה ג'",
      position: { x: 31.255, y: 34.785 },
      population: 14000,
    },
    {
      id: "bet",
      nameHe: "שכונה ב'",
      position: { x: 31.25, y: 34.788 },
      population: 10000,
    },
    {
      id: "industrial",
      nameHe: "האזור התעשייתי",
      position: { x: 31.235, y: 34.805 },
      population: 2000,
    },
    {
      id: "nachal_beka",
      nameHe: "נחל בקע",
      position: { x: 31.275, y: 34.798 },
      population: 20000,
    },
    {
      id: "omer_junction",
      nameHe: "צומת אומר",
      position: { x: 31.26, y: 34.82 },
      population: 5000,
    },
  ],

  landmarks: [
    {
      id: "fire_station_1",
      nameHe: "תחנת כיבוי אש ראשית",
      type: "fire_station",
      position: { x: 31.248, y: 34.793 },
    },
    {
      id: "police_station_1",
      nameHe: "תחנת משטרה מרכזית",
      type: "police_station",
      position: { x: 31.251, y: 34.789 },
    },
    {
      id: "soroka_hospital",
      nameHe: "בית חולים סורוקה",
      type: "hospital",
      position: { x: 31.258, y: 34.8 },
    },
    {
      id: "school_1",
      nameHe: "בית ספר מקיף אלון",
      type: "school",
      position: { x: 31.262, y: 34.808 },
    },
    {
      id: "school_2",
      nameHe: "בית ספר רמות",
      type: "school",
      position: { x: 31.267, y: 34.815 },
    },
    {
      id: "city_hall",
      nameHe: "עיריית באר שבע",
      type: "government",
      position: { x: 31.252, y: 34.791 },
    },
    {
      id: "bgu",
      nameHe: "אוניברסיטת בן גוריון",
      type: "school",
      position: { x: 31.262, y: 34.802 },
    },
    {
      id: "grand_canyon",
      nameHe: "קניון הנגב (גרנד קניון)",
      type: "commercial",
      position: { x: 31.245, y: 34.812 },
    },
  ],
};

/** Get a neighborhood by ID */
export function getNeighborhood(id: string): Neighborhood | undefined {
  return BEER_SHEVA.neighborhoods.find((n) => n.id === id);
}

/** Get a landmark by ID */
export function getLandmark(id: string): Landmark | undefined {
  return BEER_SHEVA.landmarks.find((l) => l.id === id);
}
