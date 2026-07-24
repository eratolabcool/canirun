export type VideoFamilySlug = "wan" | "hunyuan" | "ltx";
export type VideoTask = "t2v" | "i2v" | "v2v";
export type VideoPrecision = "bf16" | "fp16" | "fp8" | "int8" | "gguf";

export interface VideoModelVariant {
  slug: string;
  family: VideoFamilySlug;
  name: string;
  provider: string;
  summary: string;
  tasks: VideoTask[];
  baselineVramGb: number;
  minimumVramGb: number;
  recommendedVramGb: number;
  minimumRamGb: number;
  recommendedRamGb: number;
  storageGb: number;
  baselineWidth: number;
  baselineHeight: number;
  baselineFrames: number;
  baselineSteps: number;
  supportedPrecisions: VideoPrecision[];
  defaultPrecision: VideoPrecision;
  offloadSupported: boolean;
  preferredRuntime: string;
  optimizationFlags: string[];
  sourceUrl: string;
  sourceLabel: string;
  evidence: string;
  speedReference?: {
    gpu: string;
    speedIndex: number;
    seconds: number;
    width: number;
    height: number;
    frames: number;
    steps: number;
    precision: VideoPrecision;
  };
}

export interface VideoFamily {
  slug: VideoFamilySlug;
  name: string;
  provider: string;
  title: string;
  description: string;
  overview: string;
  strengths: string[];
  watchouts: string[];
  faq: Array<{ question: string; answer: string }>;
}

export interface CalculatorGpu {
  slug: string;
  name: string;
  vramGb: number;
  speedIndex: number;
  kind: "nvidia" | "apple" | "cloud";
}

export const calculatorGpus: CalculatorGpu[] = [
  { slug: "rtx-3060-12gb", name: "RTX 3060 12 GB", vramGb: 12, speedIndex: 13, kind: "nvidia" },
  { slug: "rtx-4070-super-12gb", name: "RTX 4070 Super 12 GB", vramGb: 12, speedIndex: 29, kind: "nvidia" },
  { slug: "rtx-3090-24gb", name: "RTX 3090 24 GB", vramGb: 24, speedIndex: 35, kind: "nvidia" },
  { slug: "rtx-4090-24gb", name: "RTX 4090 24 GB", vramGb: 24, speedIndex: 83, kind: "nvidia" },
  { slug: "rtx-5090-32gb", name: "RTX 5090 32 GB", vramGb: 32, speedIndex: 118, kind: "nvidia" },
  { slug: "a100-80gb", name: "A100 80 GB", vramGb: 80, speedIndex: 100, kind: "cloud" },
  { slug: "h100-80gb", name: "H100 80 GB", vramGb: 80, speedIndex: 210, kind: "cloud" },
  { slug: "mac-m4-pro-24gb", name: "Mac mini M4 Pro 24 GB", vramGb: 18, speedIndex: 18, kind: "apple" },
  { slug: "mac-m4-max-64gb", name: "Mac Studio M4 Max 64 GB", vramGb: 48, speedIndex: 48, kind: "apple" },
];

