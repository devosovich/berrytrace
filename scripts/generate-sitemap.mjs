// Writes public/sitemap.xml and public/robots.txt from site-pages.json. Runs before every build
// (npm "prebuild" hook), so adding a page to site-pages.json is all that is needed.
import { readFileSync, writeFileSync } from 'node:fs';

const SITE_URL = (process.env.VITE_SITE_URL || 'https://berrytrace.com').replace(/\/$/, '');
const pages = JSON.parse(readFileSync(new URL('../site-pages.json', import.meta.url), 'utf8'));
// Keep in sync with `locales` / `defaultLocale` in vite.config.ts. English is served unprefixed.
const LOCALES = ['en', 'pl', 'uk'];
const DEFAULT_LOCALE = 'en';

const url = (locale, page) => {
  const prefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`;
  const path = page === '/' ? '' : `${page.slice(1)}/`;
  return `${SITE_URL}/${prefix}${path}`;
};

const entries = pages
  .flatMap((page) =>
    LOCALES.map((locale) => {
      const alternates = [
        ...LOCALES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${url(l, page)}"/>`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(DEFAULT_LOCALE, page)}"/>`,
      ].join('\n');
      return `  <url>\n    <loc>${url(locale, page)}</loc>\n${alternates}\n  </url>`;
    }),
  )
  .join('\n');

writeFileSync(
  new URL('../public/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`,
);
writeFileSync(
  new URL('../public/robots.txt', import.meta.url),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);
console.log(`sitemap.xml: ${pages.length * LOCALES.length} URLs for ${SITE_URL}`);
