/**
 * Facts about the site that both the app and the build (vite.config.ts) need: supported locales,
 * pages and URL layout. Plain TypeScript with no framework imports, so the build can import it too.
 */

/** Locales supported by the site, in the order the language switcher shows them. */
export const LOCALES = ['en', 'pl', 'uk'] as const;

export type Locale = (typeof LOCALES)[number];

/** Locale served at unprefixed URLs (`/`). */
export const DEFAULT_LOCALE: Locale = 'en';

/** Locale the templates are written in; its translations are the template text itself. */
export const SOURCE_LOCALE: Locale = 'uk';

/** Pages of the site, as paths relative to a locale root (`''` is the landing). */
export const PAGES = ['', 'order', 'audit', 'about', 'customs', 'privacy', 'terms'] as const;

export type Page = (typeof PAGES)[number];

/**
 * Path of a page inside the site root, without the deploy base and without a leading slash:
 * `localePath('pl', 'about')` → `pl/about/`; the default locale has no prefix.
 */
export function localePath(locale: Locale, page: string = ''): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`;
  const path = page.replace(/\/$/, '');
  return `${prefix}${path ? `${path}/` : ''}`;
}

/** Absolute URL of a page in a locale on the given origin. */
export function absoluteUrl(origin: string, locale: Locale, page: Page = ''): string {
  return `${origin.replace(/\/$/, '')}/${localePath(locale, page)}`;
}

/** `sitemap.xml` listing every page once per locale, each with its `hreflang` alternates. */
export function buildSitemap(origin: string): string {
  const alternates = (page: Page) =>
    [
      ...LOCALES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${absoluteUrl(origin, l, page)}"/>`,
      ),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(origin, DEFAULT_LOCALE, page)}"/>`,
    ].join('\n');

  const entries = PAGES.flatMap((page) =>
    LOCALES.map(
      (locale) =>
        `  <url>\n    <loc>${absoluteUrl(origin, locale, page)}</loc>\n${alternates(page)}\n  </url>`,
    ),
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`;
}

/** `robots.txt`: allow everything and point crawlers to the sitemap. */
export function buildRobots(origin: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin.replace(/\/$/, '')}/sitemap.xml\n`;
}