export const videoFamilies: VideoFamily[] = [
  {
    slug: "wan",
    name: "Wan Video",
    provider: "Alibaba Wan AI",
    title: "Wan AI Video System Requirements and GPU Guide",
    description: "Check Wan 2.1 and Wan 2.2 VRAM requirements, compatible GPUs, resolution limits, CPU offload, and practical ComfyUI settings.",
    overview: "Wan is one of the broadest open AI video families, spanning lightweight consumer-GPU models and 14B-class workflows that need aggressive quantization, offload, or professional hardware.",
    strengths: ["Strong text-to-video and image-to-video coverage", "Native ComfyUI workflows", "A practical 8 GB entry point with lightweight variants", "Large community ecosystem for FP8, GGUF, and accelerated LoRAs"],
    watchouts: ["The 14B model files can exceed 32 GB before encoders and VAE", "Frame count and 720p workflows raise peak memory sharply", "Community wrappers can behave differently from native ComfyUI workflows"],
    faq: [
      { question: "Can an RTX 3060 12GB run Wan?", answer: "Yes for lightweight Wan 1.3B and 5B workflows at conservative resolutions. Wan 14B normally requires quantization, CPU offload, and reduced frames, and is not a comfortable RTX 3060 workload." },
      { question: "How much VRAM does Wan 2.1 need?", answer: "ComfyUI documents an 8 GB entry point for Wan 2.1 1.3B. Wan 14B has much larger model files and is best planned around 24–32 GB or cloud hardware." },
      { question: "Does Wan support 720p?", answer: "Yes, but safe frame count and generation speed depend heavily on model size, precision, and available VRAM. Lower-memory GPUs should start at 480p or 540p." },
    ],
  },
  {
    slug: "hunyuan",
    name: "HunyuanVideo",
    provider: "Tencent Hunyuan",
    title: "HunyuanVideo VRAM Requirements and Compatible GPUs",
    description: "Compare original HunyuanVideo and HunyuanVideo 1.5 hardware requirements, model offload, 720p memory use, and recommended GPUs.",
    overview: "HunyuanVideo covers two very different local hardware tiers: the original model was designed around 45–60 GB peak VRAM, while HunyuanVideo 1.5 provides a much lower 14 GB entry point when model offload is enabled.",
    strengths: ["High-quality cinematic motion", "Official inference repositories", "HunyuanVideo 1.5 lowers the local entry point", "Clear official memory guidance for the original model"],
    watchouts: ["Original HunyuanVideo is not a normal consumer-GPU workload", "Official repositories focus on NVIDIA CUDA and Linux", "Offload lowers VRAM but increases RAM use and generation time"],
    faq: [
      { question: "Can 24GB VRAM run HunyuanVideo?", answer: "HunyuanVideo 1.5 can fit with model offload. The original HunyuanVideo official configuration lists 45 GB at 544×960 and 60 GB at 720×1280 for 129 frames, so 24 GB requires unofficial optimization and heavy compromises." },
      { question: "What GPU is recommended for HunyuanVideo?", answer: "For the original release, an 80 GB accelerator is the safe official target. For HunyuanVideo 1.5, 24 GB consumer GPUs are a more practical comfortable tier when offload is available." },
      { question: "Does HunyuanVideo run on Windows?", answer: "The official original repository documents Linux. Community ComfyUI workflows may run on Windows, but support and memory behavior should be treated separately from the official setup." },
    ],
  },
  {
    slug: "ltx",
    name: "LTX Video",
    provider: "Lightricks",
    title: "LTX Video System Requirements, VRAM and GPU Guide",
    description: "Check LTX Video 0.9.5 and LTX 2.3 local GPU requirements, FP8 options, RAM, storage, ComfyUI support, and Mac limitations.",
    overview: "LTX spans an efficient 2B generation model and the much larger LTX 2.3 audio-video system. That makes model version the most important input when deciding whether a GPU can run LTX locally.",
    strengths: ["Efficient legacy 2B workflows", "Native ComfyUI support", "Modern synchronized audio-video generation", "Distilled and FP8 variants for faster iteration"],
    watchouts: ["LTX 2.3 open-source requirements are far higher than older LTX Video versions", "LTX Desktop local mode requires NVIDIA hardware", "Apple Silicon desktop builds use API mode rather than local LTX 2.3 generation"],
    faq: [
      { question: "Can 16GB VRAM run LTX?", answer: "It can run older LTX Video and supported LTX Desktop local modes. For the full LTX 2.3 open-source pipeline, the official system requirements list 32 GB or more, so 16 GB should be treated as an optimized or API-assisted tier." },
      { question: "Can a Mac run LTX locally?", answer: "Older LTX Video code has had MPS support, but current LTX Desktop documentation places Apple Silicon in API-only mode for LTX 2.3. The exact answer depends on the model generation and runtime." },
      { question: "How much storage does LTX 2.3 need?", answer: "The open-source system requirements list 100 GB minimum and 200 GB recommended, while LTX Desktop asks for roughly 160 GB for weights, environment, and outputs." },
    ],
  },
];

