# GatroxM.dev — API contract (local MVP)

Base URL local: `http://localhost:3000/api`
Frontend local: `http://localhost:4200`

## Endpoints públicos

| Method | Path | Response |
| --- | --- | --- |
| GET | `/api/health` | `{ status: 'ok', uptime: number, mongo: 'connected' }` |
| GET | `/api/profile` | `Profile` |
| GET | `/api/projects` | `Project[]` (ordered by `order`) |
| GET | `/api/projects/:slug` | `Project` |
| GET | `/api/experience` | `Experience[]` (ordered) |
| GET | `/api/skills` | `SkillGroup[]` (ordered) |
| GET | `/api/education` | `EducationItem[]` (ordered; includes education, certifications and languages) |
| POST | `/api/contact` | `{ ok: true, id: string }` — body `{ name, email, subject?, message }` |
| POST | `/api/chat` | `{ reply: string, source: 'ai' \| 'knowledge', suggestions?: string[] }` — body `{ message: string, history?: { role: 'user' \| 'assistant', content: string }[] }` |

## Endpoints administrativos (Bearer JWT)

| Method | Path | Response |
| --- | --- | --- |
| POST | `/api/auth/login` | `{ token: string, user: { username: string, role: string } }` — body `{ username, password }` |
| GET | `/api/auth/me` | `{ username: string, role: string }` |
| POST / PUT / DELETE | `/api/projects`, `/api/experience`, `/api/skills`, `/api/education` | CRUD estándar (`PUT /api/:resource/:id`) |

## Modelos TypeScript (idénticos en backend y frontend)

```ts
export interface Stat { value?: number; suffix?: string; text?: string; label: string }
export interface FlowStep { title: string; text: string }
export interface Profile {
  name: string; brand: string; roles: string[]; title: string; location: string; lead: string;
  stats: Stat[]; about: { paragraphs: string[]; flow: FlowStep[] };
  contact: { email: string; phone: string; phoneHref: string; whatsapp: string; linkedin: string; github: string };
  resumeHref: string;
}
export interface Project {
  id: string; slug: string; title: string; summary: string; description: string;
  category: 'web' | 'architecture' | 'ai'; tags: string[]; featured: boolean;
  links: { demo?: string; repo?: string };
  media: { poster?: string; webm?: string; mp4?: string; pngSequence?: string };
  order: number;
}
export interface Experience {
  id: string; role: string; company: string; period: string; tags: string[]; bullets: string[]; order: number;
}
export interface SkillGroup { id: string; category: string; items: string[]; order: number }
export interface EducationItem {
  id: string; type: 'education' | 'certification' | 'language';
  title: string; org: string; year: string; href?: string; order: number;
}
```

## Reglas

- Los datos reales salen de `E:\Gatroxm.github.io\src\data\content.ts` (hoja de vida). No inventar nada.
- MongoDB guarda URLs/metadatos de multimedia, nunca vídeos.
- El chatbot usa datos reales de la BD como contexto. Sin `AI_API_KEY`, responde desde base de conocimientos local (`source: 'knowledge'`).
- CORS: solo `http://localhost:4200` en local.
- El frontend debe degradar gracefully si la API no responde (skeleton/estado vacío, sin texto inventado).
