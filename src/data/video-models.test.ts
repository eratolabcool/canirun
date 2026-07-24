import { describe, expect, it } from "vitest";
import {
  calculatorGpus,
  modelsForFamily,
  precisionMultipliers,
  resolutionPresets,
  videoFamilies,
  videoModelVariants,
} from "./video-models";

describe("AI video planning data", () => {
  it("keeps family, model, GPU, and resolution slugs unique", () => {
    expect(new Set(videoFamilies.map((item) => item.slug)).size).toBe(videoFamilies.length);
    expect(new Set(videoModelVariants.map((item) => item.slug)).size).toBe(videoModelVariants.length);
    expect(new Set(calculatorGpus.map((item) => item.slug)).size).toBe(calculatorGpus.length);
    expect(new Set(resolutionPresets.map((item) => item.slug)).size).toBe(resolutionPresets.length);
  });

  it("ships Wan, Hunyuan, and LTX as the first complete families", () => {
    expect(videoFamilies.map((item) => item.slug).sort()).toEqual(["hunyuan", "ltx", "wan"]);
    for (const family of videoFamilies) {
      expect(modelsForFamily(family.slug).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps minimum requirements below comfortable recommendations", () => {
    for (const model of videoModelVariants) {
      expect(model.minimumVramGb).toBeLessThanOrEqual(model.recommendedVramGb);
      expect(model.minimumRamGb).toBeLessThanOrEqual(model.recommendedRamGb);
      expect(model.supportedPrecisions).toContain(model.defaultPrecision);
      expect(model.sourceUrl).toMatch(/^https:\/\//);
    }
  });

  it("models lower precision as lower memory pressure", () => {
    expect(precisionMultipliers.fp8).toBeLessThan(precisionMultipliers.fp16);
    expect(precisionMultipliers.int8).toBeLessThan(precisionMultipliers.bf16);
    expect(precisionMultipliers.gguf).toBeLessThan(precisionMultipliers.fp8);
  });
});
