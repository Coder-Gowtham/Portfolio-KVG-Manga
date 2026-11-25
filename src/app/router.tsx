import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppShell } from '../components/layout/AppShell'
import { RouteError } from '../pages/RouteError'

/**
 * Route-based code splitting: each page is its own chunk, loaded on demand.
 * Paths here must match src/app/routes.ts (metadata + static HTML).
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('../pages/Home/HomePage')).default }) },
      { path: 'projects', lazy: async () => ({ Component: (await import('../pages/Projects/ProjectsPage')).default }) },
      {
        path: 'projects/:slug',
        lazy: async () => ({ Component: (await import('../pages/ProjectDetail/ProjectDetailPage')).default }),
      },
      {
        path: 'experience',
        lazy: async () => ({ Component: (await import('../pages/Experience/ExperiencePage')).default }),
      },
      {
        path: 'recruiter',
        lazy: async () => ({ Component: (await import('../pages/Recruiter/RecruiterPage')).default }),
      },
      { path: 'contact', lazy: async () => ({ Component: (await import('../pages/Contact/ContactPage')).default }) },
      {
        path: 'playground',
        lazy: async () => ({ Component: (await import('../pages/Playground/PlaygroundPage')).default }),
      },
      {
        path: 'playground/secret',
        lazy: async () => ({ Component: (await import('../pages/Playground/SecretPage')).default }),
      },
      { path: '*', lazy: async () => ({ Component: (await import('../pages/NotFound/NotFoundPage')).default }) },
    ],
  },
]

export const createRouter = () => createBrowserRouter(routes)
