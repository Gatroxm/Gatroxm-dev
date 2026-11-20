import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, SectionHeaderComponent],
  template: `
    <section class="page">
      <div class="container">
        <app-section-header
          eyebrow="Hablemos"
          title="Contacto"
          subtitle="Puedes escribirme por correo, WhatsApp o redes profesionales, o enviar un mensaje desde el formulario."
        />

        <div class="contact-grid">
          <aside class="card info">
            <h3>Canales directos</h3>
            <ul class="contact-list">
              <li>
                <span class="label">Correo</span>
                <a href="mailto:tavoxpau@gmail.com">tavoxpau@gmail.com</a>
              </li>
              <li>
                <span class="label">WhatsApp</span>
                <a href="https://wa.me/573133976999" target="_blank" rel="noopener noreferrer">+57 313 397 69 99</a>
              </li>
              <li>
                <span class="label">LinkedIn</span>
                <a href="https://www.linkedin.com/in/gustavo-adolfo-mu%C3%B1oz-reyes-a277b587/" target="_blank" rel="noopener noreferrer">Perfil profesional</a>
              </li>
              <li>
                <span class="label">GitHub</span>
                <a href="https://github.com/gatroxm" target="_blank" rel="noopener noreferrer">github.com/gatroxm</a>
              </li>
            </ul>
            <p class="muted note">Ubicación: Bello, Antioquia (Colombia) · Trabajo remoto</p>
          </aside>

          <section class="card">
            <h3>Enviar mensaje</h3>
            <form #f="ngForm" (ngSubmit)="submit(f)" novalidate>
              <div class="honeypot" aria-hidden="true">
                <label for="company">Company</label>
                <input id="company" name="company" [(ngModel)]="form.company" tabindex="-1" autocomplete="off" />
              </div>

              <div class="field">
                <label for="name">Nombre</label>
                <input id="name" name="name" type="text" required minlength="2" [(ngModel)]="form.name" #name="ngModel" />
                @if (name.invalid && (name.touched || submitted())) {
                  <p class="field-error">Ingresa tu nombre.</p>
                }
              </div>

              <div class="field">
                <label for="email">Correo electrónico</label>
                <input id="email" name="email" type="email" required email [(ngModel)]="form.email" #email="ngModel" />
                @if (email.invalid && (email.touched || submitted())) {
                  <p class="field-error">Ingresa un correo válido.</p>
                }
              </div>

              <div class="field">
                <label for="subject">Asunto (opcional)</label>
                <input id="subject" name="subject" type="text" maxlength="120" [(ngModel)]="form.subject" />
              </div>

              <div class="field">
                <label for="message">Mensaje</label>
                <textarea id="message" name="message" rows="5" required minlength="10" [(ngModel)]="form.message" #message="ngModel"></textarea>
                @if (message.invalid && (message.touched || submitted())) {
                  <p class="field-error">Escribe un mensaje de al menos 10 caracteres.</p>
                }
              </div>

              <button class="btn btn-primary" type="submit" [disabled]="sending()">
                {{ sending() ? 'Enviando…' : 'Enviar mensaje' }}
              </button>

              @if (success()) {
                <p class="success" role="status">Mensaje enviado correctamente. Gracias por contactarme.</p>
              }
              @if (error()) {
                <p class="form-error" role="alert">{{ error() }}</p>
              }
            </form>
          </section>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .contact-grid {
        display: grid;
        gap: 1rem;
      }
      .contact-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.85rem;
      }
      .contact-list li {
        display: grid;
        gap: 0.15rem;
      }
      .label {
        color: var(--color-slate);
        font-size: 0.9rem;
      }
      .contact-list a {
        color: #e2e8f0;
        text-decoration: none;
        font-weight: 600;
      }
      .contact-list a:hover {
        color: #93c5fd;
      }
      .note {
        margin-top: 1rem;
      }
      form {
        display: grid;
        gap: 0.9rem;
      }
      .field {
        display: grid;
        gap: 0.35rem;
      }
      label {
        color: #e2e8f0;
        font-weight: 600;
      }
      input,
      textarea {
        width: 100%;
        background: rgba(30, 41, 59, 0.9);
        color: var(--color-cloud);
        border: 1px solid var(--color-border);
        border-radius: 0.7rem;
        padding: 0.65rem 0.75rem;
      }
      .field-error,
      .form-error {
        color: #fecaca;
        margin: 0;
        font-size: 0.9rem;
      }
      .success {
        margin: 0;
        color: #bbf7d0;
        background: rgba(34, 197, 94, 0.12);
        border: 1px solid rgba(34, 197, 94, 0.3);
        padding: 0.7rem 0.8rem;
        border-radius: 0.7rem;
      }
      .honeypot {
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      }
      @media (min-width: 900px) {
        .contact-grid {
          grid-template-columns: 0.9fr 1.1fr;
          align-items: start;
        }
      }
    `,
  ],
})
export class ContactComponent {
  private readonly api = inject(ApiService);
  readonly sending = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(null);
  readonly submitted = signal(false);

  form = {
    name: '',
    email: '',
    subject: '',
    company: '',
    message: '',
  };

  submit(f: NgForm): void {
    this.submitted.set(true);
    this.success.set(false);
    this.error.set(null);
    if (this.form.company) {
      // Honeypot: simular éxito silencioso sin enviar.
      f.resetForm({ name: '', email: '', subject: '', company: '', message: '' });
      this.submitted.set(false);
      this.success.set(true);
      return;
    }
    if (f.invalid) return;

    this.sending.set(true);
    this.api
      .sendContact({
        name: this.form.name.trim(),
        email: this.form.email.trim(),
        subject: this.form.subject.trim() || undefined,
        message: this.form.message.trim(),
      })
      .subscribe({
        next: () => {
          this.sending.set(false);
          this.success.set(true);
          f.resetForm({ name: '', email: '', subject: '', company: '', message: '' });
          this.submitted.set(false);
        },
        error: () => {
          this.sending.set(false);
          this.error.set('No fue posible enviar el mensaje en este momento. Intenta de nuevo más tarde.');
        },
      });
  }
}
