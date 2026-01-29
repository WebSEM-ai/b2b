import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://landing.websem.ro',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto'
  }
});
