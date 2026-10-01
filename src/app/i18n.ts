import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { injectLocale } from '@analogjs/router/tokens';

/** Locales supported by the site, in the order the language switcher shows them. */
export const LOCALES = ['en', 'pl', 'uk'] as const;

export type Locale = (typeof LOCALES)[number];

/** Locale served at unprefixed URLs (`/`). Must match `defaultLocale` in vite.config.ts. */
export const DEFAULT_LOCALE: Locale = 'en';

/** Pages of the site, as paths relative to a locale root (`''` is the landing). */
export type Page = '' | 'order' | 'audit' | 'about' | 'customs' | 'privacy' | 'terms';

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Site root the app is deployed under (Vite `base`, e.g. `/berrytrace/` on GitHub Pages).
 * Analog reads the locale from the first URL segment, which under a subpath is the repo name,
 * so locale detection and switching strip this prefix first.
 */
const BASE_URL = import.meta.env.BASE_URL;

/** Splits a browser pathname such as `/berrytrace/pl/order/` into its locale and page. */
function parsePath(url: string): { locale: Locale; page: string } {
  const pathname = url.split(/[?#]/)[0];
  const path = pathname.startsWith(BASE_URL) ? pathname.slice(BASE_URL.length) : pathname;
  const segments = path.split('/').filter(Boolean);
  if (isLocale(segments[0])) {
    return { locale: segments[0], page: segments.slice(1).join('/') };
  }
  return { locale: DEFAULT_LOCALE, page: segments.join('/') };
}

/** Resolves the locale from a browser pathname such as `/berrytrace/pl`. */
export function localeFromPath(pathname: string): Locale {
  return parsePath(pathname).locale;
}

/** Page part of a browser pathname, without the base and locale prefix (`/berrytrace/pl/order` → `order`). */
export function pageFromPath(pathname: string): string {
  return parsePath(pathname).page;
}

/** Full URL (including the deploy base) of a page in the given locale; the default locale has no prefix. */
export function localeUrl(locale: Locale, page = ''): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `${locale}/`;
  const path = page ? `${page.replace(/\/$/, '')}/` : '';
  return `${BASE_URL}${prefix}${path}`;
}

/** Router path of a page in the given locale, for `routerLink` (the router adds the deploy base). */
export function localeRoute(locale: Locale, page: Page = ''): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${prefix}/${page}`.replace(/(.)\/$/, '$1');
}

/** Locale of the current page. Must be called in an injection context. */
export function injectCurrentLocale(): Locale {
  const locale = injectLocale();
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

/**
 * Only render `/:locale/...` for supported locales; anything else goes back to the home page.
 * Analog attaches `routeMeta` to an empty-path child route, so the locale is read from the
 * inherited route param rather than from `canMatch` URL segments.
 */
export const supportedLocaleGuard: CanActivateFn = (route) =>
  isLocale(route.paramMap.get('locale')) || inject(Router).createUrlTree(['/']);
