import {
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { SITE_CONFIG } from '../site-config';
import { CookieConsent } from './cookie-consent';

/**
 * Cookie consent banner (bottom left, full width on phones). Rendered by `App` only in the
 * browser, while {@link CookieConsent.open} is true. There is deliberately no close button:
 * dismissing the banner must not be read as consent.
 */
@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.html',
  styleUrl: './cookie-banner.css',
})
export class CookieBanner {
  protected readonly consent = inject(CookieConsent);
  protected readonly privacyUrl = SITE_CONFIG.privacyPolicyUrl || null;

  /** Toggle positions in the settings view; applied only by "Save choice". Off by default. */
  protected readonly analytics = signal(this.consent.analytics());
  protected readonly marketing = signal(this.consent.marketing());

  private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');
  private readonly firstSwitch = viewChild<ElementRef<HTMLElement>>('firstSwitch');
  private readonly settingsButton = viewChild<ElementRef<HTMLElement>>('settingsButton');
  private readonly injector = inject(Injector);

  constructor() {
    // Move focus into the banner when it appears, and back to where it was once it closes
    // (e.g. the footer's "Cookie settings" link).
    const document = inject(DOCUMENT);
    const previous = document.activeElement;
    afterNextRender(() => this.dialog().nativeElement.focus());
    inject(DestroyRef).onDestroy(() => {
      if (previous instanceof HTMLElement && previous !== document.body && previous.isConnected) {
        previous.focus();
      }
    });
  }

  protected openSettings(): void {
    this.consent.view.set('settings');
    this.focusAfterRender(() => this.firstSwitch());
  }

  protected backToBanner(): void {
    this.consent.view.set('banner');
    this.focusAfterRender(() => this.settingsButton());
  }

  protected saveChoice(): void {
    this.consent.save({ analytics: this.analytics(), marketing: this.marketing() });
  }

  private focusAfterRender(target: () => ElementRef<HTMLElement> | undefined): void {
    afterNextRender(() => target()?.nativeElement.focus(), { injector: this.injector });
  }
}
