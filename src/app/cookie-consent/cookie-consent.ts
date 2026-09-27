import { DOCUMENT, Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { SITE_CONFIG } from '../site-config';

/** Optional cookie categories; "necessary" cookies are always allowed and need no consent. */
export type ConsentCategory = 'analytics' | 'marketing';

/** Consent record as stored in localStorage under {@link CONSENT_STORAGE_KEY}. */
export interface ConsentRecord {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** When the visitor made the choice (ISO 8601). */
  at: string;
  /** Cookie policy version the choice was made for. */
  v: number;
}

export type ConsentChoice = Pick<ConsentRecord, ConsentCategory>;

export type BannerView = 'banner' | 'settings';

export const CONSENT_STORAGE_KEY = 'bt-cookie-consent';

/** Window event fired after every consent change, for scripts that live outside Angular. */
export const CONSENT_CHANGE_EVENT = 'bt:cookie-consent';

/**
 * Parses a stored consent record. Returns `null` when there is none, it is malformed, or it was
 * given for an older policy version — in all those cases the visitor has to be asked again.
 */
export function parseConsent(raw: string | null, currentVersion: number): ConsentRecord | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === 'object' &&
      value !== null &&
      'analytics' in value &&
      'marketing' in value &&
      'v' in value &&
      typeof value.analytics === 'boolean' &&
      typeof value.marketing === 'boolean' &&
      typeof value.v === 'number' &&
      value.v >= currentVersion
    ) {
      const at = 'at' in value && typeof value.at === 'string' ? value.at : '';
      return { necessary: true, analytics: value.analytics, marketing: value.marketing, at, v: value.v };
    }
  } catch {
    // Not JSON: treat as no consent.
  }
  return null;
}

/**
 * Cookie consent state for the whole site.
 *
 * The stored choice is only read in the browser, after the first render (see `App`), so the
 * prerendered HTML and the hydrated page never disagree about whether the banner is shown.
 *
 * Analytics and marketing code must not run before consent; register it with {@link whenGranted}:
 *
 * ```ts
 * inject(CookieConsent).whenGranted('analytics', () => loadAnalytics());
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CookieConsent {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly window = inject(DOCUMENT).defaultView;
  private readonly version = SITE_CONFIG.cookiePolicyVersion;

  private readonly record = signal<ConsentRecord | null>(null);
  private pending: { category: ConsentCategory; run: () => void }[] = [];

  /** The visitor's current choice, or `null` while they have not made one. */
  readonly consent = this.record.asReadonly();

  /** Whether the banner is on screen, and which of its two views. */
  readonly open = signal(false);
  readonly view = signal<BannerView>('banner');

  readonly analytics = computed(() => this.record()?.analytics ?? false);
  readonly marketing = computed(() => this.record()?.marketing ?? false);

  /** Reads the stored choice and shows the banner if there is none. Browser only; call once. */
  restore(): void {
    if (!this.isBrowser) return;
    const record = parseConsent(this.readStorage(), this.version);
    this.record.set(record);
    if (record) {
      this.runGranted();
    } else {
      this.show('banner');
    }
  }

  isGranted(category: ConsentCategory): boolean {
    return this.record()?.[category] ?? false;
  }

  /**
   * Runs `callback` once the visitor has consented to `category`: immediately if they already
   * have, otherwise as soon as they do (no page reload needed). Code that has already run cannot
   * be unloaded, so withdrawn consent takes full effect on the next page load.
   */
  whenGranted(category: ConsentCategory, callback: () => void): void {
    if (!this.isBrowser) return;
    if (this.isGranted(category)) {
      callback();
    } else {
      this.pending.push({ category, run: callback });
    }
  }

  /** Opens the banner, e.g. from the "Cookie settings" link in the footer. */
  show(view: BannerView = 'settings'): void {
    this.view.set(view);
    this.open.set(true);
  }

  acceptAll(): void {
    this.save({ analytics: true, marketing: true });
  }

  rejectOptional(): void {
    this.save({ analytics: false, marketing: false });
  }

  save(choice: ConsentChoice): void {
    const record: ConsentRecord = {
      necessary: true,
      analytics: choice.analytics,
      marketing: choice.marketing,
      at: new Date().toISOString(),
      v: this.version,
    };
    this.record.set(record);
    this.open.set(false);
    this.writeStorage(JSON.stringify(record));
    this.runGranted();
    this.window?.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: record }));
  }

  private runGranted(): void {
    const ready = this.pending.filter((task) => this.isGranted(task.category));
    this.pending = this.pending.filter((task) => !ready.includes(task));
    for (const task of ready) task.run();
  }

  // Storage can throw (privacy modes, disabled cookies); the site must keep working without it.
  private readStorage(): string | null {
    try {
      return this.window?.localStorage.getItem(CONSENT_STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private writeStorage(value: string): void {
    try {
      this.window?.localStorage.setItem(CONSENT_STORAGE_KEY, value);
    } catch {
      // The choice still applies for this visit.
    }
  }
}
