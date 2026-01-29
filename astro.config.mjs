import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // Site URL - important pentru sitemap și canonical URLs
  site: 'https://b2b.websem.ro',

  // Integrări
  integrations: [
    mdx(),
    // sitemap(), // TODO: re-enable after upgrading to Astro 5
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
