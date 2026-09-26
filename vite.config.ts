/// <reference types="vitest" />

import { Plugin, defineConfig } from 'vite';
import analog from '@analogjs/platform';

/**
 * Analog's production build defines `ngServerMode` from the top-level `build.ssr`, which is unset
 * because the server bundle is built as a separate `ssr` environment. Both bundles therefore get
 * `ngServerMode = false`, which strips Angular's server-only code paths — e.g. `@defer` blocks
 * with hydrate triggers render empty in the prerendered HTML. Set it correctly per environment.
 */
function ngServerModePerEnvironment(): Plugin {
  return {
    name: 'ng-server-mode-per-environment',
    configEnvironment(name, _config, env) {
      if (env.command === 'build' && name === 'ssr') {
        return { define: { ngServerMode: 'true' } };
      }
      return undefined;
    },
  };
}

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
    ngServerModePerEnvironment(),
  ],
}));
