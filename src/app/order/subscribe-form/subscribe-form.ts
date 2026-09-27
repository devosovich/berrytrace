import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

import { injectCurrentLocale } from '../../i18n';
import { Newsletter, isValidEmail } from '../newsletter';

/**
 * - `idle`: waiting for input
 * - `invalid`: the address failed the format check
 * - `loading`: request in flight; the button is disabled so a second click cannot subscribe twice
 * - `success`: signed up; the form is replaced by a confirmation
 * - `failed`: the request failed; submitting again retries
 */
export type SubscribeStatus = 'idle' | 'invalid' | 'loading' | 'success' | 'failed';

/** "Notify me when the platform launches" e-mail form on the order page. */
@Component({
  selector: 'app-subscribe-form',
  templateUrl: './subscribe-form.html',
  styleUrl: './subscribe-form.css',
})
export class SubscribeForm {
  private readonly newsletter = inject(Newsletter);
  private readonly locale = injectCurrentLocale();
  private readonly injector = inject(Injector);

  protected readonly status = signal<SubscribeStatus>('idle');
  protected readonly email = signal('');
  /** Address shown in the confirmation (trimmed, as sent). */
  protected readonly subscribedEmail = signal('');

  private readonly input = viewChild<ElementRef<HTMLInputElement>>('emailInput');
  private readonly confirmation = viewChild<ElementRef<HTMLElement>>('confirmation');

  protected onInput(value: string): void {
    this.email.set(value);
    if (this.status() === 'invalid' || this.status() === 'failed') {
      this.status.set('idle');
    }
  }

  /**
   * @param honeypot value of the hidden "website" field. People never see it; bots that fill in
   *   every field do. Such submissions get the normal confirmation but are not sent anywhere.
   */
  async submit(honeypot: string): Promise<void> {
    if (this.status() === 'loading' || this.status() === 'success') return;

    const email = this.email().trim();
    if (!isValidEmail(email)) {
      this.status.set('invalid');
      this.input()?.nativeElement.focus();
      return;
    }

    if (!honeypot) {
      this.status.set('loading');
      try {
        await this.newsletter.subscribe(email, this.locale);
      } catch {
        this.status.set('failed');
        return;
      }
    }

    this.subscribedEmail.set(email);
    this.status.set('success');
    // The form is replaced by the confirmation; move focus there so it is announced.
    afterNextRender(() => this.confirmation()?.nativeElement.focus(), { injector: this.injector });
  }
}
