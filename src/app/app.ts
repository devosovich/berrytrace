import { DOCUMENT, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectLocale } from '@analogjs/router/tokens';

import { DEFAULT_LOCALE, isLocale } from './i18n';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {
  constructor() {
    const locale = injectLocale();
    inject(DOCUMENT).documentElement.lang = isLocale(locale) ? locale : DEFAULT_LOCALE;
  }
}
