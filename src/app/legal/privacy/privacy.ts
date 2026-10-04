import { Component, inject } from '@angular/core';

import { Seo } from '../../seo';
import { LegalDocument, LegalImage, LegalSection } from '../legal-document';

/** Privacy policy. Draft text: have it reviewed by a lawyer before relying on it. */
@Component({
  selector: 'app-privacy',
  imports: [LegalDocument],
  template: `<app-legal-document [title]="title" [lead]="lead" [image]="image" [sections]="sections" />`,
  styles: ':host { display: block; }',
})
export default class Privacy {
  protected readonly title = $localize`:@@privacy.title:Політика конфіденційності`;
  protected readonly lead = $localize`:@@privacy.lead:Пояснюємо, які дані ми збираємо на сайті BerryTrace, навіщо вони потрібні та як ви можете ними керувати.`;

  protected readonly image: LegalImage = {
    image: 'images/pages/privacy',
    width: 1024,
    height: 558,
    alt: $localize`:@@privacy.heroAlt:Ноутбук із замком, документи та папка на столі — захист ваших даних`,
  };

  protected readonly sections: LegalSection[] = [
    {
      title: $localize`:@@privacy.s1.title:1. Які дані ми збираємо`,
      paragraphs: [$localize`:@@privacy.s1.p1:Ми збираємо лише ті дані, які потрібні для роботи сайту та зв'язку з вами:`],
      items: [$localize`:@@privacy.s1.i1:адресу електронної пошти та мову сайту, якщо ви підписуєтеся на повідомлення про запуск платформи;`, $localize`:@@privacy.s1.i2:дані, які ви самі повідомляєте нам у WhatsApp або листом, зокрема імʼя, компанію та деталі запиту;`, $localize`:@@privacy.s1.i3:технічні дані та, за вашою згодою, аналітичні й маркетингові дані, які збирають cookie.`],
    },
    {
      title: $localize`:@@privacy.s2.title:2. Навіщо ми використовуємо дані`,
      paragraphs: [$localize`:@@privacy.s2.p1:Дані потрібні, щоб:`],
      items: [$localize`:@@privacy.s2.i1:повідомити вас про запуск онлайн-замовлень;`, $localize`:@@privacy.s2.i2:відповісти на ваш запит і підготувати комерційну пропозицію;`, $localize`:@@privacy.s2.i3:покращувати сайт та сервіс, якщо ви погодилися на аналітичні cookie.`],
    },
    {
      title: $localize`:@@privacy.s3.title:3. Cookie`,
      paragraphs: [$localize`:@@privacy.s3.p1:Необхідні cookie забезпечують роботу сайту й не потребують згоди. Аналітичні та маркетингові cookie ми вмикаємо лише після вашої згоди. Свій вибір можна змінити будь-коли через «Налаштування cookie» внизу сторінки. Ми зберігаємо його у вашому браузері.`],
      items: [],
    },
    {
      title: $localize`:@@privacy.s4.title:4. Передача даних третім особам`,
      paragraphs: [$localize`:@@privacy.s4.p1:Ми не продаємо ваші дані. Адресу електронної пошти для повідомлень про запуск платформи зберігає сервіс розсилок MailerLite, а також можуть оброблятися сервіси аналітики та хостингу — лише в обсязі, потрібному для цих цілей.`],
      items: [],
    },
    {
      title: $localize`:@@privacy.s5.title:5. Строки зберігання`,
      paragraphs: [$localize`:@@privacy.s5.p1:Ми зберігаємо дані не довше, ніж потрібно для цілей, заради яких їх зібрано. Ви можете будь-коли відписатися від повідомлень або попросити видалити ваші дані.`],
      items: [],
    },
    {
      title: $localize`:@@privacy.s6.title:6. Ваші права`,
      paragraphs: [$localize`:@@privacy.s6.p1:Ви можете запитати, які дані ми про вас маємо, виправити або видалити їх, обмежити обробку та відкликати згоду. Ці права діють згідно із законодавством України та, де це застосовно, Загальним регламентом ЄС із захисту даних (GDPR).`],
      items: [],
    },
    {
      title: $localize`:@@privacy.s7.title:7. Контакти`,
      paragraphs: [$localize`:@@privacy.s7.p1:З питань щодо персональних даних пишіть на info@berrytrace.com.`],
      items: [],
    },
  ];

  constructor() {
    inject(Seo).set({
      page: 'privacy',
      title: $localize`:@@privacy.meta.title:Політика конфіденційності — BerryTrace`,
      description: $localize`:@@privacy.meta.description:Які дані збирає BerryTrace, навіщо їх використовує, як довго зберігає та які права має користувач.`,
    });
  }
}
