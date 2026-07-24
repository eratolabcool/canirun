export type ModelCategory = "llm" | "image" | "video" | "audio" | "workflow";
export type FitLevel = "recommended" | "minimum" | "not-recommended";

export interface AdvisorModel {
  slug: string;
  name: string;
  provider: string;
  category: ModelCategory;
  summary: string;
  minVramGb: number;
  recommendedVramGb: number;
  minRamGb: number;
  recommendedRamGb: number;
  storageGb: number;
  testedPreset: string;
  sourceUrl: string;
  notes: string[];
}

export interface HardwareProfile {
  slug: string;
  name: string;
  kind: "gpu" | "mac" | "cloud";
  vramGb: number;
  ramGb: number;
  unifiedMemory: boolean;
  priceTier: 1 | 2 | 3 | 4 | 5;
  role: string;
  summary: string;
  limitations: string[];
}

export interface SeoPage {
  slug: string;
  kind: "compatibility" | "requirements" | "hardware" | "memory" | "recommendation";
  title: string;
  description: string;
  h1: string;
  answer: string;
  modelSlug?: string;
  hardwareSlug?: string;
  ramGb?: number;
}

export const categoryLabels: Record<ModelCategory, string> = {
  llm: "Language models",
  image: "Image generation",
  video: "Video generation",
  audio: "Speech and audio",
  workflow: "ComfyUI workflows",
};

