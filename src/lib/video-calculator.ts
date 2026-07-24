export type VideoPrecision = "bf16" | "fp16" | "fp8" | "int8" | "gguf";
export type VideoTask = "t2v" | "i2v" | "v2v";
export type VideoFitStatus = "recommended" | "compromise" | "blocked";

export interface VideoCalculatorModel {
  slug: string;
  family: string;
  name: string;
  summary: string;
  tasks: VideoTask[];
  baselineVramGb: number;
  minimumVramGb: number;
  recommendedVramGb: number;
  minimumRamGb: number;
  recommendedRamGb: number;
  baselineWidth: number;
  baselineHeight: number;
  baselineFrames: number;
  baselineSteps: number;
  supportedPrecisions: VideoPrecision[];
  defaultPrecision: VideoPrecision;
  offloadSupported: boolean;
  preferredRuntime: string;
  optimizationFlags: string[];
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

export interface VideoCalculatorGpu {
  slug: string;
  name: string;
  vramGb: number;
  speedIndex: number;
  kind: "nvidia" | "apple" | "cloud";
}

export interface VideoResolution {
  slug: string;
  label: string;
  width: number;
  height: number;
}

export interface VideoCalculationInput {
  model: VideoCalculatorModel;
  gpu: VideoCalculatorGpu;
  resolution: VideoResolution;
  task: VideoTask;
  precision: VideoPrecision;
  durationSeconds: number;
  fps: number;
  batchSize: number;
  systemRamGb: number;
  offload: boolean;
  resolutions: VideoResolution[];
  precisionMultipliers: Record<VideoPrecision, number>;
}

export interface VideoCalculationResult {
  status: VideoFitStatus;
  verdict: string;
  headline: string;
  summary: string;
  estimatedVramLowGb: number;
  estimatedVramHighGb: number;
  generationTimeLowSeconds: number | null;
  generationTimeHighSeconds: number | null;
  timeConfidence: string;
  maximumResolution: VideoResolution | null;
  maximumFrames: number | null;
  recommendedPrecision: VideoPrecision;
  needsOffload: boolean;
  recommendedRamGb: number;
  cloudGpu: string;
  optimizations: string[];
  nativeRuntimeBlocked: boolean;
}

const taskMultipliers: Record<VideoTask, number> = {
  t2v: 1,
  i2v: 1.08,
  v2v: 1.18,
};

const qualityOrder: VideoPrecision[] = ["bf16", "fp16", "fp8", "int8", "gguf"];

function isNativeRuntimeBlocked(model: VideoCalculatorModel, gpu: VideoCalculatorGpu): boolean {
  if (gpu.kind !== "apple") return false;
  return model.family === "hunyuan" || model.slug.startsWith("ltx-2-3");
}

export function estimatePeakVramGb(
  model: VideoCalculatorModel,
  resolution: VideoResolution,
  frames: number,
  precision: VideoPrecision,
  offload: boolean,
  task: VideoTask = "t2v",
  batchSize = 1,
  precisionMultipliers: Record<VideoPrecision, number>,
): number {
  const pixelRatio = (resolution.width * resolution.height) / (model.baselineWidth * model.baselineHeight);
  const frameRatio = Math.max(0.2, frames / model.baselineFrames);
  const batchMultiplier = 1 + Math.max(0, batchSize - 1) * 0.78;
  const offloadMultiplier = offload && model.offloadSupported ? 0.76 : 1;
  const workloadMemory =
    model.baselineVramGb *
    precisionMultipliers[precision] *
    Math.pow(pixelRatio, 0.62) *
    Math.pow(frameRatio, 0.42) *
    taskMultipliers[task] *
    batchMultiplier;

  return Math.max(2.5, workloadMemory * offloadMultiplier + 1.1);
}

export function chooseRecommendedPrecision(
  model: VideoCalculatorModel,
  gpu: VideoCalculatorGpu,
  resolution: VideoResolution,
  frames: number,
  offload: boolean,
  task: VideoTask,
  batchSize: number,
  precisionMultipliers: Record<VideoPrecision, number>,
): VideoPrecision {
  const supported = qualityOrder.filter((precision) => model.supportedPrecisions.includes(precision));
  return supported.find((precision) =>
    estimatePeakVramGb(model, resolution, frames, precision, offload, task, batchSize, precisionMultipliers) <= gpu.vramGb * 0.94,
  ) ?? supported.at(-1) ?? model.defaultPrecision;
}

function estimateGenerationSeconds(input: VideoCalculationInput, frames: number, peakVramGb: number): { low: number; high: number; confidence: string } | null {
  const { model, gpu, resolution, task, precision, batchSize, offload } = input;
  if (isNativeRuntimeBlocked(model, gpu)) return null;

  const currentWork = resolution.width * resolution.height * frames * model.baselineSteps * taskMultipliers[task] * batchSize;
  let midpoint: number;
  let confidence: string;

  if (model.speedReference) {
    const referenceWork = model.speedReference.width * model.speedReference.height * model.speedReference.frames * model.speedReference.steps;
    midpoint = model.speedReference.seconds * (currentWork / referenceWork) * (model.speedReference.speedIndex / Math.max(1, gpu.speedIndex));
    confidence = "Medium confidence · benchmark anchored";
  } else {
    const baselineWork = model.baselineWidth * model.baselineHeight * model.baselineFrames * model.baselineSteps;
    midpoint = (model.baselineVramGb * (currentWork / baselineWork) * model.baselineSteps * 3.8) / Math.max(4, gpu.speedIndex);
    confidence = "Low confidence · workload model only";
  }

  const precisionCost = Math.max(0.72, input.precisionMultipliers[precision]);
  midpoint *= precisionCost;
  if (offload && peakVramGb > gpu.vramGb * 0.82) midpoint *= 1.65;

  return {
    low: Math.max(1, midpoint * 0.68),
    high: Math.max(2, midpoint * 1.55),
    confidence,
  };
}

export function calculateVideoFit(input: VideoCalculationInput): VideoCalculationResult {
  const { model, gpu, resolution, task, precision, durationSeconds, fps, batchSize, systemRamGb, offload, resolutions, precisionMultipliers } = input;
  const frames = durationSeconds * fps + 1;
  const nativeRuntimeBlocked = isNativeRuntimeBlocked(model, gpu);
  const peak = estimatePeakVramGb(model, resolution, frames, precision, offload, task, batchSize, precisionMultipliers);
  const directFit = !nativeRuntimeBlocked && peak <= gpu.vramGb * 0.92 && systemRamGb >= model.minimumRamGb;
  const compromiseFit =
    !nativeRuntimeBlocked &&
    !directFit &&
    offload &&
    model.offloadSupported &&
    peak <= gpu.vramGb * 1.38 &&
    systemRamGb >= Math.max(model.minimumRamGb, Math.ceil(peak * 2));

  const status: VideoFitStatus = directFit ? "recommended" : compromiseFit ? "compromise" : "blocked";
  const verdict = nativeRuntimeBlocked
    ? "API or cloud recommended"
    : directFit
      ? "Runs locally"
      : compromiseFit
        ? "Runs with compromises"
        : "Not recommended locally";

  const summary = nativeRuntimeBlocked
    ? `${model.name} is not a dependable native ${gpu.name} workflow in the documented current runtime. Use an API or NVIDIA cloud GPU.`
    : directFit
      ? `This setup has enough estimated VRAM and system RAM for ${resolution.label}, ${frames} frames, batch ${batchSize}, and ${precision.toUpperCase()}.`
      : compromiseFit
        ? "This should load with CPU offload, but memory headroom is narrow. Reduce batch size or frames first if the workflow becomes unstable."
        : "The selected workload is above the practical memory budget. Choose a lighter model, lower precision, shorter clip, smaller batch, or cloud GPU.";

  const recommendedPrecision = chooseRecommendedPrecision(model, gpu, resolution, frames, offload, task, batchSize, precisionMultipliers);
  const needsOffload = !nativeRuntimeBlocked && (peak > gpu.vramGb * 0.82 || model.minimumVramGb > gpu.vramGb);
  const recommendedRamGb = Math.max(model.recommendedRamGb, Math.ceil(peak * 2));
  const time = estimateGenerationSeconds(input, frames, peak);

  let maximumResolution: VideoResolution | null = null;
  let maximumFrames: number | null = null;
  if (!nativeRuntimeBlocked) {
    const safeResolutions = resolutions.filter((preset) =>
      estimatePeakVramGb(model, preset, frames, precision, offload, task, batchSize, precisionMultipliers) <= gpu.vramGb * 0.9,
    );
    maximumResolution = safeResolutions.at(-1) ?? null;

    const budget = gpu.vramGb * 0.9;
    const pixelRatio = (resolution.width * resolution.height) / (model.baselineWidth * model.baselineHeight);
    const batchMultiplier = 1 + Math.max(0, batchSize - 1) * 0.78;
    const baseAtResolution = model.baselineVramGb * precisionMultipliers[precision] * Math.pow(pixelRatio, 0.62) * taskMultipliers[task] * batchMultiplier;
    const usableBudget = Math.max(0.5, (budget - 1.1) / (offload && model.offloadSupported ? 0.76 : 1));
    maximumFrames = Math.min(721, Math.max(9, Math.floor(model.baselineFrames * Math.pow(usableBudget / Math.max(0.5, baseAtResolution), 1 / 0.42))));
  }

  const cloudGpu = peak > 42 || model.recommendedVramGb >= 48 ? "H100 80 GB" : peak > 28 ? "A100 80 GB" : "48 GB cloud GPU";
  const optimizations = [
    `Runtime: ${model.preferredRuntime}`,
    `Use ${recommendedPrecision.toUpperCase()} with batch size ${batchSize}`,
    needsOffload ? "Enable model and text-encoder offload" : "Keep core diffusion weights on the GPU",
    ...model.optimizationFlags.slice(0, 3),
  ];

  return {
    status,
    verdict,
    headline: `${gpu.name} × ${model.name}`,
    summary,
    estimatedVramLowGb: peak,
    estimatedVramHighGb: peak * 1.12,
    generationTimeLowSeconds: time?.low ?? null,
    generationTimeHighSeconds: time?.high ?? null,
    timeConfidence: time?.confidence ?? "Native local runtime not supported for this profile",
    maximumResolution,
    maximumFrames,
    recommendedPrecision,
    needsOffload,
    recommendedRamGb,
    cloudGpu,
    optimizations,
    nativeRuntimeBlocked,
  };
}
