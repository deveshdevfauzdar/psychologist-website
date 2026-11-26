import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Photograph, Reveal, SectionCover, TextLink } from './Editorial'
import { journal } from './journal'
import { consultationLabel } from './practice'

export function HomeJournal() {
  return <section className="home-journal section-shell" aria-labelledby="home-journal-title">
    <div className="home-journal-heading"><Reveal><h2 id="home-journal-title">From the journal</h2></Reveal><TextLink href="journal/">All articles</TextLink></div>
    <div className="home-triptych">{journal.map(entry =>
      <a className="journal-print" key={entry.slug} href={'journal/' + entry.slug + '/'}>
        <Photograph file={entry.galleryImage} alt={entry.galleryAlt} />
        <div><h3>{entry.title}</h3><ArrowUpRight size={21} strokeWidth={1.2} aria-hidden="true" /></div>
      </a>)}</div>
  </section>
}

export function JournalIndex() {
  return <>
    <SectionCover title="Journal" file="tidal-estuary.webp" className="journal-cover" alt="A tidal creek winding through a salt marsh at first light" />
    <section className="journal-list section-shell" aria-label="Journal articles">
      {journal.map(entry => <Reveal key={entry.slug}><a href={'journal/' + entry.slug + '/'}>
        <h2>{entry.title}</h2><ArrowUpRight aria-hidden="true" size={29} strokeWidth={1.15} />
      </a></Reveal>)}
    </section>
  </>
}

export function JournalArticle({ entry }: { entry: typeof journal[number] }) {
  const next = journal[(journal.indexOf(entry) + 1) % journal.length]
  return <article className="article-page section-shell">
    <header className="article-head arrival">
      <a href="journal/" className="article-back"><ArrowLeft size={16} aria-hidden="true" /> Journal</a>
      <h1>{entry.title}</h1><p>{entry.lead}</p>
    </header>
    <div className="article-body"><Photograph file={entry.image} className="article-cover" alt={entry.alt} priority />
      <div className="reading-copy">{entry.sections.map(section => <section key={section.title}>
        <h2>{section.title}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}
      </section>)}
        <p><TextLink href="contact/">{consultationLabel}</TextLink></p>
        <TextLink href={'journal/' + next.slug + '/'}>Next: {next.title}</TextLink>
      </div>
    </div>
  </article>
}
