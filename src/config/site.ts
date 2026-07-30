import { CANONICAL_ORIGIN } from "@/config/seo";

export const siteConfig = {
  name: "CanIRun AI Compatibility Checker",
  shortName: "CanIRun",
  question: "Can I Run AI locally?",
  url: CANONICAL_ORIGIN,
  description:
    "Can I Run AI locally on my PC, GPU, or Mac? Detect your hardware, check compatible local AI models, estimate performance, and compare practical upgrades.",
  repositoryUrl: "https://github.com/eratolabcool/canirun",
} as const;
