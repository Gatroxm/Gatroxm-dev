import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-mascot-animation',
  template: `
    <div class="mascot" [style.height]="height()">
      @if (canPlayVideo()) {
        <video
          #videoEl
          class="media"
          [attr.poster]="src()"
          muted
          loop
          playsinline
          preload="none"
          [attr.aria-label]="alt()"
        >
          <source [src]="webmSrc()" type="video/webm" />
          <source [src]="mp4Src()" type="video/mp4" />
        </video>
      }
      @if (src()) {
        <img
          class="media fallback"
          [class.hidden]="canPlayVideo() && videoReady()"
          [src]="src()"
          [alt]="alt()"
          loading="lazy"
          decoding="async"
          (error)="onImageError()"
        />
      }
    </div>
  `,
  styles: [
    `
      .mascot {
        position: relative;
        width: 100%;
        max-width: 100%;
      }
      .media {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }
      .fallback.hidden {
        position: absolute;
        inset: 0;
        opacity: 0;
        pointer-events: none;
      }
      video {
        position: absolute;
        inset: 0;
      }
    `,
  ],
})
export class MascotAnimationComponent implements AfterViewInit, OnDestroy {
  readonly animation = input<'hello' | 'idle' | 'coding' | 'presenting' | 'celebrating'>('idle');
  readonly src = input('');
  readonly alt = input('Animación de Gx');
  readonly height = input('320px');

  readonly webmSrc = computed(() => `assets/animations/gx-${this.animation()}.webm`);
  readonly mp4Src = computed(() => `assets/animations/gx-${this.animation()}.mp4`);

  readonly reduceMotion = signal(false);
  readonly inView = signal(false);
  readonly videoReady = signal(false);
  readonly imageBroken = signal(false);
  readonly canPlayVideo = computed(() => !this.reduceMotion() && !this.imageBroken());

  readonly videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');

  private observer?: IntersectionObserver;
  private motionQuery?: MediaQueryList;
  private motionListener?: (e: MediaQueryListEvent) => void;

  constructor() {
    effect(() => {
      const video = this.videoEl()?.nativeElement;
      if (!video) return;
      if (this.canPlayVideo() && this.inView()) {
        video.play().catch(() => this.videoReady.set(false));
      } else {
        video.pause();
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduceMotion.set(this.motionQuery.matches);
    this.motionListener = (e) => this.reduceMotion.set(e.matches);
    this.motionQuery.addEventListener('change', this.motionListener);

    const host = this.videoEl()?.nativeElement.parentElement;
    const target = host ?? undefined;
    if (!target || typeof IntersectionObserver === 'undefined') {
      this.inView.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        this.inView.set(visible);
      },
      { threshold: 0.2 },
    );
    this.observer.observe(target);

    const video = this.videoEl()?.nativeElement;
    if (video) {
      video.addEventListener('loadeddata', () => this.videoReady.set(true), { once: true });
      video.addEventListener('error', () => this.videoReady.set(false), { once: true });
    }
  }

  onImageError(): void {
    this.imageBroken.set(false);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.motionQuery && this.motionListener) {
      this.motionQuery.removeEventListener('change', this.motionListener);
    }
  }
}
