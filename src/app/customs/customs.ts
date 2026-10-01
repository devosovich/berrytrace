import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../i18n';
import { SiteFooter } from '../shared/site-footer/site-footer';
import { SiteHeader } from '../shared/site-header/site-header';
import { Seo } from '../seo';

/** "Customs and logistics" page. */
@Component({
  selector: 'app-customs',
  imports: [SiteHeader, SiteFooter, RouterLink],
  templateUrl: './customs.html',
  styleUrl: '../shared/info-page.css',
})
export default class Customs {
  /** Online ordering is not live yet, so every call to action leads to the order page. */
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');

  constructor() {
    inject(Title).setTitle($localize`:@@customs.meta.title:Митниця і логістика — BerryTrace`);
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@customs.meta.description:Рефрижераторна доставка IQF-ягоди, експортні документи та митне оформлення — від виробника до вашого складу. Одна команда на всьому шляху.`,
    });
    inject(Seo).update('customs');
  }
}
