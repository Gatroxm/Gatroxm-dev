import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';
import { MascotAnimationComponent } from '../../shared/components/mascot-animation/mascot-animation.component';

@Component({
  selector: 'app-ai-engineering',
  imports: [SectionHeaderComponent, MascotAnimationComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Ingeniería aplicada"
          title="AI Engineering"
          subtitle="Uso práctico de agentes de IA y herramientas de contexto para acelerar el desarrollo sin perder criterio técnico."
        />

        <div class="hero-ai">
          <div class="card">
            <p>
              Diseño y construyo agentes de IA que agilizan la creación e implementación de requerimientos, integrándolos al flujo real
              de trabajo de ingeniería: análisis, conexión con dependencias, comprensión del código y revisión por pull request.
            </p>
            <div class="highlight">
              <p class="value">58</p>
              <p class="muted">desarrolladores capacitados en el uso de agentes de IA</p>
            </div>
            <div class="highlight">
              <p class="value">1 semana → 1 día</p>
              <p class="muted">ejemplo demostrado en la resolución de un requerimiento con agentes de IA</p>
            </div>
          </div>
          <div class="card visual">
            <app-mascot-animation
              animation="celebrating"
              src="assets/mascot/gx-character.png"
              alt="Gx celebrando logros en ingeniería con IA"
              height="300px"
            />
          </div>
        </div>

        <div class="grid-cards section-block">
          @for (item of areas; track item.title) {
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
          <h3>Tecnologías y enfoques</h3>
          <p class="muted">
            Trabajo con agentes de IA, MCP, Graphify, RAG y ecosistemas como LangChain y LangGraph, además de exploración y uso de
            búsqueda semántica con herramientas como Pinecone y pgvector en contextos de prototipo y evaluación.
          </p>
        </section>
      </div>
    </section>
  `,
  styles: [
    `
      .hero-ai,
      .grid-cards {
        display: grid;
        gap: 1rem;
      }
      .highlight {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--color-border);
      }
      .value {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 700;
        color: var(--color-white);
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
      @media (min-width: 900px) {
        .hero-ai {
          grid-template-columns: 1.2fr 0.8fr;
        }
        .grid-cards {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class AiEngineeringComponent {
  readonly areas = [
    {
      title: 'Agentes de IA en el ciclo de desarrollo',
      text: 'Aplicación de agentes para entender requerimientos, acelerar implementación y mantener trazabilidad técnica.',
      points: [
        'Análisis del requerimiento y detección de información faltante.',
        'Escalamiento de la solución con revisión posterior por pull request.',
      ],
    },
    {
      title: 'MCP y conexión con contexto',
      text: 'Uso de Model Context Protocol para conectar agentes con dependencias y fuentes relevantes del trabajo.',
      points: [
        'Integración con herramientas y contexto necesario para ejecutar tareas.',
        'Conexión a diseños y recursos que aportan precisión a la implementación.',
      ],
    },
    {
      title: 'Graphify y eficiencia de contexto',
      text: 'Uso de grafos de código para evitar leer repositorios completos y optimizar el consumo de tokens.',
      points: [
        'Navegación más eficiente por la estructura del código.',
        'Mejor foco del agente en las partes relevantes del sistema.',
      ],
    },
    {
      title: 'RAG y ecosistema LLM',
      text: 'Experiencia con patrones de recuperación aumentada y orquestación para asistentes y prototipos.',
      points: [
        'Uso y evaluación de LangChain y LangGraph en flujos de IA aplicada.',
        'Exploración de búsqueda semántica con Pinecone y pgvector en prototipos.',
      ],
    },
  ];
}
