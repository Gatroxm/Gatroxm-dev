import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Profile, Project } from '../../core/models/api.models';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { TagListComponent } from '../../shared/components/tag-list/tag-list.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SkeletonComponent, TagListComponent],
  template: `
    <section class="page hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          @if (loadingProfile()) {
            <div class="grid" aria-label="Cargando perfil">
              <app-skeleton height="1rem" width="8rem" />
              <app-skeleton height="3rem" width="90%" />
              <app-skeleton height="1.4rem" width="60%" />
              <app-skeleton height="5rem" width="100%" />
            </div>
          } @else if (profile(); as p) {
            <p class="eyebrow">{{ p.brand }}</p>
            <h1>{{ p.name }}</h1>
            <p class="role">{{ p.title }}</p>
            <p class="lead">{{ p.lead }}</p>
            <div class="actions">
              <a routerLink="/projects" class="btn btn-primary">Explorar proyectos</a>
              <a routerLink="/contact" class="btn btn-secondary">Contactar</a>
            </div>
          } @else {
            <p class="eyebrow">GatroxM.dev</p>
            <h1>Portafolio profesional</h1>
            <p class="lead muted">La información del perfil se mostrará cuando la API esté disponible.</p>
            <div class="actions">
              <a routerLink="/projects" class="btn btn-primary">Explorar proyectos</a>
              <a routerLink="/contact" class="btn btn-secondary">Contactar</a>
            </div>
          }
        </div>

        <div class="hero-visual card" aria-hidden="true">
          <div class="hero-mark">
            <span class="hero-mark-bracket">&lt;/&gt;</span>
            <span class="hero-mark-dot"></span>
          </div>
          <div class="hero-grid-lines"></div>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="container">
        <h2>Impacto en cifras</h2>
        @if (loadingProfile()) {
          <div class="stats-grid">
            @for (i of [1, 2, 3]; track i) {
              <div class="card"><app-skeleton height="2.2rem" width="50%" /><app-skeleton height="1rem" width="80%" /></div>
            }
          </div>
        } @else if (profile()?.stats?.length) {
          <div class="stats-grid">
            @for (stat of profile()!.stats; track stat.label) {
              <article class="card stat">
                <p class="stat-value">{{ formatStat(stat) }}</p>
                <p class="muted">{{ stat.label }}</p>
              </article>
            }
          </div>
        } @else {
          <p class="empty-state">Las estadísticas se cargarán desde la API cuando esté disponible.</p>
        }
      </div>
    </section>

    <section class="section-block">
      <div class="container split">
        <div>
          <p class="eyebrow">Enfoque</p>
          <h2>De la arquitectura al impacto con IA</h2>
          <p class="muted">
            Experiencia en desarrollo full stack, arquitectura moderna y adopción práctica de agentes de IA en flujos reales de ingeniería.
          </p>
          <div class="actions">
            <a routerLink="/about" class="btn btn-secondary">Conocer más</a>
            <a routerLink="/ai" class="btn btn-secondary">Ver enfoque en IA</a>
          </div>
        </div>
        <div class="card">
          <h3>Áreas destacadas</h3>
          <ul class="focus-list">
            <li>.NET, Angular y Node.js para producto web y móvil</li>
            <li>Micro-frontends, microservicios y arquitectura limpia</li>
            <li>Azure, CI/CD y operación en entornos corporativos</li>
            <li>Agentes de IA, MCP, Graphify y flujos con RAG</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section-block">
      <div class="container">
        <div class="section-head-inline">
          <div>
            <p class="eyebrow">Trabajo reciente</p>
            <h2>Proyectos destacados</h2>
          </div>
          <a routerLink="/projects" class="btn btn-secondary">Ver todos</a>
        </div>
        @if (loadingProjects()) {
          <div class="projects-grid">
            @for (i of [1, 2, 3]; track i) {
              <div class="card"><app-skeleton height="1.2rem" width="70%" /><app-skeleton height="4rem" /></div>
            }
          </div>
        } @else if (featured().length) {
          <div class="projects-grid">
            @for (project of featured(); track project.id) {
              <article class="card project">
                <p class="eyebrow">{{ project.category }}</p>
                <h3>{{ project.title }}</h3>
                <p class="muted">{{ project.summary }}</p>
                <app-tag-list [tags]="project.tags.slice(0, 4)" label="Tecnologías del proyecto" />
              </article>
            }
          </div>
        } @else {
          <p class="empty-state">Los proyectos se mostrarán aquí cuando la API esté disponible.</p>
        }
      </div>
    </section>
  `,
  styles: [
    `
      .hero {
        padding-top: 2rem;
      }
      .hero-grid {
        display: grid;
        gap: 1.5rem;
        align-items: center;
      }
      .role {
        color: #93c5fd;
        font-weight: 600;
        font-size: 1.15rem;
        margin-bottom: 0.75rem;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 1.25rem;
      }
      .hero-visual {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 320px;
        overflow: hidden;
        background:
          radial-gradient(circle at 30% 30%, rgba(37, 99, 235, 0.18), transparent 45%),
          radial-gradient(circle at 80% 70%, rgba(37, 99, 235, 0.12), transparent 40%),
          var(--color-slate-dark);
      }
      .hero-mark {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }
      .hero-mark-bracket {
        font-size: clamp(3rem, 8vw, 5rem);
        font-weight: 700;
        letter-spacing: 0.04em;
        color: var(--color-white);
        text-shadow: 0 0 40px rgba(37, 99, 235, 0.35);
      }
      .hero-mark-dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--color-blue);
        box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.18);
      }
      .hero-grid-lines {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
        background-size: 32px 32px;
        mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
        pointer-events: none;
      }
      .stats-grid,
      .projects-grid {
        display: grid;
        gap: 1rem;
      }
      .stat-value {
        font-size: 1.9rem;
        font-weight: 700;
        color: var(--color-white);
        margin-bottom: 0.25rem;
      }
      .split {
        display: grid;
        gap: 1rem;
      }
      .focus-list {
        margin: 0;
        padding-left: 1.1rem;
        color: #cbd5e1;
      }
      .focus-list li + li {
        margin-top: 0.4rem;
      }
      .section-head-inline {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .project h3 {
        margin-bottom: 0.4rem;
      }
      @media (min-width: 900px) {
        .hero-grid {
          grid-template-columns: 1.2fr 0.8fr;
        }
        .stats-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        .split {
          grid-template-columns: 1fr 1fr;
          align-items: start;
        }
        .projects-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }
      @media (max-width: 640px) {
        .section-head-inline {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly profile = signal<Profile | null>(null);
  readonly featured = signal<Project[]>([]);
  readonly loadingProfile = signal(true);
  readonly loadingProjects = signal(true);

  ngOnInit(): void {
    this.api.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.loadingProfile.set(false);
      },
      error: () => this.loadingProfile.set(false),
    });
    this.api.getProjects().subscribe({
      next: (projects) => {
        const list = [...projects]
          .filter((p) => p.featured)
          .sort((a, b) => a.order - b.order)
          .slice(0, 3);
        this.featured.set(list.length ? list : projects.slice(0, 3));
        this.loadingProjects.set(false);
      },
      error: () => this.loadingProjects.set(false),
    });
  }

  formatStat(stat: { value?: number; suffix?: string; text?: string; label: string }): string {
    if (stat.text) return stat.text;
    if (stat.value != null) return `${stat.value}${stat.suffix ?? ''}`;
    return '—';
  }
}
