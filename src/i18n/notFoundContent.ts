import type { Locale } from './locales';

export interface NotFoundContent {
  eyebrow: string;
  title: string;
  description: string;
  homeLabel: string;
  homeHref: string;
  contactLabel: string;
  contactHref: string;
}

export const notFoundContent = {
  fr: {
    eyebrow: 'Erreur 404',
    title: 'Page non trouvée',
    description:
      "La page demandée n'est pas disponible. Vous pouvez revenir à l'accueil ou accéder à la page de contact.",
    homeLabel: "Retour à l'accueil",
    homeHref: '/',
    contactLabel: 'Contacter Etoilys',
    contactHref: '/contact',
  },
  en: {
    eyebrow: 'Error 404',
    title: 'Page not found',
    description:
      'The requested page is not available. You can return to the English home page or contact Etoilys.',
    homeLabel: 'Back to home',
    homeHref: '/en',
    contactLabel: 'Contact Etoilys',
    contactHref: '/en/contact',
  },
  nl: {
    eyebrow: 'Fout 404',
    title: 'Pagina niet gevonden',
    description:
      'De gevraagde pagina is niet beschikbaar. U kunt teruggaan naar de Nederlandstalige homepagina of contact opnemen met Etoilys.',
    homeLabel: 'Terug naar home',
    homeHref: '/nl',
    contactLabel: 'Contact met Etoilys',
    contactHref: '/nl/contact',
  },
} as const satisfies Record<Locale, NotFoundContent>;
