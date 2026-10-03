/// <reference types="vitest" />

import { Plugin, defineConfig, loadEnv } from 'vite';
import analog from '@analogjs/platform';
import { DEFAULT_LOCALE, LOCALES, PAGES, SOURCE_LOCALE, buildRobots, buildSitemap } from './src/app/site.ts';

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

/**
 * Inlines the global stylesheet (styles.css + @font-face rules, ~2 KB gzipped) into index.html so
 * the first paint does not wait for a separate render-blocking CSS request.
 */
function inlineGlobalCss(): Plugin {
  return {
    name: 'inline-global-css',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      return html.replace(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"[^>]*>/g, (tag, href: string) => {
        const asset = Object.values(ctx.bundle!).find(
          (chunk) => chunk.type === 'asset' && href.endsWith('/' + chunk.fileName),
        );
        return asset && asset.type === 'asset' ? `<style>${asset.source}</style>` : tag;
      });
    },
  };
}

/**
 * Emits `sitemap.xml` and `robots.txt` into the client build, generated from the page and locale
 * lists in src/app/site.ts. The origin is the production domain (VITE_SITE_URL).
 */
function seoFiles(origin: string): Plugin {
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      if (this.environment.name !== 'client') return;
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: buildSitemap(origin),
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: buildRobots(origin),
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // `.env` files are not in process.env inside the config; loadEnv merges them with the real environment.
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    // Served from https://devosovich.github.io/berrytrace/ for now. On the custom domain (berrytrace.com)
    // build with VITE_BASE=/ (see README).
    base: env['VITE_BASE'] || '/berrytrace/',
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
          // Expanded per locale by the i18n option: / (English), /en, /pl, /uk, and the same for each page.
          routes: PAGES.map((page) => `/${page}`),
        },
        i18n: {
          // Unprefixed URLs render in English.
          defaultLocale: DEFAULT_LOCALE,
          // The first entry must stay the source locale the templates are written in (Ukrainian).
          locales: [SOURCE_LOCALE, ...LOCALES.filter((locale) => locale !== SOURCE_LOCALE)],
        },
      }),
      ngServerModePerEnvironment(),
      inlineGlobalCss(),
      seoFiles((env['VITE_SITE_URL'] || 'https://berrytrace.com').replace(/\/$/, '')),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['src/**/*.spec.ts'],
      reporters: ['default'],
    },
  };
});
