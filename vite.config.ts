/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Served from https://devosovich.github.io/berrytrace/. Use '/' for a custom domain.
  base: '/berrytrace/',
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      // Static site generation: every route below is prerendered to HTML at build time.
      ssr: true,
      static: true,
      prerender: {
        // Expanded per locale by the i18n option: / (English), /en, /pl, /uk.
        routes: ['/'],
      },
      i18n: {
        // Unprefixed URLs render in English.
        defaultLocale: 'en',
        // The first entry must stay the source locale the templates are written in (Ukrainian).
        locales: ['uk', 'en', 'pl'],
      },
    }),
  ],
}));
