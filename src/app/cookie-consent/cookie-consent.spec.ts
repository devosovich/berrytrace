import { TestBed } from '@angular/core/testing';

import { SITE_CONFIG } from '../site-config';
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_STORAGE_KEY,
  ConsentRecord,
  CookieConsent,
  parseConsent,
} from './cookie-consent';

const VERSION = SITE_CONFIG.cookiePolicyVersion;

function stored(record: Partial<ConsentRecord>): string {
  return JSON.stringify({ necessary: true, analytics: false, marketing: false, at: '2026-01-01T00:00:00.000Z', v: VERSION, ...record });
}

describe('parseConsent', () => {
  it('returns null when nothing is stored', () => {
    expect(parseConsent(null, VERSION)).toBeNull();
  });

  it('returns null for malformed values', () => {
    expect(parseConsent('not json', VERSION)).toBeNull();
    expect(parseConsent('{"analytics":"yes","marketing":false,"v":1}', VERSION)).toBeNull();
    expect(parseConsent('{"analytics":true}', VERSION)).toBeNull();
  });

  it('returns null for a choice made under an older policy version', () => {
    expect(parseConsent(stored({ v: VERSION - 1 }), VERSION)).toBeNull();
  });

  it('reads a valid record', () => {
    expect(parseConsent(stored({ analytics: true }), VERSION)).toEqual({
      necessary: true,
      analytics: true,
      marketing: false,
      at: '2026-01-01T00:00:00.000Z',
      v: VERSION,
    });
  });
});

describe('CookieConsent', () => {
  let consent: CookieConsent;

  beforeEach(() => {
    localStorage.clear();
    consent = TestBed.inject(CookieConsent);
  });

  it('shows the banner when there is no stored choice', () => {
    consent.restore();

    expect(consent.open()).toBe(true);
    expect(consent.view()).toBe('banner');
    expect(consent.consent()).toBeNull();
  });

  it('does not show the banner again once a choice is stored', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, stored({ analytics: true }));

    consent.restore();

    expect(consent.open()).toBe(false);
    expect(consent.analytics()).toBe(true);
    expect(consent.marketing()).toBe(false);
  });

  it('asks again when the stored choice is for an older policy version', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, stored({ analytics: true, v: VERSION - 1 }));

    consent.restore();

    expect(consent.open()).toBe(true);
    expect(consent.analytics()).toBe(false);
  });

  it('stores "accept all" in the documented format and closes the banner', () => {
    consent.restore();
    consent.acceptAll();

    const saved = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!);
    expect(saved).toEqual({ necessary: true, analytics: true, marketing: true, at: expect.any(String), v: VERSION });
    expect(new Date(saved.at).toISOString()).toBe(saved.at);
    expect(consent.open()).toBe(false);
  });

  it('stores "necessary only" with both optional categories off', () => {
    consent.rejectOptional();

    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject({ analytics: false, marketing: false });
  });

  it('stores a custom choice', () => {
    consent.save({ analytics: false, marketing: true });

    expect(consent.isGranted('analytics')).toBe(false);
    expect(consent.isGranted('marketing')).toBe(true);
  });

  it('runs category code only after consent, without a reload', () => {
    const loadAnalytics = vi.fn();
    const loadMarketing = vi.fn();
    consent.restore();

    consent.whenGranted('analytics', loadAnalytics);
    consent.whenGranted('marketing', loadMarketing);
    expect(loadAnalytics).not.toHaveBeenCalled();

    consent.save({ analytics: true, marketing: false });
    expect(loadAnalytics).toHaveBeenCalledTimes(1);
    expect(loadMarketing).not.toHaveBeenCalled();

    // Saving again does not load the same code twice.
    consent.acceptAll();
    expect(loadAnalytics).toHaveBeenCalledTimes(1);
    expect(loadMarketing).toHaveBeenCalledTimes(1);
  });

  it('runs category code immediately when consent was given on an earlier visit', () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, stored({ analytics: true }));
    consent.restore();
    const loadAnalytics = vi.fn();

    consent.whenGranted('analytics', loadAnalytics);

    expect(loadAnalytics).toHaveBeenCalledTimes(1);
  });

  it('never runs category code when the visitor declines', () => {
    const loadAnalytics = vi.fn();
    consent.whenGranted('analytics', loadAnalytics);

    consent.rejectOptional();

    expect(loadAnalytics).not.toHaveBeenCalled();
  });

  it('announces changes to non-Angular scripts', () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_CHANGE_EVENT, listener);

    consent.save({ analytics: true, marketing: false });

    window.removeEventListener(CONSENT_CHANGE_EVENT, listener);
    expect((listener.mock.calls[0][0] as CustomEvent<ConsentRecord>).detail).toMatchObject({ analytics: true, marketing: false });
  });

  it('reopens in the settings view (footer "Cookie settings" link)', () => {
    consent.acceptAll();

    consent.show();

    expect(consent.open()).toBe(true);
    expect(consent.view()).toBe('settings');
  });

  it('keeps working when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    consent.restore();
    expect(consent.open()).toBe(true);
    expect(() => consent.acceptAll()).not.toThrow();
    expect(consent.isGranted('analytics')).toBe(true);

    vi.restoreAllMocks();
  });
});