export const advisorModels: AdvisorModel[] = [
  {
    slug: "llama-3-1-8b",
    name: "Llama 3.1 8B",
    provider: "Meta",
    category: "llm",
    summary: "A practical general-purpose local chat model with broad tool support.",
    minVramGb: 6,
    recommendedVramGb: 10,
    minRamGb: 16,
    recommendedRamGb: 32,
    storageGb: 8,
    testedPreset: "Q4_K_M, 4k context",
    sourceUrl: "https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct",
    notes: ["A 4-bit quantization is assumed.", "Long contexts increase memory use."],
  },
  {
    slug: "qwen3-8b",
    name: "Qwen3 8B",
    provider: "Qwen",
    category: "llm",
    summary: "A compact multilingual reasoning and coding model for everyday local use.",
    minVramGb: 6,
    recommendedVramGb: 10,
    minRamGb: 16,
    recommendedRamGb: 32,
    storageGb: 9,
    testedPreset: "Q4_K_M, 8k context",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3-8B",
    notes: ["Thinking mode can require a larger context window.", "A 4-bit GGUF build is assumed."],
  },
  {
    slug: "qwen3-32b",
    name: "Qwen3 32B",
    provider: "Qwen",
    category: "llm",
    summary: "A much stronger local reasoning model that benefits from 24 GB-class GPUs.",
    minVramGb: 20,
    recommendedVramGb: 24,
    minRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 24,
    testedPreset: "Q4_K_M, 8k context",
    sourceUrl: "https://huggingface.co/Qwen/Qwen3-32B",
    notes: ["Partial CPU offload works but is substantially slower.", "Context and KV cache are not included in the model file size."],
  },
  {
    slug: "deepseek-r1-distill-qwen-32b",
    name: "DeepSeek R1 Distill Qwen 32B",
    provider: "DeepSeek",
    category: "llm",
    summary: "A reasoning-focused 32B model with similar memory needs to other 32B dense models.",
    minVramGb: 20,
    recommendedVramGb: 24,
    minRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 24,
    testedPreset: "Q4_K_M, 8k context",
    sourceUrl: "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
    notes: ["Reasoning traces can consume large contexts.", "24 GB VRAM is the practical single-GPU target."],
  },
  {
    slug: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    provider: "Stability AI",
    category: "image",
    summary: "A mature image generation ecosystem with good support on consumer GPUs.",
    minVramGb: 8,
    recommendedVramGb: 12,
    minRamGb: 16,
    recommendedRamGb: 32,
    storageGb: 15,
    testedPreset: "1024px, fp16, memory efficient attention",
    sourceUrl: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
    notes: ["ControlNet and multiple LoRAs add memory pressure.", "Lower resolutions can run on less VRAM."],
  },
  {
    slug: "flux-1-dev",
    name: "FLUX.1 dev",
    provider: "Black Forest Labs",
    category: "image",
    summary: "A high-quality 12B image model that is comfortable on 16–24 GB hardware when optimized.",
    minVramGb: 12,
    recommendedVramGb: 24,
    minRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 35,
    testedPreset: "FP8 or quantized workflow, 1024px",
    sourceUrl: "https://huggingface.co/black-forest-labs/FLUX.1-dev",
    notes: ["Full BF16 loading is roughly a 24 GB-class workload.", "Quantized ComfyUI workflows can lower the entry point."],
  },
  {
    slug: "qwen-image",
    name: "Qwen-Image",
    provider: "Qwen",
    category: "image",
    summary: "A multilingual image generation and editing model with strong text rendering.",
    minVramGb: 16,
    recommendedVramGb: 24,
    minRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 40,
    testedPreset: "Quantized or memory-offloaded Diffusers workflow",
    sourceUrl: "https://huggingface.co/Qwen/Qwen-Image",
    notes: ["The text encoder and diffusion pipeline make total memory use workload-dependent.", "Use CPU offload below 24 GB VRAM."],
  },
  {
    slug: "wan-2-1-t2v-1-3b",
    name: "Wan 2.1 T2V 1.3B",
    provider: "Wan AI",
    category: "video",
    summary: "An accessible entry point for local text-to-video experiments at 480p.",
    minVramGb: 8,
    recommendedVramGb: 12,
    minRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 25,
    testedPreset: "480p, model offload enabled",
    sourceUrl: "https://huggingface.co/Wan-AI/Wan2.1-T2V-1.3B",
    notes: ["Generation speed is much slower than image models.", "System RAM matters when model offload is enabled."],
  },
  {
    slug: "wan-2-1-t2v-14b",
    name: "Wan 2.1 T2V 14B",
    provider: "Wan AI",
    category: "video",
    summary: "A demanding local video model aimed at 24–48 GB-class systems.",
    minVramGb: 24,
    recommendedVramGb: 48,
    minRamGb: 64,
    recommendedRamGb: 128,
    storageGb: 80,
    testedPreset: "Quantized 480p workflow with offload",
    sourceUrl: "https://huggingface.co/Wan-AI/Wan2.1-T2V-14B",
    notes: ["A 24 GB card is a compromise configuration.", "Higher resolution and frame counts increase memory and runtime sharply."],
  },
  {
    slug: "hunyuanvideo",
    name: "HunyuanVideo",
    provider: "Tencent",
    category: "video",
    summary: "A large open video foundation model best suited to professional GPUs or cloud instances.",
    minVramGb: 24,
    recommendedVramGb: 48,
    minRamGb: 64,
    recommendedRamGb: 128,
    storageGb: 100,
    testedPreset: "Quantized workflow with CPU offload",
    sourceUrl: "https://huggingface.co/tencent/HunyuanVideo",
    notes: ["Consumer 24 GB GPUs require aggressive optimization.", "Cloud GPUs are often more economical for occasional use."],
  },
  {
    slug: "whisper-large-v3",
    name: "Whisper large-v3",
    provider: "OpenAI",
    category: "audio",
    summary: "High-quality multilingual speech recognition that runs well on midrange GPUs.",
    minVramGb: 6,
    recommendedVramGb: 8,
    minRamGb: 16,
    recommendedRamGb: 32,
    storageGb: 6,
    testedPreset: "FP16 transcription, batch size 1",
    sourceUrl: "https://huggingface.co/openai/whisper-large-v3",
    notes: ["Faster-Whisper can reduce memory use.", "Batch transcription needs additional headroom."],
  },
  {
    slug: "musicgen-medium",
    name: "MusicGen Medium",
    provider: "Meta",
    category: "audio",
    summary: "A local text-to-music model suitable for short generations on 8–12 GB GPUs.",
    minVramGb: 8,
    recommendedVramGb: 12,
    minRamGb: 16,
    recommendedRamGb: 32,
    storageGb: 8,
    testedPreset: "Short stereo generation, fp16",
    sourceUrl: "https://huggingface.co/facebook/musicgen-medium",
    notes: ["Longer audio durations increase memory and generation time.", "CPU execution is possible but slow."],
  },
  {
    slug: "kokoro-tts",
    name: "Kokoro TTS",
    provider: "Hexgrad",
    category: "audio",
    summary: "A compact local text-to-speech model that works on modest PCs and Macs.",
    minVramGb: 2,
    recommendedVramGb: 4,
    minRamGb: 8,
    recommendedRamGb: 16,
    storageGb: 3,
    testedPreset: "Single voice generation",
    sourceUrl: "https://huggingface.co/hexgrad/Kokoro-82M",
    notes: ["A dedicated GPU is optional.", "CPU performance is adequate for many personal workflows."],
  },
  {
    slug: "comfyui-flux-workflow",
    name: "ComfyUI FLUX Workflow",
    provider: "ComfyUI",
    category: "workflow",
    summary: "A realistic FLUX workflow budget including the model, text encoders, VAE, and optional LoRAs.",
    minVramGb: 16,
    recommendedVramGb: 24,
    minRamGb: 32,
    recommendedRamGb: 64,
    storageGb: 50,
    testedPreset: "FP8 or GGUF UNet, one LoRA, 1024px",
    sourceUrl: "https://docs.comfy.org/tutorials/flux/flux-1-dev",
    notes: ["Workflow nodes can move components between GPU and system RAM.", "Multiple ControlNets or LoRAs need extra headroom."],
  },
];

