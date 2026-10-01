import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../../i18n';

@Component({
  selector: 'app-geography',
  imports: [RouterLink],
  templateUrl: './geography.html',
  styleUrl: './geography.css',
})
export class Geography {
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');
}
