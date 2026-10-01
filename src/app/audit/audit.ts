import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

import { injectCurrentLocale, localeRoute } from '../i18n';
import { SiteFooter } from '../shared/site-footer/site-footer';
import { SiteHeader } from '../shared/site-header/site-header';
import { AuditBrief } from './audit-brief/audit-brief';
import { Seo } from '../seo';

type ReportStatus = 'ok' | 'remark' | 'pending';

/** "Producer audits" page: independent audits of IQF berry producers, run against the buyer's brief. */
@Component({
  selector: 'app-audit',
  imports: [SiteHeader, SiteFooter, AuditBrief, RouterLink],
  templateUrl: './audit.html',
  styleUrl: './audit.css',
})
export default class Audit {
  /** "Order an audit" leads to the order page while online ordering is not live yet. */
  protected readonly order = localeRoute(injectCurrentLocale(), 'order');

  protected readonly steps = [
    {
      title: $localize`:@@audit.step1.title:Оберіть виробника`,
      text: $localize`:@@audit.step1.text:З каталогу платформи або вкажіть власного постачальника, якого хочете перевірити.`,
    },
    {
      title: $localize`:@@audit.step2.title:Складіть технічне завдання`,
      text: $localize`:@@audit.step2.text:Опишіть, що вимагається від аудитора: які зони, документи, процеси й партії перевірити та в які терміни.`,
    },
    {
      title: $localize`:@@audit.step3.title:Аудитор виїжджає на виробництво`,
      text: $localize`:@@audit.step3.text:Незалежний аудитор проводить перевірку на місці строго за вашим ТЗ, з фото- та відеофіксацією.`,
    },
    {
      title: $localize`:@@audit.step4.title:Отримайте звіт у кабінеті`,
      text: $localize`:@@audit.step4.text:Звіт з висновками по кожному пункту ТЗ з'являється у вашому кабінеті на платформі.`,
    },
  ];

  protected readonly reportPoints = [
    $localize`:@@audit.report.point1:Висновок по кожному пункту вашого ТЗ: відповідає, зауваження чи невідповідність`,
    $localize`:@@audit.report.point2:Фото й відео з виробництва, прив'язані до конкретних пунктів`,
    $localize`:@@audit.report.point3:Копії документів і результати лабораторних аналізів`,
    $localize`:@@audit.report.point4:Загальний висновок аудитора та рекомендації`,
    $localize`:@@audit.report.point5:Усі звіти зберігаються в кабінеті — їх можна завантажити в PDF і поділитися з командою`,
  ];

  /** Rows of the sample report; titles match the "What can be included" cards. */
  protected readonly reportItems: { title: string; status: ReportStatus }[] = [
    { title: $localize`:@@audit.include.capacity.title:Потужності та обсяги`, status: 'ok' },
    { title: $localize`:@@audit.include.cold.title:Холодний ланцюг`, status: 'ok' },
    { title: $localize`:@@audit.include.docs.title:Сертифікати й документи`, status: 'remark' },
    { title: $localize`:@@audit.include.trace.title:Простежуваність партій`, status: 'ok' },
    { title: $localize`:@@audit.include.lab.title:Відбір проб і аналізи`, status: 'pending' },
  ];

  protected readonly statusLabels: Record<ReportStatus, string> = {
    ok: $localize`:@@audit.report.status.ok:Відповідає`,
    remark: $localize`:@@audit.report.status.remark:Зауваження`,
    pending: $localize`:@@audit.report.status.pending:Очікує лабораторію`,
  };

  constructor() {
    inject(Title).setTitle($localize`:@@audit.meta.title:Аудит виробників IQF-ягоди — BerryTrace`);
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@audit.meta.description:Незалежний аудит виробника IQF-ягоди за вашим технічним завданням: потужності, холодний ланцюг, документи, простежуваність, проби. Звіт — у кабінеті на платформі.`,
    });
    inject(Seo).update('audit');
  }
}
