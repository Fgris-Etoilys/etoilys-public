import type { LocalFaqItem, LocalV6TaxModule, LocalV6TerritorialModule } from '../types';
import { CITY_COMMON_FAQ } from '../cities/sharedCityFaq';

// Communes vérifiées contre le COG 2026 et les secteurs « Sarlat et Périgord Noir » et
// « Vallée de la Vézère » de la page Dordogne. Aucune commune du Pays de Fénelon n’est listée.
export const SARLAT_PERIGORD_NOIR_SERVICE_COMMUNES = [
  'Sarlat-la-Canéda',
  'Domme',
  'La Roque-Gageac',
  'Beynac-et-Cazenac',
  'Castelnaud-la-Chapelle',
  'Vézac',
  'Vitrac',
  'Saint-André-d’Allas',
  'Marquay',
  'Proissans',
  'Saint-Cyprien',
  'Pays de Belvès',
  'Siorac-en-Périgord',
  'Daglan',
  'Les Eyzies',
  'Montignac-Lascaux',
  'Le Bugue',
  'Saint-Léon-sur-Vézère',
] as const;

// Grille officielle 2026 de Sarlat Périgord Noir Tourisme, vérifiée le 2 novembre 2026 :
// https://www.sarlat-tourisme.com/app/uploads/sarlat/2025/11/Da.-Tarif-taxe-de-sejour-2026-v1-011025.pdf
// Meublé 2 étoiles : 1,10 € par adulte et par nuit (1,00 € + 0,10 € de taxe additionnelle).
// Meublé non classé : 5,5 % du coût par personne (5 % + 0,5 %), plafonné à 5,06 €.
// Barème limité aux 13 communes de la CC Sarlat-Périgord Noir : il ne vaut pas pour tout le
// Périgord Noir. Portail du territoire : https://taxe.3douest.com/sarlat.php
export const SARLAT_PERIGORD_NOIR_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'Un exemple concret à Sarlat : l’effet du classement sur la taxe de séjour',
  highlightedTitleText: 'taxe de séjour',
  paragraphs: [
    'À Sarlat et dans les communes relevant du même barème de taxe de séjour, le classement de votre meublé peut avoir un effet concret sur le montant payé par vos voyageurs. Un meublé classé bénéficie d’un montant fixe par personne et par nuitée, selon son nombre d’étoiles. Un meublé non classé relève d’un calcul proportionnel au prix de la nuitée.',
    'Prenons un logement loué 150 € la nuit hors taxe de séjour, accueillant quatre adultes. Selon les tarifs 2026 applicables à Sarlat, la taxe atteint 8,25 € par nuit pour un meublé non classé, contre 4,40 € pour un meublé classé 2 étoiles. Le classement représente ainsi 3,85 € de taxe de séjour en moins par nuit pour les voyageurs.',
    'Cet exemple concerne Sarlat et les communes soumises au même barème. Dans les autres secteurs du Périgord Noir, les tarifs et les modalités de collecte peuvent être différents selon la collectivité compétente.',
  ],
  exampleLabel: 'Exemple à Sarlat en 2026',
  exampleTitle: 'Taxe de séjour pour 4 adultes',
  exampleSubtitle: 'Logement à 150 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '8,25 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '4,40 € par nuit' },
  ],
  savingsHeadline: '3,85 € de taxe de séjour en moins par nuit, soit une baisse d’environ 47 %',
  savingsDetail:
    'Pour quatre adultes, cela représente 26,95 € de taxe de séjour en moins sur une semaine.',
  sourceNote:
    'Tarifs officiels 2026 de Sarlat Périgord Noir Tourisme, taxe additionnelle départementale incluse. Exemple pour quatre adultes non exonérés, un prix de nuitée retenu hors taxe de séjour et une occupation identique.',
};