export const hardwareProfiles: HardwareProfile[] = [
  {
    slug: "rtx-3060-12gb",
    name: "RTX 3060 12 GB",
    kind: "gpu",
    vramGb: 12,
    ramGb: 32,
    unifiedMemory: false,
    priceTier: 1,
    role: "Minimum-value build",
    summary: "The low-cost used-market baseline for 7B–8B LLMs, SDXL, Whisper, and lighter video workflows.",
    limitations: ["Not a good fit for 32B models fully on GPU.", "FLUX and large video models require offload or quantization."],
  },
  {
    slug: "rtx-4070-super-12gb",
    name: "RTX 4070 Super 12 GB",
    kind: "gpu",
    vramGb: 12,
    ramGb: 32,
    unifiedMemory: false,
    priceTier: 2,
    role: "Best efficiency",
    summary: "Faster than the RTX 3060 while keeping power use reasonable, but still limited by 12 GB VRAM.",
    limitations: ["VRAM capacity, not compute speed, blocks many 24 GB workloads.", "Avoid buying it specifically for 32B or large video models."],
  },
  {
    slug: "rtx-4090-24gb",
    name: "RTX 4090 24 GB",
    kind: "gpu",
    vramGb: 24,
    ramGb: 64,
    unifiedMemory: false,
    priceTier: 4,
    role: "Professional value",
    summary: "A strong single-GPU workstation for 32B quantized LLMs, FLUX, Qwen-Image, and optimized video generation.",
    limitations: ["Large video models still need quantization or offload.", "High power draw and physical size."],
  },
  {
    slug: "rtx-5090-32gb",
    name: "RTX 5090 32 GB",
    kind: "gpu",
    vramGb: 32,
    ramGb: 64,
    unifiedMemory: false,
    priceTier: 5,
    role: "Fastest consumer option",
    summary: "A premium local AI GPU with enough memory for comfortable 32B LLMs and more ambitious image and video workflows.",
    limitations: ["Still below the ideal 48 GB target for the largest video models.", "Poor value when workloads are occasional."],
  },
  {
    slug: "mac-mini-m4-pro-24gb",
    name: "Mac mini M4 Pro 24 GB",
    kind: "mac",
    vramGb: 0,
    ramGb: 24,
    unifiedMemory: true,
    priceTier: 2,
    role: "Low-power desktop",
    summary: "Quiet and efficient for 7B–14B LLMs, transcription, TTS, and moderate image workflows using unified memory.",
    limitations: ["Not all CUDA-first projects support Metal equally well.", "24 GB unified memory does not mean all 24 GB is available to a model."],
  },
  {
    slug: "mac-studio-m4-max-64gb",
    name: "Mac Studio M4 Max 64 GB",
    kind: "mac",
    vramGb: 0,
    ramGb: 64,
    unifiedMemory: true,
    priceTier: 4,
    role: "Large-memory quiet workstation",
    summary: "A power-efficient option for large quantized LLMs where memory capacity matters more than CUDA compatibility.",
    limitations: ["Image and video ecosystems remain more mature on NVIDIA.", "Training and custom CUDA extensions may not work."],
  },
  {
    slug: "cloud-gpu-48gb",
    name: "Cloud GPU 48 GB",
    kind: "cloud",
    vramGb: 48,
    ramGb: 96,
    unifiedMemory: false,
    priceTier: 3,
    role: "No-purchase option",
    summary: "Rent a 48 GB GPU for large video, image, or LLM workloads without buying a workstation.",
    limitations: ["Ongoing hourly cost.", "Uploads, privacy, and instance setup require planning."],
  },
];

