import { useState } from 'react'
import { Disclosure, Photograph, Reveal, SectionCover, TextLink } from './Editorial'
import { office, areas, methods, otherConcerns, questions } from './practice'

export function ApproachPreview() {
  return <section id="approach" className="approach-section section-shell" aria-labelledby="approach-title">
    <div className="section-heading"><Reveal><h2 id="approach-title">Feel Understood,<br />Grow Stronger</h2></Reveal></div>
    <Photograph className="room-image" file="therapy-room.webp" alt="Two armchairs facing a low oak table in soft window light" />
    <div className="approach-caption">
      <p>Online therapy for individuals, couples and families in New York and New Jersey.</p>
      <TextLink href="therapy/">Explore therapy</TextLink>
    </div>
  </section>
}

export function HomePractice() {
  return <section className="home-practice" aria-labelledby="home-anna">
    <div className="home-practice-inner">
      <Photograph file="anna-at-the-table.webp" alt="Anna at a writing table in soft afternoon light" className="home-anna-photo" />
      <div className="home-anna-copy"><Reveal>
        <h2 id="home-anna">Meet Anna <br />Tseytlina.</h2>
        <p>I’m a marriage and family therapist. I work with individuals, couples and families on the patterns that show up in their everyday lives.</p>
        <div className="home-anna-links"><TextLink href="about/">About Anna</TextLink><TextLink href="perspective/">A note on being human</TextLink></div>
      </Reveal></div>
    </div>
  </section>
}

export function HomeVisit() {
  return <section className="home-visit section-shell" aria-labelledby="home-visit-title">
    <Reveal><h2 id="home-visit-title">Before your first visit</h2></Reveal>
    <div><p>A first phone call is free and lasts 15 minutes.</p>
      <div className="home-visit-links"><TextLink href="fees/">Fees &amp; insurance</TextLink><TextLink href="contact/">Arrange a call</TextLink></div>
    </div>
  </section>
}

function WordList({ entries }: { entries: string[] }) {
  return <ul className="word-list">{entries.map(entry => <li key={entry}>{entry}</li>)}</ul>
}

export function AboutPage() {
  return <>
    <section className="portrait-note note-page" aria-labelledby="note-title">
      <div className="note-canvas">
        <div className="note-image"><Photograph file="anna-window-seat.webp" alt="Anna seated by a sunlit window" priority />
          <h1 id="note-title" className="arrival">I’m Anna.<br />What brings<br />you here?</h1>
        </div>
        <span className="note-script note-left">Curiosity</span><span className="note-script note-right">Patience</span>
        <span className="note-script note-bottom">Listening</span>
      </div>
      <div className="note-caption"><p>Anna Tseytlina, LMFT</p><span>Marriage &amp; Family Therapist</span></div>
    </section>
    <section className="reading-spread section-shell" aria-labelledby="about-work">
      <Reveal><h2 id="about-work">The way I work</h2></Reveal>
      <div className="reading-copy">
        <p className="reading-lead">A session can begin with something as ordinary as what happened at the breakfast table this morning.</p>
        <p>I’m interested in the people in your life and the situations you keep finding yourself in. For over eight years I’ve worked with children, adolescents and adults, individually, as couples and as families.</p>
        <p>My work draws on family systems, cognitive behavioral therapy and mindfulness. We might trace a pattern in a relationship, or try a different response to a thought you know well.</p>
      </div>
    </section>
    <section className="reading-spread training section-shell" aria-labelledby="training-title">
      <Reveal><h2 id="training-title">Training &amp; <br />licensure</h2></Reveal>
      <div><dl className="training-record">
        <div><dt>Education</dt><dd>Master’s in Marriage and Family Therapy<small>Mercy College, New York · 2017</small></dd></div>
        <div><dt>New York</dt><dd>LMFT · 002231</dd></div>
        <div><dt>New Jersey</dt><dd>LMFT · 37FI00225100</dd></div>
      </dl><Disclosure title="Therapy approaches"><WordList entries={methods} /></Disclosure></div>
    </section>
  </>
}

