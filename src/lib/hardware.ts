export * from "@canirun/compatibility";

import { getGPUCategory as getBaseGPUCategory } from "@canirun/compatibility";

/**
 * App-level compatibility shim for hardware records added ahead of the
 * upstream category matcher. Keep the selector and integrity tests aligned
 * without changing the package's public data contract.
 */
export function getGPUCategory(name: string): string {
  if (name === "Tesla V100") return "NVIDIA Datacenter";
  return getBaseGPUCategory(name);
}
