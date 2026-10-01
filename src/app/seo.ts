import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { injectCurrentLocale } from './i18n';
import { DEFAULT_LOCALE, LOCALES, Locale, Page, absoluteUrl } from './site';
import { SITE_CONFIG } from './site-config';

const OG_LOCALES: Record<Locale, string> = { en: 'en_US', pl: 'pl_PL', uk: 'uk_UA' };

/** Absolute, canonical URL of a page in a locale on the production domain. */
export function canonicalUrl(locale: Locale, page: Page = ''): string {
  return absoluteUrl(SITE_CONFIG.siteUrl, locale, page);
}

/** schema.org description of the company and the site, for the landing page. */
export function organizationJsonLd(): object {
  const { siteUrl, contactEmail } = SITE_CONFIG;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'BerryTrace',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/favicon.svg`,
        image: `${siteUrl}/og-image.jpg`,
        email: contactEmail,
        address: { '@type': 'PostalAddress', addressLocality: 'Vinnytsia', addressCountry: 'UA' },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: 'BerryTrace',
        inLanguage: [...LOCALES],
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };
}

export interface PageSeo {
  readonly page: Page;
  readonly title: string;
  readonly description: string;
  readonly jsonLd?: object;
}

/**
 * Everything search engines and link previews read from a page: title, description, canonical URL,
 * `hreflang` alternates, Open Graph and Twitter tags, optional JSON-LD. Pages call `set()` once from
 * their constructor. It writes through `DOCUMENT`, so the tags are part of the prerendered HTML, and
 * marks them `data-seo` so the next page of a client-side navigation can replace them.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly document = inject(DOCUMENT);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly locale = injectCurrentLocale();

  set({ page, title, description, jsonLd }: PageSeo): void {
    const url = canonicalUrl(this.locale, page);
    const image = `${SITE_CONFIG.siteUrl}/og-image.jpg`;

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });

    this.replaceInHead('link', [
      { rel: 'canonical', href: url },
      ...LOCALES.map((l) => ({ rel: 'alternate', hreflang: l, href: canonicalUrl(l, page) })),
      { rel: 'alternate', hreflang: 'x-default', href: canonicalUrl(DEFAULT_LOCALE, page) },
    ]);

    this.replaceInHead('meta', [
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'BerryTrace' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: OG_LOCALES[this.locale] },
      ...LOCALES.filter((l) => l !== this.locale).map((l) => ({
        property: 'og:locale:alternate',
        content: OG_LOCALES[l],
      })),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ]);

    this.replaceInHead(
      'script',
      jsonLd ? [{ type: 'application/ld+json', text: JSON.stringify(jsonLd) }] : [],
    );
  }

  /** Replaces all `data-seo` elements of one tag with new ones; `text` becomes the element's content. */
  private replaceInHead(tag: 'link' | 'meta' | 'script', items: Record<string, string>[]): void {
    const head = this.document.head;
    head.querySelectorAll(`${tag}[data-seo]`).forEach((el) => el.remove());
    for (const { text, ...attributes } of items) {
      const el = this.document.createElement(tag);
      el.setAttribute('data-seo', '');
      for (const [name, value] of Object.entries(attributes)) el.setAttribute(name, value);
      if (text !== undefined) el.textContent = text;
      head.appendChild(el);
    }
  }
}
