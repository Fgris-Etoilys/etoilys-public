import type { ImageAssetKey } from './imageManifest';

export interface ArticleStructuredDataConfig {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  imageKey: ImageAssetKey;
  authorName: string;
}

const ARTICLE_STRUCTURED_DATA: ArticleStructuredDataConfig[] = [
  {
    path: '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    headline: 'Meubles de tourisme: ce qui change vraiment en 2025-2026 pour les proprietaires',
    description:
      'Fiscalite, 90 jours, DPE, copropriete et enregistrement: points cles des evolutions 2025-2026.',
    datePublished: '2026-03-03',
    dateModified: '2026-03-03',
    imageKey: 'articleMeubles20252026',
    authorName: 'Florian Grisorio',
  },
  {
    path: '/actualites/micro-bic-2026-meuble-classe-vs-non-classe',
    headline: "Micro-BIC 2026: meuble classe vs non classe, l'ecart se creuse",
    description:
      'Seuils, abattements et regime reel: evolutions 2026 entre meuble de tourisme classe et non classe.',
    datePublished: '2026-03-12',
    dateModified: '2026-03-12',
    imageKey: 'articleMicroBic2026',
    authorName: 'Florian Grisorio',
  },
  {
    path: '/actualites/airbnb-residence-principale-limite-90-jours',
    headline: 'Airbnb en residence principale: qui est concerne par la limite des 90 jours',
    description:
      "La limite des 90 jours ne s'applique pas partout automatiquement. Points de contexte et conditions locales.",
    datePublished: '2026-03-27',
    dateModified: '2026-03-27',
    imageKey: 'articleResidence90Jours',
    authorName: 'Florian Grisorio',
  },
  {
    path: '/actualites/copropriete-location-touristique-reglement',
    headline: 'Copropriete et location touristique: ce que le reglement peut desormais prevoir',
    description:
      'Depuis fin 2024, les regles ont evolue en copropriete pour les meubles de tourisme.',
    datePublished: '2026-03-23',
    dateModified: '2026-03-23',
    imageKey: 'articleCoproprieteReglement',
    authorName: 'Florian Grisorio',
  },
];

function normalizePath(pathname: string): string {
  if (!pathname) return '/';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '') || '/';
}

export function getArticleStructuredData(pathname: string): ArticleStructuredDataConfig | null {
  const normalizedPath = normalizePath(pathname);
  return ARTICLE_STRUCTURED_DATA.find((article) => article.path === normalizedPath) ?? null;
}
