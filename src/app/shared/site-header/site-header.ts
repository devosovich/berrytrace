import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../../i18n';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-site-header',
  imports: [Logo, LanguageSwitcher, RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
  host: {
    '(document:keydown.escape)': 'closeMenu()',
    '(document:click)': 'closeOnOutsideClick($event)',
  },
})
export class SiteHeader {
  /** Burger menu state; the menu is only visible below the desktop breakpoint (see site-header.css). */
  protected readonly menuOpen = signal(false);

  private readonly locale = injectCurrentLocale();
  /** Section links point at the landing, so they also work from other pages such as /order. */
  protected readonly home = localeRoute(this.locale);
  protected readonly order = localeRoute(this.locale, 'order');
  protected readonly audit = localeRoute(this.locale, 'audit');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // The header is sticky, so stop anchor jumps (#process, #trust, …) just below it.
    inject(ViewportScroller).setOffset(() => [0, this.host.nativeElement.offsetHeight]);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected closeOnOutsideClick(event: MouseEvent): void {
    if (this.menuOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }
}
