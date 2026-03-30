import type { ImageAssetKey } from './imageManifest';

export interface ActualiteArticle {
  title: string;
  excerpt: string;
  imageKey: ImageAssetKey;
  href: string;
  date: string;
  publishedAt: string;
}

const articles: ActualiteArticle[] = [
  {
    title: "Micro-BIC 2026 : meublé classé vs non classé, l'écart se creuse",
    excerpt:
      'Seuils, abattements, régime réel, micro-entreprise : voici ce qui change en 2026 entre un meublé de tourisme classé et non classé.',
    imageKey: 'articleMicroBic2026',
    href: '/actualites/micro-bic-2026-meuble-classe-vs-non-classe',
    date: '12 mars 2026',
    publishedAt: '2026-03-12',
  },
  {
    title: 'Meublés de tourisme : ce qui change vraiment en 2025-2026 pour les propriétaires',
    excerpt:
      'Fiscalité, 90 jours, DPE, copropriété, enregistrement : voici ce qui change vraiment en 2025-2026 pour les propriétaires de meublés de tourisme.',
    imageKey: 'articleMeubles20252026',
    href: '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    date: '3 mars 2026',
    publishedAt: '2026-03-03',
  },
  {
    title: 'Airbnb en résidence principale : la limite des 90 jours, qui est concerné ?',
    excerpt:
      "La limite des 90 jours ne s'applique pas partout automatiquement. Voici qui est concerné, qui décide et ce que cela change pour votre meublé de tourisme.",
    imageKey: 'articleResidence90Jours',
    href: '/actualites/airbnb-residence-principale-limite-90-jours',
    date: '27 mars 2026',
    publishedAt: '2026-03-27',
  },
  {
    title: 'Copropriété et location touristique : ce que le règlement peut désormais prévoir',
    excerpt:
      'Depuis fin 2024, les règles ont évolué en copropriété pour les meublés de tourisme. Voici ce que le règlement peut désormais autoriser, interdire ou encadrer.',
    imageKey: 'articleCoproprieteReglement',
    href: '/actualites/copropriete-location-touristique-reglement',
    date: '23 mars 2026',
    publishedAt: '2026-03-23',
  },
];

export const actualitesArticlesByRecency = [...articles].sort(
  (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
);
