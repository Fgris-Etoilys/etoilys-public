import type { ImageAssetKey } from './imageManifest';

export interface SeoRouteConfig {
  title: string;
  description: string;
  robots?: string;
  breadcrumbLabel?: string;
  ogImageKey?: ImageAssetKey;
  indexable?: boolean;
  prerender?: boolean;
  lcpImageKey?: ImageAssetKey;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const SITE_URL = 'https://www.etoilys.fr';

const SIMULATION_DETAIL_SEO: SeoRouteConfig = {
  title: 'Ma simulation de classement',
  description: "Interface de simulation publique de classement d'un meublé de tourisme.",
  breadcrumbLabel: 'Ma simulation',
  robots: 'noindex,follow',
  indexable: false,
  prerender: false,
};

export const SEO_ROUTES: Record<string, SeoRouteConfig> = {
  '/': {
    title: 'Classement meublé de tourisme',
    description:
      'Informations sur les démarches de classement des meublés de tourisme avec Etoilys.',
    ogImageKey: 'homeHero',
    lcpImageKey: 'homeHero',
  },
  '/classement': {
    title: 'Le classement des meublés de tourisme',
    description:
      'Informations sur le classement officiel des meublés de tourisme : catégories, critères et cadre réglementaire.',
    breadcrumbLabel: 'Classement',
  },
  '/les-avantages-du-classement': {
    title: 'Pourquoi faire classer un meublé de tourisme',
    description:
      'Présentation factuelle des effets du classement des meublés de tourisme : fiscalité, taxe de séjour et cadre officiel.',
    breadcrumbLabel: 'Avantages du classement',
    ogImageKey: 'pourquoiReferencement',
  },
  '/prerequis-au-classement': {
    title: "Prérequis au classement d'un meublé de tourisme",
    description:
      "Conditions minimales et points de contrôle à vérifier avant une demande de classement d'un meublé de tourisme.",
    breadcrumbLabel: 'Prérequis',
  },
  '/procedure': {
    title: "Procédure de classement d'un meublé de tourisme",
    description:
      'Étapes, délais et documents de la procédure de classement des meublés de tourisme.',
    breadcrumbLabel: 'Procédure',
  },
  '/simulateur': {
    title: 'Simulateur de classement',
    description:
      'Accueil du simulateur public de classement des meublés de tourisme, avec les simulations enregistrées sur le navigateur.',
    breadcrumbLabel: 'Simulateur de classement',
  },
  '/simulateur/:simulationId': SIMULATION_DETAIL_SEO,
  '/simulateur-taxe-sejour': {
    title: 'Simulateur taxe de séjour',
    description:
      'Simulation informative de taxe de séjour par commune et catégorie de classement, sur 1 nuit.',
    breadcrumbLabel: 'Simulateur taxe de séjour',
  },
  '/simulateur-fiscal-classement': {
    title: 'Simulateur fiscal classement 2026',
    description:
      'Simulation pédagogique de comparaison fiscale 2026 entre meublé de tourisme classé et non classé.',
    breadcrumbLabel: 'Simulateur fiscal classement',
  },
  '/faq': {
    title: 'FAQ classement meublé de tourisme',
    description:
      'Réponses aux questions fréquentes sur le classement des meublés de tourisme, les obligations et la fiscalité.',
    breadcrumbLabel: 'FAQ',
  },
  '/actualites': {
    title: 'Actualités meublés de tourisme',
    description:
      'Articles et mises à jour sur la réglementation, la fiscalité et le classement des meublés de tourisme.',
    breadcrumbLabel: 'Actualités',
  },
  '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026': {
    title: 'Meublés de tourisme : ce qui change en 2025-2026',
    description:
      'Fiscalité, 90 jours, DPE, copropriété et enregistrement : points clés pour les propriétaires en 2025-2026.',
    breadcrumbLabel: 'Ce qui change en 2025-2026',
    ogImageKey: 'articleMeubles20252026',
  },
  '/actualites/micro-bic-2026-meuble-classe-vs-non-classe': {
    title: 'Micro-BIC 2026 : meublé classé vs non classé',
    description:
      'Seuils, abattements et régime réel : évolutions 2026 entre meublé classé et non classé.',
    breadcrumbLabel: 'Micro-BIC 2026',
    ogImageKey: 'articleMicroBic2026',
  },
  '/actualites/airbnb-residence-principale-limite-90-jours': {
    title: 'Résidence principale : limite des 90 jours',
    description:
      "Comprendre qui est concerné par la limite des 90 jours et dans quels cas elle s'applique.",
    breadcrumbLabel: 'Limite des 90 jours',
    ogImageKey: 'articleResidence90Jours',
  },
  '/actualites/copropriete-location-touristique-reglement': {
    title: 'Copropriété et location touristique',
    description:
      'Ce que le règlement de copropriété peut prévoir pour la location touristique depuis les évolutions récentes.',
    breadcrumbLabel: 'Copropriété et location',
    ogImageKey: 'articleCoproprieteReglement',
  },
  '/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne': {
    title: 'Taxe de séjour 2026 : pourquoi le classement change la donne',
    description:
      'Meublé classé ou non classé, barème 2026, taux, plafonds et surtaxes : voici comment le classement change concrètement la taxe de séjour.',
    breadcrumbLabel: 'Taxe de séjour 2026',
    ogImageKey: 'articleTaxeDeSejour2026',
  },
  '/contact': {
    title: 'Contact Etoilys',
    description:
      'Coordonnées et formulaire de contact pour échanger avec Etoilys sur le classement des meublés de tourisme.',
    breadcrumbLabel: 'Contact',
  },
  '/demande-classement': {
    title: 'Demande de classement meublé de tourisme',
    description:
      "Formulaire de demande de classement d'un meublé de tourisme et informations de contact Etoilys.",
    breadcrumbLabel: 'Demande de classement',
  },
  '/confidentialite': {
    title: 'Politique de confidentialité',
    description:
      'Informations sur le traitement des données personnelles dans le cadre des services Etoilys.',
    breadcrumbLabel: 'Confidentialité',
  },
  '/mentions-legales': {
    title: 'Mentions légales',
    description: "Mentions légales et informations d'édition du site Etoilys.",
    breadcrumbLabel: 'Mentions légales',
  },
};

export const NOT_FOUND_SEO: SeoRouteConfig = {
  title: 'Page non trouvée',
  description: "La page demandée n'existe pas ou n'est plus disponible.",
  robots: 'noindex,follow',
  indexable: false,
  prerender: false,
};

const DYNAMIC_SEO_ROUTES: Array<{ pattern: RegExp; config: SeoRouteConfig }> = [
  {
    pattern: /^\/simulateur\/[^/]+$/,
    config: SIMULATION_DETAIL_SEO,
  },
];

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

export function getSeoRouteConfig(pathname: string): SeoRouteConfig {
  const normalizedPath = normalizePath(pathname);
  return (
    SEO_ROUTES[normalizedPath] ??
    DYNAMIC_SEO_ROUTES.find((route) => route.pattern.test(normalizedPath))?.config ??
    NOT_FOUND_SEO
  );
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
    .filter(([pathname]) => !pathname.includes(':'))
    .map(([pathname]) => pathname);
}

export function getPrerenderPaths(): string[] {
  return Object.entries(SEO_ROUTES)
    .filter(([, route]) => isPrerenderRoute(route))
    .filter(([pathname]) => !pathname.includes(':'))
    .map(([pathname]) => pathname);
}

export function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const normalizedPath = normalizePath(pathname);
  const route = getSeoRouteConfig(normalizedPath);

  if (route === NOT_FOUND_SEO || normalizedPath === '/') {
    return [];
  }

  const home: BreadcrumbItem = { name: 'Accueil', url: `${SITE_URL}/` };

  if (normalizedPath.startsWith('/actualites/') && normalizedPath !== '/actualites') {
    return [
      home,
      { name: 'Actualités', url: `${SITE_URL}/actualites` },
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
