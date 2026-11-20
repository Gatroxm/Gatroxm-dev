import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Project } from '../../core/models/api.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TagListComponent } from '../../shared/components/tag-list/tag-list.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

type CategoryFilter = 'all' | 'web' | 'architecture' | 'ai';

@Component({
  selector: 'app-projects',
  imports: [SectionHeaderComponent, TagListComponent, SkeletonComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Portafolio"
          title="Proyectos"
          subtitle="Soluciones y productos construidos en contextos corporativos, bancarios y de innovación con IA."
        />

        <div class="filters" role="group" aria-label="Filtrar por categoría">
          @for (f of filters; track f.value) {
            <button
              type="button"
              class="filter-btn"
              [class.active]="activeFilter() === f.value"
              (click)="setFilter(f.value)"
            >
              {{ f.label }}
            </button>
          }
        </div>

        @if (loading()) {
          <div class="projects-grid">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="card grid">
                <app-skeleton height="1.2rem" width="65%" />
                <app-skeleton height="3.5rem" />
                <app-skeleton height="1.5rem" width="80%" />
              </div>
            }
          </div>
        } @else if (filtered().length) {
          <div class="projects-grid">
            @for (project of filtered(); track project.id) {
              <article class="card project">
                <div class="project-top">
                  <span class="tag">{{ categoryLabel(project.category) }}</span>
                  @if (project.featured) {
                    <span class="tag featured">Destacado</span>
                  }
                </div>
                <h3>{{ project.title }}</h3>
                <p class="muted">{{ project.summary }}</p>
                <p>{{ project.description }}</p>
                <app-tag-list [tags]="project.tags" label="Tecnologías" />
                @if (project.links.demo || project.links.repo) {
                  <div class="links">
                    @if (project.links.demo) {
                      <a class="link" [href]="project.links.demo" target="_blank" rel="noopener noreferrer">Demo</a>
                    }
                    @if (project.links.repo) {
                      <a class="link" [href]="project.links.repo" target="_blank" rel="noopener noreferrer">Repositorio</a>
                    }
                  </div>
                }
              </article>
            }
          </div>
        } @else {
          <p class="empty-state">No hay proyectos para mostrar con este filtro o la API no está disponible.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1.25rem;
      }
      .filter-btn {
        background: transparent;
        color: #cbd5e1;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        padding: 0.45rem 0.9rem;
        cursor: pointer;
      }
      .filter-btn.active,
      .filter-btn:hover {
        color: var(--color-white);
        border-color: rgba(37, 99, 235, 0.6);
        background: var(--color-blue-soft);
      }
      .projects-grid {
        display: grid;
        gap: 1rem;
      }
      .project-top {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 0.5rem;
      }
      .featured {
        color: #bfdbfe;
        border-color: rgba(37, 99, 235, 0.5);
      }
      .links {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      .link {
        color: #93c5fd;
        text-decoration: none;
        font-weight: 600;
      }
      .link:hover {
        text-decoration: underline;
      }
      @media (min-width: 900px) {
        .projects-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class ProjectsComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly items = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly activeFilter = signal<CategoryFilter>('all');

  readonly filters: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'web', label: 'Web' },
    { value: 'architecture', label: 'Arquitectura' },
    { value: 'ai', label: 'IA' },
  ];

  readonly filtered = computed(() => {
    const filter = this.activeFilter();
    const list = [...this.items()].sort((a, b) => a.order - b.order);
    return filter === 'all' ? list : list.filter((p) => p.category === filter);
  });

  ngOnInit(): void {
    this.api.getProjects().subscribe({
      next: (data) => {
        this.items.set(data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  setFilter(value: CategoryFilter): void {
    this.activeFilter.set(value);
  }

  categoryLabel(category: Project['category']): string {
    if (category === 'ai') return 'IA';
    if (category === 'architecture') return 'Arquitectura';
    return 'Web';
  }
}
