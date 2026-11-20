import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <div
      class="skeleton"
      [style.height]="height()"
      [style.width]="width()"
      [style.borderRadius]="radius()"
      aria-hidden="true"
    ></div>
  `,
  styles: [
    `
      .skeleton {
        background: linear-gradient(
          90deg,
          rgba(148, 163, 184, 0.12),
          rgba(148, 163, 184, 0.22),
          rgba(148, 163, 184, 0.12)
        );
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
      }
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .skeleton {
          animation: none;
        }
      }
    `,
  ],
})
export class SkeletonComponent {
  readonly height = input('1rem');
  readonly width = input('100%');
  readonly radius = input('0.5rem');
}
