import type { ImageAssetKey } from './imageManifest';

export interface SeoRouteConfig {
  title: string;
  description: string;
  robots?: string;
  breadcrumbLabel?: string;
  indexable?: boolean;
  prerender?: boolean;
  lcpImageKey?: ImageAssetKey;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const SITE_URL = 'https://www.etoilys.fr';

export const SEO_ROUTES: Record<string, SeoRouteConfig> = {
  '/': {
    title: 'Classement meuble de tourisme',
    description:
      'Informations sur les demarches de classement des meubles de tourisme avec Etoilys.',
    lcpImageKey: 'homeHero',
  },
  '/classement': {
    title: 'Le classement des meubles de tourisme',
    description:
      'Informations sur le classement officiel des meubles de tourisme: categories, criteres et cadre reglementaire.',
    breadcrumbLabel: 'Classement',
  },
  '/les-avantages-du-classement': {
    title: 'Pourquoi faire classer un meuble de tourisme',
    description:
      'Presentation factuelle des effets du classement des meubles de tourisme: fiscalite, taxe de sejour et cadre officiel.',
    breadcrumbLabel: 'Avantages du classement',
  },
  '/prerequis-au-classement': {
    title: "Prerequis au classement d'un meuble de tourisme",
    description:
      "Conditions minimales et points de controle a verifier avant une demande de classement d'un meuble de tourisme.",
    breadcrumbLabel: 'Prerequis',
  },
  '/procedure': {
    title: "Procedure de classement d'un meuble de tourisme",
    description:
      'Etapes, delais et documents de la procedure de classement des meubles de tourisme.',
    breadcrumbLabel: 'Procedure',
  },
  '/faq': {
    title: 'FAQ classement meuble de tourisme',
    description:
      'Reponses aux questions frequentes sur le classement des meubles de tourisme, les obligations et la fiscalite.',
    breadcrumbLabel: 'FAQ',
  },
  '/actualites': {
    title: 'Actualites meubles de tourisme',
    description:
      'Articles et mises a jour sur la reglementation, la fiscalite et le classement des meubles de tourisme.',
    breadcrumbLabel: 'Actualites',
  },
  '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026': {
    title: 'Meubles de tourisme: ce qui change en 2025-2026',
    description:
      'Fiscalite, 90 jours, DPE, copropriete et enregistrement: points cles pour les proprietaires en 2025-2026.',
    breadcrumbLabel: 'Ce qui change en 2025-2026',
  },
  '/actualites/micro-bic-2026-meuble-classe-vs-non-classe': {
    title: 'Micro-BIC 2026: meuble classe vs non classe',
    description:
      'Seuils, abattements et regime reel: evolutions 2026 entre meuble classe et non classe.',
    breadcrumbLabel: 'Micro-BIC 2026',
  },
  '/actualites/airbnb-residence-principale-limite-90-jours': {
    title: 'Residence principale: limite des 90 jours',
    description:
      "Comprendre qui est concerne par la limite des 90 jours et dans quels cas elle s'applique.",
    breadcrumbLabel: 'Limite des 90 jours',
  },
  '/actualites/copropriete-location-touristique-reglement': {
    title: 'Copropriete et location touristique',
    description:
      'Ce que le reglement de copropriete peut prevoir pour la location touristique depuis les evolutions recentes.',
    breadcrumbLabel: 'Copropriete et location',
  },
  '/contact': {
    title: 'Contact Etoilys',
    description:
      'Coordonnees et formulaire de contact pour echanger avec Etoilys sur le classement des meubles de tourisme.',
    breadcrumbLabel: 'Contact',
  },
  '/demande-classement': {
    title: 'Demande de classement meuble de tourisme',
    description:
      "Formulaire de demande de classement d'un meuble de tourisme et informations de contact Etoilys.",
    breadcrumbLabel: 'Demande de classement',
  },
  '/confidentialite': {
    title: 'Politique de confidentialite',
    description:
      'Informations sur le traitement des donnees personnelles dans le cadre des services Etoilys.',
    breadcrumbLabel: 'Confidentialite',
  },
  '/mentions-legales': {
    title: 'Mentions legales',
    description: "Mentions legales et informations d'edition du site Etoilys.",
    breadcrumbLabel: 'Mentions legales',
  },
};

export const NOT_FOUND_SEO: SeoRouteConfig = {
  title: 'Page non trouvee',
  description: "La page demandee n'existe pas ou n'est plus disponible.",
  robots: 'noindex,follow',
  indexable: false,
  prerender: false,
};

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

export function getSeoRouteConfig(pathname: string): SeoRouteConfig {
  const normalizedPath = normalizePath(pathname);
  return SEO_ROUTES[normalizedPath] ?? NOT_FOUND_SEO;
}

function isIndexableRoute(route: SeoRouteConfig): boolean {
  if (route.robots?.includes('noindex')) {
    return false;
  }
  return route.indexable ?? true;
}

function isPrerenderRoute(route: SeoRouteConfig): boolean {
  if (!isIndexableRoute(route)) {
    return false;
  }
  return route.prerender ?? true;
}

export function getAllKnownPaths(): string[] {
  return Object.keys(SEO_ROUTES);
}

export function getIndexablePaths(): string[] {
  return Object.entries(SEO_ROUTES)
    .filter(([, route]) => isIndexableRoute(route))
    .map(([pathname]) => pathname);
}

export function getPrerenderPaths(): string[] {
  return Object.entries(SEO_ROUTES)
    .filter(([, route]) => isPrerenderRoute(route))
    .map(([pathname]) => pathname);
}

export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const normalizedPath = normalizePath(pathname);
  const route = SEO_ROUTES[normalizedPath];

  if (!route || normalizedPath === '/') {
    return [];
  }

  const home: BreadcrumbItem = { name: 'Accueil', url: `${SITE_URL}/` };

  if (normalizedPath.startsWith('/actualites/') && normalizedPath !== '/actualites') {
    return [
      home,
      { name: 'Actualites', url: `${SITE_URL}/actualites` },
      {
        name: route.breadcrumbLabel ?? route.title,
        url: `${SITE_URL}${normalizedPath}`,
      },
    ];
  }

  return [
    home,
    {
      name: route.breadcrumbLabel ?? route.title,
      url: `${SITE_URL}${normalizedPath}`,
    },
  ];
}
