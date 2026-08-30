import type { ImageAssetKey } from './imageManifest';
import type { ArticleAuthorId } from './articleAuthors';

export interface ArticleStructuredDataConfig {
  path: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  imageKey: ImageAssetKey;
  authorId: ArticleAuthorId;
}

export const ARTICLE_STRUCTURED_DATA: ArticleStructuredDataConfig[] = [
  {
    path: '/actualites/preparer-visite-classement-meuble-tourisme',
    headline: 'Comment préparer la visite de classement de votre meublé de tourisme ?',
    description:
      '133 critères, vaisselle, équipements, documents et informations clients : les points à vérifier avant la visite de classement de votre meublé.',
    datePublished: '2026-07-19',
    dateModified: '2026-07-19',
    imageKey: 'articlePreparerVisiteClassement',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/que-faire-apres-classement-meuble-tourisme',
    headline: 'Meublé de tourisme classé : que faire après la décision de classement ?',
    description:
      'Affichage, déclaration, taxe de séjour et plateformes : démarches à effectuer après le classement de votre meublé de tourisme.',
    datePublished: '2026-07-08',
    dateModified: '2026-07-08',
    imageKey: 'articleApresClassement',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/airbnb-booking-abritel-donnees-communes-api-meubles',
    headline: 'Airbnb, Booking, Abritel : quelles données vont désormais remonter aux communes ?',
    description:
      "API Meublés, plateformes, numéro d'enregistrement, jours loués : quelles données sont transmises aux communes et ce que cela change.",
    datePublished: '2026-06-14',
    dateModified: '2026-06-14',
    imageKey: 'articleTransmissionDonnees',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/meubles-de-tourisme-ce-qui-change-vraiment-en-2025-2026',
    headline: 'Meublés de tourisme : ce qui change vraiment en 2025-2026 pour les propriétaires',
    description:
      'Fiscalité, 90 jours, DPE, copropriété et enregistrement : points clés des évolutions 2025-2026.',
    datePublished: '2026-03-03',
    dateModified: '2026-06-07',
    imageKey: 'articleMeubles20252026',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/micro-bic-2026-meuble-classe-vs-non-classe',
    headline: "Micro-BIC 2026 : meublé classé vs non classé, l'écart se creuse",
    description:
      'Seuils, abattements et régime réel : évolutions 2026 entre meublé de tourisme classé et non classé.',
    datePublished: '2026-03-12',
    dateModified: '2026-06-07',
    imageKey: 'articleMicroBic2026',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/airbnb-residence-principale-limite-90-jours',
    headline: 'Airbnb en résidence principale : la limite des 90 jours, qui est concerné ?',
    description:
      "La limite des 90 jours ne s'applique pas partout automatiquement. Points de contexte et conditions locales.",
    datePublished: '2026-03-27',
    dateModified: '2026-06-07',
    imageKey: 'articleResidence90Jours',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/copropriete-location-touristique-reglement',
    headline: 'Copropriété et location touristique : ce que le règlement peut désormais prévoir',
    description:
      'Depuis fin 2024, les règles ont évolué en copropriété pour les meublés de tourisme.',
    datePublished: '2026-03-23',
    dateModified: '2026-03-23',
    imageKey: 'articleCoproprieteReglement',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/taxe-de-sejour-2026-pourquoi-le-classement-change-la-donne',
    headline: 'Taxe de séjour 2026 : pourquoi le classement change la donne',
    description:
      'Meublé classé ou non classé, barème 2026, taux, plafonds et surtaxes : comment le classement change concrètement la taxe de séjour.',
    datePublished: '2026-04-17',
    dateModified: '2026-04-17',
    imageKey: 'articleTaxeDeSejour2026',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/meuble-classe-non-classe-seuils-micro-bic',
    headline: "Meublé classé et non classé : comment s'appliquent les seuils micro-BIC ?",
    description:
      'Vous avez un meublé classé et un non classé ? Voici comment lire les seuils micro-BIC, les abattements et le passage au réel sans tout mélanger.',
    datePublished: '2026-04-08',
    dateModified: '2026-04-08',
    imageKey: 'articleMeubleClasseNonClasse',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/facturation-electronique-2026-proprietaires-meubles',
    headline: 'Facturation électronique 2026 : oui, les propriétaires de meublés sont concernés',
    description:
      'Réception, émission, e-reporting, calendrier, sanctions : voici ce qui s\u2019applique vraiment aux propriétaires de meublés de tourisme.',
    datePublished: '2026-05-04',
    dateModified: '2026-05-04',
    imageKey: 'articleFacturationElectronique2026',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/dpe-meubles-tourisme-2026-2034',
    headline: 'DPE des meublés de tourisme : ce qui s\u2019applique en 2026 et ce qui attend 2034',
    description:
      'Faut-il déjà un DPE pour louer un meublé de tourisme ? Changement d\u2019usage, résidence principale, règle 2034 : voici ce qu\u2019il faut vérifier.',
    datePublished: '2026-05-14',
    dateModified: '2026-06-07',
    imageKey: 'articleDpeMeublesTourisme',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/api-meubles-declaration-meuble-tourisme',
    headline: 'API Meublés : tous les propriétaires devront déclarer leur meublé de tourisme',
    description:
      'Tous les loueurs devront obtenir un numéro d\u2019enregistrement national via API Meublés. Voici ce qui change à partir du 20 mai 2026.',
    datePublished: '2026-05-18',
    dateModified: '2026-06-07',
    imageKey: 'articleApiMeubles',
    authorId: 'florian-grisorio',
  },
  {
    path: '/actualites/voyageur-refuse-quitter-meuble-tourisme-loi-ripost',
    headline: 'Voyageur qui refuse de quitter votre meublé : ce que prévoit la loi RIPOST',
    description:
      'La loi RIPOST, promulguée le 18 août 2026, ouvre une procédure si un voyageur refuse de quitter un meublé après son séjour. Ce qui change, les délais et les démarches.',
    datePublished: '2026-08-16',
    dateModified: '2026-08-30',
    imageKey: 'articleRipostVoyageurRefuseQuitter',
    authorId: 'florian-grisorio',
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

export function getAllArticleStructuredData(): ArticleStructuredDataConfig[] {
  return ARTICLE_STRUCTURED_DATA;
}
