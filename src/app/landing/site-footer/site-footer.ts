import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-site-footer',
  imports: [Logo, LanguageSwitcher, RouterLink],
  templateUrl: './site-footer.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class SiteFooter {}
