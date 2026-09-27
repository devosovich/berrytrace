import { mergeApplicationConfig, ApplicationConfig, inject } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { LOCALE, REQUEST } from '@analogjs/router/tokens';

import { appConfig } from './app.config';
import { localeFromPath } from './i18n';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // Analog's server locale detection reads the first URL segment, which is the deploy base
    // (`/berrytrace/pl/order`) on the dev server, and falls back to Accept-Language. Resolve it the
    // same way as in the browser instead, so every page renders in the locale of its URL.
    {
      provide: LOCALE,
      useFactory: () => {
        const request = inject(REQUEST, { optional: true });
        return localeFromPath(request?.originalUrl ?? request?.url ?? '/');
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
