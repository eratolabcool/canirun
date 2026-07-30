export const CANONICAL_ORIGIN = "https://www.canirun.app";

export const canIRunKeywordTiers = {
  oneWord: ["compatibility", "hardware", "GPU", "VRAM", "local"],
  twoWords: ["AI compatibility", "local AI", "GPU requirements", "hardware checker", "model requirements"],
  threeWords: ["Can I Run", "AI hardware checker", "local AI checker", "GPU compatibility checker", "model compatibility checker"],
  fourWords: ["Can I Run AI", "Can My GPU Run", "Can My PC Run", "Can This Model Run", "AI model hardware requirements"],
  fiveWords: ["Can I Run AI Locally", "Can I Run AI Video", "Can My GPU Run AI", "Can My PC Run AI", "Can I Run This Model"],
} as const;

const VIDEO_FAMILY_LABELS: Record<string, string> = {
  wan: "Wan AI Video",
  hunyuan: "HunyuanVideo",
  ltx: "LTX Video",
};

const NON_TARGET_PATH_PREFIXES = [
  "/privacy",
  "/terms",
  "/about",
  "/contact",
  "/disclaimer",
  "/license",
];

export interface ResolvedSeo {
  title: string;
  description: string;
  canonical: URL;
  keywords: string[];
}

function stripBrand(title: string): string {
  return title
    .replace(/\s+[—|-]\s+CanIRun(?:\.ai| Local)?$/i, "")
    .replace(/CanIRun\.ai/gi, "CanIRun")
    .trim();
}

function addBrand(title: string): string {
  if (/CanIRun$/i.test(title)) return title;
  const branded = `${title} — CanIRun`;
  return branded.length <= 68 ? branded : title;
}

