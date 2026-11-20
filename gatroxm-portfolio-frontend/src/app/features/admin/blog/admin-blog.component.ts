import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { BlogPost } from '../../../core/models/api.models';

type Draft = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tagsText: string;
  status: 'draft' | 'published';
  author: string;
};

function emptyDraft(): Draft {
  return { slug: '', title: '', excerpt: '', content: '', coverImage: '', tagsText: '', status: 'draft', author: 'Gustavo Adolfo Muñoz Reyes' };
}

@Component({
  selector: 'app-admin-blog',
  imports: [DatePipe, FormsModule],
  template: `
    <section class="card">
      <div class="head">
        <div>
          <h2>Blog</h2>
          <p class="muted">Crea y publica artículos. Los borradores no son visibles públicamente.</p>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-secondary" (click)="load()">Actualizar</button>
          <button type="button" class="btn btn-primary" (click)="newPost()">Nueva publicación</button>
        </div>
      </div>

      @if (loading()) {
        <p class="muted">Cargando publicaciones…</p>
      } @else if (error()) {
        <p class="form-error" role="alert">{{ error() }}</p>
      } @else if (!posts().length) {
        <p class="empty-state">No hay publicaciones todavía.</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Título</th><th>Slug</th><th>Estado</th><th>Actualizado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              @for (p of posts(); track p.id) {
                <tr>
                  <td>{{ p.title }}</td>
                  <td><code>{{ p.slug }}</code></td>
                  <td><span class="status" [attr.data-status]="p.status">{{ p.status === 'published' ? 'Publicado' : 'Borrador' }}</span></td>
                  <td>{{ (p.updatedAt || p.createdAt) | date: 'yyyy-MM-dd HH:mm' }}</td>
                  <td class="row-actions">
                    <button type="button" class="link-btn" (click)="edit(p)">Editar</button>
                    <button type="button" class="link-btn danger" (click)="remove(p)">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    @if (editing()) {
      <section class="card">
        <div class="head">
          <h3>{{ draft.id ? 'Editar publicación' : 'Nueva publicación' }}</h3>
          <button type="button" class="btn btn-secondary" (click)="cancel()">Cancelar</button>
        </div>
        <form (ngSubmit)="save()" #f="ngForm" class="form">
          <div class="grid2">
            <div class="field">
              <label for="title">Título</label>
              <input id="title" name="title" required [(ngModel)]="draft.title" (ngModelChange)="onTitleChange()" />
            </div>
            <div class="field">
              <label for="slug">Slug (kebab-case)</label>
              <input id="slug" name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" [(ngModel)]="draft.slug" />
            </div>
          </div>
          <div class="field">
            <label for="excerpt">Resumen</label>
            <textarea id="excerpt" name="excerpt" rows="2" required maxlength="300" [(ngModel)]="draft.excerpt"></textarea>
          </div>
          <div class="field">
            <label for="content">Contenido</label>
            <textarea id="content" name="content" rows="12" required [(ngModel)]="draft.content"></textarea>
            <p class="muted hint">Texto plano; los saltos de línea se respetan en la vista pública.</p>
          </div>
          <div class="grid2">
            <div class="field">
              <label for="coverImage">URL de imagen de portada (opcional)</label>
              <input id="coverImage" name="coverImage" [(ngModel)]="draft.coverImage" placeholder="https://... o /assets/..." />
            </div>
            <div class="field">
              <label for="tags">Etiquetas (separadas por coma)</label>
              <input id="tags" name="tags" [(ngModel)]="draft.tagsText" placeholder="angular, ia, arquitectura" />
            </div>
          </div>
          <div class="grid2">
            <div class="field">
              <label for="status">Estado</label>
              <select id="status" name="status" [(ngModel)]="draft.status">
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
            <div class="field">
              <label for="author">Autor</label>
              <input id="author" name="author" [(ngModel)]="draft.author" />
            </div>
          </div>

          @if (saveError()) {
            <p class="form-error" role="alert">{{ saveError() }}</p>
          }
          <div class="actions">
            <button class="btn btn-primary" type="submit" [disabled]="saving() || !f.form.valid">
              {{ saving() ? 'Guardando…' : 'Guardar' }}
            </button>
            <button class="btn btn-secondary" type="button" (click)="cancel()">Cancelar</button>
          </div>
        </form>
      </section>
    }
  `,
  styles: [
    `
      .head { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:.75rem; }
      .actions, .row-actions { display:flex; gap:.5rem; flex-wrap:wrap; }
      .table-wrap { overflow:auto; }
      table { width:100%; border-collapse: collapse; }
      th, td { text-align:left; padding:.65rem .5rem; border-bottom:1px solid var(--color-border); }
      .form { display:grid; gap:.9rem; }
      .grid2 { display:grid; gap:.9rem; }
      .field { display:grid; gap:.35rem; }
      label { color:#e2e8f0; font-weight:600; }
      input, textarea, select { width:100%; background: rgba(30,41,59,.9); color: var(--color-cloud); border:1px solid var(--color-border); border-radius:.7rem; padding:.65rem .75rem; font: inherit; }
      .hint { margin:0; font-size:.85rem; }
      .link-btn { background:none; border:none; color:#93c5fd; cursor:pointer; padding:0; font:inherit; }
      .link-btn.danger { color:#fecaca; }
      .status { display:inline-block; padding:.15rem .5rem; border-radius:999px; border:1px solid var(--color-border); font-size:.8rem; }
      .status[data-status="published"] { color:#bbf7d0; border-color:rgba(34,197,94,.4); }
      .status[data-status="draft"] { color:#e2e8f0; }
      .form-error { color:#fecaca; margin:0; }
      code { color:#bfdbfe; }
      @media (min-width: 900px) { .grid2 { grid-template-columns: 1fr 1fr; } }
    `,
  ],
})
export class AdminBlogComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly posts = signal<BlogPost[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  draft: Draft = emptyDraft();

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.adminGetBlogPosts().subscribe({
      next: (items) => { this.posts.set(items); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar las publicaciones.'); this.loading.set(false); },
    });
  }

  newPost(): void {
    this.draft = emptyDraft();
    this.saveError.set(null);
    this.editing.set(true);
  }

  edit(p: BlogPost): void {
    this.draft = {
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImage: p.coverImage || '',
      tagsText: (p.tags || []).join(', '),
      status: p.status,
      author: p.author || 'Gustavo Adolfo Muñoz Reyes',
    };
    this.saveError.set(null);
    this.editing.set(true);
  }

  cancel(): void {
    this.editing.set(false);
    this.saveError.set(null);
  }

  onTitleChange(): void {
    if (!this.draft.id && this.draft.title) {
      this.draft.slug = this.slugify(this.draft.title);
    }
  }

  save(): void {
    this.saving.set(true);
    this.saveError.set(null);
    const payload = {
      slug: this.draft.slug.trim(),
      title: this.draft.title.trim(),
      excerpt: this.draft.excerpt.trim(),
      content: this.draft.content,
      coverImage: this.draft.coverImage.trim(),
      tags: this.draft.tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      status: this.draft.status,
      author: this.draft.author.trim() || 'Gustavo Adolfo Muñoz Reyes',
    };
    const req = this.draft.id
      ? this.api.updateBlogPost(this.draft.id, payload)
      : this.api.createBlogPost(payload);
    req.subscribe({
      next: () => { this.saving.set(false); this.editing.set(false); this.load(); },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set(err?.error?.error || 'No se pudo guardar la publicación.');
      },
    });
  }

  remove(p: BlogPost): void {
    if (!confirm(`¿Eliminar "${p.title}"?`)) return;
    this.api.deleteBlogPost(p.id).subscribe({ next: () => this.load() });
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }
}
