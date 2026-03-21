// ===== Population & Shelter Data =====
// Static data for Beer Sheva civilian simulation

/** Population per neighborhood (keyed by neighborhood ID from city.ts) */
export const neighborhoodPopulation: Record<string, number> = {
  old_city: 12000,
  neve_noi: 18000,
  ramot: 35000,
  neve_zeev: 25000,
  dalet: 15000,
  gimmel: 14000,
  bet: 10000,
  industrial: 2000,
  nachal_beka: 20000,
  omer_junction: 5000,
};

/** Total city population */
export const TOTAL_POPULATION = Object.values(neighborhoodPopulation).reduce(
  (sum, pop) => sum + pop,
  0,
);

/** A public shelter definition */
export interface ShelterDef {
  id: string;
  nameHe: string;
  position: [number, number];
  capacity: number;
  neighborhoodId: string;
}

/** Beer Sheva public shelters spread across the city */
export const shelters: ShelterDef[] = [
  {
    id: "shelter_old_city",
    nameHe: "מקלט העיר העתיקה",
    position: [31.244, 34.792],
    capacity: 3000,
    neighborhoodId: "old_city",
  },
  {
    id: "shelter_ramot_north",
    nameHe: "מקלט רמות צפון",
    position: [31.268, 34.814],
    capacity: 5000,
    neighborhoodId: "ramot",
  },
  {
    id: "shelter_ramot_south",
    nameHe: "מקלט רמות דרום",
    position: [31.263, 34.81],
    capacity: 4000,
    neighborhoodId: "ramot",
  },
  {
    id: "shelter_neve_zeev",
    nameHe: "מקלט נווה זאב",
    position: [31.271, 34.777],
    capacity: 4500,
    neighborhoodId: "neve_zeev",
  },
  {
    id: "shelter_dalet",
    nameHe: "מקלט שכונה ד׳",
    position: [31.257, 34.796],
    capacity: 3000,
    neighborhoodId: "dalet",
  },
  {
    id: "shelter_nachal_beka",
    nameHe: "מקלט נחל בקע",
    position: [31.274, 34.799],
    capacity: 3500,
    neighborhoodId: "nachal_beka",
  },
  {
    id: "shelter_neve_noi",
    nameHe: "מקלט נווה נוי",
    position: [31.237, 34.779],
    capacity: 3000,
    neighborhoodId: "neve_noi",
  },
  {
    id: "shelter_gimmel",
    nameHe: "מקלט שכונה ג׳",
    position: [31.254, 34.786],
    capacity: 2500,
    neighborhoodId: "gimmel",
  },
];
