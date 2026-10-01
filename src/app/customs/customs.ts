import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../i18n';
import { MediaCard, MediaCardData } from '../shared/media-card/media-card';
import { SiteFooter } from '../shared/site-footer/site-footer';
import { SiteHeader } from '../shared/site-header/site-header';
import { Seo } from '../seo';

/** "Customs and logistics" page. */
@Component({
  selector: 'app-customs',
  imports: [SiteHeader, SiteFooter, MediaCard, RouterLink],
  templateUrl: './customs.html',
  styleUrl: '../shared/info-page.css',
})
export default class Customs {
  /** Online ordering is not live yet, so every call to action leads to the order page. */
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');

  protected readonly services: MediaCardData[] = [
    {
      image: 'images/customs/transport',
      icon: 'truck',
      alt: $localize`:@@customs.transport.imgAlt:Біла рефрижераторна вантажівка BerryTrace з відчиненими дверима на навантажувальній рампі`,
      title: $localize`:@@customs.transport.title:Рефрижераторний транспорт`,
      text: $localize`:@@customs.transport.text:Підбираємо перевізника й контролюємо температурний режим протягом усього шляху.`,
    },
    {
      image: 'images/customs/documents',
      icon: 'doc',
      alt: $localize`:@@customs.documents.imgAlt:Експортні документи в бордовій папці з ручкою та малиною`,
      title: $localize`:@@customs.documents.title:Експортні документи`,
      text: $localize`:@@customs.documents.text:Готуємо повний комплект документів на партію, включно із сертифікатами якості та походження.`,
    },
    {
      image: 'images/customs/clearance',
      icon: 'gate',
      alt: $localize`:@@customs.clearance.imgAlt:Вантажівка BerryTrace на митному пункті, водій передає папку з документами у віконце`,
      title: $localize`:@@customs.clearance.title:Митне оформлення`,
      text: $localize`:@@customs.clearance.text:Супроводжуємо оформлення на кордоні та вчасно готуємо документи для митниці.`,
    },
    {
      image: 'images/customs/lab',
      icon: 'flask',
      alt: $localize`:@@customs.lab.imgAlt:Лаборант у рукавичках розставляє зразки малини та чорниці для аналізу`,
      title: $localize`:@@customs.lab.title:Аналізи партії`,
      text: $localize`:@@customs.lab.text:Організовуємо відбір проб і лабораторні аналізи за показниками, які ви вкажете.`,
    },
    {
      image: 'images/customs/tracking',
      icon: 'pin',
      alt: $localize`:@@customs.tracking.imgAlt:Вантажівка BerryTrace на трасі серед ранкових полів`,
      title: $localize`:@@customs.tracking.title:Статус партії`,
      text: $localize`:@@customs.tracking.text:Повідомляємо, на якому етапі ваша партія, від завантаження до прибуття.`,
    },
    {
      image: 'images/customs/manager',
      icon: 'user',
      alt: $localize`:@@customs.manager.imgAlt:Смартфон із чатом, навушники та миска ягід на столі`,
      title: $localize`:@@customs.manager.title:Єдина точка контакту`,
      text: $localize`:@@customs.manager.text:Один менеджер для всіх питань щодо поставки — від заводу до вашого складу.`,
    },
  ];

  protected readonly steps = [
    {
      title: $localize`:@@customs.step1.title:Формуємо партію`,
      text: $localize`:@@customs.step1.text:Узгоджуємо обсяг, пакування та терміни готовності з виробником.`,
    },
    {
      title: $localize`:@@customs.step2.title:Готуємо документи`,
      text: $localize`:@@customs.step2.text:Збираємо сертифікати й оформлюємо експортні документи.`,
    },
    {
      title: $localize`:@@customs.step3.title:Перевозимо та оформлюємо`,
      text: $localize`:@@customs.step3.text:Організовуємо рефрижераторне перевезення й проходження митниці.`,
    },
    {
      title: $localize`:@@customs.step4.title:Доставляємо на склад`,
      text: $localize`:@@customs.step4.text:Партія прибуває до вас разом із повним пакетом документів.`,
    },
  ];

  constructor() {
    inject(Seo).set({
      page: 'customs',
      title: $localize`:@@customs.meta.title:Митниця і логістика — BerryTrace`,
      description: $localize`:@@customs.meta.description:Рефрижераторна доставка IQF-ягоди, експортні документи та митне оформлення — від виробника до вашого складу. Одна команда на всьому шляху.`,
    });
  }
}
