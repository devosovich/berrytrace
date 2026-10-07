import { TrackLead } from '../analytics';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../i18n';
import { SiteFooter } from '../shared/site-footer/site-footer';
import { SiteHeader } from '../shared/site-header/site-header';
import { whatsappLink } from '../site-config';
import { SubscribeForm } from './subscribe-form/subscribe-form';
import { WhatsappCard } from './whatsapp-card/whatsapp-card';
import { Seo } from '../seo';

/** "Order berries" page: online ordering is not live yet, so it offers a mailing list and WhatsApp. */
@Component({
  selector: 'app-order',
  imports: [TrackLead, SiteHeader, SiteFooter, SubscribeForm, WhatsappCard, RouterLink],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export default class Order {
  protected readonly home = localeRoute(injectCurrentLocale());
  protected readonly chatLink = whatsappLink();

  constructor() {
    inject(Seo).set({
      page: 'order',
      title: $localize`:@@order.meta.title:Замовити ягоду — BerryTrace`,
      description: $localize`:@@order.meta.description:Онлайн-замовлення IQF-ягоди на BerryTrace скоро запрацює. Підпишіться на повідомлення або напишіть нам у WhatsApp.`,
    });
  }
}
