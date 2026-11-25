import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import {
  BlogReactionCounts,
  BlogReactionSummary,
  BlogReactionType,
} from '../../../core/models/api.models';
import { getVisitorId } from '../../../core/utils/visitor-id';

interface ReactionOption {
  type: BlogReactionType;
  emoji: string;
  label: string;
}

const OPTIONS: readonly ReactionOption[] = [
  { type: 'like', emoji: '👍', label: 'Me gusta' },
  { type: 'love', emoji: '❤️', label: 'Me encanta' },
  { type: 'haha', emoji: '😂', label: 'Me divierte' },
  { type: 'wow', emoji: '😮', label: 'Me asombra' },
  { type: 'sad', emoji: '😢', label: 'Me entristece' },
  { type: 'angry', emoji: '😡', label: 'Me enoja' },
];

function emptyCounts(): BlogReactionCounts {
  return { like: 0, love: 0, haha: 0, wow: 0, sad: 0, angry: 0 };
}

/** Aplica el cambio de inmediato; el servidor confirma o se revierte. */
function applyOptimistic(current: BlogReactionSummary, type: BlogReactionType): BlogReactionSummary {
  const counts: BlogReactionCounts = { ...current.counts };
  const previous = current.viewerReaction;

  if (previous) counts[previous] = Math.max(0, counts[previous] - 1);

  if (previous === type) {
    return { counts, total: Math.max(0, current.total - 1), viewerReaction: null };
  }

  counts[type] = counts[type] + 1;
  return {
    counts,
    total: previous ? current.total : current.total + 1,
    viewerReaction: type,
  };
}

@Component({
  selector: 'app-reaction-bar',
  template: `
    <div class="reactions" role="group" aria-label="Reacciones a esta publicación">
      @for (option of options; track option.type) {
        <button
          type="button"
          class="reaction"
          [class.active]="summary()?.viewerReaction === option.type"
          [attr.aria-pressed]="summary()?.viewerReaction === option.type"
          [attr.aria-label]="option.label"
          [title]="option.label"
          [disabled]="sending()"
          (click)="toggle(option.type)"
        >
          <span class="emoji" aria-hidden="true">{{ option.emoji }}</span>
          @if (count(option.type) > 0) {
            <span class="count">{{ count(option.type) }}</span>
          }
        </button>
      }
    </div>

    <p class="summary muted" aria-live="polite">{{ summaryText() }}</p>

    @if (error()) {
      <p class="error" role="alert">{{ error() }}</p>
    }
  `,
  styles: [
    `
      :host { display: block; }
      .reactions {
        display: flex;
        flex-wrap: wrap;
        gap: .45rem;
        margin: 1.5rem 0 .6rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
      }
      .reaction {
        display: inline-flex;
        align-items: center;
        gap: .4rem;
        padding: .4rem .75rem;
        border-radius: 999px;
        border: 1px solid var(--color-border);
        background: rgba(30, 41, 59, .65);
        color: var(--color-cloud);
        font: inherit;
        cursor: pointer;
        transition: transform .15s ease, border-color .15s ease, background .15s ease;
      }
      .reaction:hover:not(:disabled) {
        transform: translateY(-2px);
        border-color: rgba(37, 99, 235, .7);
        background: rgba(37, 99, 235, .18);
      }
      .reaction:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }
      .reaction:disabled { opacity: .65; cursor: progress; }
      .reaction.active {
        background: rgba(37, 99, 235, .28);
        border-color: var(--color-blue);
      }
      .emoji { font-size: 1.05rem; line-height: 1; }
      .count { font-size: .85rem; font-variant-numeric: tabular-nums; }
      .summary { margin: 0; font-size: .9rem; }
      .error { margin: .4rem 0 0; color: #fecaca; font-size: .9rem; }
      @media (prefers-reduced-motion: reduce) {
        .reaction { transition: none; }
        .reaction:hover:not(:disabled) { transform: none; }
      }
    `,
  ],
})
export class ReactionBarComponent implements OnInit {
  readonly slug = input.required<string>();
  readonly changed = output<BlogReactionSummary>();

  private readonly api = inject(ApiService);
  readonly options = OPTIONS;
  readonly summary = signal<BlogReactionSummary | null>(null);
  readonly sending = signal(false);
  readonly error = signal<string | null>(null);
  private visitorId = '';

  ngOnInit(): void {
    this.visitorId = getVisitorId();
    this.api.getBlogReactions(this.slug(), this.visitorId).subscribe({
      next: (summary) => this.summary.set(summary),
      error: () =>
        this.summary.set({ counts: emptyCounts(), total: 0, viewerReaction: null }),
    });
  }

  count(type: BlogReactionType): number {
    return this.summary()?.counts[type] ?? 0;
  }

  toggle(type: BlogReactionType): void {
    const current = this.summary();
    if (!current || this.sending()) return;

    this.summary.set(applyOptimistic(current, type));
    this.sending.set(true);
    this.error.set(null);

    this.api.reactToBlogPost(this.slug(), this.visitorId, type).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.sending.set(false);
        this.changed.emit(summary);
      },
      error: () => {
        this.summary.set(current);
        this.sending.set(false);
        this.error.set('No se pudo guardar tu reacción. Intenta de nuevo.');
      },
    });
  }

  summaryText(): string {
    const current = this.summary();
    if (!current) return 'Cargando reacciones…';
    if (!current.total) return 'Sé el primero en reaccionar';

    const label = current.total === 1 ? 'reacción' : 'reacciones';
    const mine = current.viewerReaction
      ? OPTIONS.find((option) => option.type === current.viewerReaction)?.label
      : null;

    return mine ? `${current.total} ${label} · Tu reacción: ${mine}` : `${current.total} ${label}`;
  }
}
