import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { BlogPost } from '../../../core/models/api.models';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { SkeletonComponent } from '../../../shared/components/skeleton/skeleton.component';
import { TagListComponent } from '../../../shared/components/tag-list/tag-list.component';

@Component({
  selector: 'app-blog-list',
  imports: [DatePipe, RouterLink, SectionHeaderComponent, SkeletonComponent, TagListComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Artículos y notas"
          title="Blog"
          subtitle="Publicaciones sobre desarrollo, arquitectura e inteligencia artificial aplicados a proyectos reales."
        />

        @if (loading()) {
          <div class="grid posts">
            @for (i of [1,2,3]; track i) {
              <div class="card grid">
                <app-skeleton height="1.4rem" width="70%" />
                <app-skeleton height="1rem" />
                <app-skeleton height="1rem" width="85%" />
              </div>
            }
          </div>
        } @else if (error()) {
          <p class="empty-state">No fue posible cargar el blog en este momento.</p>
        } @else if (!posts().length) {
          <p class="empty-state">Aún no hay publicaciones. Pronto compartiré notas sobre ingeniería y proyectos.</p>
        } @else {
          <div class="posts">
            @for (post of posts(); track post.id) {
              <article class="card post">
                <p class="muted date">{{ (post.publishedAt || post.createdAt) | date: 'longDate' }}</p>
                <h2><a [routerLink]="['/blog', post.slug]">{{ post.title }}</a></h2>
                <p class="muted">{{ post.excerpt }}</p>
                @if (post.tags?.length) {
                  <app-tag-list [tags]="post.tags.slice(0, 6)" label="Etiquetas" />
                }
                <a class="read-more" [routerLink]="['/blog', post.slug]">Leer publicación →</a>
              </article>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .posts { display:grid; gap:1rem; }
      .post h2 { margin:.2rem 0 .4rem; font-size:1.35rem; }
      .post h2 a { color: var(--color-white); text-decoration:none; }
      .post h2 a:hover { color:#93c5fd; }
      .date { margin:0; font-size:.9rem; }
      .read-more { display:inline-block; margin-top:.75rem; color:#93c5fd; text-decoration:none; font-weight:600; }
      .read-more:hover { text-decoration:underline; }
    `,
  ],
})
export class BlogListComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly posts = signal<BlogPost[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.api.getBlogPosts().subscribe({
      next: (items) => { this.posts.set(items); this.loading.set(false); },
      error: () => { this.error.set(true); this.loading.set(false); },
    });
  }
}
