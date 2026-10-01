import { Component, computed, input } from '@angular/core';

import { ICONS, IconName } from './icons';

/** Content of one card; the page supplies already translated text. */
export interface MediaCardData {
  /** Image path without extension or size suffix, e.g. `images/about/producers` (needs `-480.webp` and `.webp` at 800 px). */
  readonly image: string;
  readonly alt: string;
  readonly icon: IconName;
  readonly title: string;
  readonly text: string;
}

/** Card with an inset photo, a red icon badge overlapping its corner, a title and a short text. */
@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.html',
  styleUrl: './media-card.css',
})
export class MediaCard {
  readonly card = input.required<MediaCardData>();

  protected readonly paths = computed(() => ICONS[this.card().icon]);
  protected readonly src = computed(() => `${this.card().image}.webp`);
  protected readonly srcset = computed(() => `${this.card().image}-480.webp 480w, ${this.card().image}.webp 800w`);
}
