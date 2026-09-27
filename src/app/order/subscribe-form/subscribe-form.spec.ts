import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Newsletter, isValidEmail } from '../newsletter';
import { SubscribeForm } from './subscribe-form';

describe('isValidEmail', () => {
  it.each(['name@company.com', ' name@company.com ', 'a.b+c@sub.domain.pl'])('accepts %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(['', 'name', 'name@', 'name@company', '@company.com', 'na me@company.com'])('rejects "%s"', (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe('SubscribeForm', () => {
  let fixture: ComponentFixture<SubscribeForm>;
  let element: HTMLElement;
  let subscribe: ReturnType<typeof vi.fn>;

  const input = () => element.querySelector<HTMLInputElement>('#bt-email')!;
  const honeypot = () => element.querySelector<HTMLInputElement>('input[name="website"]')!;
  const submitButton = () => element.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const alertText = () => element.querySelector('[role="alert"]')?.textContent?.trim();

  function type(value: string): void {
    input().value = value;
    input().dispatchEvent(new Event('input'));
  }

  async function submit(): Promise<void> {
    element.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();
  }

  beforeEach(async () => {
    subscribe = vi.fn().mockResolvedValue(undefined);
    TestBed.configureTestingModule({ providers: [{ provide: Newsletter, useValue: { subscribe } }] });
    fixture = TestBed.createComponent(SubscribeForm);
    element = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('shows an error for an invalid address and does not send it', async () => {
    type('name@company');
    await submit();

    expect(alertText()).toBe('Перевірте, будь ласка, адресу email.');
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(input().getAttribute('aria-describedby')).toBe('bt-email-error');
    expect(subscribe).not.toHaveBeenCalled();
  });

  it('clears the error once the address is edited', async () => {
    type('bad');
    await submit();
    type('bad@');
    await fixture.whenStable();

    expect(alertText()).toBeUndefined();
    expect(input().getAttribute('aria-invalid')).toBe('false');
  });

  it('subscribes a valid address and confirms it', async () => {
    type('  name@company.com ');
    await submit();

    expect(subscribe).toHaveBeenCalledWith('name@company.com', 'en');
    const confirmation = element.querySelector('[role="status"]')!;
    expect(confirmation.textContent).toContain('Дякуємо! Ви в списку.');
    expect(confirmation.textContent).toContain('name@company.com');
    expect(element.querySelector('form')).toBeNull();
  });

  it('disables the button while sending and subscribes only once on repeated submits', async () => {
    let resolve!: () => void;
    subscribe.mockReturnValue(new Promise<void>((r) => (resolve = r)));
    type('name@company.com');

    await submit();
    expect(submitButton().disabled).toBe(true);
    expect(submitButton().getAttribute('aria-busy')).toBe('true');

    await submit();
    await submit();
    expect(subscribe).toHaveBeenCalledTimes(1);

    resolve();
    await Promise.resolve(); // let submit() continue after the request settles
    await fixture.whenStable();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Дякуємо');
  });

  it('shows a server error and lets the visitor retry', async () => {
    subscribe.mockRejectedValueOnce(new Error('500'));
    type('name@company.com');

    await submit();
    expect(alertText()).toContain('Не вдалося оформити підписку');
    expect(submitButton().disabled).toBe(false);

    await submit();
    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Дякуємо');
  });

  it('pretends to succeed for bots that fill the honeypot, without sending', async () => {
    type('bot@spam.com');
    honeypot().value = 'https://spam.example';
    await submit();

    expect(subscribe).not.toHaveBeenCalled();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Дякуємо');
  });
});
