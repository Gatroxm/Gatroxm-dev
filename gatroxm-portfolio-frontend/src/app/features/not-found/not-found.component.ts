import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="page">
      <div class="container">
        <div class="card not-found">
          <p class="eyebrow">Error 404</p>
          <h1>Página no encontrada</h1>
          <p class="muted">La ruta que buscas no existe o fue movida.</p>
          <a routerLink="/" class="btn btn-primary">Volver al inicio</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .not-found {
        max-width: 640px;
      }
      .not-found .btn {
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class NotFoundComponent {}
