import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { MascotAnimationComponent } from '../../shared/components/mascot-animation/mascot-animation.component';

@Component({
  selector: 'app-architecture',
  imports: [SectionHeaderComponent, MascotAnimationComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Diseño de sistemas"
          title="Arquitectura de software"
          subtitle="Enfoques aplicados en proyectos reales: modularidad, escalabilidad, calidad y entrega continua."
        />

        <div class="intro-grid mb-3">
          <div class="card">
            <p>
              Mi experiencia en arquitectura parte de contextos reales de producto y consultoría: aplicaciones web y móviles,
              modernización de frontends, integración de servicios y operación en nube con prácticas de revisión y despliegue.
            </p>
            <p class="muted">
              El foco está en diseñar soluciones mantenibles, seguras y preparadas para evolucionar con el negocio.
            </p>
          </div>
          <div class="card visual">
            <app-mascot-animation
              animation="coding"
              src="assets/mascot/gx-character.png"
              alt="Gx representando trabajo técnico en arquitectura y desarrollo"
              height="260px"
            />
          </div>
        </div>

        <div class="pillars section-block">
          @for (item of pillars; track item.title) {
            <article class="card">
              <h3>{{ item.title }}</h3>
              <p class="muted">{{ item.text }}</p>
              <ul>
                @for (point of item.points; track point) {
                  <li>{{ point }}</li>
                }
              </ul>
            </article>
          }
        </div>

        <section class="section-block card">
          <h3>Prácticas de entrega y operación</h3>
          <ul class="delivery">
            <li><strong>CI/CD y control de cambios:</strong> revisión de código mediante pull requests en GitHub y flujos de despliegue en Azure.</li>
            <li><strong>Calidad y mantenibilidad:</strong> principios de arquitectura limpia, separación de responsabilidades y código preparado para escalar.</li>
            <li><strong>Trabajo por dominios:</strong> aplicación de DDD y diseño de servicios para reducir acoplamiento y facilitar evolución.</li>
          </ul>
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .intro-grid,
      .pillars {
        display: grid;
        gap: 1rem;
      }
      .visual {
        display: flex;
        align-items: center;
      }
      ul {
        margin: 0.75rem 0 0;
        padding-left: 1.1rem;
        color: #cbd5e1;
      }
      li + li {
        margin-top: 0.35rem;
      }
      .delivery {
        margin: 0.5rem 0 0;
      }
      @media (min-width: 900px) {
        .intro-grid {
          grid-template-columns: 1.2fr 0.8fr;
        }
        .pillars {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class ArchitectureComponent {
  readonly pillars = [
    {
      title: 'Micro-frontends',
      text: 'Experiencia liderando el frontend de una aplicación móvil de inversiones para el Banco Santander de Chile.',
      points: [
        'Implementación de micro-frontends con Next.js para habilitar trabajo en paralelo.',
        'Despliegues independientes por equipo con foco en autonomía y coordinación.',
      ],
    },
    {
      title: 'Microservicios y APIs',
      text: 'Diseño y construcción de servicios backend para aplicaciones de alta disponibilidad y evolución continua.',
      points: [
        'Microservicios con Node.js y Express, y servicios con Java en contextos corporativos.',
        'APIs REST seguras, optimización de consultas y modelado orientado a dominio.',
      ],
    },
    {
      title: 'Arquitectura limpia y DDD',
      text: 'Organización del software para mantener claridad, testabilidad y capacidad de cambio.',
      points: [
        'Aplicación de principios de arquitectura limpia y separación por capas/responsabilidades.',
        'Uso de DDD cuando el dominio lo requiere para alinear negocio y solución técnica.',
      ],
    },
    {
      title: 'Nube y CI/CD en Azure',
      text: 'Operación y entrega de aplicaciones en entornos corporativos con prácticas de integración continua.',
      points: [
        'Despliegue de aplicaciones en Azure y soporte a producción con análisis de trazas.',
        'Revisión de código, planificación técnica y documentación de arquitectura.',
      ],
    },
  ];
}
