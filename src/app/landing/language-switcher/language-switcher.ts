import { Component, input } from '@angular/core';
import { injectLocale } from '@analogjs/router/tokens';

import { DEFAULT_LOCALE, LOCALES, Locale, isLocale, localeUrl } from '../../i18n';

const LABELS: Record<Locale, string> = { uk: 'UA', en: 'EN', pl: 'PL' };

@Component({
  selector: 'app-language-switcher',
  template: `
    @for (locale of locales; track locale) {
      <button
        type="button"
        [class.active]="locale === current"
        [attr.aria-pressed]="locale === current"
        [attr.lang]="locale"
        (click)="select(locale)"
      >
        {{ labels[locale] }}
      </button>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 2px;
      border: 1px solid #ebdde0;
      border-radius: 999px;
      padding: 3px;
      background: var(--surface);
    }

    button {
      border: none;
      background: none;
      cursor: pointer;
      color: #6b6563;
      padding: 6px 12px;
      border-radius: 999px;
      font-family: 'Archivo', Helvetica, sans-serif;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.04em;
    }

    button.active {
      background: linear-gradient(135deg, #a32639, #7d1f2e);
      color: #fdfdfc;
      cursor: default;
    }
  `,
  host: {
    role: 'group',
    'aria-label': 'Language',
    '[style.--surface]': 'surface()',
  },
})
export class LanguageSwitcher {
  readonly surface = input('transparent');

  protected readonly locales = LOCALES;
  protected readonly labels = LABELS;

  private readonly locale = injectLocale();
  protected readonly current: Locale = isLocale(this.locale) ? this.locale : DEFAULT_LOCALE;

  protected select(locale: Locale): void {
    if (locale !== this.current) {
      // Full page load so every $localize message is rendered with the new translations.
      window.location.href = localeUrl(locale) + window.location.hash;
    }
  }
}
