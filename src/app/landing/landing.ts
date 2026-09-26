import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { Audience } from './audience/audience';
import { Cta } from './cta/cta';
import { Geography } from './geography/geography';
import { Hero } from './hero/hero';
import { Process } from './process/process';
import { SiteFooter } from './site-footer/site-footer';
import { SiteHeader } from './site-header/site-header';
import { Testimonials } from './testimonials/testimonials';
import { Trust } from './trust/trust';
import { TrustedBy } from './trusted-by/trusted-by';

@Component({
  selector: 'app-landing',
  imports: [SiteHeader, Hero, TrustedBy, Audience, Geography, Process, Testimonials, Trust, Cta, SiteFooter],
  template: `
    <app-site-header />
    <main>
      <app-hero />
      <app-trusted-by />
      <app-audience />
      <app-geography />
      <app-process />
      <app-testimonials />
      <app-trust />
      <app-cta />
    </main>
    <app-site-footer />
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      background: #fdfdfc;
      color: #3a3a3a;
    }
  `,
})
export default class Landing {
  constructor() {
    inject(Title).setTitle($localize`:@@meta.title:BerryTrace — IQF-ягода з України для B2B`);
    inject(Meta).updateTag({
      name: 'description',
      content: $localize`:@@meta.description:Перевірені українські виробники IQF-ягід, прозорий контроль кожної партії — від поля до складу — та мінімум бюрократії.`,
    });
  }
}
