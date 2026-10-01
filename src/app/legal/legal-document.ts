import { Component, input } from '@angular/core';

import { SiteFooter } from '../shared/site-footer/site-footer';
import { SiteHeader } from '../shared/site-header/site-header';

export interface LegalSection {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly items: readonly string[];
}

export interface LegalImage {
  /** Image path without extension or size suffix, e.g. `images/pages/privacy` (needs `-640.webp` and `.webp` at 1024 px). */
  readonly image: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

/** Layout shared by the privacy policy and the public offer: header photo, title and numbered sections. */
@Component({
  selector: 'app-legal-document',
  imports: [SiteHeader, SiteFooter],
  templateUrl: './legal-document.html',
  styleUrl: '../shared/info-page.css',
})
export class LegalDocument {
  readonly title = input.required<string>();
  readonly lead = input.required<string>();
  readonly image = input.required<LegalImage>();
  readonly sections = input.required<readonly LegalSection[]>();
}
