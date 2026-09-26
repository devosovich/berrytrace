import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withI18nSupport,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { withInMemoryScrolling } from '@angular/router';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { provideI18n } from '@analogjs/router/i18n';
import { LOCALE } from '@analogjs/router/tokens';

import { localeFromPath } from './i18n';

type TranslationFile = { translations: Record<string, string> };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFileRouter(
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    provideHttpClient(withFetch(), withInterceptors([requestContextInterceptor])),
    provideClientHydration(withEventReplay(), withI18nSupport(), withIncrementalHydration()),
    // `defaultLocale` and `locales` come from the `i18n` option in vite.config.ts.
    provideI18n({
      loader: async (locale) => {
        const file = (await import(`../i18n/${locale}.json`)).default as TranslationFile;
        return file.translations;
      },
    }),
    // provideI18n() detects the browser locale from the first path segment, which is `berrytrace`
    // under the GitHub Pages subpath; override it with a base-aware lookup. On the server the locale
    // comes from the prerendered route (`/pl`), which has no base prefix.
    ...(typeof window !== 'undefined'
      ? [{ provide: LOCALE, useValue: localeFromPath(window.location.pathname) }]
      : []),
  ],
};
