import { describe, expect, it } from "vitest";
import { CANONICAL_ORIGIN, canIRunKeywordTiers, resolveSeo } from "./seo";

function wordCount(value: string): number {
  return value.trim().split(/\s+/).length;
}

describe("Can I Run SEO strategy", () => {
  it("uses the www canonical origin", () => {
    expect(CANONICAL_ORIGIN).toBe("https://www.canirun.app");
    expect(resolveSeo("/ai-video/", "Anything", "Anything").canonical.href)
      .toBe("https://www.canirun.app/ai-video");
  });

  it("keeps the keyword tiers at their declared word counts", () => {
    expect(canIRunKeywordTiers.oneWord.every((keyword) => wordCount(keyword) === 1)).toBe(true);
    expect(canIRunKeywordTiers.twoWords.every((keyword) => wordCount(keyword) === 2)).toBe(true);
    expect(canIRunKeywordTiers.threeWords.every((keyword) => wordCount(keyword) === 3)).toBe(true);
    expect(canIRunKeywordTiers.fourWords.every((keyword) => wordCount(keyword) === 4)).toBe(true);
    expect(canIRunKeywordTiers.fiveWords.every((keyword) => wordCount(keyword) === 5)).toBe(true);
  });

  it("builds Can I Run titles for the main search-intent routes", () => {
    expect(resolveSeo("/", "Legacy", "Legacy").title).toContain("Can I Run AI Locally?");
    expect(resolveSeo("/ai-video", "Legacy", "Legacy").title).toContain("Can I Run AI Video?");
    expect(resolveSeo("/ai-video/wan", "Legacy", "Legacy").title).toContain("Can I Run Wan AI Video?");
    expect(resolveSeo("/advisor", "Legacy", "Legacy").title).toContain("Can I Run This AI Model?");
    expect(resolveSeo("/compare", "Legacy", "Legacy").title).toContain("Can I Run AI on This GPU?");
    expect(resolveSeo("/docs", "Legacy", "Legacy").title).toContain("Can I Run AI?");
  });

  it("builds model and hardware long-tail metadata", () => {
    const modelSeo = resolveSeo(
      "/advisor/model/qwen",
      "Best PC and GPU for Qwen 3 — CanIRun Local",
      "Minimum and recommended hardware.",
    );
    expect(modelSeo.title).toContain("Can I Run Qwen 3 Locally?");
    expect(modelSeo.description).toContain("Can I Run Qwen 3 locally?");
    expect(modelSeo.keywords).toContain("Can I Run Qwen 3");

    const hardwareSeo = resolveSeo(
      "/advisor/hardware/rtx-4090",
      "RTX 4090 Local AI Models — CanIRun Local",
      "Compatible models.",
    );
    expect(hardwareSeo.title).toContain("Can I Run AI on RTX 4090?");
    expect(hardwareSeo.description).toContain("Can I Run AI on RTX 4090?");
    expect(hardwareSeo.description).not.toContain("AI on AI on");
  });

  it("does not force commercial keywords onto legal pages", () => {
    const legalSeo = resolveSeo("/privacy", "Privacy Policy — CanIRun.ai", "Read the privacy policy.");
    expect(legalSeo.title).toBe("Privacy Policy — CanIRun");
    expect(legalSeo.description).toBe("Read the privacy policy.");
  });
});
