import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  template: `
    <section class="page">
      <div class="container login-wrap">
        <div class="card login-card">
          <p class="eyebrow">GatroxM.dev</p>
          <h1>Panel de administración</h1>
          <p class="muted">Inicia sesión para gestionar mensajes del formulario y el blog.</p>

          <form (ngSubmit)="submit()" #f="ngForm" class="form">
            <div class="field">
              <label for="username">Usuario</label>
              <input id="username" name="username" type="text" required [(ngModel)]="username" autocomplete="username" />
            </div>
            <div class="field">
              <label for="password">Contraseña</label>
              <input id="password" name="password" type="password" required [(ngModel)]="password" autocomplete="current-password" />
            </div>

            @if (error()) {
              <p class="form-error" role="alert">{{ error() }}</p>
            }

            <button class="btn btn-primary" type="submit" [disabled]="loading() || !f.form.valid">
              {{ loading() ? 'Ingresando…' : 'Ingresar' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .login-wrap {
        min-height: 70vh;
        display: grid;
        place-items: center;
      }
      .login-card {
        width: min(420px, 100%);
      }
      .form {
        display: grid;
        gap: 0.9rem;
        margin-top: 1rem;
      }
      .field {
        display: grid;
        gap: 0.35rem;
      }
      label { color: #e2e8f0; font-weight: 600; }
      input {
        width: 100%;
        background: rgba(30, 41, 59, 0.9);
        color: var(--color-cloud);
        border: 1px solid var(--color-border);
        border-radius: 0.7rem;
        padding: 0.65rem 0.75rem;
      }
      .form-error {
        color: #fecaca;
        margin: 0;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class AdminLoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  submit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(this.username.trim(), this.password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/admin/messages']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Credenciales inválidas o el servidor no está disponible.');
      },
    });
  }
}
