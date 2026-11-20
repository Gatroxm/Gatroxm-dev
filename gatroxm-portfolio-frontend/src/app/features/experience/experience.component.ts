import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Experience } from '../../core/models/api.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TagListComponent } from '../../shared/components/tag-list/tag-list.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-experience',
  imports: [SectionHeaderComponent, TagListComponent, SkeletonComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Trayectoria"
          title="Experiencia profesional"
          subtitle="Roles y responsabilidades en desarrollo full stack, arquitectura, nube e inteligencia artificial aplicada."
        />

        @if (loading()) {
          <div class="grid">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="card grid">
                <app-skeleton height="1.3rem" width="60%" />
                <app-skeleton height="1rem" width="40%" />
                <app-skeleton height="4rem" />
              </div>
            }
          </div>
        } @else if (items().length) {
          <p class="note card">
            En algunos periodos (2015–2016 y 2019–2021) combiné contratos a término fijo y proyectos como freelancer, por eso algunas fechas se cruzan.
          </p>

          <ol class="timeline">
            @for (job of visibleJobs(); track job.id) {
              <li class="card job">
                <header class="job-head">
                  <div>
                    <h3>{{ job.role }}</h3>
                    <p class="company">{{ job.company }}</p>
                  </div>
                  <p class="period">{{ job.period }}</p>
                </header>
                <app-tag-list [tags]="job.tags" label="Tecnologías y enfoque" />
                <ul class="bullets">
                  @for (b of job.bullets; track b) {
                    <li>{{ b }}</li>
                  }
                </ul>
              </li>
            }
          </ol>

          @if (items().length > 4) {
            <div class="actions">
              <button type="button" class="btn btn-secondary" (click)="toggleAll()">
                {{ showAll() ? 'Mostrar menos' : 'Ver toda la trayectoria' }}
              </button>
            </div>
          }
        } @else {
          <p class="empty-state">La experiencia se mostrará cuando la API esté disponible.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .note {
        margin-bottom: 1rem;
        color: #cbd5e1;
      }
      .timeline {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1rem;
      }
      .job-head {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.75rem;
      }
      .job h3 {
        margin-bottom: 0.2rem;
      }
      .company {
        margin: 0;
        color: #93c5fd;
        font-weight: 600;
      }
      .period {
        margin: 0;
        color: var(--color-slate);
        white-space: nowrap;
      }
      .bullets {
        margin: 0.75rem 0 0;
        padding-left: 1.1rem;
        color: #cbd5e1;
      }
      .bullets li + li {
        margin-top: 0.35rem;
      }
      .actions {
        margin-top: 1.25rem;
      }
      @media (max-width: 720px) {
        .job-head {
          flex-direction: column;
        }
        .period {
          white-space: normal;
        }
      }
    `,
  ],
})
export class ExperienceComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly items = signal<Experience[]>([]);
  readonly loading = signal(true);
  readonly showAll = signal(false);

  readonly visibleJobs = computed(() => {
    const list = this.items();
    return this.showAll() ? list : list.slice(0, 4);
  });

  ngOnInit(): void {
    this.api.getExperience().subscribe({
      next: (data) => {
        this.items.set([...data].sort((a, b) => a.order - b.order));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleAll(): void {
    this.showAll.update((v) => !v);
  }
}