export function getAdvisorModel(slug: string) {
  return advisorModels.find((model) => model.slug === slug);
}

export function getHardwareProfile(slug: string) {
  return hardwareProfiles.find((hardware) => hardware.slug === slug);
}

export function effectiveModelMemory(hardware: HardwareProfile) {
  return hardware.unifiedMemory ? Math.floor(hardware.ramGb * 0.75) : hardware.vramGb;
}

export function fitLevel(model: AdvisorModel, hardware: HardwareProfile): FitLevel {
  const available = effectiveModelMemory(hardware);
  const hasSystemRam = hardware.ramGb >= model.minRamGb;
  if (available >= model.recommendedVramGb && hardware.ramGb >= model.recommendedRamGb) return "recommended";
  if (available >= model.minVramGb && hasSystemRam) return "minimum";
  return "not-recommended";
}

export function fitLabel(level: FitLevel) {
  if (level === "recommended") return "Recommended";
  if (level === "minimum") return "Runs with compromises";
  return "Not recommended";
}

export function hardwareForModel(model: AdvisorModel) {
  return hardwareProfiles
    .map((hardware) => ({ hardware, fit: fitLevel(model, hardware) }))
    .filter((item) => item.fit !== "not-recommended")
    .sort((a, b) => a.hardware.priceTier - b.hardware.priceTier || effectiveModelMemory(a.hardware) - effectiveModelMemory(b.hardware));
}

export function modelsForHardware(hardware: HardwareProfile) {
  return advisorModels
    .map((model) => ({ model, fit: fitLevel(model, hardware) }))
    .sort((a, b) => {
      const rank: Record<FitLevel, number> = { recommended: 0, minimum: 1, "not-recommended": 2 };
      return rank[a.fit] - rank[b.fit] || a.model.name.localeCompare(b.model.name);
    });
}

