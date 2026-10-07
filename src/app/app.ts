import { DOCUMENT, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CookieBanner } from './cookie-consent/cookie-banner';
import { CookieConsent } from './cookie-consent/cookie-consent';
import { injectCurrentLocale } from './i18n';
import { SITE_CONFIG } from './site-config';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/** Loads Google tag (gtag.js); call only after analytics consent. */
function loadGoogleTag(document: Document, id: string): void {
  const win = document.defaultView;
  if (!win || document.getElementById('google-tag')) return;
  const dataLayer = (win.dataLayer ??= []);
  // gtag.js expects the `arguments` object itself, not an array, so a rest-parameter will not do.
  // eslint-disable-next-line prefer-rest-params
  const gtag = function (..._args: unknown[]) { dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', id);
  const script = document.createElement('script');
  script.id = 'google-tag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

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
