// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const site = process.env.SITE_URL ?? 'https://www.canirun.app';
const corePaths = new Set(['/', '/ai-video', '/advisor', '/compare', '/docs']);

// Keep sitemap, canonical URLs, Open Graph URLs, and production builds on one origin.
export default defineConfig({
  site,
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith('/404'),
      serialize(item) {
        const pathname = new URL(item.url).pathname.replace(/\/+$/, '') || '/';

        if (pathname === '/') {
          return { ...item, changefreq: 'weekly', priority: 1 };
        }

        if (corePaths.has(pathname)) {
          return { ...item, changefreq: 'weekly', priority: 0.9 };
        }

        if (
          pathname.startsWith('/ai-video/') ||
          pathname.startsWith('/advisor/model/') ||
          pathname.startsWith('/advisor/hardware/') ||
          pathname.startsWith('/model/')
        ) {
          return { ...item, changefreq: 'monthly', priority: 0.8 };
        }

        return { ...item, changefreq: 'monthly', priority: 0.6 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    worker: {
      format: 'es'
    }
  }
});