export function PerspectivePage() {
  return <article className="perspective-page">
    <div className="perspective-spread">
      <div className="perspective-text">
        <Reveal><h1>Being human <br />is <em>messy.</em></h1></Reveal>
        <Reveal><p>You say “I’m fine” on the phone, then spend the walk home thinking about what you wanted to say.</p>
          <p>Sometimes you need a place to finish that sentence. We can start there, even if you change your mind halfway through.</p>
          <TextLink href="contact/">Talk with Anna</TextLink></Reveal>
      </div>
      <div className="perspective-art">
        <Photograph className="forest-frame" file="woods-at-the-water.webp" alt="A person pauses beneath tall pines at the edge of a quiet inlet" priority />
        <img className="willow-ink" src="media/willow-ink.webp" alt="" width="310" height="465" />
      </div>
    </div>
  </article>
}

export function TherapyPage() {
  return <>
    <SectionCover title={<>What brings you<br />to therapy?</>} file="quiet-lounge.webp" alt="Two curved chairs and a low limestone table beside a plaster hearth" className="therapy-cover" />
    <section className="reading-spread section-shell services-spread" aria-labelledby="areas-title">
      <Reveal><h2 id="areas-title">Areas of care</h2><p className="side-copy">Individual, couples and family therapy for children, teens and adults.</p><TextLink href="contact/">Book a consultation</TextLink></Reveal>
      <div className="disclosure-list">{areas.map(item => <Disclosure key={item.title} title={item.title}><p>{item.text}</p></Disclosure>)}
        <Disclosure title="Other concerns"><WordList entries={otherConcerns} /></Disclosure>
        <Disclosure title="Therapy approaches"><WordList entries={methods} /></Disclosure>
      </div>
    </section>
  </>
}

const coverage = {
  'New York': 'Anna accepts select plans from Aetna, Anthem BCBS, Evernorth and Cigna. Confirm your specific plan and copay before booking.',
  'New Jersey': 'Anna is out of network. If your plan includes out-of-network benefits, ask your insurer what it reimburses for a video session.',
}

export function FeesPage() {
  const [state, setState] = useState<keyof typeof coverage>('New York')
  return <>
    <section className="fee-page" aria-labelledby="fees-title">
      <div className="fee-copy">
        <div className="arrival"><h1 id="fees-title">Fees &amp; insurance</h1>
          <p className="fee-intro">Online sessions for clients in New York and New Jersey.</p></div>
        <dl className="fee-ledger">
          <div><dt>Individual session</dt><dd>{office.individual}</dd></div>
          <div><dt>Couples session</dt><dd>{office.couples}</dd></div>
          <div className="consultation-rate"><dt>15-minute consultation</dt><dd>Free</dd></div>
        </dl>
        <fieldset className="coverage-selector">
          <legend>Insurance by state</legend>
          <div className="state-tabs" data-jersey={state === 'New Jersey'}>
            {(['New York', 'New Jersey'] as const).map(value =>
              <label key={value}><input type="radio" name="practice-state" value={value} checked={value === state} onChange={() => setState(value)} />
                <span>{value}</span></label>)}
            <i aria-hidden="true" />
          </div>
        </fieldset>
        <div className="coverage-copy">
          {(Object.keys(coverage) as Array<keyof typeof coverage>).map(name =>
            <p key={name} className={state === name ? 'is-current' : ''} aria-hidden={state !== name}>{coverage[name]}</p>)}
        </div>
        <span className="sr-only" aria-live="polite">{coverage[state]}</span>
        <TextLink href="contact/">Ask about your coverage</TextLink>
      </div>
      <Photograph className="fee-photograph" file="linen-in-sun.webp" alt="Sunlight on oak and folded linen at the arm of a chair" priority />
    </section>
    <section id="first-visit" className="reading-spread section-shell first-visit" aria-labelledby="visit-title">
      <Reveal><h2 id="visit-title">Before your <br />first visit</h2></Reveal>
      <div className="disclosure-list">{questions.map(item => <Disclosure key={item.title} title={item.title}><p>{item.text}</p></Disclosure>)}</div>
    </section>
  </>
}
