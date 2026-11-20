import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <section class="page">
      <div class="container">
        <header class="admin-header card">
          <div>
            <p class="eyebrow">Panel de control</p>
            <h1>Administración</h1>
            <p class="muted">Sesión: {{ auth.user()?.username || 'admin' }}</p>
          </div>
          <div class="admin-actions">
            <a routerLink="/" class="btn btn-secondary">Ver sitio</a>
            <button type="button" class="btn btn-secondary" (click)="auth.logout()">Cerrar sesión</button>
          </div>
        </header>

        <nav class="admin-nav" aria-label="Administración">
          <a routerLink="/admin/messages" routerLinkActive="active">Mensajes</a>
          <a routerLink="/admin/blog" routerLinkActive="active">Blog</a>
        </nav>

        <div class="admin-content">
          <router-outlet />
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .admin-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .admin-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .admin-nav {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      .admin-nav a {
        text-decoration: none;
        color: #cbd5e1;
        padding: 0.5rem 0.8rem;
        border: 1px solid var(--color-border);
        border-radius: 0.6rem;
        background: rgba(30, 41, 59, 0.5);
      }
      .admin-nav a.active,
      .admin-nav a:hover {
        color: var(--color-white);
        border-color: rgba(37, 99, 235, 0.5);
        background: var(--color-blue-soft);
      }
      .admin-content {
        display: grid;
        gap: 1rem;
      }
    `,
  ],
})
export class AdminLayoutComponent {
  readonly auth = inject(AuthService);
}
