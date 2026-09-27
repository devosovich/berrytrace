import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { Audience } from './audience/audience';
import { Cta } from './cta/cta';
import { Geography } from './geography/geography';
import { Hero } from './hero/hero';
import { Process } from './process/process';
import { SiteFooter } from '../shared/site-footer/site-footer';
import { SiteHeader } from '../shared/site-header/site-header';
import { Testimonials } from './testimonials/testimonials';
import { Trust } from './trust/trust';
import { TrustedBy } from './trusted-by/trusted-by';

/**
 * Sections below the hero are prerendered as HTML like the rest of the page, but their code is only
 * downloaded and hydrated once they scroll into view (`hydrate on viewport`). `on immediate` covers
 * client-side navigation (e.g. from /order back to the landing), where there is no prerendered HTML
 * to hydrate: without a regular trigger those sections would never render.
 * `data-reveal` marks the sections that fade in on scroll (see `.bt-reveal` in styles.css).
 */
@Component({
  selector: 'app-landing',
  imports: [SiteHeader, Hero, TrustedBy, Audience, Geography, Process, Testimonials, Trust, Cta, SiteFooter],
  template: `
    <app-site-header />
    <main>
      <app-hero />
      @defer (on immediate; hydrate on viewport) {
        <app-trusted-by data-reveal />
      }
      @defer (on immediate; hydrate on viewport) {
        <app-audience data-reveal />
      }
      @defer (on immediate; hydrate on viewport) {
        <app-geography data-reveal />
      }
      @defer (on immediate; hydrate on viewport) {
        <app-process data-reveal />
      }
      @defer (on immediate; hydrate on viewport) {
        <app-testimonials data-reveal />
      }
      @defer (on immediate; hydrate on viewport) {
        <app-trust data-reveal />
      }
      @defer (on immediate; hydrate on viewport) {
        <app-cta data-reveal />
      }
    </main>
    @defer (on immediate; hydrate on viewport) {
      <app-site-footer data-reveal />
    }
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

    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);
    // Browser only: the prerendered HTML always shows every section fully.
    const fragment = inject(ActivatedRoute).snapshot.fragment;
    const scroller = inject(ViewportScroller);
    afterNextRender(() => {
      const observer = revealOnScroll(host.querySelectorAll<HTMLElement>('[data-reveal]'));
      const anchorWatch = fragment ? scrollWhenRendered(host, fragment, scroller) : undefined;
      destroyRef.onDestroy(() => {
        observer?.disconnect();
        anchorWatch?.disconnect();
      });
    });
  }
}

/**
 * Arriving from another page (e.g. /order → /#process), the router scrolls to the anchor before the
 * deferred sections exist. Wait for the target to render, then scroll to it (up to 5 s).
 */
function scrollWhenRendered(
  host: HTMLElement,
  id: string,
  scroller: ViewportScroller,
): MutationObserver | undefined {
  if (host.ownerDocument.getElementById(id)) {
    scroller.scrollToAnchor(id);
    return undefined;
  }
  const observer = new MutationObserver(() => {
    if (host.ownerDocument.getElementById(id)) {
      observer.disconnect();
      scroller.scrollToAnchor(id);
    }
  });
  observer.observe(host, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 5000);
  return observer;
}

/**
 * Hides sections that start below the fold and fades them in as they scroll into view. Sections
 * already on screen are left untouched so nothing flickers after the page loads.
 */
function revealOnScroll(elements: NodeListOf<HTMLElement>): IntersectionObserver | undefined {
  if (
    typeof IntersectionObserver === 'undefined' ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return undefined;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('bt-revealed');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );

  for (const element of elements) {
    if (element.getBoundingClientRect().top > innerHeight) {
      element.classList.add('bt-reveal');
      observer.observe(element);
    }
  }
  return observer;
}
