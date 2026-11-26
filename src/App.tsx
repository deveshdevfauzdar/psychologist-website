import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { MotionConfig, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { useIntro } from './useIntro'
import { ConsultationButton } from './Editorial'
import { AboutPage, ApproachPreview, FeesPage, HomePractice, HomeVisit, PerspectivePage, TherapyPage } from './PracticePages'
import { ContactPage, ThankYouPage, type ConsultationResult } from './ContactPage'
import { PrivacyPage } from './PrivacyPage'
import { usePageNavigation } from './usePageNavigation'
import { HomeJournal, JournalArticle, JournalIndex } from './JournalPages'
import { SiteHeader, SiteFooter } from './SiteChrome'
import { journal } from './journal'

function InnerPage({ path, onComplete }: { path: string; onComplete: (result: ConsultationResult) => void }) {
  if (path === 'about') return <AboutPage />
  if (path === 'perspective') return <PerspectivePage />
  if (path === 'therapy') return <TherapyPage />
  if (path === 'fees') return <FeesPage />
  if (path === 'contact') return <ContactPage onComplete={onComplete} />
  if (path === 'thank-you') return <ThankYouPage />
  if (path === 'privacy-policy') return <PrivacyPage />
  if (path === 'website-terms') return <article className="terms-page section-shell arrival"><h1>Website terms</h1>
    <p>This website introduces Anna’s practice and provides general information about therapy. You and Anna confirm the appointment time, fee and insurance arrangements directly.</p>
    <p>For questions about how the practice uses personal information, read its <a href="privacy-policy/">privacy policy</a>.</p></article>
  if (path === 'journal') return <JournalIndex />
  const article = journal.find(entry => path === 'journal/' + entry.slug)
  return article ? <JournalArticle entry={article} /> : <section className="section-shell"><h1>Page not found</h1><a href="./">Return home</a></section>
}

export default function App() {
  const reduced = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [navigated, setNavigated] = useState(false)
  const portrait = useRef<HTMLImageElement>(null)
  const onNavigate = useCallback(() => {
    setMenuOpen(false)
    setNavigated(true)
  }, [])
  const { path, veil, navigate } = usePageNavigation(onNavigate)
  const complete = useCallback((result: ConsultationResult) => {
    navigate('thank-you/', { consultationResult: result })
  }, [navigate])
  const home = path === ''
  const { phase, progress, skip } = useIntro(portrait, !home || navigated || reduced)
  const introActive = home && phase !== 'complete'

  useEffect(() => {
    document.documentElement.toggleAttribute('data-hide-sound', menuOpen || introActive)
    if (!menuOpen && !introActive) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old; document.documentElement.removeAttribute('data-hide-sound') }
  }, [menuOpen, introActive])

  return <MotionConfig reducedMotion="user"><div className={'experience ' + (home ? 'home-page' : 'interior-page') + (menuOpen ? ' menu-is-open' : '')} data-intro={phase}>
    <a href={window.location.pathname + '#main-content'} className="skip-link" inert={menuOpen || introActive}>Skip to content</a>
    <SiteHeader key={'header-' + path} path={path} open={menuOpen} setOpen={setMenuOpen} introActive={introActive} />
    <main key={path} id="main-content" tabIndex={-1} inert={menuOpen || introActive}>
      {home ? <>
        <section id="home" className="hero" aria-labelledby="hero-title">
          <div className="hero-media" style={phase === 'loading' ? { clipPath: 'inset(45% ' + (100 - progress) + '% 45% 0%)' } : undefined}>
            <div className="hero-frame">
              <img className="hero-backdrop" src="media/hero-plaster-arch.webp" alt="" width="1774" height="887" fetchPriority="high" decoding="async" />
              <img ref={portrait} className="hero-portrait" src="media/anna-portrait-concept.webp" alt="Anna Tseytlina in a taupe blazer" width="1122" height="1402" fetchPriority="high" decoding="async" />
            </div>
          </div>
          {introActive && <div className="loading-progress" style={{ width: progress + '%' }} aria-hidden="true"><span className="loading-label">Loading</span><span className="loading-count">/ {String(progress).padStart(3, '0')}</span></div>}
          <span data-sound-slot="" className="hero-sound" /><div className="hero-content">
            <h1 id="hero-title"><span className="reveal-mask"><span>Online therapy for anxiety, </span></span><span className="reveal-mask" style={{ '--reveal-delay': '.8625s' } as CSSProperties}><span>ADHD and relationships </span></span><span className="reveal-mask"><span>that feel stuck</span></span></h1>
            <p className="hero-description"><span className="reveal-mask"><span>With Anna Tseytlina, LMFT. Video sessions for individuals, couples and families across New York and New Jersey.</span></span></p>
            <div className="hero-cta"><ConsultationButton /></div>
          </div>
        </section>
        <ApproachPreview />
        <HomePractice />
        <HomeJournal />
        <HomeVisit />
      </> : <InnerPage path={path} onComplete={complete} />}
    </main>
    <div inert={menuOpen || introActive}><SiteFooter path={path} /></div>
    <div ref={veil} className="page-veil" aria-hidden="true" hidden />
    {introActive && <div className="loading-screen">
      <span className="sr-only" role="status">{phase === 'loading' ? 'Loading' : ''}</span>
      <div className="loading-logo-mask"><img className="loading-logo" src="media/therapy-office-logo-dark.png" alt="" width="1200" height="268" /></div>
      {phase === 'loading' && progress < 100 && <button className="skip-intro" onClick={skip}>Skip intro <ArrowUpRight size={15} strokeWidth={1.3} /></button>}
    </div>}
  </div></MotionConfig>
}
