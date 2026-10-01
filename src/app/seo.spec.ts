import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LOCALE } from '@analogjs/router/tokens';

import { Seo, canonicalUrl, organizationJsonLd } from './seo';
import { SITE_CONFIG } from './site-config';

describe('Seo', () => {
  let head: HTMLHeadElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: LOCALE, useValue: 'pl' }] });
    head = TestBed.inject(DOCUMENT).head;
    head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
  });

  const meta = (attr: string, value: string) =>
    head.querySelector(`meta[${attr}="${value}"]`)?.getAttribute('content');

  it('writes title, description, canonical URL and hreflang alternates', () => {
    TestBed.inject(Seo).set({ page: 'about', title: 'O nas', description: 'Opis' });

    expect(TestBed.inject(DOCUMENT).title).toBe('O nas');
    expect(meta('name', 'description')).toBe('Opis');
    expect(head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${SITE_CONFIG.siteUrl}/pl/about/`,
    );
    const alternates = [...head.querySelectorAll('link[rel="alternate"]')].map((el) => [
      el.getAttribute('hreflang'),
      el.getAttribute('href'),
    ]);
    expect(alternates).toEqual([
      ['en', `${SITE_CONFIG.siteUrl}/about/`],
      ['pl', `${SITE_CONFIG.siteUrl}/pl/about/`],
      ['uk', `${SITE_CONFIG.siteUrl}/uk/about/`],
      ['x-default', `${SITE_CONFIG.siteUrl}/about/`],
    ]);
  });

  it('writes Open Graph and Twitter tags for the current locale', () => {
    TestBed.inject(Seo).set({ page: '', title: 'BerryTrace', description: 'Opis' });

    expect(meta('property', 'og:title')).toBe('BerryTrace');
    expect(meta('property', 'og:url')).toBe(`${SITE_CONFIG.siteUrl}/pl/`);
    expect(meta('property', 'og:locale')).toBe('pl_PL');
    expect([...head.querySelectorAll('meta[property="og:locale:alternate"]')].map((el) => el.getAttribute('content'))).toEqual(['en_US', 'uk_UA']);
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
  });

  it('replaces the previous page tags instead of adding to them', () => {
    const seo = TestBed.inject(Seo);
    seo.set({ page: 'order', title: 'A', description: 'a', jsonLd: { a: 1 } });
    seo.set({ page: 'audit', title: 'B', description: 'b' });

    expect(head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(head.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    expect(meta('property', 'og:title')).toBe('B');
    expect(head.querySelector('script[type="application/ld+json"]')).toBeNull();
  });

  it('adds JSON-LD when given', () => {
    TestBed.inject(Seo).set({ page: '', title: 'T', description: 'd', jsonLd: organizationJsonLd() });

    const json = JSON.parse(head.querySelector('script[type="application/ld+json"]')!.textContent!);
    expect(json['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual(['Organization', 'WebSite']);
  });
});

describe('canonicalUrl', () => {
  it('uses the production origin and no prefix for English', () => {
    expect(canonicalUrl('en', 'privacy')).toBe(`${SITE_CONFIG.siteUrl}/privacy/`);
  });
});
