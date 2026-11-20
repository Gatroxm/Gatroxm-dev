import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tag-list',
  template: `
    @if (tags().length) {
      <ul class="tags" [attr.aria-label]="label() || 'Etiquetas'">
        @for (tag of tags(); track tag) {
          <li class="tag">{{ tag }}</li>
        }
      </ul>
    }
  `,
  styles: [
    `
      .tags {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    `,
  ],
})
export class TagListComponent {
  readonly tags = input<string[]>([]);
  readonly label = input<string>();
}
