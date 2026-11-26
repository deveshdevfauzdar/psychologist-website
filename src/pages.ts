import { journal } from './journal'

export const pages = [
  { path: '', label: 'Home', title: 'Online therapy for anxiety, ADHD and relationships that feel stuck', description: 'With Anna Tseytlina, LMFT. Video sessions for individuals, couples and families across New York and New Jersey.' },
  { path: 'about', label: 'About Anna', title: 'About Anna Tseytlina, LMFT', description: 'Meet Anna, learn about her approach to therapy, and see her training and licenses.' },
  { path: 'perspective', label: 'Being human', title: 'Being human is messy', description: 'A note about everyday life and making room for it in therapy.' },
  { path: 'therapy', label: 'Therapy', title: 'Therapy & areas of care', description: 'Explore support for relationships, anxiety, self-esteem, ADHD, trauma, teens, families and life changes.' },
  { path: 'fees', label: 'Fees & insurance', title: 'Session fees & insurance', description: 'Individual and couples session fees, New York and New Jersey insurance information, and first-visit questions.' },
  { path: 'journal', label: 'Journal', title: 'Journal', description: 'Short reflections on starting therapy, making time and considering a change.' },
  { path: 'contact', label: 'Contact', title: 'Arrange a consultation', description: 'Call or email Anna to arrange a complimentary 15-minute phone consultation.' },
]
export const articlePages = journal.map(entry => ({
  path: 'journal/' + entry.slug, label: entry.title, title: entry.title, description: entry.lead,
}))

export const allPages = [...pages, ...articlePages, {
  path: 'website-terms', label: 'Website terms', title: 'Website terms', description: 'Using this practice website and arranging a consultation.',
}, {
  path: 'thank-you', label: 'Thank you', title: 'Thank you', description: 'Consultation form confirmation and contact details for Anna’s practice.',
}, {
  path: 'privacy-policy', label: 'Privacy policy', title: 'Privacy policy', description: 'How the practice handles website information and how to contact Anna about privacy.',
}]

export const pageCovers: Record<string, string> = {
  '': 'hero-plaster-arch.webp',
  about: 'anna-window-seat.webp',
  perspective: 'woods-at-the-water.webp',
  therapy: 'quiet-lounge.webp',
  fees: 'linen-in-sun.webp',
  journal: 'tidal-estuary.webp',
  ...Object.fromEntries(journal.map(entry => ['journal/' + entry.slug, entry.image])),
}
