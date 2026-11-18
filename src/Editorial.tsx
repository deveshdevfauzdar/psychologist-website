import { useId, useState } from 'react'
import type { ReactNode, PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ArrowUpRight, Plus } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }}
    transition={{ duration: 0.8, ease }}>{children}</motion.div>
}

export function Photograph({ file, alt, className = '', priority = false }: {
  file: string; alt: string; className?: string; priority?: boolean
}) {
  const reduced = useReducedMotion()
  return <div className={'photograph ' + className}>
    <motion.img src={'media/' + file} alt={alt} loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'} decoding="async"
      initial={reduced ? false : { scale: 1.045 }}
      whileInView={{ scale: 1 }} viewport={{ once: true, amount: .04 }} transition={{ duration: 1.2, ease }} />
  </div>
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <a className="editorial-link" href={href}><span>{children}</span><ArrowUpRight size={18} strokeWidth={1.4} aria-hidden="true" /></a>
}

export function Disclosure({ title, children, initiallyOpen = false }: {
  title: string; children: ReactNode; initiallyOpen?: boolean
}) {
  const id = useId()
  const [open, setOpen] = useState(initiallyOpen)
  return <div className="disclosure" data-expanded={open}>
    <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      <span>{title}</span><Plus size={21} strokeWidth={1.3} aria-hidden="true" />
    </button>
    <div id={id} className="disclosure-body" aria-hidden={!open} inert={!open}>
      <div><div className="disclosure-content">{children}</div></div>
    </div>
  </div>
}

export function SectionCover({ title, file, alt, className = '' }: { title: ReactNode; file: string; alt: string; className?: string }) {
  return <header className={'section-cover ' + className}>
    <Photograph file={file} alt={alt} priority />
    <div className="cover-type"><Reveal><h1>{title}</h1></Reveal></div>
  </header>
}

export function ConsultationButton() {
  const reduced = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 170, damping: 19 })
  const y = useSpring(pointerY, { stiffness: 170, damping: 19 })
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left - bounds.width / 2) * 0.07)
    pointerY.set((event.clientY - bounds.top - bounds.height / 2) * 0.14)
  }
  return <motion.a href="contact/" className="consultation-button" style={{ x, y }}
    onPointerMove={move} onPointerLeave={() => { pointerX.set(0); pointerY.set(0) }}>
    <span className="cta-fill" aria-hidden="true" />
    <span className="cta-label"><span>Book a consultation</span><span aria-hidden="true">Book a consultation</span></span>
    <span className="cta-arrow" aria-hidden="true"><ArrowUpRight size={24} strokeWidth={1.4} /><ArrowUpRight size={24} strokeWidth={1.4} /></span>
  </motion.a>
}
