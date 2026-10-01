import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../i18n';
import { MediaCard, MediaCardData } from '../shared/media-card/media-card';
import { SiteFooter } from '../shared/site-footer/site-footer';
import { SiteHeader } from '../shared/site-header/site-header';
import { Seo } from '../seo';

/** "About us" page. */
@Component({
  selector: 'app-about',
  imports: [SiteHeader, SiteFooter, MediaCard, RouterLink],
  templateUrl: './about.html',
  styleUrl: '../shared/info-page.css',
})
export default class About {
  /** Online ordering is not live yet, so every call to action leads to the order page. */
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');
  protected readonly home = localeRoute(injectCurrentLocale());

  protected readonly services: MediaCardData[] = [
    {
      image: 'images/about/producers',
      icon: 'shield',
      alt: $localize`:@@about.do.producers.imgAlt:Перевірений виробник заморожених ягід`,
      title: $localize`:@@about.do.producers.title:Надійні виробники`,
      text: $localize`:@@about.do.producers.text:Співпрацюємо лише з перевіреними виробниками: контролюємо якість продукції, сертифікацію та необхідні документи.`,
    },
    {
      image: 'images/about/transparency',
      icon: 'eye',
      alt: $localize`:@@about.do.transparency.imgAlt:Планшет із відстеженням партії на палеті з ящиками заморожених ягід`,
      title: $localize`:@@about.do.transparency.title:Прозорість кожної партії`,
      text: $localize`:@@about.do.transparency.text:Ви знаєте походження продукції, що саме отримуєте і де зараз ваша партія — на кожному етапі.`,
    },
    {
      image: 'images/about/logistics',
      icon: 'truck',
      alt: $localize`:@@about.do.logistics.imgAlt:Рефрижераторна логістика та документи`,
      title: $localize`:@@about.do.logistics.title:Логістика та документи`,
      text: $localize`:@@about.do.logistics.text:Координуємо формування партії, рефрижераторний транспорт, експортні документи та доставку.`,
    },
  ];

  protected readonly principles: MediaCardData[] = [
    {
      image: 'images/about/principle1',
      icon: 'eye',
      alt: $localize`:@@about.principle1.imgAlt:Скляна банка із замороженою малиною та лупа на білому столі`,
      title: $localize`:@@about.principle1.title:Прозорість`,
      text: $localize`:@@about.principle1.text:Відкрито показуємо, звідки походить продукція та як проходить поставка.`,
    },
    {
      image: 'images/about/principle2',
      icon: 'award',
      alt: $localize`:@@about.principle2.imgAlt:Лаборант у рукавичках тримає лоток із замороженими ягодами для перевірки`,
      title: $localize`:@@about.principle2.title:Якість`,
      text: $localize`:@@about.principle2.text:Працюємо лише з виробниками, які підтверджують якість документами та аналізами.`,
    },
    {
      image: 'images/about/principle3',
      icon: 'shield',
      alt: $localize`:@@about.principle3.imgAlt:Відповідальність: контроль на місці виробництва`,
      title: $localize`:@@about.principle3.title:Відповідальність`,
      text: $localize`:@@about.principle3.text:Відповідаємо перед клієнтом за результат поставки й шукаємо рішення, коли щось іде не за планом.`,
    },
    {
      image: 'images/about/principle4',
      icon: 'sparkle',
      alt: $localize`:@@about.principle4.imgAlt:Ноутбук, чашка та миска ягід на світлому робочому столі`,
      title: $localize`:@@about.principle4.title:Простота`,
      text: $localize`:@@about.principle4.text:Мінімум бюрократії: запит, пропозиція й поставка — в одному місці.`,
    },
  ];

  constructor() {
    inject(Seo).set({
      page: 'about',
      title: $localize`:@@about.meta.title:Про нас — BerryTrace`,
      description: $localize`:@@about.meta.description:BerryTrace — B2B-сервіс постачання української IQF-ягоди: співпрацюємо з надійними перевіреними виробниками та контролюємо якість, логістику й документи на кожному етапі.`,
    });
  }
}
