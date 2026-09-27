import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieBanner } from './cookie-banner';
import { CONSENT_STORAGE_KEY, CookieConsent } from './cookie-consent';

describe('CookieBanner', () => {
  let fixture: ComponentFixture<CookieBanner>;
  let consent: CookieConsent;
  let element: HTMLElement;

  const button = (label: string) =>
    [...element.querySelectorAll('button')].find((b) => b.textContent?.trim() === label)!;
  const switches = () => [...element.querySelectorAll<HTMLButtonElement>('[role="switch"]')];

  beforeEach(async () => {
    localStorage.clear();
    consent = TestBed.inject(CookieConsent);
    consent.restore();
    fixture = TestBed.createComponent(CookieBanner);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('is an accessible dialog labelled by its title and text', () => {
    const dialog = element.querySelector('[role="dialog"]')!;

    expect(element.querySelector(`#${dialog.getAttribute('aria-labelledby')}`)?.textContent).toContain('cookie');
    expect(element.querySelector(`#${dialog.getAttribute('aria-describedby')}`)).not.toBeNull();
  });

  it('offers both choices without a close button', () => {
    expect(button('Лише необхідні')).toBeTruthy();
    expect(button('Прийняти всі')).toBeTruthy();
    expect(element.querySelector('[aria-label*="Закрити"], [aria-label*="Close"]')).toBeNull();
  });

  it('"Necessary only" stores both optional categories as declined', () => {
    button('Лише необхідні').click();

    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject({ analytics: false, marketing: false });
    expect(consent.open()).toBe(false);
  });

  it('settings start with every optional category off and save the chosen ones', async () => {
    button('Налаштувати').click();
    await fixture.whenStable();

    expect(switches().map((s) => s.getAttribute('aria-checked'))).toEqual(['false', 'false']);

    switches()[0].click();
    await fixture.whenStable();
    expect(switches()[0].getAttribute('aria-checked')).toBe('true');

    button('Зберегти вибір').click();

    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!)).toMatchObject({ analytics: true, marketing: false });
  });

  it('"Back" returns from settings to the banner', async () => {
    button('Налаштувати').click();
    await fixture.whenStable();
    button('Назад').click();
    await fixture.whenStable();

    expect(switches()).toHaveLength(0);
    expect(button('Лише необхідні')).toBeTruthy();
  });
});
