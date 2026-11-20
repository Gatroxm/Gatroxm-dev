import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ContactMessage } from '../../../core/models/api.models';

@Component({
  selector: 'app-admin-messages',
  imports: [DatePipe],
  template: `
    <section class="card">
      <div class="head">
        <div>
          <h2>Mensajes de contacto</h2>
          <p class="muted">Registros enviados desde el formulario público.</p>
        </div>
        <button type="button" class="btn btn-secondary" (click)="load()">Actualizar</button>
      </div>

      @if (loading()) {
        <p class="muted">Cargando mensajes…</p>
      } @else if (error()) {
        <p class="form-error" role="alert">{{ error() }}</p>
      } @else if (!messages().length) {
        <p class="empty-state">Aún no hay mensajes registrados.</p>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Asunto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (m of messages(); track m.id) {
                <tr [class.selected]="selected()?.id === m.id" (click)="select(m)">
                  <td>{{ m.createdAt | date: 'yyyy-MM-dd HH:mm' }}</td>
                  <td>{{ m.name }}</td>
                  <td><a [href]="'mailto:' + m.email" (click)="$event.stopPropagation()">{{ m.email }}</a></td>
                  <td>{{ m.subject || '—' }}</td>
                  <td><span class="status" [attr.data-status]="m.status">{{ statusLabel(m.status) }}</span></td>
                  <td class="actions">
                    <button type="button" class="link-btn" (click)="setStatus(m, 'read'); $event.stopPropagation()">Leído</button>
                    <button type="button" class="link-btn" (click)="setStatus(m, 'replied'); $event.stopPropagation()">Respondido</button>
                    <button type="button" class="link-btn danger" (click)="remove(m); $event.stopPropagation()">Eliminar</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>

    @if (selected(); as s) {
      <section class="card detail">
        <div class="head">
          <h3>Detalle del mensaje</h3>
          <button type="button" class="btn btn-secondary" (click)="selected.set(null)">Cerrar</button>
        </div>
        <dl class="meta">
          <div><dt>De</dt><dd>{{ s.name }} &lt;{{ s.email }}&gt;</dd></div>
          <div><dt>Asunto</dt><dd>{{ s.subject || '—' }}</dd></div>
          <div><dt>Fecha</dt><dd>{{ s.createdAt | date: 'medium' }}</dd></div>
          <div><dt>Estado</dt><dd>{{ statusLabel(s.status) }}</dd></div>
        </dl>
        <pre class="message">{{ s.message }}</pre>
        <p class="muted"><a [href]="'mailto:' + s.email + '?subject=Re:%20' + (s.subject || 'Contacto%20GatroxM.dev')">Responder por correo</a></p>
      </section>
    }
  `,
  styles: [
    `
      .head { display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom: .75rem; }
      .table-wrap { overflow:auto; }
      table { width:100%; border-collapse: collapse; font-size: .95rem; }
      th, td { text-align:left; padding:.65rem .5rem; border-bottom:1px solid var(--color-border); vertical-align: top; }
      th { color:#cbd5e1; font-weight:600; white-space:nowrap; }
      tbody tr { cursor:pointer; }
      tbody tr:hover, tbody tr.selected { background: rgba(148,163,184,.06); }
      .actions { white-space:nowrap; }
      .link-btn { background:none; border:none; color:#93c5fd; cursor:pointer; padding:0 .25rem; font:inherit; }
      .link-btn:hover { text-decoration:underline; }
      .link-btn.danger { color:#fecaca; }
      .status { display:inline-block; padding:.15rem .5rem; border-radius:999px; border:1px solid var(--color-border); font-size:.8rem; }
      .status[data-status="new"] { color:#bfdbfe; border-color:rgba(37,99,235,.5); }
      .status[data-status="read"] { color:#e2e8f0; }
      .status[data-status="replied"] { color:#bbf7d0; border-color:rgba(34,197,94,.4); }
      .detail .meta { display:grid; gap:.4rem; margin: .5rem 0 1rem; }
      .detail .meta div { display:grid; grid-template-columns: 90px 1fr; gap:.5rem; }
      dt { color: var(--color-slate); }
      dd { margin:0; }
      .message { white-space: pre-wrap; font-family: inherit; margin:0; padding: .75rem; background: rgba(15,23,42,.5); border:1px solid var(--color-border); border-radius:.7rem; }
      .form-error { color:#fecaca; margin:0; }
      a { color:#93c5fd; }
    `,
  ],
})
export class AdminMessagesComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly messages = signal<ContactMessage[]>([]);
  readonly selected = signal<ContactMessage | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getContactMessages().subscribe({
      next: (items) => { this.messages.set(items); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar los mensajes. Verifica tu sesión y la API.'); this.loading.set(false); },
    });
  }

  select(m: ContactMessage): void {
    this.selected.set(m);
    if (m.status === 'new') this.setStatus(m, 'read', false);
  }

  statusLabel(status: ContactMessage['status']): string {
    return status === 'new' ? 'Nuevo' : status === 'read' ? 'Leído' : 'Respondido';
  }

  setStatus(m: ContactMessage, status: ContactMessage['status'], reloadSelected = true): void {
    if (m.status === status) return;
    this.api.updateContactMessageStatus(m.id, status).subscribe({
      next: (updated) => {
        this.messages.update((list) => list.map((x) => (x.id === updated.id ? updated : x)));
        if (reloadSelected && this.selected()?.id === updated.id) this.selected.set(updated);
      },
    });
  }

  remove(m: ContactMessage): void {
    if (!confirm(`¿Eliminar el mensaje de ${m.name}?`)) return;
    this.api.deleteContactMessage(m.id).subscribe({
      next: () => {
        this.messages.update((list) => list.filter((x) => x.id !== m.id));
        if (this.selected()?.id === m.id) this.selected.set(null);
      },
    });
  }
}
