import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Profile } from '../../core/models/api.models';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-about',
  imports: [SectionHeaderComponent, SkeletonComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Perfil profesional"
          title="Sobre mí"
          subtitle="Trayectoria, forma de trabajo y enfoque en soluciones reales con impacto técnico."
        />

        @if (loading()) {
          <div class="grid">
            <div class="card grid">
              <app-skeleton height="1rem" /><app-skeleton height="1rem" /><app-skeleton height="1rem" width="80%" />
            </div>
          </div>
        } @else if (profile(); as p) {
          <div class="card">
            @for (paragraph of p.about.paragraphs; track paragraph) {
              <p>{{ paragraph }}</p>
            }
            <dl class="meta">
              <div><dt>Ubicación</dt><dd>{{ p.location }}</dd></div>
              <div><dt>Rol</dt><dd>{{ p.title }}</dd></div>
            </dl>
          </div>

          <section class="section-block">
            <h3>Flujo de trabajo con IA</h3>
            @if (p.about.flow.length) {
              <ol class="flow-grid">
                @for (step of p.about.flow; track step.title; let i = $index) {
                  <li class="card flow-step">
                    <span class="step-num">{{ i + 1 }}</span>
                    <h4>{{ step.title }}</h4>
                    <p class="muted">{{ step.text }}</p>
                  </li>
                }
              </ol>
            } @else {
              <p class="empty-state">El flujo de trabajo se mostrará cuando la API esté disponible.</p>
            }
          </section>
        } @else {
          <p class="empty-state">La información de perfil no está disponible en este momento. Se mostrará cuando la API responda.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .meta {
        margin: 1rem 0 0;
        display: grid;
        gap: 0.5rem;
      }
      .meta div {
        display: grid;
        grid-template-columns: 110px 1fr;
        gap: 0.5rem;
      }
      dt {
        color: var(--color-slate);
      }
      dd {
        margin: 0;
        color: var(--color-white);
      }
      .flow-grid {
        list-style: none;
        padding: 0;
        margin: 1rem 0 0;
        display: grid;
        gap: 1rem;
      }
      .step-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 999px;
        background: var(--color-blue-soft);
        color: #bfdbfe;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .flow-step h4 {
        margin-bottom: 0.35rem;
      }
      @media (min-width: 900px) {
        .flow-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    `,
  ],
})
export class AboutComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly profile = signal<Profile | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.api.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
