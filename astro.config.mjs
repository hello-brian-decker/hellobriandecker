import { defineConfig } from 'astro/config';

// GitHub Pages sets both through the deploy workflow (actions/configure-pages):
// a custom domain serves from '/', a project page from '/<repo>/'.
// Locally they fall back to the production domain at the root.
export default defineConfig({
  site: process.env.SITE_URL || 'https://hellobriandecker.com',
  base: process.env.BASE_PATH || '/',
});
