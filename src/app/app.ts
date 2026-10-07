import { DOCUMENT, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CookieBanner } from './cookie-consent/cookie-banner';
import { CookieConsent } from './cookie-consent/cookie-consent';
import { injectCurrentLocale } from './i18n';
import { loadGoogleTag } from './analytics';
import { SITE_CONFIG } from './site-config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CookieBanner],
  template: `
    <router-outlet />
    @if (consent.open()) {
      <app-cookie-banner />
    }
  `,
})
export class App {
  protected readonly consent = inject(CookieConsent);

  constructor() {
    const document = inject(DOCUMENT);
    // setAttribute rather than the `lang` property, which the server-side DOM does not serialize.
    document.documentElement.setAttribute('lang', injectCurrentLocale());
    // The stored choice lives in localStorage, so the banner can only be decided in the browser.
    // Doing it after the first render keeps the prerendered HTML and the hydrated DOM identical.
    afterNextRender(() => {
      this.consent.whenGranted('analytics', () => loadGoogleTag(document, SITE_CONFIG.googleTagId));
      this.consent.restore();
    });
  }
}
