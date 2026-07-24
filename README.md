<div align="center">

<img src="public/favicon.svg" alt="CanIRun Local" width="80" height="80" />

# CanIRun Local

**Local AI Hardware Advisor**

Detect your computer to see which models it can run, or start with an AI model to find the cheapest practical GPU, PC, Mac, or cloud setup.

</div>

---

## Product direction

The core question remains:

> **Can my PC run this AI model?**

The product now supports two complementary journeys:

1. **Hardware → models** — browser-based hardware detection and compatibility grading.
2. **Model → hardware** — minimum, comfortable, professional, Mac, and cloud recommendations.

The advisor expands beyond GGUF language models to cover:

- local LLMs
- Stable Diffusion and FLUX image generation
- Qwen-Image
- Wan and Hunyuan local video models
- Whisper speech recognition
- MusicGen
- Kokoro TTS
- ComfyUI workflows

## First implementation

This branch adds:

- a centralized brand configuration
- a cross-modality hardware advisor data layer
- model-to-hardware recommendation pages
- hardware-to-model compatibility pages
- an advisor catalog with search and category filters
- initial programmatic SEO pages at root-level search-friendly URLs
- FAQ and technical-article structured data
- deploy-specific canonical URLs through `SITE_URL`
- rebranded navigation, metadata, homepage entry points, and footer

### Initial SEO routes

Examples generated from `src/data/advisor.ts`:

```text
/can-rtx-3060-run-llama-3-1-8b
/can-rtx-3060-run-deepseek-r1
/can-mac-mini-m4-pro-run-qwen3-8b
/best-gpu-for-deepseek-r1
/llama-3-1-8b-system-requirements
/flux-system-requirements
/rtx-4070-local-ai-models
/32gb-ram-local-ai-models
/can-rtx-5090-run-wan-2-1-14b
```

## How compatibility estimates work

The original client-side detection and GGUF scoring engine remains intact.

The new advisor layer uses curated workload presets with:

- minimum model memory
- comfortable model memory
- minimum and recommended system RAM
- storage budget
- quantization, resolution, or workflow assumptions
- hardware-specific limitations

For dedicated GPUs, model memory maps to VRAM. For Apple Silicon, the current estimator conservatively treats 75% of unified memory as potentially usable by the model. These are planning estimates, not benchmark guarantees.

Real usage changes with runtime, quantization, context length, KV cache, resolution, frame count, VAE and text encoders, workflow nodes, drivers, and operating-system overhead.

## Architecture

```text
src/
├── config/
│   └── site.ts                         # Brand and repository settings
├── data/
│   └── advisor.ts                      # Cross-modality models, hardware, fit logic, SEO records
├── pages/
│   ├── index.astro                     # Hardware detection entry point
│   ├── advisor/
│   │   ├── index.astro                 # Reverse-search catalog
│   │   ├── model/[slug].astro          # Model → hardware
│   │   └── hardware/[slug].astro       # Hardware → models
│   └── [seoSlug].astro                 # Curated programmatic SEO pages
├── components/
│   ├── ModelListContent.astro          # Existing client-side detector and LLM results
│   ├── NavHeader.astro
│   └── Footer.astro
└── layouts/
    └── Layout.astro
```

The existing workspace packages remain responsible for the mature LLM engine:

```text
packages/
├── compatibility/
└── models/
```

## Development

Prerequisites: Node.js 18+ and pnpm.

```bash
pnpm install
pnpm dev
```

Validation commands:

```bash
pnpm packages:typecheck
pnpm test
pnpm build
```

Set the production domain before deployment:

```bash
SITE_URL=https://your-domain.example pnpm build
```

## Data maintenance

Each advisor model should define a precise tested preset. Do not publish one unexplained number as a universal requirement.

When adding or updating a model:

1. link to the primary model card or official documentation
2. record quantization, precision, context, resolution, or offload assumptions
3. separate minimum loading requirements from a comfortable recommendation
4. verify at least one representative runtime when possible
5. update or add related SEO records only after the data exists

## Commercialization hooks

The page architecture is ready for later integration of:

- GPU and prebuilt-PC affiliate offers
- cloud GPU providers
- local AI installation services
- downloadable configuration reports
- workstation build guides
- a public compatibility API

Affiliate links are intentionally not hardcoded in the first implementation. Product inventory, geography, disclosure, tracking, and merchant selection should be configured before offers are shown.

## Attribution

This repository is based on the open-source [CanIRun.ai project](https://github.com/midudev/canirun.ai), originally created by midudev and released under the MIT License. The existing hardware detector, GGUF model catalog, compatibility calculations, and Astro foundation were retained and extended.

## License

MIT
