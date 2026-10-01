import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { SiteFooter } from '../../shared/site-footer/site-footer';
import { SiteHeader } from '../../shared/site-header/site-header';

/** Public offer (terms of use). Draft text: have it reviewed by a lawyer before relying on it. */
@Component({
  selector: 'app-terms',
  imports: [SiteHeader, SiteFooter],
  templateUrl: '../legal.html',
  styleUrl: '../../shared/info-page.css',
})
export default class Terms {
  protected readonly title = $localize`:@@terms.title:Публічна оферта`;
  protected readonly lead = $localize`:@@terms.lead:Загальні умови користування сайтом BerryTrace та порядок взаємодії із замовниками.`;

  protected readonly image = {
    src: 'images/pages/terms.webp',
    srcset: 'images/pages/terms-640.webp 640w, images/pages/terms.webp 1024w',
    width: 1024,
    height: 559,
    alt: $localize`:@@terms.heroAlt:Договір із ручкою та печаткою на столі, у вікні — рукостискання`,
  };

  protected readonly sections = [
    {
      title: $localize`:@@terms.s1.title:1. Загальні положення`,
      paragraphs: [$localize`:@@terms.s1.p1:Цей документ визначає умови користування сайтом BerryTrace й порядок взаємодії між BerryTrace та замовниками. Користуючись сайтом або надсилаючи нам запит, ви погоджуєтеся з цими умовами.`],
      items: [],
    },
    {
      title: $localize`:@@terms.s2.title:2. Платформа та інформація на сайті`,
      paragraphs: [$localize`:@@terms.s2.p1:Онлайн-замовлення на платформі перебуває в розробці. Інформація на сайті має ознайомчий характер і не є остаточною пропозицією щодо конкретної партії, ціни чи терміну поставки.`],
      items: [],
    },
    {
      title: $localize`:@@terms.s3.title:3. Порядок замовлення`,
      paragraphs: [$localize`:@@terms.s3.p1:Замовлення оформлюється так:`],
      items: [$localize`:@@terms.s3.i1:ви надсилаєте запит із вимогами до продукту та сертифікатами;`, $localize`:@@terms.s3.i2:ми готуємо комерційну пропозицію з обсягом, ціною та строками;`, $localize`:@@terms.s3.i3:умови поставки фіксуються в окремому договорі або специфікації, погодженій сторонами.`],
    },
    {
      title: $localize`:@@terms.s4.title:4. Ціни та оплата`,
      paragraphs: [$localize`:@@terms.s4.p1:Ціни, валюта й порядок оплати визначаються індивідуально в комерційній пропозиції та договорі.`],
      items: [],
    },
    {
      title: $localize`:@@terms.s5.title:5. Поставка, якість і документи`,
      paragraphs: [$localize`:@@terms.s5.p1:Поставка, приймання, якість продукції та супровідні документи регулюються договором. Ми координуємо логістику й документи та повідомляємо про стан партії на кожному етапі.`],
      items: [],
    },
    {
      title: $localize`:@@terms.s6.title:6. Відповідальність`,
      paragraphs: [$localize`:@@terms.s6.p1:Сторони відповідають згідно із законодавством і умовами договору. Ми докладаємо зусиль, щоб інформація на сайті була точною, але не гарантуємо відсутності помилок чи неактуальних даних.`],
      items: [],
    },
    {
      title: $localize`:@@terms.s7.title:7. Персональні дані`,
      paragraphs: [$localize`:@@terms.s7.p1:Обробка персональних даних описана в Політиці конфіденційності.`],
      items: [],
    },
    {
      title: $localize`:@@terms.s8.title:8. Контакти`,
      paragraphs: [$localize`:@@terms.s8.p1:З питань щодо цієї оферти пишіть на sales@berrytrace.com.`],
      items: [],
    },
  ];

  constructor() {
    inject(Title).setTitle($localize`:@@terms.meta.title:Публічна оферта — BerryTrace`);
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@terms.meta.description:Публічна оферта BerryTrace: загальні умови користування сайтом і порядок взаємодії із замовниками.`,
    });
  }
}
