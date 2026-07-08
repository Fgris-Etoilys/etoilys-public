import type { ImageAssetKey } from './imageManifest';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { isContentReadyForIndexing } from '../i18n/contentReadiness';
import {
  getAlternateLocaleLinks,
  getLocaleFromPath,
  getRouteIdFromPath,
} from '../i18n/routeHelpers';
import type { LocalizedRouteId } from '../i18n/localizedRoutes';

export interface SeoRouteConfig {
  title: string;
  description: string;
  robots?: string;
  breadcrumbLabel?: string;
  ogImageKey?: ImageAssetKey;
  indexable?: boolean;
  prerender?: boolean;
  lcpImageKey?: ImageAssetKey;
  locale?: Locale;
  routeId?: LocalizedRouteId;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SeoAlternateLink {
  hreflang: Locale | 'x-default';
  href: string;
}

export const SITE_URL = 'https://www.etoilys.fr';
export const SITE_NAME = 'Etoilys';

function normalizeSeoTitleBase(title: string): string {
  const suffixPatterns = [
    /\s*\|\s*Etoilys\s*$/i,
    /\s*-\s*Etoilys\s*$/i,
    /\s*-\s*Classement Meubles de Tourisme\s*$/i,
  ];

  let baseTitle = title.trim();
  let previousTitle = '';

  while (baseTitle && baseTitle !== previousTitle) {
    previousTitle = baseTitle;
    baseTitle = suffixPatterns.reduce(
      (currentTitle, suffixPattern) => currentTitle.replace(suffixPattern, '').trim(),
      baseTitle
    );
  }

  return baseTitle || SITE_NAME;
}

export function getSeoTitle(title: string): string {
  return `${normalizeSeoTitleBase(title)} | ${SITE_NAME}`;
}

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
    title: 'Classement meublé de tourisme en Dordogne, Gironde et Lot-et-Garonne',
    description:
      'Etoilys accompagne les propriétaires de meublés de tourisme pour obtenir leur classement officiel en Dordogne, Gironde et Lot-et-Garonne.',
    ogImageKey: 'homeHero',
    lcpImageKey: 'homeHero',
    locale: 'fr',
    routeId: 'home',
  },
  '/classement': {
    title: 'Classement des meublés de tourisme : principe, avantages et procédure',
    description:
      'Comprendre le classement officiel des meublés de tourisme : étoiles, durée de validité, organisme accrédité, visite et critères à vérifier.',
    breadcrumbLabel: 'Classement',
    locale: 'fr',
    routeId: 'classement',
  },
  '/les-avantages-du-classement': {
    title: 'Pourquoi faire classer son meublé de tourisme ?',
    description:
      'Fiscalité, taxe de séjour, visibilité, confiance des voyageurs : découvrez les avantages concrets du classement officiel d’un meublé de tourisme.',
    breadcrumbLabel: 'Avantages du classement',
    ogImageKey: 'pourquoiReferencement',
    locale: 'fr',
    routeId: 'avantages',
  },
  '/prerequis-au-classement': {
    title: 'Prérequis au classement d’un meublé de tourisme',
    description:
      'Surface, équipements, état du logement, pièces comptabilisables : les points à vérifier avant de demander le classement de votre meublé.',
    breadcrumbLabel: 'Prérequis',
    locale: 'fr',
    routeId: 'prerequis',
  },
  '/procedure': {
    title: 'Procédure de classement d’un meublé de tourisme',
    description:
      'Découvrez les étapes d’une demande de classement : prise de contact, visite, rapport, proposition de classement et validité 5 ans.',
    breadcrumbLabel: 'Procédure',
    locale: 'fr',
    routeId: 'procedure',
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
      'Estimez le classement possible de votre meublé de tourisme avant la visite officielle. Simulation gratuite à partir de la grille de classement.',
    breadcrumbLabel: 'Simulateur de classement',
    ogImageKey: 'simulateurClassement',
  },
  '/simulateur/:simulationId': SIMULATION_DETAIL_SEO,
  '/simulateur-taxe-sejour': {
    title: 'Simulateur taxe de séjour : meublé classé ou non classé',
    description:
      'Comparez la taxe de séjour d’un meublé classé et non classé selon la commune, le prix de la nuitée, le nombre de voyageurs et les étoiles.',
    breadcrumbLabel: 'Simulateur taxe de séjour',
    ogImageKey: 'simulateurTaxeSejour',
  },
  '/simulateur-fiscal-classement': {
    title: 'Simulateur fiscal meublé classé vs non classé 2026',
    description:
      'Comparez l’impact fiscal du classement en micro-BIC : seuils, abattements, base imposable et différence entre meublé classé et non classé.',
    breadcrumbLabel: 'Simulateur fiscal classement',
    ogImageKey: 'simulateurFiscalClassement',
  },
  '/faq': {
    title: 'FAQ classement meublé de tourisme',
    description:
      'Réponses aux questions fréquentes sur le classement des meublés de tourisme : fiscalité, taxe de séjour, procédure, durée, obligations.',
    breadcrumbLabel: 'FAQ',
    locale: 'fr',
    routeId: 'faq',
  },
  '/actualites': {
    title: 'Actualités meublés de tourisme : fiscalité, avantages, réglementation',
    description:
      'Actualités et guides pratiques sur les meublés de tourisme : classement officiel, fiscalité, réglementation, taxe de séjour, obligations locales et démarches propriétaires.',
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
  '/actualites/airbnb-booking-abritel-donnees-communes-api-meubles': {
    title: 'Airbnb, Booking, Abritel : données transmises aux communes',
    description:
      "API Meublés, plateformes, numéro d'enregistrement, jours loués : voici quelles données sont transmises aux communes et ce que cela change.",
    breadcrumbLabel: 'Données des plateformes transmises aux communes',
    ogImageKey: 'articleTransmissionDonnees',
  },
  '/actualites/que-faire-apres-classement-meuble-tourisme': {
    title: 'Que faire après le classement d’un meublé de tourisme ?',
    description:
      'Affichage, déclaration, taxe de séjour et plateformes : suivez les démarches à effectuer après le classement de votre meublé de tourisme.',
    breadcrumbLabel: 'Après la décision de classement',
    ogImageKey: 'articleApresClassement',
  },
  '/recrutement': {
    title: 'Recrutement consultant classement meublés de tourisme',
    description:
      'Etoilys recherche des consultants indépendants pour réaliser des visites de classement de meublés de tourisme sur leur secteur. Formation, outils métier et demandes entrantes selon zone.',
    breadcrumbLabel: 'Recrutement',
    ogImageKey: 'recrutementInspection',
  },
  '/contact': {
    title: 'Contact',
    description:
      'Coordonnées et formulaire de contact pour échanger avec Etoilys sur le classement des meublés de tourisme.',
    breadcrumbLabel: 'Contact',
    locale: 'fr',
    routeId: 'contact',
  },
  '/demande-classement': {
    title: 'Demande de classement meublé de tourisme',
    description:
      'Demandez le classement de votre meublé de tourisme. Procédure simple. Etoilys vous recontacte sous 24h pour organiser la visite.',
    breadcrumbLabel: 'Demande de classement',
    locale: 'fr',
    routeId: 'demandeClassement',
  },
  '/confidentialite': {
    title: 'Politique de confidentialité',
    description:
      'Informations sur le traitement des données personnelles dans le cadre des services Etoilys.',
    breadcrumbLabel: 'Confidentialité',
    locale: 'fr',
    routeId: 'confidentialite',
  },
  '/en/': {
    title: 'Official classification of your furnished tourist accommodation',
    description:
      'Etoilys supports you in obtaining the official star classification of your furnished tourist accommodation.',
    breadcrumbLabel: 'Home',
    ogImageKey: 'homeHero',
    lcpImageKey: 'homeHero',
    locale: 'en',
    routeId: 'home',
  },
  '/en/furnished-tourist-accommodation-classification': {
    title: 'Official classification of furnished tourist accommodation',
    description:
      'Understand the French official classification of furnished tourist accommodation: star rating, validity, accredited body, inspection and criteria.',
    breadcrumbLabel: 'Classification',
    locale: 'en',
    routeId: 'classement',
  },
  '/en/benefits-of-furnished-tourist-accommodation-classification': {
    title: 'Benefits of official furnished tourist accommodation classification',
    description:
      'Tax regime, tourist tax, visibility, traveller trust and official signs: discover the benefits of official furnished tourist accommodation classification.',
    breadcrumbLabel: 'Classification benefits',
    ogImageKey: 'pourquoiReferencement',
    locale: 'en',
    routeId: 'avantages',
  },
  '/en/classification-requirements': {
    title: 'Requirements for furnished tourist accommodation classification',
    description:
      'Key requirements before a French furnished tourist accommodation classification request: surface area, equipment, property condition and eligible rooms.',
    breadcrumbLabel: 'Requirements',
    locale: 'en',
    routeId: 'prerequis',
  },
  '/en/classification-process': {
    title: 'Furnished tourist accommodation classification process',
    description:
      'Steps in a French furnished tourist accommodation classification request: contact, inspection, report, classification proposal and five-year validity.',
    breadcrumbLabel: 'Process',
    locale: 'en',
    routeId: 'procedure',
  },
  '/en/faq': {
    title: 'FAQ on furnished tourist accommodation classification',
    description:
      'Frequently asked questions about French furnished tourist accommodation classification, tax regime, tourist tax, process, validity and obligations.',
    breadcrumbLabel: 'FAQ',
    locale: 'en',
    routeId: 'faq',
  },
  '/en/contact': {
    title: 'Contact',
    description:
      'Contact details and form for questions about Etoilys and the French furnished tourist accommodation classification process.',
    breadcrumbLabel: 'Contact',
    locale: 'en',
    routeId: 'contact',
  },
  '/en/request-a-classification': {
    title: 'Classification request',
    description:
      'Submit your furnished tourist accommodation classification request to Etoilys in a few minutes.',
    breadcrumbLabel: 'Request a classification',
    locale: 'en',
    routeId: 'demandeClassement',
  },
  '/en/privacy-policy': {
    title: 'Privacy policy',
    description:
      'Information about personal data processing in connection with Etoilys services and public forms.',
    breadcrumbLabel: 'Privacy policy',
    locale: 'en',
    routeId: 'confidentialite',
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

const EN_LOCALE_PREFIX = '/en';

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  return normalizedPath === EN_LOCALE_PREFIX ? '/en/' : normalizedPath;
}

function applyLocaleIndexing(route: SeoRouteConfig): SeoRouteConfig {
  const locale = route.locale ?? DEFAULT_LOCALE;

  if (isContentReadyForIndexing(locale, route.routeId)) {
    return route;
  }

  return {
    ...route,
    robots: 'noindex,follow',
    indexable: false,
    prerender: false,
  };
}

export function getSeoRouteConfig(pathname: string): SeoRouteConfig {
  const normalizedPath = normalizePath(pathname);
  const route =
    SEO_ROUTES[normalizedPath] ??
    DYNAMIC_SEO_ROUTES.find((route) => route.pattern.test(normalizedPath))?.config ??
    NOT_FOUND_SEO;

  return applyLocaleIndexing(route);
}

export function getCanonicalUrl(pathname: string): string {
  const normalizedPath = normalizePath(pathname);
  return normalizedPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;
}

export function getHtmlLang(pathname: string): Locale {
  return getLocaleFromPath(normalizePath(pathname));
}

function pathnameFromSiteUrl(url: string): string {
  return url.startsWith(SITE_URL) ? url.slice(SITE_URL.length) || '/' : url;
}

function getIndexableLocalizedAlternates(pathname: string): SeoAlternateLink[] {
  return getAlternateLocaleLinks(normalizePath(pathname), SITE_URL)
    .map((link): SeoAlternateLink => ({ hreflang: link.locale, href: link.href }))
    .filter((link) => isIndexableRoute(getSeoRouteConfig(pathnameFromSiteUrl(link.href))));
}

export function getSeoAlternateLinks(pathname: string): SeoAlternateLink[] {
  const routeId = getRouteIdFromPath(pathname);

  if (routeId === null || !isIndexableRoute(getSeoRouteConfig(pathname))) {
    return [];
  }

  const alternates = getIndexableLocalizedAlternates(pathname);

  if (alternates.length < 2) {
    return [];
  }

  const defaultAlternate = alternates.find((alternate) => alternate.hreflang === DEFAULT_LOCALE);

  return defaultAlternate
    ? [...alternates, { hreflang: 'x-default', href: defaultAlternate.href }]
    : alternates;
}

export function getSitemapAlternateLinks(pathname: string): SeoAlternateLink[] {
  return getSeoAlternateLinks(pathname);
}

function isIndexableRoute(route: SeoRouteConfig): boolean {
  const locale = route.locale ?? DEFAULT_LOCALE;
  if (!isContentReadyForIndexing(locale, route.routeId)) {
    return false;
  }
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
  const locale = getHtmlLang(normalizedPath);

  if (route === NOT_FOUND_SEO || route.routeId === 'home' || normalizedPath === '/') {
    return [];
  }

  const home: BreadcrumbItem =
    locale === 'en'
      ? { name: 'Home', url: `${SITE_URL}/en/` }
      : { name: 'Accueil', url: `${SITE_URL}/` };

  if (normalizedPath.startsWith('/actualites/') && normalizedPath !== '/actualites') {
    return [
      home,
      { name: 'Actualités', url: `${SITE_URL}/actualites` },
      {
        name: route.breadcrumbLabel ?? route.title,
        url: getCanonicalUrl(normalizedPath),
      },
    ];
  }

  return [
    home,
    {
      name: route.breadcrumbLabel ?? route.title,
      url: getCanonicalUrl(normalizedPath),
    },
  ];
}
