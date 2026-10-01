import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CookieConsent } from '../../cookie-consent/cookie-consent';
import { injectCurrentLocale, localeRoute } from '../../i18n';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { SITE_CONFIG, phoneLink } from '../../site-config';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-site-footer',
  imports: [Logo, LanguageSwitcher, RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  protected readonly cookieConsent = inject(CookieConsent);

  private readonly locale = injectCurrentLocale();
  protected readonly home = localeRoute(this.locale);
  protected readonly order = localeRoute(this.locale, 'order');
  protected readonly audit = localeRoute(this.locale, 'audit');
  protected readonly about = localeRoute(this.locale, 'about');
  protected readonly customs = localeRoute(this.locale, 'customs');
  protected readonly terms = localeRoute(this.locale, 'terms');
  protected readonly email = SITE_CONFIG.contactEmail;
  protected readonly emailLink = `mailto:${SITE_CONFIG.contactEmail}`;
  protected readonly phone = SITE_CONFIG.phoneNumber;
  protected readonly phoneLink = phoneLink();
  protected readonly privacy = localeRoute(this.locale, 'privacy');
}