export const seoPages: SeoPage[] = [
  {
    slug: "can-rtx-3060-run-llama-3-1-8b",
    kind: "compatibility",
    modelSlug: "llama-3-1-8b",
    hardwareSlug: "rtx-3060-12gb",
    title: "Can RTX 3060 Run Llama 3.1 8B? Settings and RAM Guide",
    description: "See whether an RTX 3060 12 GB can run Llama 3.1 8B locally, including quantization, RAM, storage, and expected compromises.",
    h1: "Can RTX 3060 run Llama 3.1 8B?",
    answer: "Yes. The 12 GB RTX 3060 is a practical match for a 4-bit Llama 3.1 8B build and leaves useful headroom for context and desktop overhead.",
  },
  {
    slug: "can-rtx-3060-run-deepseek-r1",
    kind: "compatibility",
    modelSlug: "deepseek-r1-distill-qwen-32b",
    hardwareSlug: "rtx-3060-12gb",
    title: "Can RTX 3060 Run DeepSeek R1 32B Locally?",
    description: "Check the realistic RTX 3060 requirements for DeepSeek R1 Distill Qwen 32B, including CPU offload and better GPU options.",
    h1: "Can RTX 3060 run DeepSeek R1 32B?",
    answer: "Not fully on the GPU. A 12 GB RTX 3060 can only run the 32B distill with heavy CPU offload and adequate system RAM, which reduces speed sharply. A 24 GB GPU is the practical target.",
  },
  {
    slug: "can-mac-mini-m4-pro-run-qwen3-8b",
    kind: "compatibility",
    modelSlug: "qwen3-8b",
    hardwareSlug: "mac-mini-m4-pro-24gb",
    title: "Can Mac mini M4 Pro Run Qwen3 8B? Unified Memory Guide",
    description: "Learn how Qwen3 8B runs on a 24 GB Mac mini M4 Pro, which quantization to use, and how much unified memory remains available.",
    h1: "Can Mac mini M4 Pro run Qwen3 8B?",
    answer: "Yes. A 24 GB Mac mini M4 Pro is well suited to a 4-bit Qwen3 8B model through MLX, Ollama, or llama.cpp, with enough memory for normal desktop use and a useful context window.",
  },
  {
    slug: "best-gpu-for-deepseek-r1",
    kind: "recommendation",
    modelSlug: "deepseek-r1-distill-qwen-32b",
    title: "Best GPU for DeepSeek R1 32B: Cheapest, Value, and Pro Picks",
    description: "Compare the minimum, value, professional, Mac, and cloud hardware choices for running DeepSeek R1 Distill Qwen 32B locally.",
    h1: "Best GPU for DeepSeek R1 32B",
    answer: "Start at 24 GB VRAM for a comfortable single-GPU setup. A used 24 GB card is usually the value choice, while 32 GB improves context headroom and 48 GB cloud GPUs make sense for occasional workloads.",
  },
  {
    slug: "llama-3-1-8b-system-requirements",
    kind: "requirements",
    modelSlug: "llama-3-1-8b",
    title: "Llama 3.1 8B System Requirements: GPU, RAM, and Storage",
    description: "Minimum and recommended hardware for Llama 3.1 8B, covering VRAM, system RAM, storage, quantization, and local runtimes.",
    h1: "Llama 3.1 8B system requirements",
    answer: "For a 4-bit build, plan for at least 6 GB of usable model memory and 16 GB of system RAM. A 10–12 GB GPU with 32 GB RAM is the more comfortable everyday configuration.",
  },
  {
    slug: "flux-system-requirements",
    kind: "requirements",
    modelSlug: "flux-1-dev",
    title: "FLUX.1 dev System Requirements: VRAM, RAM, and GPU Guide",
    description: "Estimate the GPU, VRAM, RAM, and storage needed for FLUX.1 dev in Diffusers or ComfyUI, including quantized workflows.",
    h1: "FLUX.1 dev system requirements",
    answer: "A quantized or FP8 workflow can start around 12–16 GB VRAM, while 24 GB is the comfortable target for higher-quality workflows with fewer offload compromises.",
  },
  {
    slug: "rtx-4070-local-ai-models",
    kind: "hardware",
    hardwareSlug: "rtx-4070-super-12gb",
    title: "RTX 4070 Super Local AI Models: What Fits in 12 GB VRAM?",
    description: "See which LLM, image, video, speech, and ComfyUI workloads fit on an RTX 4070 Super with 12 GB VRAM.",
    h1: "Which local AI models run on RTX 4070 Super?",
    answer: "The RTX 4070 Super is fast for models that fit inside 12 GB, including 7B–8B LLMs, SDXL, Whisper, MusicGen, and lighter video models. Its main limitation is VRAM capacity, not compute speed.",
  },
  {
    slug: "32gb-ram-local-ai-models",
    kind: "memory",
    ramGb: 32,
    title: "Local AI Models for 32 GB RAM: LLM, Image, Audio, and Video",
    description: "Find local AI models that work well on a PC or Mac with 32 GB system RAM and learn when GPU VRAM still becomes the limiting factor.",
    h1: "What local AI models can run with 32 GB RAM?",
    answer: "32 GB system RAM is a strong baseline for 7B–14B quantized LLMs, SDXL, Whisper, MusicGen, and smaller video models. Large 32B LLMs and 14B video models still need more memory or aggressive offload.",
  },
  {
    slug: "can-rtx-5090-run-wan-2-1-14b",
    kind: "compatibility",
    modelSlug: "wan-2-1-t2v-14b",
    hardwareSlug: "rtx-5090-32gb",
    title: "Can RTX 5090 Run Wan 2.1 14B? VRAM and Workflow Guide",
    description: "Check how Wan 2.1 14B runs on an RTX 5090 32 GB, including quantization, offload, RAM, and when a 48 GB cloud GPU is better.",
    h1: "Can RTX 5090 run Wan 2.1 14B?",
    answer: "Yes, with an optimized or quantized workflow. The RTX 5090 has enough VRAM to make Wan 2.1 14B practical, but 64 GB system RAM and selective offload are still recommended for longer or higher-resolution generations.",
  },
];

export const advisorDisclaimer =
  "Memory figures are practical estimates for the listed preset, not guarantees. Runtime, quantization, context length, resolution, workflow nodes, drivers, and operating-system overhead can change real usage.";
