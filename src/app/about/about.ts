import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../i18n';
import { SiteFooter } from '../shared/site-footer/site-footer';
import { SiteHeader } from '../shared/site-header/site-header';
import { Seo } from '../seo';

/** "About us" page. */
@Component({
  selector: 'app-about',
  imports: [SiteHeader, SiteFooter, RouterLink],
  templateUrl: './about.html',
  styleUrl: '../shared/info-page.css',
})
export default class About {
  /** Online ordering is not live yet, so every call to action leads to the order page. */
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');
  protected readonly home = localeRoute(injectCurrentLocale());

  constructor() {
    inject(Title).setTitle($localize`:@@about.meta.title:Про нас — BerryTrace`);
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@about.meta.description:BerryTrace — B2B-сервіс постачання української IQF-ягоди: співпрацюємо з надійними перевіреними виробниками та контролюємо якість, логістику й документи на кожному етапі.`,
    });
    inject(Seo).update('about');
  }
}
