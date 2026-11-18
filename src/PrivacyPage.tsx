import { TextLink } from './Editorial'
import { office } from './practice'

const sections = [
  { id: 'information', title: 'Information we collect', text: [
    'When you contact the practice, you may provide your name, email address, phone number and the details you choose to share. The consultation form asks about scheduling and optionally which state you will attend from.',
    'The website and its providers may collect technical details such as your IP address, browser, device, pages visited, time of access and how long a visit lasts. The original policy describes cookies, tags and similar technologies used for essential features, preferences and usage analysis.',
  ] },
  { id: 'use', title: 'How information is used', text: [
    'The practice uses information to operate the website, respond to requests, contact you, protect the service and understand how it is used. Where applicable, the original policy also covers account administration, providing contracted services, and news or offers you can opt out of.',
    'The preview form keeps your entries in the page while you complete it. When form delivery is connected, submitting sends those entries to the practice’s form provider. The sound control remembers your choice and playing position in this browser tab. The contact page includes a Google Maps view of the service area.',
  ] },
  { id: 'sharing', title: 'Sharing and storage', text: [
    'The practice may share information with service providers, affiliates and business partners for the purposes described in its policy, or with your consent. Information posted in public areas of a service may be visible to others.',
    'Information may also be disclosed when legally required, to protect safety or legal rights, or as part of a financing, merger or sale. The practice’s policy provides for notice if a business transfer places information under a different policy.',
    'Information may be processed outside your state or country. The practice describes safeguards for transfers and retains information as needed for the stated purposes, legal obligations, disputes and agreements. Technical usage records may have a shorter retention period.',
  ] },
  { id: 'choices', title: 'Your choices', text: [
    'Contact the practice to request access to, correction of, or deletion of personal information you provided. Some records may need to be retained for legal reasons. You can change cookie permissions in your browser and opt out of promotional communications.',
    'The practice describes commercially reasonable steps to protect information. Email, internet transmission and electronic storage carry risks. Third-party websites and services have their own privacy practices.',
  ] },
  { id: 'children', title: 'Children and policy updates', text: [
    'The website is intended for people aged 13 and over. A parent or guardian who believes a child under 13 has provided personal information can contact the practice so it can review and remove the information as appropriate.',
    'The practice posts policy changes on its original website. Its policy describes notice by email or a prominent website notice before changes take effect.',
  ] },
]

export function PrivacyPage() {
  return <article className="privacy-page section-shell">
    <header className="privacy-heading arrival"><h1>Privacy policy</h1>
      <p>A plain-language guide to how the Therapy Office of Anna Tseytlina handles information on its website.</p>
      <TextLink href="https://lmftcounselingnjny.com/privacy-policy/">Read the original privacy policy</TextLink>
      <small>Original policy dated August 28, 2024</small>
    </header>
    <div className="privacy-columns"><nav aria-label="Privacy policy sections">
      {sections.map(s => <a key={s.id} href={'privacy-policy/#' + s.id}>{s.title}</a>)}
      <a href="privacy-policy/#privacy-contact">Contact the practice</a>
    </nav>
    <div className="privacy-reading">{sections.map(section => <section key={section.id} id={section.id}>
      <h2>{section.title}</h2>{section.text.map(text => <p key={text}>{text}</p>)}
    </section>)}
      <section id="privacy-contact"><h2>Contact the practice</h2><p>For a privacy question or a request about your personal information, contact Anna.</p>
        <a href={office.emailHref}>{office.email}</a><br /><a href={office.phoneHref}>{office.phone}</a>
      </section>
    </div></div>
  </article>
}
