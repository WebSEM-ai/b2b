import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Site URL - important pentru sitemap și canonical URLs
  site: 'https://b2b.websem.ro',

  // Integrări
  integrations: [
    mdx(),
    sitemap(),
  ],

  // Build optimizations
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    // Assets optimization
    assets: '_assets',
  },

  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  // Vite configuration for better performance
  vite: {
    build: {
      cssMinify: true,
    },
    ssr: {
      noExternal: [],
    },
  },
});
