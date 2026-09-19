import type { LocalFaqItem, LocalV6TaxModule } from '../types';
import { CITY_COMMON_FAQ } from '../cities/sharedCityFaq';

export const MEDOC_ATLANTIQUE_SERVICE_COMMUNES = [
  'Lacanau',
  'Carcans',
  'Hourtin',
  'Vendays-Montalivet',
  'Soulac-sur-Mer',
  'Le Verdon-sur-Mer',
  'Naujac-sur-Mer',
  'Grayan-et-l’Hôpital',
  'Saint-Vivien-de-Médoc',
  'Vensac',
  'Queyrac',
  'Jau-Dignac-et-Loirac',
  'Talais',
  'Valeyrac',
] as const;

export const MEDOC_ATLANTIQUE_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'Sur la côte médocaine, le classement peut aussi réduire la taxe de séjour',
  highlightedTitleText: 'réduire la taxe de séjour',
  paragraphs: [
    'De Lacanau-Océan à Soulac-sur-Mer, en passant par les grands lacs de Carcans et d’Hourtin, la location saisonnière occupe une place importante sur le littoral médocain. Le classement apporte à votre logement un repère officiel pour les voyageurs. Il peut aussi réduire très concrètement le montant de leur taxe de séjour.',
    'En 2026, le même barème s’applique dans les 14 communes de la Communauté de communes Médoc Atlantique. Pour une réservation à 200 € la nuit hors taxe de séjour et quatre adultes, un meublé non classé représente 14,40 € de taxe de séjour par nuit, contre 6,80 € pour un meublé classé 3 étoiles. Cela représente 7,60 € de moins par nuit, soit 53,20 € sur une semaine.',
  ],
  exampleLabel: 'Exemple à Lacanau',
  exampleTitle: 'Taxe de séjour pour 4 adultes',
  exampleSubtitle: 'Logement à 200 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '14,40 € par nuit' },
    { key: 'classified', label: 'Meublé classé 3 étoiles', value: '6,80 € par nuit' },
  ],
  savingsHeadline: '7,60 € de taxe de séjour en moins par nuit, soit une baisse d’environ 53 %',
  savingsDetail:
    'Pour les voyageurs, cela représente 53,20 € de taxe de séjour en moins sur une semaine.',
  sourceNote:
    'Tarifs 2026 de la Communauté de communes Médoc Atlantique, taxes additionnelles comprises.',
};

export const MEDOC_ATLANTIQUE_FAQ: LocalFaqItem[] = [
  {
    question:
      'Intervenez-vous aussi à Lacanau-Océan, Carcans-Maubuisson, Hourtin et Soulac-sur-Mer ?',
    answer:
      'Oui. Etoilys intervient dans les 14 communes de la Communauté de communes Médoc Atlantique, de Lacanau au Verdon-sur-Mer, jusqu’à la Pointe de Grave. Cela couvre notamment Lacanau-Océan, Carcans-Maubuisson, Hourtin et Hourtin-Plage, Vendays-Montalivet, Soulac-sur-Mer et les autres communes du territoire.',
  },
  ...CITY_COMMON_FAQ,
];
