import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiService } from './api.service';
import { ChatMessage } from '../models/api.models';

export interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
  source?: 'ai' | 'knowledge';
  suggestions?: string[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly api = inject(ApiService);

  readonly messages = signal<ChatEntry[]>([
    {
      role: 'assistant',
      content:
        'Hola, soy Gx. Puedo contarte sobre la experiencia, proyectos y enfoque en IA de Gustavo.',
      source: 'knowledge',
    },
  ]);
  readonly typing = signal(false);
  readonly error = signal<string | null>(null);

  send(text: string): void {
    const message = text.trim();
    if (!message || this.typing()) return;

    const history: ChatMessage[] = this.messages()
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    this.messages.update((list) => [...list, { role: 'user', content: message }]);
    this.typing.set(true);
    this.error.set(null);

    this.api
      .chat(message, history)
      .pipe(finalize(() => this.typing.set(false)))
      .subscribe({
        next: (res) => {
          this.messages.update((list) => [
            ...list,
            {
              role: 'assistant',
              content: res.reply,
              source: res.source,
              suggestions: res.suggestions,
            },
          ]);
        },
        error: () => {
          this.error.set('No pude conectar con el asistente en este momento.');
          this.messages.update((list) => [
            ...list,
            {
              role: 'assistant',
              content:
                'No hay conexión con la API en este momento. Intenta de nuevo más tarde.',
              source: 'knowledge',
            },
          ]);
        },
      });
  }
}
