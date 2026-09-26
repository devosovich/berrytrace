/** Locales supported by the landing, in the order the language switcher shows them. */
export const LOCALES = ['en', 'pl', 'uk'] as const;

export type Locale = (typeof LOCALES)[number];

/** Locale served at unprefixed URLs (`/`). Must match `defaultLocale` in vite.config.ts. */
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Site root the app is deployed under (Vite `base`, e.g. `/berrytrace/` on GitHub Pages).
 * Analog reads the locale from the first URL segment, which under a subpath is the repo name,
 * so locale detection and switching strip this prefix first.
 */
const BASE_URL = import.meta.env.BASE_URL;

/** Resolves the locale from a browser pathname such as `/berrytrace/pl`. */
export function localeFromPath(pathname: string): Locale {
  const path = pathname.startsWith(BASE_URL) ? pathname.slice(BASE_URL.length) : pathname;
  const first = path.split('/').find(Boolean);
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/** URL of the landing in the given locale; the default locale lives at the site root. */
export function localeUrl(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? BASE_URL : `${BASE_URL}${locale}/`;
}
