import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../../i18n';

@Component({
  selector: 'app-cta',
  imports: [RouterLink],
  templateUrl: './cta.html',
  styleUrl: './cta.css',
})
export class Cta {
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');
}
