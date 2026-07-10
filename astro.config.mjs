// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static, zero-JS-by-default build. Astro minifies HTML and bundles/minifies
// CSS automatically; inlineStylesheets:'auto' inlines tiny sheets to cut
// render-blocking requests — key for the "lightweight" goal.
export default defineConfig({
  site: 'https://embeddedos.org',
  output: 'static',
  compressHTML: true,
  build: {
    // Keep .html URLs so the site's existing in-content links keep resolving.
    format: 'file',
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  integrations: [sitemap()],
});
