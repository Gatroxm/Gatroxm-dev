import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        title: 'GatroxM.dev | Gustavo Adolfo Muñoz Reyes',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'about',
        title: 'Sobre mí | GatroxM.dev',
        loadComponent: () =>
          import('./features/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'experience',
        title: 'Experiencia | GatroxM.dev',
        loadComponent: () =>
          import('./features/experience/experience.component').then((m) => m.ExperienceComponent),
      },
      {
        path: 'architecture',
        title: 'Arquitectura | GatroxM.dev',
        loadComponent: () =>
          import('./features/architecture/architecture.component').then(
            (m) => m.ArchitectureComponent,
          ),
      },
      {
        path: 'projects',
        title: 'Proyectos | GatroxM.dev',
        loadComponent: () =>
          import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
      },
      {
        path: 'technologies',
        title: 'Tecnologías | GatroxM.dev',
        loadComponent: () =>
          import('./features/technologies/technologies.component').then(
            (m) => m.TechnologiesComponent,
          ),
      },
      {
        path: 'ai',
        title: 'AI Engineering | GatroxM.dev',
        loadComponent: () =>
          import('./features/ai-engineering/ai-engineering.component').then(
            (m) => m.AiEngineeringComponent,
          ),
      },
      {
        path: 'education',
        title: 'Educación | GatroxM.dev',
        loadComponent: () =>
          import('./features/education/education.component').then((m) => m.EducationComponent),
      },
      {
        path: 'blog',
        title: 'Blog | GatroxM.dev',
        loadComponent: () =>
          import('./features/blog/list/blog-list.component').then((m) => m.BlogListComponent),
      },
      {
        path: 'blog/:slug',
        title: 'Blog | GatroxM.dev',
        loadComponent: () =>
          import('./features/blog/detail/blog-detail.component').then((m) => m.BlogDetailComponent),
      },
      {
        path: 'contact',
        title: 'Contacto | GatroxM.dev',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'admin/login',
        title: 'Acceso administrativo | GatroxM.dev',
        loadComponent: () =>
          import('./features/admin/login/login.component').then((m) => m.AdminLoginComponent),
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/layout/admin-layout.component').then(
            (m) => m.AdminLayoutComponent,
          ),
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'messages' },
          {
            path: 'messages',
            title: 'Mensajes | Admin GatroxM.dev',
            loadComponent: () =>
              import('./features/admin/messages/admin-messages.component').then(
                (m) => m.AdminMessagesComponent,
              ),
          },
          {
            path: 'blog',
            title: 'Blog | Admin GatroxM.dev',
            loadComponent: () =>
              import('./features/admin/blog/admin-blog.component').then(
                (m) => m.AdminBlogComponent,
              ),
          },
        ],
      },
      {
        path: '**',
        title: 'Página no encontrada | GatroxM.dev',
        loadComponent: () =>
          import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
      },
    ],
  },
];
