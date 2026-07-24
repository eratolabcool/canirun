// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const site = process.env.SITE_URL ?? 'https://canirun.ai';

// Set SITE_URL in production when the rebranded domain is connected.
export default defineConfig({
  site,
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    worker: {
      format: 'es'
    }
  }
});
