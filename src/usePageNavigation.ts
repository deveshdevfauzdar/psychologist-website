import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { allPages, pageCovers } from './pages'

const siteBase = new URL(document.baseURI)
const baseTag = document.querySelector('base')
if (baseTag) baseTag.href = siteBase.href
const routes = new Map(allPages.map(page => [page.path, page]))
const initialPath = document.documentElement.dataset.page ?? ''
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

function routeFor(url: URL) {
  if (url.origin !== siteBase.origin || !url.pathname.startsWith(siteBase.pathname)) return
  const route = url.pathname.slice(siteBase.pathname.length).replace(/(?:^|\/)index\.html$/, '').replace(/\/$/, '')
  return routes.get(route)
}

function goToPosition(hash: string, top: number) {
  let target: HTMLElement | null = null
  if (hash) {
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))) }
    catch { /* A malformed fragment still opens the page. */ }
  }
  if (target) target.scrollIntoView({ behavior: 'instant' })
  else window.scrollTo({ top, behavior: 'instant' })
}

export function usePageNavigation(onChange: () => void) {
  const [path, setPath] = useState(initialPath)
  const veil = useRef<HTMLDivElement>(null)
  const follow = useRef<((url: URL, back: boolean, entry?: Record<string, string>) => Promise<void>) | null>(null)
  const navigate = useCallback((href: string, entry?: Record<string, string>) => {
    const url = new URL(href, siteBase)
    if (follow.current && routeFor(url)) void follow.current(url, false, entry)
    else window.location.assign(url.href)
  }, [])
  useEffect(() => {
    const surface = veil.current
    if (!surface) return
    const curtain = surface
    const savedRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    let entrySequence = 0
    const newKey = () => Date.now().toString(36) + '-' + (++entrySequence)
    let activeKey: string = history.state?.practiceEntry ?? newKey()
    if (!history.state?.practiceEntry) history.replaceState({ ...history.state, practiceEntry: activeKey }, '')
    let currentPath = document.documentElement.dataset.page ?? ''
    const positions = new Map<string, number>()
    const remember = () => { positions.set(activeKey, window.scrollY) }
    let sequence = 0
    let animation: Animation | undefined
    let pending = false
    let followUp = 0
    const warmImages = new Map<string, HTMLImageElement>()

    function warm(path: string) {
      const file = pageCovers[path]
      if (!file || path === currentPath || warmImages.has(file)) return
      const image = new Image()
      image.decoding = 'async'
      image.src = new URL('media/' + file, siteBase).href
      warmImages.set(file, image)
    }

    function anticipate(event: Event) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
      if (!link) return
      const route = routeFor(new URL(link.href))
      if (route) warm(route.path)
    }

    async function transition(url: URL, back: boolean, entry?: Record<string, string>) {
      const destination = routeFor(url)
      if (!destination) return
      warm(destination.path)
      const ticket = ++sequence
      animation?.cancel()
      window.cancelAnimationFrame(followUp)
      const useMotion = !motionPreference.matches && typeof curtain.animate === 'function'
      const sign = back ? -1 : 1
      remember()
      pending = true
      curtain.hidden = !useMotion
      if (useMotion) {
        animation = curtain.animate([
          { transform: 'translateY(' + (sign * 102) + '%)' }, { transform: 'translateY(0)' },
        ], { duration: 280, easing: 'cubic-bezier(.46,.02,.32,1)', fill: 'both' })
        await animation.finished.catch(() => {})
      }
      if (ticket !== sequence) return
      if (back) {
        activeKey = history.state?.practiceEntry ?? newKey()
        if (!history.state?.practiceEntry) history.replaceState({ ...history.state, practiceEntry: activeKey }, '')
      } else {
        activeKey = newKey()
        history.pushState({ ...entry, practiceEntry: activeKey }, '', url.href)
      }
      currentPath = destination.path
      document.documentElement.dataset.page = currentPath
      document.title = destination.title + ' — Therapy Office of Anna Tseytlina'
      document.querySelector('meta[name="description"]')?.setAttribute('content', destination.description)
      flushSync(() => { onChange(); setPath(currentPath) })
      const top = back ? positions.get(activeKey) ?? 0 : 0
      goToPosition(url.hash, top)
      document.getElementById('main-content')?.focus({ preventScroll: true })
      if (useMotion) {
        animation?.cancel()
        animation = curtain.animate([
          { transform: 'translateY(0)' }, { transform: 'translateY(' + (-sign * 102) + '%)' },
        ], { duration: 485, easing: 'cubic-bezier(.56,0,.18,1)', fill: 'both' })
        await animation.finished.catch(() => {})
      }
      if (ticket !== sequence) return
      curtain.hidden = true
      animation?.cancel()
      pending = false
    }

    function click(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
      if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download') || anchor.hasAttribute('data-native')) return
      const url = new URL(anchor.href)
      const route = routeFor(url)
      if (!route) return
      if (route.path === currentPath && !pending) {
        if (url.hash) return
        event.preventDefault()
        onChange()
        window.scrollTo({ top: 0, behavior: motionPreference.matches ? 'instant' : 'smooth' })
        return
      }
      event.preventDefault()
      void transition(url, false)
    }

    function pop() {
      const url = new URL(location.href)
      if (routeFor(url)?.path === currentPath && !pending) {
        goToPosition(url.hash, positions.get(history.state?.practiceEntry) ?? 0)
        return
      }
      void transition(url, true)
    }
    if (location.hash) followUp = requestAnimationFrame(() => goToPosition(location.hash, 0))
    follow.current = transition
    document.addEventListener('click', click)
    document.addEventListener('pointerover', anticipate, { passive: true })
    document.addEventListener('focusin', anticipate)
    window.addEventListener('popstate', pop)
    window.addEventListener('scroll', remember, { passive: true })
    return () => {
      follow.current = null
      sequence++
      cancelAnimationFrame(followUp)
      animation?.cancel()
      curtain.hidden = true
      history.scrollRestoration = savedRestoration
      document.removeEventListener('click', click)
      document.removeEventListener('pointerover', anticipate)
      document.removeEventListener('focusin', anticipate)
      window.removeEventListener('popstate', pop)
      window.removeEventListener('scroll', remember)
    }
  }, [onChange])
  return { path, veil, navigate }
}
