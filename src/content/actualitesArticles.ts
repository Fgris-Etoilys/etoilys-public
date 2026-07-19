import {
  getAllArticleStructuredData,
  getArticleStructuredData,
  type ArticleStructuredDataConfig,
} from './articleStructuredData';
import { formatFrenchDate } from './dateFormatting';
import type { ImageAssetKey } from './imageManifest';

export interface ActualiteArticle {
  title: string;
  excerpt: string;
  imageKey: ImageAssetKey;
  href: string;
  category: ArticleCategory;
  readingTimeMinutes: number;
  authorName: string;
  date: string;
  publishedAt: string;
  updatedDate?: string;
  updatedAt?: string;
}

export type ArticleCategory =
  | 'classement'
  | 'fiscalite'
  | 'reglementation'
  | 'obligations'
  | 'guides-pratiques';

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  classement: 'Classement',
  fiscalite: 'Fiscalité',
  reglementation: 'Réglementation',
  obligations: 'Obligations',
  'guides-pratiques': 'Guides pratiques',
};

type ActualiteArticleContent = Omit<
  ActualiteArticle,
  'authorName' | 'date' | 'publishedAt' | 'updatedDate' | 'updatedAt'
>;

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

export function getArticleCategoryLabel(category: ArticleCategory): string {
  return ARTICLE_CATEGORY_LABELS[category];
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min de lecture`;
}

const articleContent: ActualiteArticleContent[] = [
  {
    title: 'Comment préparer la visite de classement de votre meublé de tourisme ?',
    excerpt:
      'Comment fonctionne la grille des 133 critères et quels équipements, quantités et informations vérifier avant la visite de classement ?',
    imageKey: 'articlePreparerVisiteClassement',
    href: '/actualites/preparer-visite-classement-meuble-tourisme',
    category: 'guides-pratiques',
    readingTimeMinutes: 11,
  },
  {
    title: 'Meublé de tourisme classé : que faire après la décision de classement ?',
    excerpt:
      'Affichage, déclaration, taxe de séjour et plateformes : les démarches à effectuer après le classement de votre meublé de tourisme.',
    imageKey: 'articleApresClassement',
    href: '/actualites/que-faire-apres-classement-meuble-tourisme',
    category: 'guides-pratiques',
    readingTimeMinutes: 7,
  },
  {
    title: 'Airbnb, Booking, Abritel : quelles données vont désormais remonter aux communes ?',
    excerpt:
      "API Meublés, numéro d'enregistrement, adresse, annonces, jours loués : quelles données sont transmises aux communes et ce que cela change.",
    imageKey: 'articleTransmissionDonnees',
    href: '/actualites/airbnb-booking-abritel-donnees-communes-api-meubles',
    category: 'reglementation',
    readingTimeMinutes: 9,
  },
  {
    title: "Micro-BIC 2026 : meublé classé vs non classé, l'écart se creuse",
    excerpt:
      'Seuils, abattements, régime réel, micro-entreprise : ce qui change en 2026 entre un meublé de tourisme classé et non classé.',
    imageKey: 'articleMicroBic2026',
    href: '/actualites/micro-bic-2026-meuble-classe-vs-non-classe',
    category: 'fiscalite',
    readingTimeMinutes: 8,
  },
  {
    title: 'Meublés de tourisme : ce qui change vraiment en 2025-2026 pour les propriétaires',
    excerpt:
      'Fiscalité, 90 jours, DPE, copropriété, enregistrement : ce qui change vraiment en 2025-2026 pour les propriétaires de meublés de tourisme.',
    imageKey: 'articleMeubles20252026',
    href: '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    category: 'reglementation',
    readingTimeMinutes: 8,
  },
  {
    title: 'Airbnb en résidence principale : la limite des 90 jours, qui est concerné ?',
    excerpt:
      "La limite des 90 jours ne s'applique pas partout automatiquement. Qui est concerné, qui décide et ce que cela change pour votre meublé de tourisme.",
    imageKey: 'articleResidence90Jours',
    href: '/actualites/airbnb-residence-principale-limite-90-jours',
    category: 'reglementation',
    readingTimeMinutes: 8,
  },
  {
    title: 'Copropriété et location touristique : ce que le règlement peut désormais prévoir',
    excerpt:
      'Depuis fin 2024, les règles ont évolué en copropriété pour les meublés de tourisme : autorisation, interdiction, syndic et règlement.',
    imageKey: 'articleCoproprieteReglement',
    href: '/actualites/copropriete-location-touristique-reglement',
    category: 'reglementation',
    readingTimeMinutes: 8,
  },
  {
    title: 'Taxe de séjour 2026 : pourquoi le classement change la donne',
    excerpt:
      'Meublé classé ou non classé, barème 2026, taux, plafonds et surtaxes : comment le classement change concrètement la taxe de séjour.',
    imageKey: 'articleTaxeDeSejour2026',
    href: '/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
    category: 'fiscalite',
    readingTimeMinutes: 8,
  },
  {
    title: "Meublé classé et non classé : comment s'appliquent les seuils micro-BIC ?",
    excerpt:
      'Vous avez un meublé classé et un non classé ? Comment lire les seuils micro-BIC, les abattements et le passage au réel sans tout mélanger.',
    imageKey: 'articleMeubleClasseNonClasse',
    href: '/actualites/meuble-classe-non-classe-seuils-micro-bic',
    category: 'fiscalite',
    readingTimeMinutes: 7,
  },
  {
    title: 'Facturation électronique 2026 : oui, les propriétaires de meublés sont concernés',
    excerpt:
      "Réception, émission, e-reporting, calendrier, sanctions : ce qui s'applique vraiment aux propriétaires de meublés de tourisme.",
    imageKey: 'articleFacturationElectronique2026',
    href: '/actualites/facturation-electronique-2026-proprietaires-meubles',
    category: 'obligations',
    readingTimeMinutes: 7,
  },
  {
    title: 'DPE des meublés de tourisme : ce qui s’applique en 2026 et ce qui attend 2034',
    excerpt:
      'Faut-il déjà un DPE pour louer un meublé de tourisme ? Changement d’usage, résidence principale, règle 2034 : les points à vérifier.',
    imageKey: 'articleDpeMeublesTourisme',
    href: '/actualites/dpe-meubles-tourisme-2026-2034',
    category: 'reglementation',
    readingTimeMinutes: 6,
  },
  {
    title: 'API Meublés : tous les propriétaires devront déclarer leur meublé de tourisme',
    excerpt:
      'Tous les loueurs devront obtenir un numéro d’enregistrement national via API Meublés. Ce qui change à partir du 20 mai 2026.',
    imageKey: 'articleApiMeubles',
    href: '/actualites/api-meubles-declaration-meuble-tourisme',
    category: 'obligations',
    readingTimeMinutes: 9,
  },
];

function buildArticle(article: ActualiteArticleContent): ActualiteArticle {
  const canonicalArticle = getArticleStructuredData(article.href);

  if (canonicalArticle === null) {
    throw new Error(`Missing canonical article metadata for ${article.href}`);
  }

  const result: ActualiteArticle = {
    ...article,
    date: formatFrenchDate(canonicalArticle.datePublished),
    publishedAt: canonicalArticle.datePublished,
    authorName: canonicalArticle.authorName,
  };

  if (canonicalArticle.dateModified !== canonicalArticle.datePublished) {
    result.updatedDate = formatFrenchDate(canonicalArticle.dateModified);
    result.updatedAt = canonicalArticle.dateModified;
  }

  return result;
}

const articles = articleContent.map(buildArticle);
const articlePaths = new Set(articleContent.map((article) => article.href));

getAllArticleStructuredData().forEach((article: ArticleStructuredDataConfig) => {
  if (!articlePaths.has(article.path)) {
    throw new Error(`Missing article list content for ${article.path}`);
  }
});

export const actualitesArticlesByRecency = [...articles].sort(
  (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
);

const articlesByHref = new Map(articles.map((article) => [normalizePath(article.href), article]));

export function getActualiteArticleByHref(href: string): ActualiteArticle {
  const article = articlesByHref.get(normalizePath(href));

  if (!article) {
    throw new Error(`Missing actualites article metadata for ${href}`);
  }

  return article;
}
