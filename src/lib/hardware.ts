export * from "@canirun/compatibility";

import {
  applyOverrides as applyBaseOverrides,
  getGPUCategory as getBaseGPUCategory,
  getHardwareOverrides as getBaseHardwareOverrides,
} from "@canirun/compatibility";

/**
 * App-level compatibility shim for hardware records added ahead of the
 * upstream category matcher. Keep the selector and integrity tests aligned
 * without changing the package's public data contract.
 */
export function getGPUCategory(name: string): string {
  if (name === "Tesla V100") return "NVIDIA Datacenter";
  return getBaseGPUCategory(name);
}

/**
 * Preserve the package API while allowing client reports to apply the user's
 * saved hardware selections without duplicating override-loading logic.
 */
export function applyOverrides(
  hardware: Parameters<typeof applyBaseOverrides>[0],
  overrides: Parameters<typeof applyBaseOverrides>[1] = getBaseHardwareOverrides(),
): ReturnType<typeof applyBaseOverrides> {
  return applyBaseOverrides(hardware, overrides);
}
