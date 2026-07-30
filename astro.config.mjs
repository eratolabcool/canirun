// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const site = process.env.SITE_URL ?? 'https://www.canirun.app';

// Keep sitemap, canonical URLs, Open Graph URLs, and production builds on one origin.
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
