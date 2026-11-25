import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { metaFor } from './routes'

function setMeta(attr: 'name' | 'property', key: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (content === null) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/**
 * Keeps <title> and meta tags in sync on client-side navigation.
 *
 * The build already writes the correct tags into each route's static HTML
 * (vite.config.ts), so crawlers and link previews see them without
 * JavaScript. This component updates those same tags in place rather than
 * adding duplicates.
 */
export function Seo({ title, description }: { title?: string; description?: string }) {
  const { pathname } = useLocation()
  const meta = metaFor(pathname)
  const t = title ?? meta.title
  const d = description ?? meta.description
  const noindex = Boolean(meta.noindex)

  useEffect(() => {
    document.title = t
    setMeta('name', 'description', d)
    setMeta('property', 'og:title', t)
    setMeta('property', 'og:description', d)
    setMeta('name', 'robots', noindex ? 'noindex' : null)
  }, [t, d, noindex])

  return null
}
