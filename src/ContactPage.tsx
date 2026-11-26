import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'
import { Reveal, TextLink } from './Editorial'
import { office } from './practice'

export type ConsultationResult = 'preview' | 'received'
type Delivery = { status: 'ready'; endpoint: string } | { status: 'loading' | 'unavailable' }
type ContactProps = { onComplete: (result: ConsultationResult) => void }

function ContactForm({ onComplete }: ContactProps) {
  const [delivery, setDelivery] = useState<Delivery>({ status: 'loading' })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const pending = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function readSettings() {
      try {
        const response = await fetch(new URL('consultation-form.json', document.baseURI), { cache: 'no-cache', signal: controller.signal })
        if (!response.ok) throw new Error()
        const settings = await response.json()
        if (typeof settings.endpoint !== 'string') throw new Error()
        const value = settings.endpoint.trim()
        const endpoint = value ? new URL(value, document.baseURI) : undefined
        if (endpoint && endpoint.origin !== location.origin && endpoint.protocol !== 'https:') throw new Error()
        if (!controller.signal.aborted) setDelivery({ status: 'ready', endpoint: endpoint?.href ?? '' })
      } catch {
        if (!controller.signal.aborted) setDelivery({ status: 'unavailable' })
      }
    }
    void readSettings()
    return () => { controller.abort(); pending.current?.abort() }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (delivery.status !== 'ready' || pending.current) return
    const form = event.currentTarget
    const name = form.elements.namedItem('name') as HTMLInputElement
    if (!name.value.trim()) {
      name.setCustomValidity('Please enter your name.')
      name.reportValidity()
      return
    }
    const request = new AbortController()
    pending.current = request
    setError('')
    setSending(true)
    if (!delivery.endpoint) {
      onComplete('preview')
      return
    }
    const fields = new FormData(form)
    for (const [key, value] of fields) if (typeof value === 'string') fields.set(key, value.trim())
    try {
      const response = await fetch(delivery.endpoint, { method: 'POST', body: fields, headers: { Accept: 'application/json' }, signal: request.signal })
      if (!response.ok) throw new Error()
      if (!request.signal.aborted) onComplete('received')
    } catch {
      if (request.signal.aborted) return
      pending.current = null
      setSending(false)
      setError('Your request could not be submitted. Please try again or call Anna.')
    }
  }

  return <div className="letter">
    <h2>Request a free 15-minute call</h2>
    <form onSubmit={submit} aria-busy={sending}>
      <div className="letter-row">
        <label htmlFor="visitor-name">Your name<input id="visitor-name" name="name" type="text" autoComplete="name" maxLength={90} required onInput={e => e.currentTarget.setCustomValidity('')} /></label>
        <label htmlFor="visitor-email">Email address<input id="visitor-email" name="email" type="email" autoComplete="email" maxLength={180} required /></label>
      </div>
      <label htmlFor="visitor-state">Where will you attend sessions? <span className="optional">Optional</span>
        <span className="select-line"><select id="visitor-state" name="state" defaultValue=""><option value="">Choose a state</option><option>New York</option><option>New Jersey</option></select><ChevronDown size={17} aria-hidden="true" /></span>
      </label>
      <label htmlFor="visitor-message">Your note <span className="optional">Optional</span>
        <span className="field-hint">Please keep health details out of this form. We can talk on the call.</span>
        <textarea id="visitor-message" name="message" rows={3} maxLength={1000} /></label>
      <div className="letter-send"><button type="submit" className="letter-button" disabled={delivery.status !== 'ready' || sending}>
        {sending ? 'Submitting…' : 'Request my call'} <ArrowRight size={19} strokeWidth={1.4} aria-hidden="true" /></button>
        <a className="form-policy" href="privacy-policy/">Privacy policy</a></div>
      <p className="form-status">This form is not for emergencies. If you are in crisis, call or text 988, or call 911.</p>
      {delivery.status === 'ready' && !delivery.endpoint && <p className="form-status">Preview form. To reach Anna today, use the contact details on this page.</p>}
      {delivery.status === 'unavailable' && <p className="form-status" role="status">The form is unavailable. You can call or email Anna directly.</p>}
      {error && <p className="form-status" role="alert">{error}</p>}
    </form>
  </div>
}

export function ThankYouPage() {
  const result = history.state?.consultationResult
  return <section className="thanks-page section-shell arrival">
    <h1>Thank you.</h1>
    <p>{result === 'received' ? 'Your consultation request has been submitted to Anna’s practice.'
      : result === 'preview' ? 'You’ve completed the preview form. To arrange a consultation, please contact Anna directly.'
      : 'You can reach Anna’s practice to arrange a complimentary consultation.'}</p>
    <div className="thanks-links"><TextLink href="./">Back to home</TextLink><TextLink href="contact/">Contact Anna</TextLink></div>
  </section>
}

export function ContactPage({ onComplete }: ContactProps) {
  return <>
    <section className="contact-opening section-shell">
      <div className="contact-intro arrival">
        <h1>Get in touch.</h1><p>A free, 15-minute call is a chance to ask a question and see how it feels to talk together.</p>
        <address className="contact-address"><a href={office.emailHref}>{office.email}<ArrowUpRight size={16} aria-hidden="true" /></a><a href={office.phoneHref}>{office.phone}</a></address>
        <div className="office-hours"><h2>Practice hours</h2><p>{office.days}<br />{office.hours}</p></div>
      </div>
      <ContactForm onComplete={onComplete} />
    </section>
    <section className="service-map section-shell" aria-labelledby="map-title">
      <Reveal><h2 id="map-title">Service area</h2><p>New York, NY 10075</p>
        <p className="map-note">Online across New York and New Jersey.</p>
        <TextLink href={office.map}>Open in Google Maps</TextLink></Reveal>
      <div className="map-frame"><iframe title="Google map of the New York 10075 service area" src={office.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></div>
    </section>
  </>
}