function unique(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function shortenDescription(description: string): string {
  if (description.length <= 165) return description;
  const clipped = description.slice(0, 162).replace(/\s+\S*$/, "");
  return `${clipped}…`;
}

function extractModelName(baseTitle: string): string {
  return baseTitle
    .replace(/^Best PC and GPU for\s+/i, "")
    .replace(/\s+Local AI Models$/i, "")
    .trim();
}

function pageSpecificKeywords(pathname: string, baseTitle: string): string[] {
  if (pathname === "/") {
    return ["Can I Run AI Locally", "Can My PC Run AI", "Can My GPU Run AI", "local AI compatibility checker"];
  }

  if (pathname === "/ai-video") {
    return ["Can I Run AI Video", "AI video GPU requirements", "AI video VRAM calculator", "Can My GPU Run AI Video"];
  }

  const videoFamily = pathname.match(/^\/ai-video\/([^/]+)\/?$/)?.[1];
  if (videoFamily) {
    const familyName = VIDEO_FAMILY_LABELS[videoFamily] ?? baseTitle;
    return [
      `Can I Run ${familyName}`,
      `Can I Run ${familyName} Locally`,
      `${familyName} GPU requirements`,
      `${familyName} VRAM requirements`,
    ];
  }

  if (pathname === "/advisor") {
    return ["Can I Run This Model", "AI model hardware requirements", "Can This Model Run Locally", "AI hardware advisor"];
  }

  if (pathname.startsWith("/advisor/model/")) {
    const modelName = extractModelName(baseTitle);
    return [
      `Can I Run ${modelName}`,
      `Can I Run ${modelName} Locally`,
      `${modelName} system requirements`,
      `${modelName} GPU requirements`,
    ];
  }

  if (pathname.startsWith("/advisor/hardware/")) {
    const hardwareName = extractModelName(baseTitle);
    return [
      `Can I Run AI on ${hardwareName}`,
      `Can ${hardwareName} Run AI`,
      `${hardwareName} AI compatibility`,
      `${hardwareName} local AI models`,
    ];
  }

  if (pathname.startsWith("/model/")) {
    const modelName = extractModelName(baseTitle);
    return [
      `Can I Run ${modelName}`,
      `Can I Run ${modelName} Locally`,
      `${modelName} RAM requirements`,
      `${modelName} VRAM requirements`,
    ];
  }

  if (pathname === "/compare") {
    return ["Can I Run AI on This GPU", "Can My GPU Run AI", "compare AI GPUs", "AI GPU compatibility"];
  }

  if (pathname === "/docs") {
    return ["Can I Run AI", "Can I Run AI guide", "local AI hardware guide", "AI model requirements explained"];
  }

  return [];
}

function resolveTitle(pathname: string, rawTitle: string): string {
  const baseTitle = stripBrand(rawTitle);

  if (pathname === "/") return addBrand("Can I Run AI Locally? Check Your PC, GPU and Mac");
  if (pathname === "/ai-video") return addBrand("Can I Run AI Video? GPU and VRAM Calculator");
  if (pathname === "/advisor") return addBrand("Can I Run This AI Model? Hardware Requirements");
  if (pathname === "/compare") return addBrand("Can I Run AI on This GPU? Compare Devices");
  if (pathname === "/docs") return addBrand("Can I Run AI? Local AI Hardware Guide");

  const videoFamily = pathname.match(/^\/ai-video\/([^/]+)\/?$/)?.[1];
  if (videoFamily) {
    const familyName = VIDEO_FAMILY_LABELS[videoFamily] ?? baseTitle;
    return addBrand(`Can I Run ${familyName}? GPU and VRAM Guide`);
  }

  if (pathname.startsWith("/advisor/model/")) {
    const modelName = extractModelName(baseTitle);
    return addBrand(`Can I Run ${modelName} Locally? Hardware Requirements`);
  }

  if (pathname.startsWith("/advisor/hardware/")) {
    const hardwareName = extractModelName(baseTitle);
    return addBrand(`Can I Run AI on ${hardwareName}? Compatibility Guide`);
  }

  if (pathname.startsWith("/model/")) {
    const modelName = extractModelName(baseTitle);
    return addBrand(`Can I Run ${modelName} Locally?`);
  }

  if (NON_TARGET_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return addBrand(baseTitle);
  }

  return /\bCan I Run\b/i.test(baseTitle)
    ? addBrand(baseTitle)
    : addBrand(`Can I Run AI? ${baseTitle}`);
}

function resolveDescription(pathname: string, rawDescription: string, title: string): string {
  if (/\bCan I Run\b/i.test(rawDescription)) return shortenDescription(rawDescription);

  const baseTitle = stripBrand(title)
    .replace(/^Can I Run\s+/i, "")
    .replace(/\?(.+)?$/, "")
    .trim();

  if (pathname.startsWith("/model/") || pathname.startsWith("/advisor/model/")) {
    return shortenDescription(`Can I Run ${baseTitle} locally? Check minimum RAM, recommended VRAM, storage, compatible GPUs, Macs, quantization options, and practical performance guidance.`);
  }

  if (pathname.startsWith("/advisor/hardware/")) {
    return shortenDescription(`Can I Run AI on ${baseTitle}? See compatible local AI models, usable memory, workload limits, and practical upgrade guidance for this hardware.`);
  }

  if (NON_TARGET_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return shortenDescription(rawDescription);
  }

  return shortenDescription(`Can I Run AI locally? ${rawDescription}`);
}

export function resolveSeo(
  pathname: string,
  rawTitle: string,
  rawDescription: string,
  extraKeywords: string[] = [],
): ResolvedSeo {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const baseTitle = stripBrand(rawTitle);
  const title = resolveTitle(normalizedPath, rawTitle);
  const description = resolveDescription(normalizedPath, rawDescription, title);
  const canonical = new URL(normalizedPath || "/", CANONICAL_ORIGIN);
  const tierKeywords = Object.values(canIRunKeywordTiers).flat();
  const keywords = unique([
    ...tierKeywords,
    ...pageSpecificKeywords(normalizedPath, baseTitle),
    ...extraKeywords,
  ]);

  return { title, description, canonical, keywords };
}
