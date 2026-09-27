import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  template: `
    <svg viewBox="20 30 160 180" [attr.width]="width()" [attr.height]="height()" aria-hidden="true">
      <path d="M100,80 L100,44" fill="none" stroke-width="8" stroke-linecap="round" style="stroke: var(--bt-accent-green);"></path>
      @for (angle of leafAngles; track angle) {
        <path d="M100,46 L110,66 L100,82 L90,66 Z" [attr.transform]="'rotate(' + angle + ' 100 82)'" style="fill: var(--bt-accent-green);"></path>
      }
      <g [attr.stroke]="ring()" stroke-width="4" style="fill: var(--bt-accent);">
        @for (berry of berries; track $index) {
          <circle [attr.cx]="berry[0]" [attr.cy]="berry[1]" [attr.r]="berry[2]"></circle>
        }
      </g>
    </svg>
    @if (wordmark()) {
      <div class="wordmark"><span style="color: var(--bt-accent);">Berry</span><span>Trace</span></div>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .wordmark {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #3a3a3a;
    }
  `,
})
export class Logo {
  /** Stroke drawn around each berry; should match the background the logo sits on. */
  readonly ring = input('#FDFDFC');
  /** Show the "BerryTrace" name next to the mark. */
  readonly wordmark = input(true);
  /** Height of the mark in px; the width follows the mark's 30:34 proportions. */
  readonly height = input(34);
  protected readonly width = computed(() => Math.round((this.height() * 30) / 34));

  protected readonly leafAngles = [0, -62, 62, -108, 108];
  protected readonly berries = [
    [66, 94, 17], [100, 94, 17], [134, 94, 17],
    [49, 122, 17], [83, 122, 17], [117, 122, 17], [151, 122, 17],
    [66, 150, 16], [100, 150, 16], [134, 150, 16],
    [83, 176, 14], [117, 176, 14],
  ] as const;
}
