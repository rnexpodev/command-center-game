export { TUTORIAL_SCENARIO } from "./tutorial";
export { COMPLEX_SINGLE_SCENARIO } from "./complex-single";
export { DUAL_EMERGENCY_SCENARIO } from "./dual-emergency";
export { SURGE_SCENARIO } from "./surge";

import type { Scenario } from "../../engine/types";
import { TUTORIAL_SCENARIO } from "./tutorial";
import { COMPLEX_SINGLE_SCENARIO } from "./complex-single";
import { DUAL_EMERGENCY_SCENARIO } from "./dual-emergency";
import { SURGE_SCENARIO } from "./surge";

/** All available scenarios, ordered by difficulty */
export const ALL_SCENARIOS: Scenario[] = [
  TUTORIAL_SCENARIO,
  DUAL_EMERGENCY_SCENARIO,
  COMPLEX_SINGLE_SCENARIO,
  SURGE_SCENARIO,
];