// Sources vérifiées le 2 novembre 2026. Aucune délibération sarladaise nouvelle sur les meublés de
// tourisme : le DOB 2025 de Sarlat n’évoque qu’une réflexion sur les outils de la loi Le Meur.
// Rattachement des 18 communes : 4 communautés de communes, 3 offices de tourisme gestionnaires.
// - CC Sarlat-Périgord Noir : portail de l’OT, reversement trimestriel (taxe.3douest.com/sarlat.php).
// - CC Vallée de l’Homme : dépliant 2026 de l’OT Lascaux-Dordogne Vallée Vézère, trois périodes
//   (échéances au 15 mai, 15 septembre et 15 janvier).
// - CC Domme-Villefranche du Périgord et CC Vallée de la Dordogne et Forêt Bessède : taxe perçue
//   par les deux CC, reversements auprès de l’OT Périgord Noir Vallée Dordogne (Domme).
export const SARLAT_PERIGORD_NOIR_TERRITORIAL_MODULE: LocalV6TerritorialModule = {
  type: 'territorial-service',
  title: 'Après le classement, vos interlocuteurs dans le Périgord Noir',
  intro:
    'Après un classement ou un renouvellement, signalez vos étoiles à l’office de tourisme qui gère la taxe de séjour de votre commune. Dans le Périgord Noir, il dépend de la communauté de communes du logement.',
  items: [
    {
      title: 'Sarlat et ses environs',
      body: 'À Sarlat-la-Canéda, La Roque-Gageac, Beynac-et-Cazenac, Vézac, Vitrac, Marquay, Proissans ou Saint-André-d’Allas, la taxe de séjour se reverse chaque trimestre sur le portail de l’Office de tourisme Sarlat Périgord Noir.',
      link: {
        label: 'Portail de taxe de séjour de Sarlat Périgord Noir',
        href: 'https://taxe.3douest.com/sarlat.php',
      },
    },
    {
      title: 'Vallée de la Vézère',
      body: 'Aux Eyzies, à Montignac-Lascaux, au Bugue ou à Saint-Léon-sur-Vézère, l’Office de tourisme Lascaux-Dordogne Vallée Vézère gère la taxe de séjour de la Vallée de l’Homme, avec trois échéances de reversement par an.',
      link: {
        label: 'Portail de taxe de séjour de la Vallée de l’Homme',
        href: 'https://taxe.3douest.com/lascauxdordogne.php',
      },
    },
    {
      title: 'Domme, Castelnaud, Saint-Cyprien et Belvès',
      body: 'À Domme, Castelnaud-la-Chapelle, Daglan, Saint-Cyprien, Pays de Belvès ou Siorac-en-Périgord, la taxe de séjour est perçue par deux communautés de communes ; les reversements se font auprès de l’Office de tourisme Périgord Noir Vallée Dordogne.',
      link: {
        label: 'Taxe de séjour Périgord Noir Vallée Dordogne',
        href: 'https://www.perigordnoir-valleedordogne.com/espace-pro/informations-pratiques/taxes-sejour/',
      },
    },
  ],
};

export const SARLAT_PERIGORD_NOIR_FAQ: LocalFaqItem[] = [
  {
    question: 'Dans quelles communes du Périgord Noir intervenez-vous ?',
    answer:
      'Etoilys intervient à Sarlat-la-Canéda et dans de nombreuses communes du Périgord Noir, notamment Domme, La Roque-Gageac, Beynac-et-Cazenac, Castelnaud-la-Chapelle, Saint-Cyprien, Pays de Belvès, Les Eyzies et Montignac-Lascaux. La zone couverte est précisée dans la section dédiée et l’organisation de la visite est confirmée selon l’adresse du logement.',
  },
  {
    question: 'Comment bénéficier du tarif partenaire office de tourisme ?',
    answer:
      'Le tarif partenaire est réservé aux propriétaires adhérents d’un office de tourisme partenaire d’Etoilys. Pour un premier logement, il est de 160 € TTC au lieu de 200 € TTC au tarif direct. Des tarifs dégressifs sont également prévus pour plusieurs logements. Les conditions applicables sont confirmées avant tout engagement.',
  },
  ...CITY_COMMON_FAQ,
];
