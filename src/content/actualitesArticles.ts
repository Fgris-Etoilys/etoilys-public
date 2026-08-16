import {
  getAllArticleStructuredData,
  getArticleStructuredData,
  type ArticleStructuredDataConfig,
} from './articleStructuredData';
import { getArticleAuthor, type ArticleAuthorId } from './articleAuthors';
import { formatFrenchDate } from './dateFormatting';
import type { ImageAssetKey } from './imageManifest';

export interface ActualiteArticle {
  slug: string;
  title: string;
  excerpt: string;
  relatedSummary: string;
  imageKey: ImageAssetKey;
  href: string;
  category: ArticleCategory;
  readingTimeMinutes: number;
  authorId: ArticleAuthorId;
  authorName: string;
  date: string;
  publishedAt: string;
  updatedDate?: string;
  updatedAt?: string;
  relatedArticleSlugs?: readonly string[];
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

export type ActualitesCategoryFilter = ArticleCategory | 'all';

export interface ActualitesCategoryFilterOption {
  value: ActualitesCategoryFilter;
  label: string;
}

export const ACTUALITES_CATEGORY_FILTERS: readonly ActualitesCategoryFilterOption[] = [
  { value: 'all', label: 'Tous' },
  { value: 'fiscalite', label: ARTICLE_CATEGORY_LABELS.fiscalite },
  { value: 'reglementation', label: ARTICLE_CATEGORY_LABELS.reglementation },
  { value: 'obligations', label: ARTICLE_CATEGORY_LABELS.obligations },
  { value: 'guides-pratiques', label: ARTICLE_CATEGORY_LABELS['guides-pratiques'] },
];

type ActualiteArticleContent = Omit<
  ActualiteArticle,
  'slug' | 'authorId' | 'authorName' | 'date' | 'publishedAt' | 'updatedDate' | 'updatedAt'
>;

export interface RelatedArticleConfigEntry {
  href: string;
  relatedArticleSlugs?: readonly string[];
}

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

function getSlugFromHref(href: string): string {
  return normalizePath(href).replace(/^\/actualites\//, '');
}

export function getArticleCategoryLabel(category: ArticleCategory): string {
  return ARTICLE_CATEGORY_LABELS[category];
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min de lecture`;
}

export function isArticleCategory(value: string | null): value is ArticleCategory {
  if (!value) return false;
  return Object.prototype.hasOwnProperty.call(ARTICLE_CATEGORY_LABELS, value);
}

const articleContent: ActualiteArticleContent[] = [
  {
    title: 'Comment préparer la visite de classement de votre meublé de tourisme ?',
    excerpt:
      'Comment fonctionne la grille des 133 critères et quels équipements, quantités et informations vérifier avant la visite de classement ?',
    relatedSummary:
      'Équipements, documents et points de vigilance : les vérifications utiles avant la visite de classement.',
    imageKey: 'articlePreparerVisiteClassement',
    href: '/actualites/preparer-visite-classement-meuble-tourisme',
    category: 'guides-pratiques',
    readingTimeMinutes: 11,
    relatedArticleSlugs: [
      'que-faire-apres-classement-meuble-tourisme',
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
      'taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
    ],
  },
  {
    title: 'Meublé de tourisme classé : que faire après la décision de classement ?',
    excerpt:
      'Affichage, déclaration, taxe de séjour et plateformes : les démarches à effectuer après le classement de votre meublé de tourisme.',
    relatedSummary:
      'Affichage, déclaration et taxe de séjour : les démarches à effectuer une fois votre classement obtenu.',
    imageKey: 'articleApresClassement',
    href: '/actualites/que-faire-apres-classement-meuble-tourisme',
    category: 'guides-pratiques',
    readingTimeMinutes: 7,
    relatedArticleSlugs: [
      'preparer-visite-classement-meuble-tourisme',
      'taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
      'airbnb-booking-abritel-donnees-communes-api-meubles',
    ],
  },
  {
    title: 'Airbnb, Booking, Abritel : quelles données vont désormais remonter aux communes ?',
    excerpt:
      "API Meublés, numéro d'enregistrement, adresse, annonces, jours loués : quelles données sont transmises aux communes et ce que cela change.",
    relatedSummary:
      'Les plateformes doivent transmettre davantage de données aux communes : voici ce que cela change pour les loueurs.',
    imageKey: 'articleTransmissionDonnees',
    href: '/actualites/airbnb-booking-abritel-donnees-communes-api-meubles',
    category: 'reglementation',
    readingTimeMinutes: 9,
    relatedArticleSlugs: [
      'api-meubles-declaration-meuble-tourisme',
      'airbnb-residence-principale-limite-90-jours',
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    ],
  },
  {
    title: "Micro-BIC 2026 : meublé classé vs non classé, l'écart se creuse",
    excerpt:
      'Seuils, abattements, régime réel, micro-entreprise : ce qui change en 2026 entre un meublé de tourisme classé et non classé.',
    relatedSummary:
      'Seuils, abattements et régime réel : les différences fiscales entre un meublé classé et non classé en 2026.',
    imageKey: 'articleMicroBic2026',
    href: '/actualites/micro-bic-2026-meuble-classe-vs-non-classe',
    category: 'fiscalite',
    readingTimeMinutes: 8,
    relatedArticleSlugs: [
      'meuble-classe-non-classe-seuils-micro-bic',
      'taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    ],
  },
  {
    title: 'Meublés de tourisme : ce qui change vraiment en 2025-2026 pour les propriétaires',
    excerpt:
      'Fiscalité, 90 jours, DPE, copropriété, enregistrement : ce qui change vraiment en 2025-2026 pour les propriétaires de meublés de tourisme.',
    relatedSummary:
      'Fiscalité, DPE, copropriété et enregistrement : les principales évolutions à connaître en 2025-2026.',
    imageKey: 'articleMeubles20252026',
    href: '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    category: 'reglementation',
    readingTimeMinutes: 8,
    relatedArticleSlugs: [
      'dpe-meubles-tourisme-2026-2034',
      'airbnb-residence-principale-limite-90-jours',
      'api-meubles-declaration-meuble-tourisme',
    ],
  },
  {
    title: 'Airbnb en résidence principale : la limite des 90 jours, qui est concerné ?',
    excerpt:
      "La limite des 90 jours ne s'applique pas partout automatiquement. Qui est concerné, qui décide et ce que cela change pour votre meublé de tourisme.",
    relatedSummary:
      'La limite de 90 jours ne s’applique pas partout : vérifiez la règle adoptée par votre commune.',
    imageKey: 'articleResidence90Jours',
    href: '/actualites/airbnb-residence-principale-limite-90-jours',
    category: 'reglementation',
    readingTimeMinutes: 8,
    relatedArticleSlugs: [
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
      'copropriete-location-touristique-reglement',
      'airbnb-booking-abritel-donnees-communes-api-meubles',
    ],
  },
  {
    title: 'Copropriété et location touristique : ce que le règlement peut désormais prévoir',
    excerpt:
      'Depuis fin 2024, les règles ont évolué en copropriété pour les meublés de tourisme : autorisation, interdiction, syndic et règlement.',
    relatedSummary:
      'Règlement, vote en assemblée générale et information du syndic : les règles applicables en copropriété.',
    imageKey: 'articleCoproprieteReglement',
    href: '/actualites/copropriete-location-touristique-reglement',
    category: 'reglementation',
    readingTimeMinutes: 8,
    relatedArticleSlugs: [
      'airbnb-residence-principale-limite-90-jours',
      'dpe-meubles-tourisme-2026-2034',
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    ],
  },
  {
    title: 'Taxe de séjour 2026 : pourquoi le classement change la donne',
    excerpt:
      'Meublé classé ou non classé, barème 2026, taux, plafonds et surtaxes : comment le classement change concrètement la taxe de séjour.',
    relatedSummary:
      'Comprendre la différence de calcul de la taxe de séjour entre un meublé classé et non classé.',
    imageKey: 'articleTaxeDeSejour2026',
    href: '/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
    category: 'fiscalite',
    readingTimeMinutes: 8,
    relatedArticleSlugs: [
      'micro-bic-2026-meuble-classe-vs-non-classe',
      'meuble-classe-non-classe-seuils-micro-bic',
      'que-faire-apres-classement-meuble-tourisme',
    ],
  },
  {
    title: "Meublé classé et non classé : comment s'appliquent les seuils micro-BIC ?",
    excerpt:
      'Vous avez un meublé classé et un non classé ? Comment lire les seuils micro-BIC, les abattements et le passage au réel sans tout mélanger.',
    relatedSummary:
      'Un comparatif clair des plafonds et abattements micro-BIC applicables aux meublés classés et non classés.',
    imageKey: 'articleMeubleClasseNonClasse',
    href: '/actualites/meuble-classe-non-classe-seuils-micro-bic',
    category: 'fiscalite',
    readingTimeMinutes: 7,
    relatedArticleSlugs: [
      'micro-bic-2026-meuble-classe-vs-non-classe',
      'taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    ],
  },
  {
    title: 'Facturation électronique 2026 : oui, les propriétaires de meublés sont concernés',
    excerpt:
      "Réception, émission, e-reporting, calendrier, sanctions : ce qui s'applique vraiment aux propriétaires de meublés de tourisme.",
    relatedSummary:
      'Calendrier, factures concernées et premières démarches : ce que les loueurs doivent anticiper.',
    imageKey: 'articleFacturationElectronique2026',
    href: '/actualites/facturation-electronique-2026-proprietaires-meubles',
    category: 'obligations',
    readingTimeMinutes: 7,
    relatedArticleSlugs: [
      'api-meubles-declaration-meuble-tourisme',
      'airbnb-booking-abritel-donnees-communes-api-meubles',
      'micro-bic-2026-meuble-classe-vs-non-classe',
    ],
  },
  {
    title: 'DPE des meublés de tourisme : ce qui s’applique en 2026 et ce qui attend 2034',
    excerpt:
      'Faut-il déjà un DPE pour louer un meublé de tourisme ? Changement d’usage, résidence principale, règle 2034 : les points à vérifier.',
    relatedSummary:
      'Changement d’usage, décence énergétique et échéance de 2034 : les meublés réellement concernés par le DPE.',
    imageKey: 'articleDpeMeublesTourisme',
    href: '/actualites/dpe-meubles-tourisme-2026-2034',
    category: 'reglementation',
    readingTimeMinutes: 6,
    relatedArticleSlugs: [
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
      'airbnb-residence-principale-limite-90-jours',
      'copropriete-location-touristique-reglement',
    ],
  },
  {
    title: 'API Meublés : tous les propriétaires devront déclarer leur meublé de tourisme',
    excerpt:
      'Tous les loueurs devront obtenir un numéro d’enregistrement national via API Meublés. Ce qui change à partir du 20 mai 2026.',
    relatedSummary:
      'Enregistrement national et API Meublés : comprendre le nouveau circuit de déclaration des locations touristiques.',
    imageKey: 'articleApiMeubles',
    href: '/actualites/api-meubles-declaration-meuble-tourisme',
    category: 'obligations',
    readingTimeMinutes: 9,
    relatedArticleSlugs: [
      'airbnb-booking-abritel-donnees-communes-api-meubles',
      'facturation-electronique-2026-proprietaires-meubles',
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    ],
  },
  {
    title: 'Voyageur qui refuse de quitter votre meublé : ce que prévoit la loi RIPOST',
    excerpt:
      'Un voyageur refuse de quitter votre meublé après la fin de sa réservation ? La loi RIPOST prévoit d’ouvrir la procédure administrative d’évacuation à cette situation. Voici ce que cela change, les délais et les démarches.',
    relatedSummary:
      'Voyageur qui refuse de partir après son séjour : ce que la loi RIPOST prévoit de changer et les démarches à engager.',
    imageKey: 'articleRipostVoyageurRefuseQuitter',
    href: '/actualites/voyageur-refuse-quitter-meuble-tourisme-loi-ripost',
    category: 'reglementation',
    readingTimeMinutes: 6,
    relatedArticleSlugs: [
      'meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
      'api-meubles-declaration-meuble-tourisme',
      'airbnb-booking-abritel-donnees-communes-api-meubles',
    ],
  },
];

function buildArticle(article: ActualiteArticleContent): ActualiteArticle {
  const canonicalArticle = getArticleStructuredData(article.href);

  if (canonicalArticle === null) {
    throw new Error(`Missing canonical article metadata for ${article.href}`);
  }

  const author = getArticleAuthor(canonicalArticle.authorId);
  const result: ActualiteArticle = {
    ...article,
    slug: getSlugFromHref(article.href),
    date: formatFrenchDate(canonicalArticle.datePublished),
    publishedAt: canonicalArticle.datePublished,
    authorId: canonicalArticle.authorId,
    authorName: author.name,
  };

  if (canonicalArticle.dateModified !== canonicalArticle.datePublished) {
    result.updatedDate = formatFrenchDate(canonicalArticle.dateModified);
    result.updatedAt = canonicalArticle.dateModified;
  }

  return result;
}

export function validateRelatedArticleSlugs(entries: readonly RelatedArticleConfigEntry[]): void {
  const slugs = new Set(entries.map((entry) => getSlugFromHref(entry.href)));

  entries.forEach((entry) => {
    const currentSlug = getSlugFromHref(entry.href);
    const relatedSlugs = entry.relatedArticleSlugs ?? [];

    if (relatedSlugs.length > 3) {
      throw new Error(`Article ${currentSlug} has more than 3 related articles`);
    }

    const seen = new Set<string>();

    relatedSlugs.forEach((slug) => {
      if (slug === currentSlug) {
        throw new Error(`Article ${currentSlug} cannot reference itself as related article`);
      }

      if (seen.has(slug)) {
        throw new Error(`Article ${currentSlug} has duplicate related article ${slug}`);
      }

      if (!slugs.has(slug)) {
        throw new Error(`Article ${currentSlug} references unknown related article ${slug}`);
      }

      seen.add(slug);
    });
  });
}

const shouldValidateArticleConfiguration =
  typeof window === 'undefined' || import.meta.env?.DEV || import.meta.env?.MODE === 'test';

if (shouldValidateArticleConfiguration) {
  validateRelatedArticleSlugs(articleContent);
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

export function getFeaturedActualiteArticle(
  articleList: readonly ActualiteArticle[] = actualitesArticlesByRecency
): ActualiteArticle | null {
  return (
    [...articleList].sort(
      (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    )[0] ?? null
  );
}

const articlesByHref = new Map(articles.map((article) => [normalizePath(article.href), article]));

export function getActualiteArticleByHref(href: string): ActualiteArticle {
  const article = articlesByHref.get(normalizePath(href));

  if (!article) {
    throw new Error(`Missing actualites article metadata for ${href}`);
  }

  return article;
}

function getArticlesBySlug(
  articleList: readonly ActualiteArticle[]
): Map<string, ActualiteArticle> {
  return new Map(articleList.map((article) => [article.slug, article]));
}

export function getRelatedArticles(
  article: ActualiteArticle,
  articleList: readonly ActualiteArticle[] = actualitesArticlesByRecency
): ActualiteArticle[] {
  const relatedSlugs = article.relatedArticleSlugs ?? [];
  const articlesBySlug = getArticlesBySlug(articleList);

  if (relatedSlugs.length > 0) {
    const seen = new Set<string>();
    const manuallySelectedArticles: ActualiteArticle[] = [];

    relatedSlugs.forEach((slug) => {
      if (slug === article.slug || seen.has(slug)) return;

      const relatedArticle = articlesBySlug.get(slug);
      if (!relatedArticle) return;

      seen.add(slug);
      manuallySelectedArticles.push(relatedArticle);
    });

    return manuallySelectedArticles.slice(0, 3);
  }

  const selected: ActualiteArticle[] = [];
  const selectedSlugs = new Set<string>();

  const appendArticle = (candidate: ActualiteArticle) => {
    if (candidate.slug === article.slug || selectedSlugs.has(candidate.slug)) return;
    if (selected.length >= 3) return;

    selected.push(candidate);
    selectedSlugs.add(candidate.slug);
  };

  articleList.filter((candidate) => candidate.category === article.category).forEach(appendArticle);

  articleList.forEach(appendArticle);

  return selected;
}
