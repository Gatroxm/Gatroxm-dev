import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { SkillGroup } from '../../core/models/api.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { TagListComponent } from '../../shared/components/tag-list/tag-list.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-technologies',
  imports: [SectionHeaderComponent, TagListComponent, SkeletonComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Stack técnico"
          title="Tecnologías"
          subtitle="Herramientas y tecnologías utilizadas en frontend, backend, datos, nube, IA y calidad."
        />

        @if (loading()) {
          <div class="groups">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="card grid">
                <app-skeleton height="1.2rem" width="40%" />
                <app-skeleton height="3rem" />
              </div>
            }
          </div>
        } @else if (groups().length) {
          <div class="groups">
            @for (group of groups(); track group.id) {
              <article class="card">
                <h3>{{ group.category }}</h3>
                <app-tag-list [tags]="group.items" [label]="group.category" />
              </article>
            }
          </div>
        } @else {
          <p class="empty-state">Las tecnologías se mostrarán cuando la API esté disponible.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .groups {
        display: grid;
        gap: 1rem;
      }
      h3 {
        margin-bottom: 0.75rem;
      }
      @media (min-width: 900px) {
        .groups {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class TechnologiesComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly groups = signal<SkillGroup[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.api.getSkills().subscribe({
      next: (data) => {
        this.groups.set([...(data ?? [])].sort((a, b) => a.order - b.order));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
