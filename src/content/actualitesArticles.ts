import type { ImageAssetKey } from './imageManifest';

export interface ActualiteArticle {
  title: string;
  excerpt: string;
  imageKey: ImageAssetKey;
  href: string;
  date: string;
  publishedAt: string;
  updatedDate?: string;
  updatedAt?: string;
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
    updatedDate: '7 juin 2026',
    updatedAt: '2026-06-07',
  },
  {
    title: 'Meublés de tourisme : ce qui change vraiment en 2025-2026 pour les propriétaires',
    excerpt:
      'Fiscalité, 90 jours, DPE, copropriété, enregistrement : voici ce qui change vraiment en 2025-2026 pour les propriétaires de meublés de tourisme.',
    imageKey: 'articleMeubles20252026',
    href: '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    date: '3 mars 2026',
    publishedAt: '2026-03-03',
    updatedDate: '7 juin 2026',
    updatedAt: '2026-06-07',
  },
  {
    title: 'Airbnb en résidence principale : la limite des 90 jours, qui est concerné ?',
    excerpt:
      "La limite des 90 jours ne s'applique pas partout automatiquement. Voici qui est concerné, qui décide et ce que cela change pour votre meublé de tourisme.",
    imageKey: 'articleResidence90Jours',
    href: '/actualites/airbnb-residence-principale-limite-90-jours',
    date: '27 mars 2026',
    publishedAt: '2026-03-27',
    updatedDate: '7 juin 2026',
    updatedAt: '2026-06-07',
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
  {
    title: 'Taxe de séjour 2026 : pourquoi le classement change la donne',
    excerpt:
      'Meublé classé ou non classé, barème 2026, taux, plafonds et surtaxes : voici comment le classement change concrètement la taxe de séjour.',
    imageKey: 'articleTaxeDeSejour2026',
    href: '/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
    date: '17 avril 2026',
    publishedAt: '2026-04-17',
  },
  {
    title: "Meublé classé et non classé : comment s'appliquent les seuils micro-BIC ?",
    excerpt:
      'Vous avez un meublé classé et un non classé ? Voici comment lire les seuils micro-BIC, les abattements et le passage au réel sans tout mélanger.',
    imageKey: 'articleMeubleClasseNonClasse',
    href: '/actualites/meuble-classe-non-classe-seuils-micro-bic',
    date: '8 avril 2026',
    publishedAt: '2026-04-08',
  },
  {
    title: 'Facturation électronique 2026 : oui, les propriétaires de meublés sont concernés',
    excerpt:
      "Réception, émission, e-reporting, calendrier, sanctions : voici ce qui s'applique vraiment aux propriétaires de meublés de tourisme.",
    imageKey: 'articleFacturationElectronique2026',
    href: '/actualites/facturation-electronique-2026-proprietaires-meubles',
    date: '4 mai 2026',
    publishedAt: '2026-05-04',
  },
  {
    title: 'DPE des meublés de tourisme : ce qui s\u2019applique en 2026 et ce qui attend 2034',
    excerpt:
      'Faut-il déjà un DPE pour louer un meublé de tourisme ? Changement d\u2019usage, résidence principale, règle 2034 : voici ce qu\u2019il faut vérifier.',
    imageKey: 'articleDpeMeublesTourisme',
    href: '/actualites/dpe-meubles-tourisme-2026-2034',
    date: '14 mai 2026',
    publishedAt: '2026-05-14',
    updatedDate: '7 juin 2026',
    updatedAt: '2026-06-07',
  },
  {
    title: 'API Meublés : tous les propriétaires devront déclarer leur meublé de tourisme',
    excerpt:
      'Tous les loueurs devront obtenir un numéro d\u2019enregistrement national via API Meublés. Voici ce qui change à partir du 20 mai 2026 et comment se préparer.',
    imageKey: 'articleApiMeubles',
    href: '/actualites/api-meubles-declaration-meuble-tourisme',
    date: '18 mai 2026',
    publishedAt: '2026-05-18',
    updatedDate: '7 juin 2026',
    updatedAt: '2026-06-07',
  },
];

export const actualitesArticlesByRecency = [...articles].sort(
  (left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
);
