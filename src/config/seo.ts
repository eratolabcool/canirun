export const CANONICAL_ORIGIN = "https://www.canirun.app";

/**
 * Search-intent vocabulary used for content planning, titles, descriptions,
 * internal links, and llms.txt. These terms are intentionally not emitted as
 * a meta keywords tag.
 */
export const canIRunKeywordTiers = {
  oneWord: ["compatibility", "hardware", "GPU", "VRAM", "local"],
  twoWords: ["AI compatibility", "local AI", "GPU requirements"],
  threeWords: ["Can I Run", "AI hardware checker"],
  fourWords: ["Can I Run AI", "Can My GPU Run"],
  fiveWords: ["Can I Run AI Locally", "Can I Run AI Video", "Can I Run This Model"],
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
  searchTerms: string[];
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

function extractSubjectName(baseTitle: string): string {
  return stripBrand(baseTitle)
    .replace(/^Best PC and GPU for\s+/i, "")
    .replace(/\s+Local AI Models$/i, "")
    .trim();
}

function pageSpecificSearchTerms(pathname: string, baseTitle: string): string[] {
  if (pathname === "/") {
    return ["Can I Run AI Locally", "Can My PC Run AI", "Can My GPU Run AI"];
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
    return ["Can I Run This Model", "Can This Model Run Locally", "AI model hardware requirements"];
  }

  if (pathname.startsWith("/advisor/model/")) {
    const modelName = extractSubjectName(baseTitle);
    return [
      `Can I Run ${modelName}`,
      `Can I Run ${modelName} Locally`,
      `${modelName} system requirements`,
      `${modelName} GPU requirements`,
    ];
  }

  if (pathname.startsWith("/advisor/hardware/")) {
    const hardwareName = extractSubjectName(baseTitle);
    return [
      `Can I Run AI on ${hardwareName}`,
      `Can ${hardwareName} Run AI`,
      `${hardwareName} AI compatibility`,
      `${hardwareName} local AI models`,
    ];
  }

  if (pathname.startsWith("/model/")) {
    const modelName = extractSubjectName(baseTitle);
    return [
      `Can I Run ${modelName}`,
      `Can I Run ${modelName} Locally`,
      `${modelName} RAM requirements`,
      `${modelName} VRAM requirements`,
    ];
  }

  if (pathname === "/compare") {
    return ["Can I Run AI on This GPU", "Can My GPU Run AI", "AI GPU compatibility"];
  }

  if (pathname === "/docs") {
    return ["Can I Run AI", "Can I Run AI guide", "local AI hardware guide"];
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
    const modelName = extractSubjectName(baseTitle);
    return addBrand(`Can I Run ${modelName} Locally? Hardware Requirements`);
  }

  if (pathname.startsWith("/advisor/hardware/")) {
    const hardwareName = extractSubjectName(baseTitle);
    return addBrand(`Can I Run AI on ${hardwareName}? Compatibility Guide`);
  }

  if (pathname.startsWith("/model/")) {
    const modelName = extractSubjectName(baseTitle);
    return addBrand(`Can I Run ${modelName} Locally?`);
  }

  if (NON_TARGET_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return addBrand(baseTitle);
  }

  return /\bCan I Run\b/i.test(baseTitle)
    ? addBrand(baseTitle)
    : addBrand(`Can I Run AI? ${baseTitle}`);
}

function resolveDescription(pathname: string, rawDescription: string, rawTitle: string): string {
  if (/\bCan I Run\b/i.test(rawDescription)) return shortenDescription(rawDescription);

  const subjectName = extractSubjectName(rawTitle);

  if (pathname.startsWith("/model/") || pathname.startsWith("/advisor/model/")) {
    return shortenDescription(`Can I Run ${subjectName} locally? Check minimum RAM, recommended VRAM, storage, compatible GPUs, Macs, quantization options, and practical performance guidance.`);
  }

  if (pathname.startsWith("/advisor/hardware/")) {
    return shortenDescription(`Can I Run AI on ${subjectName}? See compatible local AI models, usable memory, workload limits, and practical upgrade guidance for this hardware.`);
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
  extraSearchTerms: string[] = [],
): ResolvedSeo {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const baseTitle = stripBrand(rawTitle);
  const title = resolveTitle(normalizedPath, rawTitle);
  const description = resolveDescription(normalizedPath, rawDescription, rawTitle);
  const canonical = new URL(normalizedPath || "/", CANONICAL_ORIGIN);
  const tierSearchTerms = Object.values(canIRunKeywordTiers).flat();
  const searchTerms = unique([
    ...tierSearchTerms,
    ...pageSpecificSearchTerms(normalizedPath, baseTitle),
    ...extraSearchTerms,
  ]);

  return { title, description, canonical, searchTerms };
}
