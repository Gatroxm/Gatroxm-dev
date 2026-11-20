import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { EducationItem } from '../../core/models/api.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-education',
  imports: [SectionHeaderComponent, SkeletonComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Formación"
          title="Educación y certificaciones"
          subtitle="Formación académica, certificaciones, cursos e idiomas."
        />

        @if (loading()) {
          <div class="grid">
            @for (i of [1, 2, 3]; track i) {
              <div class="card grid"><app-skeleton height="1.1rem" width="60%" /><app-skeleton height="1rem" width="40%" /></div>
            }
          </div>
        } @else if (items().length) {
          @if (education().length) {
            <section class="section-block">
              <h3>Educación</h3>
              <div class="list-grid">
                @for (item of education(); track item.id) {
                  <article class="card item">
                    <h4>{{ item.title }}</h4>
                    <p class="muted">{{ item.org }} @if (item.year) { · {{ item.year }} }</p>
                  </article>
                }
              </div>
            </section>
          }

          @if (certifications().length) {
            <section class="section-block">
              <h3>Certificaciones y cursos</h3>
              <div class="list-grid">
                @for (item of certifications(); track item.id) {
                  <article class="card item">
                    <h4>
                      @if (item.href) {
                        <a [href]="item.href" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
                      } @else {
                        {{ item.title }}
                      }
                    </h4>
                    <p class="muted">{{ item.org }} @if (item.year) { · {{ item.year }} }</p>
                  </article>
                }
              </div>
            </section>
          }

          @if (languages().length) {
            <section class="section-block">
              <h3>Idiomas</h3>
              <div class="list-grid">
                @for (item of languages(); track item.id) {
                  <article class="card item">
                    <h4>{{ item.title }}</h4>
                    <p class="muted">{{ item.org }}</p>
                  </article>
                }
              </div>
            </section>
          }
        } @else {
          <p class="empty-state">La información educativa se mostrará cuando la API esté disponible.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .list-grid {
        display: grid;
        gap: 1rem;
      }
      .item h4 {
        margin-bottom: 0.25rem;
      }
      .item a {
        color: #e2e8f0;
        text-decoration: none;
      }
      .item a:hover {
        color: #93c5fd;
        text-decoration: underline;
      }
      @media (min-width: 900px) {
        .list-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class EducationComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly items = signal<EducationItem[]>([]);
  readonly loading = signal(true);

  readonly education = computed(() =>
    this.items()
      .filter((i) => i.type === 'education')
      .sort((a, b) => a.order - b.order),
  );
  readonly certifications = computed(() =>
    this.items()
      .filter((i) => i.type === 'certification')
      .sort((a, b) => a.order - b.order),
  );
  readonly languages = computed(() =>
    this.items()
      .filter((i) => i.type === 'language')
      .sort((a, b) => a.order - b.order),
  );

  ngOnInit(): void {
    this.api.getEducation().subscribe({
      next: (data) => {
        this.items.set(data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
