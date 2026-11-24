import { Component } from '@angular/core';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-ai-engineering',
  imports: [SectionHeaderComponent],
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
          <div class="card visual" aria-hidden="true">
            <div class="ai-grid"></div>
            <svg class="ai-graph" viewBox="0 0 360 360" focusable="false">
              <defs>
                <radialGradient id="ai-core-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.5" />
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0" />
                </radialGradient>
                <linearGradient id="ai-link" x1="0" y1="0" x2="360" y2="360" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.15" />
                  <stop offset="50%" stop-color="#93c5fd" stop-opacity="0.85" />
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0.15" />
                </linearGradient>
              </defs>

              <circle cx="180" cy="180" r="132" fill="url(#ai-core-glow)" />

              <g class="ai-links">
                <line x1="180" y1="180" x2="180" y2="52" />
                <line x1="180" y1="180" x2="291" y2="116" />
                <line x1="180" y1="180" x2="291" y2="244" />
                <line x1="180" y1="180" x2="180" y2="308" />
                <line x1="180" y1="180" x2="69" y2="244" />
                <line x1="180" y1="180" x2="69" y2="116" />
              </g>

              <circle class="ai-ring" cx="180" cy="180" r="128" />
              <circle class="ai-ring ai-ring-inner" cx="180" cy="180" r="94" />

              <g class="ai-nodes">
                <g>
                  <circle class="ai-node-halo" cx="180" cy="52" r="13" />
                  <circle class="ai-node" cx="180" cy="52" r="5.5" />
                </g>
                <g>
                  <circle class="ai-node-halo" cx="291" cy="116" r="13" style="animation-delay: 0.6s" />
                  <circle class="ai-node" cx="291" cy="116" r="5.5" />
                </g>
                <g>
                  <circle class="ai-node-halo" cx="291" cy="244" r="13" style="animation-delay: 1.2s" />
                  <circle class="ai-node" cx="291" cy="244" r="5.5" />
                </g>
                <g>
                  <circle class="ai-node-halo" cx="180" cy="308" r="13" style="animation-delay: 1.8s" />
                  <circle class="ai-node" cx="180" cy="308" r="5.5" />
                </g>
                <g>
                  <circle class="ai-node-halo" cx="69" cy="244" r="13" style="animation-delay: 2.4s" />
                  <circle class="ai-node" cx="69" cy="244" r="5.5" />
                </g>
                <g>
                  <circle class="ai-node-halo" cx="69" cy="116" r="13" style="animation-delay: 3s" />
                  <circle class="ai-node" cx="69" cy="116" r="5.5" />
                </g>
              </g>

              <g class="ai-core">
                <path d="M224 180 L202 218 L158 218 L136 180 L158 142 L202 142 Z" />
                <text x="180" y="191" text-anchor="middle">AI</text>
              </g>
            </svg>
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
      .ai-grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
        background-size: 32px 32px;
        mask-image: radial-gradient(circle at center, black 30%, transparent 85%);
        pointer-events: none;
      }
      .ai-graph {
        position: relative;
        z-index: 1;
        width: min(100%, 340px);
        height: auto;
      }
      .ai-links line {
        stroke: url(#ai-link);
        stroke-width: 1.5;
      }
      .ai-ring {
        fill: none;
        stroke: rgba(37, 99, 235, 0.4);
        stroke-width: 1;
        stroke-dasharray: 3 9;
        transform-box: fill-box;
        transform-origin: center;
        animation: ai-spin 28s linear infinite;
      }
      .ai-ring-inner {
        stroke: rgba(147, 197, 253, 0.2);
        stroke-dasharray: 2 12;
        animation-duration: 20s;
        animation-direction: reverse;
      }
      .ai-node-halo {
        fill: var(--color-blue);
        opacity: 0.25;
        transform-box: fill-box;
        transform-origin: center;
        animation: ai-node-pulse 3.6s ease-in-out infinite;
      }
      .ai-node {
        fill: var(--color-white);
      }
      .ai-core path {
        fill: var(--color-slate-dark);
        stroke: var(--color-blue);
        stroke-width: 2.5;
      }
      .ai-core text {
        fill: var(--color-white);
        font-size: 30px;
        font-weight: 700;
        letter-spacing: 3px;
      }
      @keyframes ai-spin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes ai-node-pulse {
        0%,
        100% {
          opacity: 0.18;
          transform: scale(1);
        }
        50% {
          opacity: 0.55;
          transform: scale(1.3);
        }
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
