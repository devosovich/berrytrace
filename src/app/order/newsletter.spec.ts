import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SITE_CONFIG } from '../site-config';
import { Newsletter, isMailerLiteEndpoint } from './newsletter';

const MAILERLITE = 'https://assets.mailerlite.com/jsonp/2681876/forms/200334407506069320/subscribe';

describe('isMailerLiteEndpoint', () => {
  it('recognises MailerLite form endpoints only', () => {
    expect(isMailerLiteEndpoint(MAILERLITE)).toBe(true);
    expect(isMailerLiteEndpoint('https://example.com/subscribe')).toBe(false);
    expect(isMailerLiteEndpoint('https://mailerlite.com.evil.example/x')).toBe(false);
    expect(isMailerLiteEndpoint('')).toBe(false);
  });
});

describe('Newsletter', () => {
  const config = SITE_CONFIG as { subscribeEndpoint: string; subscribeLanguageField: string };
  let http: HttpTestingController;
  let newsletter: Newsletter;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
    newsletter = TestBed.inject(Newsletter);
  });

  afterEach(() => {
    config.subscribeEndpoint = '';
    config.subscribeLanguageField = '';
    http.verify();
  });

  it('rejects when no endpoint is configured', async () => {
    await expect(newsletter.subscribe('a@b.co', 'en')).rejects.toThrow(/not configured/);
  });

  it('posts JSON to a generic endpoint', async () => {
    config.subscribeEndpoint = 'https://example.com/subscribe';
    const done = newsletter.subscribe('a@b.co', 'pl');

    const req = http.expectOne('https://example.com/subscribe');
    expect(req.request.body).toEqual({ email: 'a@b.co', locale: 'pl' });
    req.flush('ok');
    await done;
  });

  it('posts multipart form data to a MailerLite endpoint', async () => {
    config.subscribeEndpoint = MAILERLITE;
    const done = newsletter.subscribe('a@b.co', 'uk');

    const req = http.expectOne(MAILERLITE);
    const body = req.request.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get('fields[email]')).toBe('a@b.co');
    expect(body.get('ml-submit')).toBe('1');
    expect(body.get('anticsrf')).toBe('true');
    expect(body.has('fields[language]')).toBe(false);
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush({ success: true });
    await done;
  });

  it('sends the locale in the configured MailerLite field', async () => {
    config.subscribeEndpoint = MAILERLITE;
    config.subscribeLanguageField = 'language';
    const done = newsletter.subscribe('a@b.co', 'uk');

    const req = http.expectOne(MAILERLITE);
    expect((req.request.body as FormData).get('fields[language]')).toBe('uk');
    req.flush({ success: true });
    await done;
  });

  it('rejects when MailerLite does not report success', async () => {
    config.subscribeEndpoint = MAILERLITE;
    const done = newsletter.subscribe('a@b.co', 'en');

    http.expectOne(MAILERLITE).flush({ success: false, errors: { fields: { email: ['Invalid'] } } });
    await expect(done).rejects.toThrow(/did not accept/);
  });
});
