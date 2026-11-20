import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: `
    <header class="section-header">
      @if (eyebrow()) {
        <p class="eyebrow">{{ eyebrow() }}</p>
      }
      <h2>{{ title() }}</h2>
      @if (subtitle()) {
        <p class="muted subtitle">{{ subtitle() }}</p>
      }
    </header>
  `,
  styles: [
    `
      .section-header {
        margin-bottom: 1.25rem;
      }
      .subtitle {
        max-width: 70ch;
        margin: 0;
      }
    `,
  ],
})
export class SectionHeaderComponent {
  readonly title = input.required<string>();
  readonly eyebrow = input<string>();
  readonly subtitle = input<string>();
}
