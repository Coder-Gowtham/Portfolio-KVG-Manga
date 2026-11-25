import { isRouteErrorResponse, useRouteError } from 'react-router'

/**
 * Last-resort error screen (e.g. a page chunk failed to load after a deploy).
 * Deliberately dependency-free so it renders even if the shell is broken.
 */
export function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : 'Something broke mid-render.'
  return (
    <main className="page" style={{ display: 'grid', gap: 'var(--s-4)' }}>
      <h1 style={{ fontSize: 'var(--fs-h2)' }}>SYSTEM GLITCH</h1>
      <p>{message}</p>
      <p>
        <a href="/">Reload the site</a>
      </p>
    </main>
  )
}
