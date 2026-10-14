import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionConfig, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { PointerEvent } from 'react'
import { ArrowUpRight, Check, Mail, Phone, Volume2, VolumeX, X } from 'lucide-react'
import { useIntro } from './useIntro'
import { useHeroSource } from './useHeroSource'

type Panel = 'contact' | 'about' | null
const introduction = 'Founded by a team of licensed mental health professionals with decades of combined clinical experience, our practice blends evidence-based techniques with a warm, personalized approach. We specialize in virtual care, making high-quality therapy accessible, confidential, and convenient—wherever you are.'

function ConsultationButton({ onClick }: { onClick: () => void }) {
  const reducedMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 170, damping: 19 })
  const y = useSpring(pointerY, { stiffness: 170, damping: 19 })

  function move(event: PointerEvent<HTMLButtonElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.07)
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.14)
  }

  return <motion.button className="consultation-button" style={{ x, y }} onPointerMove={move} onPointerLeave={() => { pointerX.set(0); pointerY.set(0) }} onClick={onClick}>
    <span className="cta-fill" aria-hidden="true" />
    <span className="cta-label"><span>Book a consultation</span><span aria-hidden="true">Book a consultation</span></span>
    <span className="cta-arrow" aria-hidden="true"><ArrowUpRight size={24} strokeWidth={1.4} /><ArrowUpRight size={24} strokeWidth={1.4} /></span>
  </motion.button>
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [panel, setPanel] = useState<Panel>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [audioError, setAudioError] = useState('')
  const [copied, setCopied] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const heroRef = useRef<HTMLVideoElement>(null)
  const heroSource = useHeroSource(heroRef)
  const { phase: introPhase, progress, skip: skipIntro } = useIntro(heroRef, reducedMotion)
  const introActive = introPhase !== 'complete'
  const stripVisible = introPhase === 'loading'
  const menuToggle = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const [menuOrigin, setMenuOrigin] = useState('calc(100% - 70px) 70px')
  const overlayOpen = menuOpen || panel !== null

  useEffect(() => {
    const video = heroRef.current
    if (!video) return
    // Like the reference, the video already plays (hidden) while loading, so the reveal starts on moving frames.
    if (reducedMotion || overlayOpen) video.pause()
    else void video.play().catch(() => {})
  }, [reducedMotion, overlayOpen, heroSource.src])

  useEffect(() => {
    if (!overlayOpen && !introActive) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [overlayOpen, introActive])

  useEffect(() => {
    if (!overlayOpen) return
    const focusable = () => {
      const region = panel ? dialogRef.current : menuRef.current
      const items = Array.from(region?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [])
      if (!panel && menuToggle.current) items.unshift(menuToggle.current)
      return items
    }
    const timer = window.setTimeout(() => focusable()[0]?.focus(), 160)
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); setPanel(null) }
      if (event.key === 'Tab') {
        const items = focusable()
        const current = items.indexOf(document.activeElement as HTMLElement)
        const next = (current + (event.shiftKey ? -1 : 1) + items.length) % items.length
        event.preventDefault()
        items[next]?.focus()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKey)
      requestAnimationFrame(() => {
        const target = lastFocus.current?.isConnected ? lastFocus.current : menuToggle.current
        target?.focus({ preventScroll: true })
      })
    }
  }, [overlayOpen, panel])

  const goTo = (id: string) => {
    setMenuOpen(false)
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' }))
  }
  const openPanel = (next: Panel) => {
    lastFocus.current = document.activeElement as HTMLElement
    setMenuOpen(false)
    setCopied(false)
    setPanel(next)
  }
  const toggleMenu = () => {
    const rect = menuToggle.current?.getBoundingClientRect()
    if (rect) setMenuOrigin((rect.left + rect.width / 2) + 'px ' + (rect.top + rect.height / 2) + 'px')
    lastFocus.current = menuToggle.current
    setMenuOpen(!menuOpen)
  }
  const toggleSound = async () => {
    if (!audioRef.current) return
    setAudioError('')
    if (soundOn) { audioRef.current.pause(); setSoundOn(false); return }
    audioRef.current.volume = 0.24
    try { await audioRef.current.play(); setSoundOn(true) }
    catch { setAudioError('Sound couldn’t start. Please try again.') }
  }
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText('anna@lmftcounselingnjny.com'); setCopied(true) }
    catch { setCopied(false) }
  }

  return <MotionConfig reducedMotion="user"><div className={'experience' + (menuOpen ? ' menu-is-open' : '')} data-intro={introPhase}>
    <audio ref={audioRef} src="media/ambient.mp3" loop preload="none" />
    <a href="#hero-title" className="skip-link" inert={overlayOpen || introActive}>Skip to content</a>

    <header className="site-header" inert={panel !== null || introActive}>
      <a className="brand" href="#home" onClick={event => { event.preventDefault(); goTo('home') }} aria-label="Therapy Office of Anna Tseytlina, home" inert={menuOpen}>
        <img className="brand-logo" src="media/therapy-office-logo-light.png" alt="Therapy Office of Anna Tseytlina, LMFT" width="1200" height="268" />
        <img className="brand-logo brand-logo-dark" src="media/therapy-office-logo-dark.png" alt="" width="1200" height="268" />
      </a>
      <div className="header-right">
        <nav className="desktop-nav" aria-label="Main navigation" inert={menuOpen}>
          <button onClick={() => openPanel('about')}>About</button>
          <button onClick={() => goTo('approach')}>Our approach</button>
          <button onClick={() => openPanel('contact')}>Contact</button>
        </nav>
        <button ref={menuToggle} className={'menu-toggle' + (menuOpen ? ' is-active' : '')} onClick={toggleMenu} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="site-menu">
          <span /><span />
        </button>
      </div>
    </header>

    <main inert={overlayOpen || introActive}>
      <section id="home" className="hero" aria-labelledby="hero-title">
        {/* Reveal (see index.css, [data-intro]): the strip opens to full height while the frame spins in from the centre. */}
        <div className="hero-media" style={stripVisible ? { clipPath: 'inset(45% ' + (100 - progress) + '% 45% 0%)' } : undefined}>
          <div className="hero-frame">
            <video ref={heroRef} className="hero-video" src={heroSource.src} poster={heroSource.poster} loop muted playsInline preload="auto" aria-hidden="true" />
          </div>
        </div>
        {introActive && <div className="loading-progress" style={{ width: progress + '%' }} aria-hidden="true">
          <span className="loading-label">Loading</span><span className="loading-count">/ {String(progress).padStart(3, '0')}</span>
        </div>}
        <div className="hero-content">
          <p className="hero-description"><span className="reveal-mask"><span>
            Compassionate online therapy designed to<br className="desktop-break" /> help you rediscover balance, build resilience,<br className="desktop-break" /> and move forward with confidence.
          </span></span></p>
          <div className="hero-title-row">
            <h1 id="hero-title" tabIndex={-1}><span className="reveal-mask"><span>Healing Starts Here</span></span></h1>
            <div className="hero-cta">
              <ConsultationButton onClick={() => openPanel('contact')} />
            </div>
          </div>
        </div>
        <button onClick={toggleSound} className="sound-control" aria-pressed={soundOn} aria-label={soundOn ? 'Turn ambient sound off' : 'Turn ambient sound on'}>
          {soundOn ? <Volume2 size={20} strokeWidth={1.4} /> : <VolumeX size={20} strokeWidth={1.4} />}
          <span>Sound {soundOn ? 'on' : 'off'}</span>
        </button>
        <span className="audio-message" role="status">{audioError}</span>
      </section>

      <section id="approach" className="intro-section" aria-label="Our approach to therapy" style={{ visibility: introActive ? 'hidden' : 'visible' }}>
        <motion.p className="intro-copy" initial={reducedMotion ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.018 } } }}>
          {introduction.split(' ').map((word, index) => <motion.span className="intro-word" key={index} variants={{ hidden: { opacity: 0, y: 16, filter: 'blur(4px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reducedMotion ? 0 : 0.7, ease: 'easeOut' } } }}>{word}{' '}</motion.span>)}
        </motion.p>
      </section>
    </main>

    {introActive && <div className="loading-screen">
      <span className="sr-only" role="status">{stripVisible ? 'Loading' : ''}</span>
      <div className="loading-logo-mask"><img className="loading-logo" src="media/therapy-office-logo-dark.png" alt="Therapy Office of Anna Tseytlina, LMFT" width="1200" height="268" /></div>
      {stripVisible && progress < 100 && <button className="skip-intro" onClick={skipIntro}>Skip intro <ArrowUpRight size={15} strokeWidth={1.3} /></button>}
    </div>}

    <AnimatePresence>
      {menuOpen && <motion.aside id="site-menu" ref={menuRef} className="menu-overlay" initial={{ clipPath: 'circle(0px at ' + menuOrigin + ')' }} animate={{ clipPath: 'circle(150vmax at ' + menuOrigin + ')' }} exit={{ clipPath: 'circle(0px at ' + menuOrigin + ')' }} transition={{ duration: reducedMotion ? 0 : 0.85, ease: [0.76, 0, 0.24, 1] }} aria-label="Site menu" role="dialog" aria-modal="true">
        <div className="menu-content">
          <nav aria-label="Explore the website" className="menu-links">
            {[{ name: 'Home', action: () => goTo('home') }, { name: 'Our approach', action: () => goTo('approach') }, { name: 'About Anna', action: () => openPanel('about') }, { name: 'Contact', action: () => openPanel('contact') }].map((item, index) => <div className="menu-link-mask" key={item.name}><motion.button initial={{ opacity: 0, y: reducedMotion ? 0 : '105%' }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.3 + index * 0.075, duration: 0.85, ease: [0.22, 1, 0.36, 1] }} onClick={item.action}><span className="menu-number">0{index + 1}</span><span className="menu-link-text">{item.name}</span><ArrowUpRight className="menu-arrow" strokeWidth={1} /></motion.button></div>)}
          </nav>
          <motion.div className="menu-aside" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 1.1 }}>
            <div className="menu-visual"><motion.img src="media/hero-poster.jpg" alt="" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: 'easeOut' }} /></div>
            <p>Anna Tseytlina, LMFT</p><span>NEW YORK & NEW JERSEY</span>
          </motion.div>
        </div>
        <motion.div className="menu-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}><a href="mailto:anna@lmftcounselingnjny.com">anna@lmftcounselingnjny.com <ArrowUpRight size={14} /></a><a href="tel:+15512460611">+1 (551) 246-0611</a></motion.div>
      </motion.aside>}
    </AnimatePresence>

    <AnimatePresence>
      {panel && <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(null)}>
        <motion.div ref={dialogRef} className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" initial={{ opacity: 0, y: reducedMotion ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.35 }} onClick={event => event.stopPropagation()}>
          <button className="dialog-close" aria-label="Close dialog" onClick={() => setPanel(null)}><X size={23} strokeWidth={1.2} /></button>
          <img className="dialog-logo" src="media/therapy-office-logo-dark.png" alt="Therapy Office of Anna Tseytlina, LMFT" width="1200" height="268" />
          <h2 id="dialog-title">{panel === 'about' ? 'About Anna' : 'Let’s talk.'}</h2>
          {panel === 'about' ? <><p>I’m Anna Tseytlina, a licensed marriage and family therapist serving New York and New Jersey. I work with individuals, couples, and families through a warm, collaborative approach.</p><p>Whether you’re navigating anxiety, relationship challenges, or a season of change, we can make room to explore what matters to you.</p><button className="dark-cta" onClick={() => setPanel('contact')}>Book a consultation <ArrowUpRight size={20} /></button></> : <><p>A complimentary 15-minute phone consultation is a chance to share a little about yourself, ask questions, and see if we’re a good fit.</p><div className="contact-options"><a href="tel:+15512460611"><Phone size={20} strokeWidth={1.3} /><span><small>GIVE ME A CALL</small>+1 (551) 246-0611</span><ArrowUpRight size={20} /></a><a href="mailto:anna@lmftcounselingnjny.com?subject=Initial%20consultation"><Mail size={20} strokeWidth={1.3} /><span><small>SEND ME A NOTE</small>anna@lmftcounselingnjny.com</span><ArrowUpRight size={20} /></a></div><button className="copy-email" onClick={copyEmail}>{copied ? <><Check size={15} /> Email address copied</> : 'Copy email address'}</button></>}
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </div></MotionConfig>
}
