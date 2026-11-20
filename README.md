# GatroxM.dev — Portafolio (monorepo local)

Portafolio profesional interactivo de **Gustavo Adolfo Muñoz Reyes** (GatroxM.dev), stack MEAN (Angular + Node.js/Express + TypeScript + MongoDB Atlas) con mascota **Gx** animada en Pencil2D y chatbot con IA (fallback a base de conocimientos local).

> Regla: la información profesional se toma de la hoja de vida real (`gatroxm-portfolio-backend/src/data/portfolio-content.ts`). No se inventan experiencias, métricas ni certificaciones.

## Estructura

```
GatroxM-Portfolio/
├── API_CONTRACT.md
├── GatroxM-Mascot/                 # Recursos de la mascota Gx (Pencil2D)
│   ├── 01-Character-Design/        # model-sheet.png, character-reference.png
│   ├── 02-Animations/              # gx-idle / gx-hello / gx-coding / gx-presenting / gx-celebrating
│   └── 03-Exports/                 # webm / mp4 / png-sequences
├── gatroxm-portfolio-frontend/     # Angular (en construcción)
└── gatroxm-portfolio-backend/      # Node.js + Express + TypeScript + MongoDB
    ├── .env                        # desarrollo local (Atlas + admin + chat)
    └── src/...
```

## Ejecutar todo junto (local)

Scripts de conveniencia en la raíz (abren backend y frontend en ventanas separadas):

```powershell
cd E:\GatroxM-Portfolio
.\start-all.cmd       # backend (3000) + frontend (4200)
# o por separado:
.\start-backend.cmd
.\start-frontend.cmd
```

> `start-frontend.cmd` avisará si el frontend aún no ha terminado de generarse/compilar. En este equipo PowerShell bloquea `npm.ps1`; los scripts usan `npm.cmd` / `npx.cmd`.

## Backend (listo y probado)

```powershell
cd E:\GatroxM-Portfolio\gatroxm-portfolio-backend
npm.cmd install
npm.cmd run seed      # idempotente: siembra datos reales en MongoDB Atlas
npm.cmd run dev       # http://localhost:3000
```

- Health: `GET http://localhost:3000/api/health`
- Datos: `/api/profile`, `/api/projects`, `/api/experience`, `/api/skills`, `/api/education`
- Contacto: `POST /api/contact`
- Chat: `POST /api/chat` (sin `AI_API_KEY` responde desde base de conocimientos real con `source: "knowledge"`)
- Auth admin: `POST /api/auth/login` (usuario `admin`, password definido en `.env`)

## Frontend (en construcción)

Se está generando Angular 22 standalone + SCSS con las 9 secciones, consumo de API, chatbot flotante y componente de mascota con fallback/lazy/reduced-motion. Cuando termine quedará en `gatroxm-portfolio-frontend/` y se arranca con:

```powershell
cd E:\GatroxM-Portfolio\gatroxm-portfolio-frontend
npm.cmd install
npx.cmd ng serve   # http://localhost:4200 (API en http://localhost:3000/api)
```

## Mascota Gx

Imágenes base copiadas a `GatroxM-Mascot/01-Character-Design/` (hoja de modelo y referencia). Exporta las animaciones de Pencil2D a `03-Exports/` y cópialas al frontend en `public/assets/animations/` como `gx-hello|idle|coding|presenting|celebrating.(webm|mp4)` con poster PNG.

## MongoDB Atlas

Conexión configurada en `gatroxm-portfolio-backend/.env` (`MONGODB_DB=gatroxm_portfolio`). MongoDB guarda solo URLs/metadatos multimedia, nunca archivos de vídeo. No se suben credenciales al repositorio (`.env` está en `.gitignore`).
