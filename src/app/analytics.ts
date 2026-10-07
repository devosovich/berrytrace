import { DOCUMENT, Directive, inject, input } from '@angular/core';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** How a visitor reached out; sent as the `method` of the `generate_lead` event. */
export type LeadMethod = 'whatsapp' | 'phone' | 'email' | 'newsletter';

/** Loads Google tag (gtag.js); call only after analytics consent. */
export function loadGoogleTag(document: Document, id: string): void {
  const win = document.defaultView;
  if (!id || !win || document.getElementById('google-tag')) return;
  const dataLayer = (win.dataLayer ??= []);
  // gtag.js expects the `arguments` object itself, not an array, so a rest parameter will not do.
  win.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  };
  win.gtag('js', new Date());
  win.gtag('config', id);
  const script = document.createElement('script');
  script.id = 'google-tag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
}

/** Reports a lead to Google Analytics. Does nothing until the tag has loaded (i.e. without consent). */
export function trackLead(document: Document, method: LeadMethod): void {
  document.defaultView?.gtag?.('event', 'generate_lead', { method });
}

/** Reports a `generate_lead` event when the host link is clicked: `<a [btTrackLead]="'phone'">`. */
@Directive({
  selector: '[btTrackLead]',
  host: { '(click)': 'track()' },
})
export class TrackLead {
  private readonly document = inject(DOCUMENT);
  readonly method = input.required<LeadMethod>({ alias: 'btTrackLead' });

  protected track(): void {
    trackLead(this.document, this.method());
  }
}
