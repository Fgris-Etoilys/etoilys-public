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
  '/zones-intervention': {
    title: 'Zones d’intervention pour le classement des meublés de tourisme',
    description:
      'Découvrez les zones où Etoilys intervient pour le classement des meublés de tourisme, notamment en Dordogne, Gironde, Lot-et-Garonne et secteurs proches.',
    breadcrumbLabel: 'Zones d’intervention',
  },
  '/classement-meuble-tourisme-dordogne': {
    title: 'Classement gîte, Airbnb et meublé de tourisme en Dordogne',
    description:
      'Etoilys accompagne les propriétaires de gîtes et locations saisonnières en Dordogne pour le classement officiel de leur meublé de tourisme.',
    breadcrumbLabel: 'Classement en Dordogne',
    ogImageKey: 'dordogneHero',
    lcpImageKey: 'dordogneHero',
  },
  '/classement-meuble-tourisme-gironde': {
    title: 'Classement gîte, Airbnb et meublé de tourisme en Gironde',
    description:
      'Etoilys accompagne les propriétaires de meublés de tourisme en Gironde : classement officiel, zones d’intervention, procédure, fiscalité, taxe de séjour et demande en ligne.',
    breadcrumbLabel: 'Classement en Gironde',
    ogImageKey: 'girondeHero',
    lcpImageKey: 'girondeHero',
  },
  '/classement-meuble-tourisme-lot-et-garonne': {
    title: 'Classement gîte, Airbnb et meublé de tourisme dans le Lot-et-Garonne',
    description:
      'Etoilys accompagne les propriétaires de gîtes, locations saisonnières et meublés de tourisme dans le Lot-et-Garonne pour leur classement officiel.',
    breadcrumbLabel: 'Classement en Lot-et-Garonne',
    ogImageKey: 'lotEtGaronneHero',
    lcpImageKey: 'lotEtGaronneHero',
  },
  '/simulateur': {
    title: 'Simulateur de classement meublé de tourisme',
    description:
      'Estimez gratuitement le classement possible de votre meublé de tourisme à partir de la grille officielle, avant une visite de classement.',
    breadcrumbLabel: 'Simulateur de classement',
    ogImageKey: 'simulateurClassement',
  },
  '/simulateur/:simulationId': SIMULATION_DETAIL_SEO,
  '/simulateur-taxe-sejour': {
    title: 'Simulateur de taxe de séjour meublé de tourisme',
    description:
      'Calculez gratuitement l’écart de taxe de séjour entre un meublé non classé et un meublé classé, selon la commune et le nombre d’étoiles.',
    breadcrumbLabel: 'Simulateur taxe de séjour',
    ogImageKey: 'simulateurTaxeSejour',
  },
  '/simulateur-fiscal-classement': {
    title: 'Simulateur fiscal meublé classé 2026',
    description:
      'Comparez gratuitement la fiscalité d’un meublé classé et non classé avec les seuils et abattements micro-BIC 2026.',
    breadcrumbLabel: 'Simulateur fiscal classement',
    ogImageKey: 'simulateurFiscalClassement',
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
  '/actualites/meuble-classe-non-classe-seuils-micro-bic': {
    title: "Meublé classé + non classé : comment s'appliquent les seuils micro-BIC ?",
    description:
      'Vous avez un meublé classé et un non classé ? Voici comment lire les seuils micro-BIC, les abattements et le passage au réel sans tout mélanger.',
    breadcrumbLabel: 'Seuils micro-BIC classé et non classé',
    ogImageKey: 'articleMeubleClasseNonClasse',
  },
  '/actualites/facturation-electronique-2026-proprietaires-meubles': {
    title: 'Facturation électronique 2026 : les propriétaires de meublés sont-ils concernés ?',
    description:
      "Réception, émission, e-reporting, calendrier, sanctions : voici ce qui s'applique vraiment aux propriétaires de meublés de tourisme.",
    breadcrumbLabel: 'Facturation électronique 2026',
    ogImageKey: 'articleFacturationElectronique2026',
  },
  '/actualites/dpe-meubles-tourisme-2026-2034': {
    title: 'DPE des meublés de tourisme : règles 2026 et échéance 2034',
    description:
      'Faut-il déjà un DPE pour louer un meublé de tourisme ? Changement d\u2019usage, résidence principale, règle 2034 : voici ce qu\u2019il faut vérifier.',
    breadcrumbLabel: 'DPE des meublés de tourisme',
    ogImageKey: 'articleDpeMeublesTourisme',
  },
  '/actualites/api-meubles-declaration-meuble-tourisme': {
    title: 'API Meublés : déclaration obligatoire des meublés de tourisme',
    description:
      'Tous les propriétaires de meublés de tourisme devront demander un numéro d\u2019enregistrement national via API Meublés. Voici ce qui change à partir du 20 mai 2026.',
    breadcrumbLabel: 'API Meublés : déclaration obligatoire',
    ogImageKey: 'articleApiMeubles',
  },
  '/contact': {
    title: 'Contact',
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
