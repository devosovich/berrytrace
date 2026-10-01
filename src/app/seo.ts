import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { DEFAULT_LOCALE, LOCALES, Locale, Page, injectCurrentLocale } from './i18n';
import { SITE_CONFIG } from './site-config';

const OG_LOCALES: Record<Locale, string> = { en: 'en_US', pl: 'pl_PL', uk: 'uk_UA' };

/** Absolute, canonical URL of a page in a locale on the production domain (English has no prefix). */
export function canonicalUrl(locale: Locale, page: Page = ''): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`;
  return `${SITE_CONFIG.siteUrl}/${prefix}${page ? `${page}/` : ''}`;
}

/**
 * Search and social metadata of the current page: canonical URL, `hreflang` alternates, Open Graph
 * and Twitter tags, and optional JSON-LD. Call `update()` from a page's constructor after it has set
 * its title and description; it reads them back, so they are written only once. Everything goes
 * through `DOCUMENT`, so it is also part of the prerendered HTML.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(page: Page, options: { jsonLd?: object } = {}): void {
    const locale = injectCurrentLocale();
    const url = canonicalUrl(locale, page);
    const title = this.title.getTitle();
    const description = this.meta.getTag('name="description"')?.content ?? '';
    const image = `${SITE_CONFIG.siteUrl}/og-image.jpg`;

    this.replaceLinks([
      { rel: 'canonical', href: url },
      ...LOCALES.map((l) => ({ rel: 'alternate', hreflang: l, href: canonicalUrl(l, page) })),
      { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl(DEFAULT_LOCALE, page) },
    ]);

    const tags: Record<string, string>[] = [
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'BerryTrace' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: OG_LOCALES[locale] },
      ...LOCALES.filter((l) => l !== locale).map((l) => ({
        property: 'og:locale:alternate',
        content: OG_LOCALES[l],
      })),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ];
    // Several og:locale:alternate tags are valid, so drop the old ones before adding.
    this.document.head.querySelectorAll('meta[data-seo]').forEach((el) => el.remove());
    for (const tag of tags) {
      const el = this.document.createElement('meta');
      el.setAttribute('data-seo', '');
      for (const [name, value] of Object.entries(tag)) el.setAttribute(name, value);
      this.document.head.appendChild(el);
    }

    this.document.head.querySelectorAll('script[data-seo]').forEach((el) => el.remove());
    if (options.jsonLd) {
      const script = this.document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', '');
      script.textContent = JSON.stringify(options.jsonLd);
      this.document.head.appendChild(script);
    }
  }

  private replaceLinks(links: Record<string, string>[]): void {
    this.document.head.querySelectorAll('link[data-seo]').forEach((el) => el.remove());
    for (const link of links) {
      const el = this.document.createElement('link');
      el.setAttribute('data-seo', '');
      for (const [name, value] of Object.entries(link)) el.setAttribute(name, value);
      this.document.head.appendChild(el);
    }
  }
}
