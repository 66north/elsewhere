// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: 'https://66north.github.io',
  base: '/elsewhere',
  trailingSlash: 'never',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => {
        // Exclude admin/system paths
        if (page.includes('/.astro/') || page.includes('/dist/')) {
          return false;
        }
        return true;
      },
      serialize: (item) => {
        const url = item.url;

        // Home page - highest priority
        if (url.endsWith('/elsewhere/') || url.endsWith('/elsewhere')) {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }

        // Journal pages - frequently updated
        if (url.includes('/journal/')) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }

        // Bucket list pages - frequently updated
        if (url.includes('/bucketlist/')) {
          return { ...item, priority: 0.85, changefreq: 'monthly' };
        }

        // Workshop guides - core content, occasionally updated
        if (url.includes('/workshop/guides/')) {
          return { ...item, priority: 0.85, changefreq: 'monthly' };
        }

        // Build page - rarely changed
        if (url.includes('/build')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }

        // Workshop hub and archive
        if (url.includes('/workshop/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }

        // Default priority for other pages
        return { ...item, priority: 0.7, changefreq: 'monthly' };
      },
    }),
    preact(),
  ],
  build: {
    format: 'directory',
  },
});
