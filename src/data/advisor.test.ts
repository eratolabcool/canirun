import { describe, expect, it } from "vitest";
import {
  advisorModels,
  hardwareProfiles,
  seoPages,
  fitLevel,
  getAdvisorModel,
  getHardwareProfile,
  hardwareForModel,
} from "./advisor";

describe("local AI hardware advisor", () => {
  it("keeps model and hardware slugs unique", () => {
    expect(new Set(advisorModels.map((model) => model.slug)).size).toBe(advisorModels.length);
    expect(new Set(hardwareProfiles.map((hardware) => hardware.slug)).size).toBe(hardwareProfiles.length);
    expect(new Set(seoPages.map((page) => page.slug)).size).toBe(seoPages.length);
  });

  it("marks an RTX 3060 as recommended for a quantized Llama 3.1 8B preset", () => {
    const model = getAdvisorModel("llama-3-1-8b");
    const hardware = getHardwareProfile("rtx-3060-12gb");
    expect(model).toBeDefined();
    expect(hardware).toBeDefined();
    expect(fitLevel(model!, hardware!)).toBe("recommended");
  });

  it("does not recommend an RTX 3060 for a 32B DeepSeek preset", () => {
    const model = getAdvisorModel("deepseek-r1-distill-qwen-32b");
    const hardware = getHardwareProfile("rtx-3060-12gb");
    expect(model).toBeDefined();
    expect(hardware).toBeDefined();
    expect(fitLevel(model!, hardware!)).toBe("not-recommended");
  });

  it("returns affordable compatible options before premium options", () => {
    const model = getAdvisorModel("flux-1-dev");
    expect(model).toBeDefined();
    const recommendations = hardwareForModel(model!);
    expect(recommendations.length).toBeGreaterThan(0);
    for (let index = 1; index < recommendations.length; index += 1) {
      expect(recommendations[index - 1].hardware.priceTier).toBeLessThanOrEqual(
        recommendations[index].hardware.priceTier,
      );
    }
  });

  it("only references existing model and hardware records from SEO pages", () => {
    for (const page of seoPages) {
      if (page.modelSlug) expect(getAdvisorModel(page.modelSlug)).toBeDefined();
      if (page.hardwareSlug) expect(getHardwareProfile(page.hardwareSlug)).toBeDefined();
    }
  });
});
