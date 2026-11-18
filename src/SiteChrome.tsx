import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { pages } from './pages'
import { office } from './practice'

function hrefFor(path: string) { return path ? path + '/' : './' }

export function SiteHeader({ path, open, setOpen, introActive }: {
  path: string; open: boolean; setOpen: (value: boolean) => void; introActive: boolean
}) {
  const toggle = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLElement>(null)
  const [origin, setOrigin] = useState('95% 65px')
  const reduced = useReducedMotion()
  const current = path.split('/')[0]
  useEffect(() => {
    if (!open) return
    toggle.current?.focus({ preventScroll: true })
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); return }
      if (event.key !== 'Tab') return
      const items = [toggle.current, ...Array.from(dialog.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? [])].filter(Boolean) as HTMLElement[]
      const at = items.indexOf(document.activeElement as HTMLElement)
      event.preventDefault()
      items[(at + (event.shiftKey ? -1 : 1) + items.length) % items.length]?.focus()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      toggle.current?.focus({ preventScroll: true })
    }
  }, [open, setOpen])

  return <>
    <header className="site-header" inert={introActive}>
      <a className="brand" href="./" aria-label="Therapy Office of Anna Tseytlina, home" inert={open}>
        <img className="brand-logo" src="media/therapy-office-logo-dark.png" alt="Therapy Office of Anna Tseytlina, LMFT" width="1200" height="268" />
      </a>
      <div className="header-right">
        {path && <a href="./" className="mobile-home" inert={open}><ArrowLeft size={14} strokeWidth={1.4} aria-hidden="true" />Home</a>}
        <nav className="desktop-nav" aria-label="Main navigation" inert={open}>
          {pages.filter(page => (path && !page.path) || ['about', 'therapy', 'fees', 'contact'].includes(page.path)).map(page =>
            <a key={page.path} href={hrefFor(page.path)} aria-current={page.path === current ? 'page' : undefined}>{page.label}</a>)}
        </nav>
        <button ref={toggle} className={'menu-toggle' + (open ? ' is-active' : '')}
          onClick={() => {
            const rect = toggle.current?.getBoundingClientRect()
            if (rect) setOrigin((rect.left + rect.width / 2) + 'px ' + (rect.top + rect.height / 2) + 'px')
            setOpen(!open)
          }}
          aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-menu"><span /><span /></button>
      </div>
    {path && <span data-sound-slot="" className="header-sound" />}</header>
    <AnimatePresence>{open && <motion.aside id="site-menu" className="menu-overlay" ref={dialog} role="dialog" aria-modal="true" aria-label="Site menu"
      initial={{ clipPath: 'circle(0px at ' + origin + ')' }}
      animate={{ clipPath: 'circle(150vmax at ' + origin + ')' }}
      exit={{ clipPath: 'circle(0px at ' + origin + ')' }}
      transition={{ duration: reduced ? 0 : 0.78, ease: [0.76, 0, 0.24, 1] }}>
      <div className="menu-content"><nav aria-label="Explore the website" className="menu-links">
        {pages.map((page, index) => <div className="menu-link-mask" key={page.path}>
          <motion.a href={hrefFor(page.path)} aria-current={page.path === current ? 'page' : undefined}
            initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : '105%' }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.19 + index * 0.055, duration: reduced ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}>
            <span className="menu-link-text">{page.label}</span><ArrowUpRight className="menu-arrow" strokeWidth={1} aria-hidden="true" />
          </motion.a></div>)}
      </nav>
      <div className="menu-aside"><div className="menu-visual"><img src="media/clay-vessel.webp" alt="" /></div><p>Anna Tseytlina, LMFT</p></div></div>
      <div className="menu-footer"><a href={office.emailHref}>{office.email}<ArrowUpRight size={14} /></a><a href={office.phoneHref}>{office.phone}</a></div>
    </motion.aside>}</AnimatePresence>
  </>
}

export function SiteFooter({ path }: { path: string }) {
  return <footer className="practice-footer">
    <div className="footer-directory">
      <a href="./" className="footer-brand"><img width="1200" height="268" src="media/therapy-office-logo-dark.png" alt="Therapy Office of Anna Tseytlina, home" /></a>
      <nav aria-label="Footer navigation">{pages.filter(page => ['', 'about', 'therapy', 'fees', 'journal', 'contact'].includes(page.path)).map(page => <a key={page.path} href={hrefFor(page.path)}>{page.label}</a>)}</nav>
      {path !== 'contact' && <address><a href={office.emailHref}>{office.email}</a><a href={office.phoneHref}>{office.phone}</a></address>}
    </div>
    <div className="footer-policies"><a href="privacy-policy/">Privacy policy</a><a href="website-terms/">Website terms</a></div>
  </footer>
}
