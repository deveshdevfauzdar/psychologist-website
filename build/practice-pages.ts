import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { notFoundDocument } from './not-found'
import { allPages as routes, pageCovers, pages } from '../src/pages'

const publicFiles = [
  'favicon.svg', 'ambient-player.js', 'consultation-form.json', 'fonts/instrument-serif-regular.woff2', 'fonts/ms-madi-regular.ttf',
  'media/therapy-office-logo-dark.png', 'media/ambient.mp3',
  ...['anna-portrait-concept', 'hero-plaster-arch', 'therapy-room', 'stillness-stone', 'balance-stone',
    'quiet-horizon', 'anna-window-seat', 'open-notebook', 'quiet-lounge', 'tidal-estuary',
    'woods-at-the-water', 'linen-in-sun', 'willow-ink', 'anna-at-the-table', 'tea-at-noon',
    'limestone-passage', 'clay-vessel'].map(name => 'media/' + name + '.webp'),
]
const htmlEscape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')

function pageHtml(template: string, page: typeof pages[number]) {
  const depth = page.path ? page.path.split('/').length : 0
  let result = template.replace('data-page=""', 'data-page="' + page.path + '"')
    .replace('<base href="./"', '<base href="' + ('../'.repeat(depth) || './') + '"')
    .replace(/<title>.*?<\/title>/, '<title>' + htmlEscape(page.title) + ' — Therapy Office of Anna Tseytlina</title>')
    .replace(/<meta name="description" content="[^"]*"/, '<meta name="description" content="' + htmlEscape(page.description) + '"')
  if (depth) {
    result = result.replace(/\s*<link[^>]*\bdata-home\b[^>]*>/g, '')
    const cover = pageCovers[page.path]
    if (cover) result = result.replace('</head>', '<link rel="preload" as="image" href="media/' + cover + '" fetchpriority="high" /></head>')
  }
  return result
}

export function practicePages(): Plugin {
  let projectRoot = ''
  function showMissingPage(req: IncomingMessage, res: ServerResponse) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return false
    const pathname = new URL(req.url || '/', 'http://localhost').pathname
    const slug = pathname.replace(/(?:^|\/)index\.html$/, '').replace(/^\/+|\/+$/g, '')
    if (routes.some(page => page.path === slug)) return false
    const accept = req.headers.accept ?? '*/*'
    const wantsDocument = accept.includes('text/html') || accept === '*/*' || req.method === 'HEAD'
    const missingHTML = wantsDocument && !/^(?:@|src\/|node_modules\/|assets\/|fonts\/|media\/)/.test(slug) && (!slug.includes('.') || slug.endsWith('.html'))
    if (slug !== '404.html' && !missingHTML) return false
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(req.method === 'HEAD' ? undefined : notFoundDocument(projectRoot))
    return true
  }
  return {
    name: 'practice-pages',
    enforce: 'post',
    configResolved(config) { projectRoot = config.root },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (showMissingPage(req, res)) return
        const url = new URL(req.url || '/', 'http://localhost')
        const path = url.pathname.replace(/^\/+|\/+$/g, '')
        const page = routes.find(entry => entry.path === path)
        if (!path || !page || req.method !== 'GET') return next()
        if (!url.pathname.endsWith('/')) {
          res.writeHead(308, { Location: url.pathname + '/' + url.search })
          return res.end()
        }
        try {
          const template = readFileSync(resolve(projectRoot, 'index.html'), 'utf8')
          const html = await server.transformIndexHtml(url.pathname, pageHtml(template, page))
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(html)
        } catch (error) { next(error) }
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => { if (!showMissingPage(req, res)) next() })
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const entry = bundle['index.html']
        if (!entry || entry.type !== 'asset') this.error('Missing homepage HTML')
        const template = String(entry.source)
        this.emitFile({ type: 'asset', fileName: '404.html', source: notFoundDocument(projectRoot) })
        for (const page of routes.filter(route => route.path)) {
          this.emitFile({ type: 'asset', fileName: page.path + '/index.html', source: pageHtml(template, page) })
        }
        for (const fileName of publicFiles) {
          this.emitFile({ type: 'asset', fileName, source: readFileSync(resolve(projectRoot, 'public', fileName)) })
        }
      },
    },
  }
}
