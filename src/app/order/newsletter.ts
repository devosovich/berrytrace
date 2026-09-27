import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Locale } from '../i18n';
import { SITE_CONFIG } from '../site-config';

/** Basic shape check (`name@domain.tld`); the mailing service does the real validation. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Sign-ups for the "tell me when the platform launches" mailing list. */
@Injectable({ providedIn: 'root' })
export class Newsletter {
  private readonly http = inject(HttpClient);

  /**
   * POSTs `{ email, locale }` as JSON to the configured endpoint. Rejects when the request fails
   * or no endpoint is configured (see `SITE_CONFIG.subscribeEndpoint`).
   */
  async subscribe(email: string, locale: Locale): Promise<void> {
    const endpoint = SITE_CONFIG.subscribeEndpoint;
    if (!endpoint) {
      throw new Error('Newsletter endpoint is not configured (VITE_SUBSCRIBE_ENDPOINT).');
    }
    await firstValueFrom(this.http.post(endpoint, { email, locale }, { responseType: 'text' }));
  }
}
