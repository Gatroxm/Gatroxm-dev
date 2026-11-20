import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule],
  template: `
    <div class="chatbot">
      @if (open()) {
        <section class="panel card" aria-label="Asistente Gx">
          <header class="panel-header">
            <div>
              <p class="panel-title">Gx · Asistente</p>
              <p class="panel-sub muted">Preguntas sobre experiencia, proyectos e IA</p>
            </div>
            <button type="button" class="icon-btn" (click)="toggle()" aria-label="Cerrar chat">
              ✕
            </button>
          </header>

          <div class="messages" role="log" aria-live="polite" aria-relevant="additions">
            @for (msg of chat.messages(); track $index) {
              <article class="msg" [class.user]="msg.role === 'user'" [class.assistant]="msg.role === 'assistant'">
                <div class="bubble">
                  <p>{{ msg.content }}</p>
                  @if (msg.role === 'assistant' && msg.source) {
                    <span class="badge" [class.ai]="msg.source === 'ai'">{{ msg.source === 'ai' ? 'IA' : 'Base de conocimientos' }}</span>
                  }
                </div>
                @if (msg.role === 'assistant' && msg.suggestions?.length) {
                  <div class="suggestions">
                    @for (s of msg.suggestions!; track s) {
                      <button type="button" class="suggestion" (click)="useSuggestion(s)">{{ s }}</button>
                    }
                  </div>
                }
              </article>
            }
            @if (chat.typing()) {
              <p class="typing muted" aria-live="polite">Gx está escribiendo…</p>
            }
          </div>

          <form class="composer" (ngSubmit)="submit()" autocomplete="off">
            <label class="sr-only" for="chat-input">Escribe tu mensaje</label>
            <input
              id="chat-input"
              name="message"
              type="text"
              [(ngModel)]="draft"
              [disabled]="chat.typing()"
              placeholder="Escribe tu pregunta"
              maxlength="500"
            />
            <button class="btn btn-primary send" type="submit" [disabled]="chat.typing() || !draft.trim()">
              Enviar
            </button>
          </form>
        </section>
      }

      <button
        type="button"
        class="fab"
        (click)="toggle()"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="open() ? 'Cerrar asistente Gx' : 'Abrir asistente Gx'"
      >
        @if (open()) {
          <span aria-hidden="true">✕</span>
        } @else {
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8A2.5 2.5 0 0 1 17.5 16H9l-4.2 3.2c-.5.38-1.2.02-1.2-.6V16A2.5 2.5 0 0 1 4 13.5v-8Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
            <path d="M8 8h8M8 11h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
        }
      </button>
    </div>
  `,
  styles: [
    `
      .chatbot {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        z-index: 60;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.75rem;
      }
      .panel {
        width: min(360px, calc(100vw - 2rem));
        max-height: min(70vh, 560px);
        display: grid;
        grid-template-rows: auto 1fr auto;
        padding: 0;
        overflow: hidden;
      }
      .panel-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 0.9rem 1rem;
        border-bottom: 1px solid var(--color-border);
        background: rgba(15, 23, 42, 0.7);
      }
      .panel-title {
        margin: 0;
        font-weight: 700;
        color: var(--color-white);
      }
      .panel-sub {
        margin: 0;
        font-size: 0.82rem;
      }
      .icon-btn {
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-cloud);
        border-radius: 0.5rem;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
      }
      .messages {
        overflow: auto;
        padding: 0.9rem;
        display: grid;
        gap: 0.75rem;
      }
      .msg {
        display: grid;
        gap: 0.35rem;
      }
      .msg.user {
        justify-items: end;
      }
      .bubble {
        max-width: 92%;
        padding: 0.65rem 0.8rem;
        border-radius: 0.9rem;
        border: 1px solid var(--color-border);
        background: rgba(30, 41, 59, 0.8);
      }
      .msg.user .bubble {
        background: rgba(37, 99, 235, 0.2);
        border-color: rgba(37, 99, 235, 0.4);
      }
      .bubble p {
        margin: 0;
        white-space: pre-wrap;
      }
      .badge {
        display: inline-block;
        margin-top: 0.35rem;
        font-size: 0.7rem;
        color: #cbd5e1;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        padding: 0.1rem 0.45rem;
      }
      .badge.ai {
        color: #bfdbfe;
        border-color: rgba(37, 99, 235, 0.5);
      }
      .suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      .suggestion {
        background: transparent;
        color: #cbd5e1;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        padding: 0.2rem 0.55rem;
        font-size: 0.78rem;
        cursor: pointer;
      }
      .typing {
        margin: 0;
        font-size: 0.9rem;
      }
      .composer {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
        padding: 0.75rem;
        border-top: 1px solid var(--color-border);
        background: rgba(15, 23, 42, 0.7);
      }
      .composer input {
        width: 100%;
        background: rgba(30, 41, 59, 0.9);
        color: var(--color-cloud);
        border: 1px solid var(--color-border);
        border-radius: 0.7rem;
        padding: 0.6rem 0.75rem;
      }
      .send {
        padding-inline: 0.9rem;
      }
      .fab {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 999px;
        border: 1px solid rgba(37, 99, 235, 0.5);
        background: var(--color-blue);
        color: #fff;
        box-shadow: var(--shadow-soft);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        line-height: 1;
      }
      .fab:hover {
        filter: brightness(1.05);
      }
    `,
  ],
})
export class ChatbotComponent {
  readonly chat = inject(ChatService);
  readonly open = signal(false);
  draft = '';

  toggle(): void {
    this.open.update((v) => !v);
  }

  submit(): void {
    const text = this.draft.trim();
    if (!text) return;
    this.chat.send(text);
    this.draft = '';
  }

  useSuggestion(text: string): void {
    this.draft = text;
    this.submit();
  }
}
