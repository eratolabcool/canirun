import { describe, expect, it } from "vitest";
import { calculateVideoFit, chooseRecommendedPrecision, estimatePeakVramGb } from "./video-calculator";
import { calculatorGpus, precisionMultipliers, resolutionPresets, videoModelVariants } from "../data/video-models";

const model = videoModelVariants.find((item) => item.slug === "wan-2-1-1-3b")!;
const gpu3060 = calculatorGpus.find((item) => item.slug === "rtx-3060-12gb")!;
const gpu4090 = calculatorGpus.find((item) => item.slug === "rtx-4090-24gb")!;
const mac = calculatorGpus.find((item) => item.slug === "mac-m4-pro-24gb")!;
const resolution = resolutionPresets.find((item) => item.slug === "480p")!;

function input(overrides = {}) {
  return {
    model,
    gpu: gpu3060,
    resolution,
    task: "t2v" as const,
    precision: "fp8" as const,
    durationSeconds: 5,
    fps: 16,
    batchSize: 1,
    systemRamGb: 32,
    offload: true,
    resolutions: [...resolutionPresets],
    precisionMultipliers,
    ...overrides,
  };
}

describe("AI video calculator", () => {
  it("raises memory when task or batch size becomes heavier", () => {
    const base = estimatePeakVramGb(model, resolution, 81, "fp8", true, "t2v", 1, precisionMultipliers);
    const heavier = estimatePeakVramGb(model, resolution, 81, "fp8", true, "v2v", 2, precisionMultipliers);
    expect(heavier).toBeGreaterThan(base);
  });

  it("recommends the highest-quality precision that fits", () => {
    const precision = chooseRecommendedPrecision(model, gpu4090, resolution, 81, true, "t2v", 1, precisionMultipliers);
    expect(precision).toBe("bf16");
  });

  it("returns a practical local verdict for Wan 1.3B on RTX 3060", () => {
    const result = calculateVideoFit(input());
    expect(["recommended", "compromise"]).toContain(result.status);
    expect(result.nativeRuntimeBlocked).toBe(false);
    expect(result.maximumFrames).not.toBeNull();
  });

  it("blocks documented unsupported Apple runtime profiles", () => {
    const ltx = videoModelVariants.find((item) => item.slug === "ltx-2-3-full")!;
    const result = calculateVideoFit(input({ model: ltx, gpu: mac, systemRamGb: 64 }));
    expect(result.status).toBe("blocked");
    expect(result.nativeRuntimeBlocked).toBe(true);
    expect(result.generationTimeLowSeconds).toBeNull();
    expect(result.maximumResolution).toBeNull();
  });
});
