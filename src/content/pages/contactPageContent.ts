import type { Locale } from '../../i18n/locales';

type ContactPageContent = {
  hero: { eyebrow: string; title: string; description: string };
  detailsTitle: string;
  contactLabels: { phone: string; email: string; headOffice: string };
  quickResponse: string;
};

export const contactPageContent = {
  fr: {
    hero: {
      eyebrow: 'Contact Etoilys',
      title: 'Une question ?',
      description: 'Écrivez-nous ou contactez-nous directement. Nous sommes là pour vous répondre.',
    },
    detailsTitle: 'Nous contacter directement',
    contactLabels: { phone: 'Par téléphone', email: 'Par email', headOffice: 'Siège social' },
    quickResponse: 'Une réponse sous 24 heures ouvrées.',
  },
  en: {
    hero: {
      eyebrow: 'Contact Etoilys',
      title: 'Have a question?',
      description: 'Send us a message or get in touch directly. We are here to help.',
    },
    detailsTitle: 'Get in touch directly',
    contactLabels: { phone: 'By phone', email: 'By email', headOffice: 'Head office' },
    quickResponse: 'A reply within 24 working hours.',
  },
  nl: {
    hero: {
      eyebrow: 'Contact met Etoilys',
      title: 'Heeft u een vraag?',
      description: 'Stuur ons een bericht of neem rechtstreeks contact op. Wij helpen u graag.',
    },
    detailsTitle: 'Rechtstreeks contact opnemen',
    contactLabels: { phone: 'Per telefoon', email: 'Per e-mail', headOffice: 'Vestigingsadres' },
    quickResponse: 'Een antwoord binnen één werkdag.',
  },
} as const satisfies Record<Locale, ContactPageContent>;