export const videoModelVariants: VideoModelVariant[] = [
  {
    slug: "wan-2-1-1-3b",
    family: "wan",
    name: "Wan 2.1 1.3B",
    provider: "Alibaba Wan AI",
    summary: "The practical consumer-GPU entry point for local Wan text-to-video and image-to-video workflows.",
    tasks: ["t2v", "i2v"],
    baselineVramGb: 8,
    minimumVramGb: 8,
    recommendedVramGb: 12,
    minimumRamGb: 16,
    recommendedRamGb: 32,
    storageGb: 28,
    baselineWidth: 832,
    baselineHeight: 480,
    baselineFrames: 81,
    baselineSteps: 30,
    supportedPrecisions: ["bf16", "fp16", "fp8"],
    defaultPrecision: "fp8",
    offloadSupported: true,
    preferredRuntime: "ComfyUI native Wan workflow",
    optimizationFlags: ["Use the FP8 UMT5 encoder", "Enable model offload below 12 GB", "Start at 480p and 81 frames", "Use tiled VAE for longer clips"],
    sourceUrl: "https://docs.comfy.org/tutorials/video/wan/wan-video",
    sourceLabel: "ComfyUI Wan 2.1 documentation",
    evidence: "ComfyUI identifies the 1.3B release as an 8 GB VRAM entry point.",
    speedReference: { gpu: "RTX 4090", speedIndex: 83, seconds: 72, width: 512, height: 512, frames: 81, steps: 30, precision: "bf16" },
  },
  {
    slug: "wan-2-2-5b",
    family: "wan",
    name: "Wan 2.2 TI2V 5B",
    provider: "Alibaba Wan AI",
    summary: "A hybrid text and image-to-video model that ComfyUI positions as a good 8 GB offload workload.",
    tasks: ["t2v", "i2v"],
    baselineVramGb: 8,
    minimumVramGb: 8,
    recommendedVramGb: 16,
    minimumRamGb: 24,
    recommendedRamGb: 48,
    storageGb: 38,
    baselineWidth: 832,
    baselineHeight: 480,
    baselineFrames: 81,
    baselineSteps: 30,
    supportedPrecisions: ["fp16", "fp8", "gguf"],
    defaultPrecision: "fp8",
    offloadSupported: true,
    preferredRuntime: "ComfyUI native Wan 2.2 workflow",
    optimizationFlags: ["Keep native offloading enabled", "Use the FP8 text encoder", "Reduce frames before reducing width", "Use GGUF only with a compatible custom node"],
    sourceUrl: "https://docs.comfy.org/tutorials/video/wan/wan2_2",
    sourceLabel: "ComfyUI Wan 2.2 documentation",
    evidence: "ComfyUI states the 5B hybrid version should fit well on 8 GB VRAM with native offloading.",
  },
  {
    slug: "wan-2-1-14b",
    family: "wan",
    name: "Wan 2.1 14B",
    provider: "Alibaba Wan AI",
    summary: "The high-quality Wan tier, best suited to 24–32 GB GPUs, quantized workflows, or cloud accelerators.",
    tasks: ["t2v", "i2v", "v2v"],
    baselineVramGb: 26,
    minimumVramGb: 20,
    recommendedVramGb: 32,
    minimumRamGb: 48,
    recommendedRamGb: 64,
    storageGb: 75,
    baselineWidth: 832,
    baselineHeight: 480,
    baselineFrames: 81,
    baselineSteps: 30,
    supportedPrecisions: ["bf16", "fp16", "fp8", "gguf"],
    defaultPrecision: "fp8",
    offloadSupported: true,
    preferredRuntime: "ComfyUI WanVideoWrapper or native quantized workflow",
    optimizationFlags: ["Use FP8 or GGUF diffusion weights", "Offload the text encoder", "Keep batch size at 1", "Use 480p before attempting 720p"],
    sourceUrl: "https://docs.comfy.org/tutorials/video/wan/fun-control",
    sourceLabel: "ComfyUI Wan 2.1 Fun documentation",
    evidence: "ComfyUI notes a 32 GB-plus 14B model file and substantially higher VRAM needs than the 1.3B release.",
  },
  {
    slug: "hunyuan-video-original",
    family: "hunyuan",
    name: "HunyuanVideo Original",
    provider: "Tencent Hunyuan",
    summary: "The original high-memory HunyuanVideo release, documented around 45–60 GB peak VRAM for 129-frame workloads.",
    tasks: ["t2v"],
    baselineVramGb: 45,
    minimumVramGb: 45,
    recommendedVramGb: 80,
    minimumRamGb: 64,
    recommendedRamGb: 128,
    storageGb: 120,
    baselineWidth: 960,
    baselineHeight: 544,
    baselineFrames: 129,
    baselineSteps: 50,
    supportedPrecisions: ["bf16", "fp16", "fp8"],
    defaultPrecision: "bf16",
    offloadSupported: true,
    preferredRuntime: "Official HunyuanVideo inference on Linux",
    optimizationFlags: ["Use an 80 GB accelerator for the official path", "Enable Flash Attention", "Use 544×960 before 720p", "Treat consumer-GPU workflows as unofficial optimizations"],
    sourceUrl: "https://github.com/Tencent-Hunyuan/HunyuanVideo",
    sourceLabel: "Official HunyuanVideo repository",
    evidence: "Tencent lists 45 GB at 544×960×129 frames and 60 GB at 720×1280×129 frames, with 80 GB recommended.",
  },
  {
    slug: "hunyuan-video-1-5",
    family: "hunyuan",
    name: "HunyuanVideo 1.5",
    provider: "Tencent Hunyuan",
    summary: "A substantially more accessible Hunyuan release with a documented 14 GB minimum when model offload is enabled.",
    tasks: ["t2v", "i2v"],
    baselineVramGb: 16,
    minimumVramGb: 14,
    recommendedVramGb: 24,
    minimumRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 85,
    baselineWidth: 960,
    baselineHeight: 544,
    baselineFrames: 81,
    baselineSteps: 30,
    supportedPrecisions: ["bf16", "fp16", "fp8"],
    defaultPrecision: "fp8",
    offloadSupported: true,
    preferredRuntime: "Official HunyuanVideo 1.5 pipeline or ComfyUI",
    optimizationFlags: ["Enable model offload below 24 GB", "Install Flash Attention", "Use 32–64 GB system RAM", "Disable offload only when sufficient headroom exists"],
    sourceUrl: "https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5/blob/main/README_CN.md",
    sourceLabel: "Official HunyuanVideo 1.5 repository",
    evidence: "Tencent documents a 14 GB minimum with model offload enabled.",
  },
  {
    slug: "ltx-video-0-9-5-2b",
    family: "ltx",
    name: "LTX Video 0.9.5 2B",
    provider: "Lightricks",
    summary: "An efficient legacy LTX checkpoint for local ComfyUI experimentation on mainstream GPUs.",
    tasks: ["t2v", "i2v", "v2v"],
    baselineVramGb: 8,
    minimumVramGb: 8,
    recommendedVramGb: 12,
    minimumRamGb: 16,
    recommendedRamGb: 32,
    storageGb: 30,
    baselineWidth: 768,
    baselineHeight: 512,
    baselineFrames: 97,
    baselineSteps: 30,
    supportedPrecisions: ["bf16", "fp16", "fp8"],
    defaultPrecision: "fp16",
    offloadSupported: true,
    preferredRuntime: "ComfyUI native LTX Video workflow",
    optimizationFlags: ["Use detailed chronological prompts", "Keep dimensions divisible by 32", "Use frame counts divisible by 8 plus 1", "Stay below 720×1280 and 257 frames for the documented sweet spot"],
    sourceUrl: "https://docs.comfy.org/tutorials/video/ltxv",
    sourceLabel: "ComfyUI LTX 0.9.5 documentation",
    evidence: "ComfyUI packages the efficient 2B model as a native local workflow; memory values here are conservative planning estimates.",
  },
  {
    slug: "ltx-2-3-fp8",
    family: "ltx",
    name: "LTX 2.3 FP8",
    provider: "Lightricks",
    summary: "The optimized LTX 2.3 audio-video path for high-end consumer GPUs and cloud systems.",
    tasks: ["t2v", "i2v", "v2v"],
    baselineVramGb: 28,
    minimumVramGb: 16,
    recommendedVramGb: 32,
    minimumRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 160,
    baselineWidth: 1280,
    baselineHeight: 720,
    baselineFrames: 121,
    baselineSteps: 8,
    supportedPrecisions: ["fp8", "int8"],
    defaultPrecision: "fp8",
    offloadSupported: true,
    preferredRuntime: "LTX Desktop or ComfyUI LTX 2.3 workflow",
    optimizationFlags: ["Use the distilled FP8 checkpoint", "Prefer NVIDIA Ada or newer for FP8 kernels", "Keep 160 GB free for desktop installation", "Use API mode on Apple Silicon"],
    sourceUrl: "https://docs.ltx.io/open-source-model/getting-started/quick-start",
    sourceLabel: "Official LTX quick start",
    evidence: "LTX Desktop supports local generation on NVIDIA GPUs with at least 16 GB, while the full open-source pipeline publishes a higher 32 GB minimum.",
  },
  {
    slug: "ltx-2-3-full",
    family: "ltx",
    name: "LTX 2.3 Full",
    provider: "Lightricks",
    summary: "The full open-source LTX 2.3 pipeline for synchronized audio-video generation on professional hardware.",
    tasks: ["t2v", "i2v", "v2v"],
    baselineVramGb: 38,
    minimumVramGb: 32,
    recommendedVramGb: 80,
    minimumRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 200,
    baselineWidth: 1280,
    baselineHeight: 720,
    baselineFrames: 121,
    baselineSteps: 20,
    supportedPrecisions: ["bf16", "fp8", "int8"],
    defaultPrecision: "fp8",
    offloadSupported: true,
    preferredRuntime: "Official LTX 2.3 open-source pipeline",
    optimizationFlags: ["Use the distilled model for iteration", "Use a low-VRAM INT8 configuration on 32 GB GPUs", "Plan around CUDA 12.x", "Use an A100 or H100 for the recommended configuration"],
    sourceUrl: "https://docs.ltx.io/open-source-model/getting-started/system-requirements",
    sourceLabel: "Official LTX system requirements",
    evidence: "LTX lists 32 GB-plus VRAM, 32 GB RAM, and 100 GB storage as minimum, with A100/H100 and 64 GB RAM recommended.",
  },
];

export const resolutionPresets = [
  { slug: "480p", label: "480p · 832×480", width: 832, height: 480 },
  { slug: "540p", label: "540p · 960×544", width: 960, height: 544 },
  { slug: "720p", label: "720p · 1280×720", width: 1280, height: 720 },
  { slug: "1080p", label: "1080p · 1920×1080", width: 1920, height: 1080 },
] as const;

export const precisionMultipliers: Record<VideoPrecision, number> = {
  bf16: 1,
  fp16: 0.96,
  fp8: 0.68,
  int8: 0.62,
  gguf: 0.56,
};

export function getVideoFamily(slug: string) {
  return videoFamilies.find((family) => family.slug === slug);
}

export function getVideoModel(slug: string) {
  return videoModelVariants.find((model) => model.slug === slug);
}

export function modelsForFamily(family: VideoFamilySlug) {
  return videoModelVariants.filter((model) => model.family === family);
}
