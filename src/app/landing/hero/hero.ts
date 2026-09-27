import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../../i18n';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');
}
