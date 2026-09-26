import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Hero {}
