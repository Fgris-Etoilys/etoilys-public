import type { Locale } from './locales';

export type LayoutNavigationSubItem = {
  name: string;
  href: string;
  description?: string;
};

export type LayoutNavigationItem = {
  name: string;
  href: string;
  showOverviewLink?: boolean;
  overviewLabel?: string;
  overviewDescription?: string;
  submenu?: readonly LayoutNavigationSubItem[];
};

export type LayoutFooterColumn = {
  title: string;
  links: readonly LayoutNavigationSubItem[];
};

export type LayoutContent = {
  header: {
    homeHref: string;
    menuToggleLabel: string;
    navigation: readonly LayoutNavigationItem[];
    cta: LayoutNavigationSubItem;
  };
  footer: {
    homeHref: string;
    brandTagline: readonly [string, string];
    columns: readonly LayoutFooterColumn[];
    cookiePreferencesLabel: string;
    copyright: string;
  };
  languageSwitcher: {
    ariaLabel: string;
    shortLabels: Readonly<Record<Locale, string>>;
    activeLabel: string;
    switchLabel: string;
    unavailableLabel: string;
  };
};

export const localeNativeNames = {
  fr: 'Français',
  en: 'English',
  nl: 'Nederlands',
} as const satisfies Readonly<Record<Locale, string>>;

