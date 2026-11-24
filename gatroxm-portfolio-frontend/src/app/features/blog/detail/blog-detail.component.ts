import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { BlogPost } from '../../../core/models/api.models';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { TagListComponent } from '../../../shared/components/tag-list/tag-list.component';

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, RouterLink, SkeletonComponent, TagListComponent],
  template: `
    <section class="page">
      <div class="container article-wrap">
        <a routerLink="/blog" class="back">← Volver al blog</a>

        @if (loading()) {
          <article class="card grid">
            <app-skeleton height="2rem" width="70%" />
            <app-skeleton height="1rem" width="40%" />
            <app-skeleton height="10rem" />
          </article>
        } @else if (post(); as p) {
          <article class="card article">
            <header>
              <p class="eyebrow">Blog</p>
              <h1>{{ p.title }}</h1>
              <p class="muted meta">
                {{ p.author }} · {{ (p.publishedAt || p.createdAt) | date: 'longDate' }}
              </p>
              @if (p.tags?.length) {
                <app-tag-list [tags]="p.tags" label="Etiquetas" />
              }
            </header>
            @if (p.coverImage) {
              <img class="cover" [src]="p.coverImage" [alt]="p.title" loading="lazy" />
            }
            <div class="content">
              @for (para of paragraphs(p.content); track $index) {
                <p>{{ para }}</p>
              }
            </div>
          </article>
        } @else {
          <div class="card">
            <h1>Publicación no encontrada</h1>
            <p class="muted">La publicación que buscas no existe o no está disponible.</p>
            <a routerLink="/blog" class="btn btn-secondary">Ir al blog</a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .article-wrap { max-width: 820px; }
      .back { display:inline-block; margin-bottom: 1rem; color:#93c5fd; text-decoration:none; }
      .back:hover { text-decoration:underline; }
      .article header { margin-bottom: 1rem; }
      .article h1 { margin-bottom: .35rem; }
      .meta { margin: 0 0 .5rem; }
      .cover {
        display: block;
        width: 100%;
        height: auto;
        max-height: none;
        object-fit: contain;
        border-radius: .8rem;
        border: 1px solid var(--color-border);
        margin: .5rem auto 1rem;
        background: var(--color-slate-dark);
      }
      .content p { margin: 0 0 1rem; white-space: pre-wrap; }
    `,
  ],
})
export class BlogDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  readonly post = signal<BlogPost | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!slug) { this.loading.set(false); return; }
    this.api.getBlogPost(slug).subscribe({
      next: (p) => { this.post.set(p); this.loading.set(false); },
      error: () => { this.post.set(null); this.loading.set(false); },
    });
  }

  paragraphs(content: string): string[] {
    return content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  }
}
