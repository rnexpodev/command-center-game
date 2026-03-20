import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Position } from "../engine/types";

/** Merge Tailwind classes with clsx */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a game tick as HH:MM */
export function formatGameTime(tick: number): string {
  const totalMinutes = tick;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Euclidean distance between two positions (lat/lng approximation) */
export function calculateDistance(a: Position, b: Position): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate travel time in ticks.
 * Speed is in "coordinate units per tick".
 */
export function calculateTravelTime(distance: number, speed: number): number {
  if (speed <= 0) return Infinity;
  return Math.ceil(distance / speed);
}

let idCounter = 0;

/** Generate a unique ID with an optional prefix */
export function generateId(prefix = "id"): string {
  idCounter += 1;
  return `${prefix}_${idCounter}_${Date.now().toString(36)}`;
}

/** Reset the ID counter (useful for tests) */
export function resetIdCounter(): void {
  idCounter = 0;
}
