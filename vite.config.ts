/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { prerenderPaths, metaFor } from './src/app/routes'

/**
 * Emits one HTML document per public route with its own <title>, description,
 * canonical URL and Open Graph tags, plus sitemap.xml and robots.txt.
 * Content still renders client-side; link previews and crawlers get correct
 * metadata without a server.
 */
function routeDocuments(origin: string | undefined): Plugin {
  const esc = (v: string) =>
    v.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

  return {
    name: 'kvg-route-documents',
    apply: 'build',
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const index = bundle['index.html']
        if (!index || index.type !== 'asset' || typeof index.source !== 'string') return
        const template = index.source

        for (const path of prerenderPaths()) {
          const meta = metaFor(path)
          const abs = (p: string) => (origin ? new URL(p, origin).href : p)
          const head = [
            `<title>${esc(meta.title)}</title>`,
            `<meta name="description" content="${esc(meta.description)}">`,
            `<meta property="og:title" content="${esc(meta.title)}">`,
            `<meta property="og:description" content="${esc(meta.description)}">`,
            `<meta property="og:type" content="website">`,
            `<meta property="og:image" content="${esc(abs('/og-cover.png'))}">`,
            `<meta name="twitter:card" content="summary_large_image">`,
            origin ? `<link rel="canonical" href="${esc(abs(path))}">` : '',
            origin ? `<meta property="og:url" content="${esc(abs(path))}">` : '',
            meta.noindex ? `<meta name="robots" content="noindex">` : '',
          ]
            .filter(Boolean)
            .join('\n    ')
          const html = template.replace(/<!--route-head-->[\s\S]*?<!--\/route-head-->/, head)
          if (path === '/') index.source = html
          else this.emitFile({ type: 'asset', fileName: `${path.slice(1)}/index.html`, source: html })
        }

        if (origin) {
          const urls = prerenderPaths()
            .filter((p) => !metaFor(p).noindex)
            .map((p) => `  <url><loc>${new URL(p, origin).href}</loc></url>`)
          this.emitFile({
            type: 'asset',
            fileName: 'sitemap.xml',
            source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
          })
          this.emitFile({
            type: 'asset',
            fileName: 'robots.txt',
            source: `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', origin).href}\n`,
          })
        } else {
          this.warn('SITE_URL not set: skipping canonical URLs, sitemap.xml and robots.txt')
        }
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const { SITE_URL } = loadEnv(mode, process.cwd(), 'SITE_')
  const origin = SITE_URL ? new URL(SITE_URL).origin : undefined

  return {
    plugins: [react(), routeDocuments(origin)],
    build: {
      target: 'es2022',
      cssCodeSplit: true,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.test.{ts,tsx}'],
      css: false,
    },
  }
})
