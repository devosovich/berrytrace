import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Locale } from '../i18n';
import { SITE_CONFIG } from '../site-config';

/** Basic shape check (`name@domain.tld`); the mailing service does the real validation. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Whether the endpoint is a MailerLite embedded-form address (`assets.mailerlite.com/jsonp/…/subscribe`). */
export function isMailerLiteEndpoint(endpoint: string): boolean {
  try {
    return new URL(endpoint).hostname.endsWith('mailerlite.com');
  } catch {
    return false;
  }
}

/** Sign-ups for the "tell me when the platform launches" mailing list. */
@Injectable({ providedIn: 'root' })
export class Newsletter {
  private readonly http = inject(HttpClient);

  /**
   * Subscribes the address through the endpoint in `SITE_CONFIG.subscribeEndpoint`. Rejects when no
   * endpoint is configured or the service refuses the request.
   *
   * - MailerLite form endpoint: sent like its own embedded form does, as multipart form data
   *   (`fields[email]`, plus the locale in `subscribeLanguageField` when configured). It answers
   *   with JSON and only `success: true` counts. The endpoint accepts cross-origin requests but only
   *   the `Accept` header, so no JSON body or other headers.
   * - Any other endpoint: a JSON POST of `{ email, locale }`.
   */
  async subscribe(email: string, locale: Locale): Promise<void> {
    const endpoint = SITE_CONFIG.subscribeEndpoint;
    if (!endpoint) {
      throw new Error('Newsletter endpoint is not configured (VITE_SUBSCRIBE_ENDPOINT).');
    }

    if (isMailerLiteEndpoint(endpoint)) {
      const body = new FormData();
      body.append('fields[email]', email);
      if (SITE_CONFIG.subscribeLanguageField) {
        body.append(`fields[${SITE_CONFIG.subscribeLanguageField}]`, locale);
      }
      body.append('ml-submit', '1');
      body.append('anticsrf', 'true');
      const response = await firstValueFrom(
        this.http.post<{ success?: boolean }>(endpoint, body, { headers: { Accept: 'application/json' } }),
      );
      if (!response?.success) {
        throw new Error('MailerLite did not accept the subscription.');
      }
      return;
    }

    await firstValueFrom(this.http.post(endpoint, { email, locale }, { responseType: 'text' }));
  }
}
