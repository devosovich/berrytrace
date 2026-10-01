import { Component } from '@angular/core';

import { Logo } from '../../shared/logo/logo';
import { SITE_CONFIG, phoneLink, whatsappLink } from '../../site-config';

/** Chat-style card that sends visitors to WhatsApp while online ordering is not live yet. */
@Component({
  selector: 'app-whatsapp-card',
  imports: [Logo],
  templateUrl: './whatsapp-card.html',
  styleUrl: './whatsapp-card.css',
})
export class WhatsappCard {
  protected readonly phone = SITE_CONFIG.phoneNumber;
  protected readonly phoneHref = phoneLink();
  protected readonly chatLink = whatsappLink();

  /** Quick replies; each opens WhatsApp with the message already typed. */
  protected readonly quickReplies = [
    {
      label: $localize`:@@order.whatsapp.chip.order:Замовити партію`,
      link: whatsappLink($localize`:@@order.whatsapp.prefill.order:Добрий день! Хочу замовити партію IQF-ягоди.`),
    },
    {
      label: $localize`:@@order.whatsapp.chip.prices:Дізнатися ціни`,
      link: whatsappLink($localize`:@@order.whatsapp.prefill.prices:Добрий день! Підкажіть, будь ласка, актуальні ціни на IQF-ягоду.`),
    },
    {
      label: $localize`:@@order.whatsapp.chip.supplier:Стати постачальником`,
      link: whatsappLink($localize`:@@order.whatsapp.prefill.supplier:Добрий день! Хочу стати постачальником BerryTrace.`),
    },
  ];
}
