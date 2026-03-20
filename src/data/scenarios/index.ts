export { TUTORIAL_SCENARIO } from "./tutorial";
export { COMPLEX_SINGLE_SCENARIO } from "./complex-single";
export { DUAL_EMERGENCY_SCENARIO } from "./dual-emergency";
export { SURGE_SCENARIO } from "./surge";

// Missile scenarios
export {
  MISSILE_SINGLE_HIT,
  MISSILE_SHORT_BARRAGE,
  MISSILE_NEAR_SCHOOL,
  MISSILE_OLD_BUILDING,
  MISSILE_INTERCEPTION_DEBRIS,
  MISSILE_INFRASTRUCTURE,
  MISSILE_HEAVY_BARRAGE,
  MISSILE_UNCERTAIN,
  MISSILE_COMMERCIAL,
  MISSILE_BALLISTIC,
  MISSILE_SCENARIOS,
} from "./missile-scenarios";

// Missile support modules
export { MISSILE_IMPACT_CATEGORIES } from "./missile-categories";
export type { MissileImpactCategory } from "./missile-categories";
export { fillTemplate } from "./missile-info-templates";

import type { Scenario } from "../../engine/types";
import { TUTORIAL_SCENARIO } from "./tutorial";
import { COMPLEX_SINGLE_SCENARIO } from "./complex-single";
import { DUAL_EMERGENCY_SCENARIO } from "./dual-emergency";
import { SURGE_SCENARIO } from "./surge";
import { MISSILE_SCENARIOS } from "./missile-scenarios";

/** All available scenarios, ordered by difficulty */
export const ALL_SCENARIOS: Scenario[] = [
  TUTORIAL_SCENARIO,
  DUAL_EMERGENCY_SCENARIO,
  COMPLEX_SINGLE_SCENARIO,
  SURGE_SCENARIO,
  ...MISSILE_SCENARIOS,
];
