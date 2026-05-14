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
  integrations: [mdx(), sitemap(), preact()],
  build: {
    format: 'directory',
  },
});
