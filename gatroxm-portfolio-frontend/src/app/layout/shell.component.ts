import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ChatbotComponent } from '../shared/components/chatbot/chatbot.component';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatbotComponent],
  template: `
    <a class="skip-link" href="#contenido">Saltar al contenido</a>
    <header class="site-header">
      <div class="container header-inner">
        <a class="brand" routerLink="/" (click)="closeMenu()">
          <span class="brand-mark">&lt;/&gt;</span>
          <span>GatroxM.dev</span>
        </a>

        <button
          type="button"
          class="menu-btn"
          (click)="toggleMenu()"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="site-nav"
          aria-label="Menú de navegación"
        >
          <span></span><span></span><span></span>
        </button>

        <nav id="site-nav" class="nav" [class.open]="menuOpen()" aria-label="Principal">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
              (click)="closeMenu()"
              >{{ item.label }}</a
            >
          }
        </nav>
      </div>
    </header>

    <main id="contenido" class="site-main">
      <router-outlet />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <p>© {{ year }} Gustavo Adolfo Muñoz Reyes · GatroxM.dev</p>
        <p class="muted">Construido con Angular, enfocado en claridad técnica y producto.</p>
        <p class="muted admin-access">
          @if (auth.isAuthenticated()) {
            <a routerLink="/admin/messages" class="admin-link">Ir al panel</a>
            <span class="sep">·</span>
            <button type="button" class="admin-link as-button" (click)="auth.logout()">Cerrar sesión</button>
          } @else {
            <a routerLink="/admin/login">Acceso administrativo</a>
          }
        </p>
      </div>
    </footer>

    <app-chatbot />
  `,
  styles: [
    `
      .skip-link {
        position: absolute;
        left: -999px;
        top: 0;
        background: var(--color-blue);
        color: white;
        padding: 0.5rem 0.75rem;
        z-index: 100;
      }
      .skip-link:focus {
        left: 1rem;
        top: 1rem;
      }
      .site-header {
        position: sticky;
        top: 0;
        z-index: 40;
        backdrop-filter: blur(10px);
        background: rgba(15, 23, 42, 0.82);
        border-bottom: 1px solid var(--color-border);
      }
      .header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-height: 64px;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        font-weight: 700;
        color: var(--color-white);
      }
      .brand-mark {
        color: #93c5fd;
      }
      .nav {
        display: flex;
        align-items: center;
        gap: 0.2rem;
      }
      .nav a {
        text-decoration: none;
        color: #cbd5e1;
        padding: 0.45rem 0.7rem;
        border-radius: 0.6rem;
        font-size: 0.95rem;
      }
      .nav a:hover,
      .nav a.active {
        color: var(--color-white);
        background: rgba(148, 163, 184, 0.12);
      }
      .menu-btn {
        display: none;
        flex-direction: column;
        gap: 4px;
        width: 2.5rem;
        height: 2.5rem;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1px solid var(--color-border);
        border-radius: 0.6rem;
        cursor: pointer;
      }
      .menu-btn span {
        width: 16px;
        height: 2px;
        background: var(--color-cloud);
        display: block;
      }
      .site-main {
        min-height: calc(100vh - 140px);
      }
      .site-footer {
        border-top: 1px solid var(--color-border);
        padding: 1.5rem 0 5rem;
      }
      .footer-inner p {
        margin: 0.2rem 0;
      }
      .footer-inner a {
        color: #93c5fd;
        text-decoration: none;
        font-size: 0.9rem;
      }
      .footer-inner a:hover {
        text-decoration: underline;
      }
      .admin-access {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        flex-wrap: wrap;
      }
      .admin-link {
        color: #93c5fd;
      }
      .as-button {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        font-size: 0.9rem;
        cursor: pointer;
      }
      .as-button:hover {
        text-decoration: underline;
      }
      .sep {
        color: var(--color-slate);
      }
      @media (max-width: 980px) {
        .menu-btn {
          display: inline-flex;
        }
        .nav {
          position: absolute;
          left: 1rem;
          right: 1rem;
          top: calc(100% + 0.5rem);
          display: none;
          flex-direction: column;
          align-items: stretch;
          padding: 0.5rem;
          background: rgba(15, 23, 42, 0.98);
          border: 1px solid var(--color-border);
          border-radius: 0.9rem;
          box-shadow: var(--shadow-soft);
        }
        .nav.open {
          display: flex;
        }
        .nav a {
          padding: 0.7rem 0.8rem;
        }
      }
    `,
  ],
})
export class ShellComponent {
  readonly auth = inject(AuthService);
  readonly menuOpen = signal(false);
  readonly year = new Date().getFullYear();
  readonly navItems = [
    { path: '/', label: 'Inicio', exact: true },
    { path: '/about', label: 'Sobre mí' },
    { path: '/experience', label: 'Experiencia' },
    { path: '/architecture', label: 'Arquitectura' },
    { path: '/projects', label: 'Proyectos' },
    { path: '/technologies', label: 'Tecnologías' },
    { path: '/ai', label: 'IA' },
    { path: '/education', label: 'Educación' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contacto' },
  ];

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