export const layoutContent = {
  fr: {
    header: {
      homeHref: '/',
      menuToggleLabel: 'Ouvrir ou fermer le menu',
      navigation: [
        { name: 'Accueil', href: '/' },
        {
          name: 'Le classement',
          href: '/classement',
          showOverviewLink: true,
          overviewLabel: "Qu'est-ce que le classement ?",
          overviewDescription: 'Comprendre le classement officiel',
          submenu: [
            {
              name: 'Les avantages du classement',
              href: '/les-avantages-du-classement',
              description: 'Pourquoi faire classer votre logement ?',
            },
            {
              name: 'Prérequis au classement',
              href: '/prerequis-au-classement',
              description: 'Les points à vérifier avant la visite',
            },
            {
              name: 'Procédure',
              href: '/procedure',
              description: 'De la demande à la décision de classement',
            },
            {
              name: 'Zones d’intervention',
              href: '/zones-intervention',
              description: 'Les départements couverts par Etoilys',
            },
            { name: 'FAQ', href: '/faq', description: 'Les réponses aux questions fréquentes' },
          ],
        },
        {
          name: 'Outils',
          href: '/simulateur',
          showOverviewLink: false,
          submenu: [
            {
              name: 'Simulateur de classement',
              href: '/simulateur',
              description: 'Estimez vos étoiles',
            },
            {
              name: 'Simulateur taxe de séjour',
              href: '/simulateur-taxe-sejour',
              description: 'Comparez classé et non classé',
            },
            {
              name: 'Simulateur fiscal 2026',
              href: '/simulateur-fiscal-classement',
              description: 'Mesurez l’impact fiscal du classement',
            },
          ],
        },
        { name: 'Actualités', href: '/actualites' },
        { name: 'Recrutement', href: '/recrutement' },
        { name: 'Contact', href: '/contact' },
      ],
      cta: {
        name: 'Demander mon classement',
        href: '/demande-classement',
      },
    },
    footer: {
      homeHref: '/',
      brandTagline: ['Classement de meublés', 'de tourisme'],
      columns: [
        {
          title: 'Services',
          links: [
            { name: 'Classement meublé de tourisme', href: '/classement' },
            { name: 'Les avantages du classement', href: '/les-avantages-du-classement' },
            { name: 'Prérequis au classement', href: '/prerequis-au-classement' },
            { name: 'La procédure de classement', href: '/procedure' },
            { name: 'Simulateur de classement', href: '/simulateur' },
            { name: 'Simulateur taxe de séjour', href: '/simulateur-taxe-sejour' },
            { name: 'Simulateur fiscal classement 2026', href: '/simulateur-fiscal-classement' },
          ],
        },
        {
          title: 'Zones d’intervention',
          links: [
            { name: 'Zones d’intervention', href: '/zones-intervention' },
            { name: 'Classement en Dordogne', href: '/classement-meuble-tourisme-dordogne' },
            { name: 'Classement en Gironde', href: '/classement-meuble-tourisme-gironde' },
            {
              name: 'Classement en Lot-et-Garonne',
              href: '/classement-meuble-tourisme-lot-et-garonne',
            },
          ],
        },
        {
          title: 'Entreprise',
          links: [
            { name: 'Actualités', href: '/actualites' },
            { name: 'Recrutement', href: '/recrutement' },
            { name: 'FAQ', href: '/faq' },
          ],
        },
        {
          title: 'Informations légales',
          links: [
            { name: 'Mentions légales', href: '/mentions-legales' },
            { name: 'Politique de confidentialité', href: '/confidentialite' },
          ],
        },
      ],
      cookiePreferencesLabel: 'Gérer mes cookies',
      copyright: 'Tous droits réservés.',
    },
    languageSwitcher: {
      ariaLabel: 'Sélecteur de langue',
      shortLabels: {
        fr: 'FR',
        en: 'EN',
        nl: 'NL',
      },
      activeLabel: 'Langue active :',
      switchLabel: 'Passer en',
      unavailableLabel: 'Version indisponible en',
    },
  },
  en: {
    header: {
      homeHref: '/en',
      menuToggleLabel: 'Open or close menu',
      navigation: [
        {
          name: 'Official classification',
          href: '/en/furnished-tourist-accommodation-classification',
          showOverviewLink: true,
          overviewLabel: 'What is official classification?',
          overviewDescription: 'Understand the official classification',
          submenu: [
            {
              name: 'Benefits of classification',
              href: '/en/benefits-of-furnished-tourist-accommodation-classification',
              description: 'Tax, tourist tax and official reference points',
            },
            {
              name: 'Classification requirements',
              href: '/en/classification-requirements',
              description: 'Minimum points before the inspection',
            },
            {
              name: 'Classification process',
              href: '/en/classification-process',
              description: 'From request to classification decision',
            },
            { name: 'FAQ', href: '/en/faq', description: 'Answers to common questions' },
          ],
        },
        {
          name: 'Simulators',
          href: '/en/furnished-tourist-accommodation-tax-simulator',
          showOverviewLink: true,
          overviewLabel: '2026 tax simulator',
          overviewDescription: 'Compare classified and unclassified accommodation',
          submenu: [
            {
              name: 'Tourist tax simulator',
              href: '/en/tourist-tax-simulator',
              description: 'Compare local tourist tax calculations',
            },
          ],
        },
        { name: 'Contact', href: '/en/contact' },
      ],
      cta: {
        name: 'Request a classification',
        href: '/en/request-a-classification',
      },
    },
    footer: {
      homeHref: '/en',
      brandTagline: ['Furnished tourist', 'accommodation classification'],
      columns: [
        {
          title: 'Services',
          links: [
            {
              name: 'Furnished tourist accommodation classification',
              href: '/en/furnished-tourist-accommodation-classification',
            },
            {
              name: 'Benefits of classification',
              href: '/en/benefits-of-furnished-tourist-accommodation-classification',
            },
            { name: 'Classification requirements', href: '/en/classification-requirements' },
            { name: 'Classification process', href: '/en/classification-process' },
            { name: 'Request a classification', href: '/en/request-a-classification' },
          ],
        },
        {
          title: 'Information',
          links: [
            {
              name: '2026 tax simulator',
              href: '/en/furnished-tourist-accommodation-tax-simulator',
            },
            { name: 'Tourist tax simulator', href: '/en/tourist-tax-simulator' },
            { name: 'FAQ', href: '/en/faq' },
            { name: 'Contact', href: '/en/contact' },
          ],
        },
        {
          title: 'Legal information',
          links: [{ name: 'Privacy policy', href: '/en/privacy-policy' }],
        },
      ],
      cookiePreferencesLabel: 'Manage cookies',
      copyright: 'All rights reserved.',
    },
    languageSwitcher: {
      ariaLabel: 'Language selector',
      shortLabels: {
        fr: 'FR',
        en: 'EN',
        nl: 'NL',
      },
      activeLabel: 'Active language:',
      switchLabel: 'Switch to',
      unavailableLabel: 'Version unavailable in',
    },
  },
  nl: {
    header: {
      homeHref: '/nl',
      menuToggleLabel: 'Menu openen of sluiten',
      navigation: [
        {
          name: 'Classificatie',
          href: '/nl/classificatie-vakantiewoning-frankrijk',
          showOverviewLink: true,
          overviewLabel: 'Wat is officiële classificatie?',
          overviewDescription: 'Begrijp de officiële classificatie',
          submenu: [
            {
              name: 'Voordelen van classificatie',
              href: '/nl/voordelen-classificatie-vakantiewoning',
              description: 'Fiscaliteit, toeristenbelasting en officiële herkenningspunten',
            },
            {
              name: 'Voorwaarden voor classificatie',
              href: '/nl/voorwaarden-classificatie-vakantiewoning',
              description: 'Belangrijke punten vóór het inspectiebezoek',
            },
            {
              name: 'Classificatieprocedure',
              href: '/nl/classificatieprocedure-vakantiewoning',
              description: 'Van aanvraag tot classificatiebesluit',
            },
            { name: 'FAQ', href: '/nl/faq', description: 'Antwoorden op veelgestelde vragen' },
          ],
        },
        { name: 'Contact', href: '/nl/contact' },
      ],
      cta: {
        name: 'Classificatie aanvragen',
        href: '/nl/classificatie-aanvragen',
      },
    },
    footer: {
      homeHref: '/nl',
      brandTagline: ['Classificatie van', 'vakantiewoningen'],
      columns: [
        {
          title: 'Diensten',
          links: [
            {
              name: 'Classificatie van vakantiewoningen',
              href: '/nl/classificatie-vakantiewoning-frankrijk',
            },
            {
              name: 'Voordelen van classificatie',
              href: '/nl/voordelen-classificatie-vakantiewoning',
            },
            {
              name: 'Voorwaarden voor classificatie',
              href: '/nl/voorwaarden-classificatie-vakantiewoning',
            },
            {
              name: 'Classificatieprocedure',
              href: '/nl/classificatieprocedure-vakantiewoning',
            },
            { name: 'Classificatie aanvragen', href: '/nl/classificatie-aanvragen' },
          ],
        },
        {
          title: 'Informatie',
          links: [
            { name: 'FAQ', href: '/nl/faq' },
            { name: 'Contact', href: '/nl/contact' },
          ],
        },
        {
          title: 'Juridische informatie',
          links: [
            { name: 'Privacybeleid', href: '/nl/privacybeleid' },
            { name: 'Juridische informatie (Frans)', href: '/mentions-legales' },
          ],
        },
      ],
      cookiePreferencesLabel: 'Cookies beheren',
      copyright: 'Alle rechten voorbehouden.',
    },
    languageSwitcher: {
      ariaLabel: 'Taalkiezer',
      shortLabels: {
        fr: 'FR',
        en: 'EN',
        nl: 'NL',
      },
      activeLabel: 'Actieve taal:',
      switchLabel: 'Overschakelen naar',
      unavailableLabel: 'Versie niet beschikbaar in',
    },
  },
} as const satisfies Record<Locale, LayoutContent>;
