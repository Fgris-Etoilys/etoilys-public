import type { LocalFaqItem, LocalV6TaxModule } from '../types';
import { CITY_COMMON_FAQ } from '../cities/sharedCityFaq';

export const VALLEE_DORDOGNE_SERVICE_COMMUNES = [
  'Rocamadour',
  'Souillac',
  'Gramat',
  'Martel',
  'Saint-Céré',
  'Padirac',
  'Carennac',
  'Autoire',
  'Loubressac',
  'Bretenoux',
] as const;

export const VALLEE_DORDOGNE_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'Dans la Vallée de la Dordogne, le classement peut aussi réduire la taxe de séjour',
  highlightedTitleText: 'réduire la taxe de séjour',
  paragraphs: [
    'De Rocamadour à Souillac, en passant par Gramat, Martel et Saint-Céré, la Vallée de la Dordogne accueille de nombreux gîtes, maisons de vacances et locations saisonnières. Le classement apporte à votre logement un repère officiel pour les voyageurs. Il peut aussi réduire très concrètement le montant de leur taxe de séjour.',
    'À Rocamadour, pour une réservation à 150 € la nuit hors taxe de séjour et quatre personnes, un meublé non classé représente 10,80 € de taxe de séjour par nuit, contre 5,18 € pour un meublé classé 2 étoiles. Cela représente 5,62 € de moins par nuit, soit 39,34 € sur sept nuits.',
  ],
  exampleLabel: 'Exemple à Rocamadour',
  exampleTitle: 'Taxe de séjour pour 4 personnes',
  exampleSubtitle: 'Logement à 150 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '10,80 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '5,18 € par nuit' },
  ],
  savingsHeadline: '5,62 € de taxe de séjour en moins par nuit, soit une baisse d’environ 52 %',
  savingsDetail:
    'Pour les voyageurs, cela représente 39,34 € de taxe de séjour en moins sur 7 nuits.',
  sourceNote: 'Tarifs 2026 applicables à Rocamadour, taxes additionnelles comprises.',
};

export const VALLEE_DORDOGNE_FAQ: LocalFaqItem[] = [
  {
    question: 'Intervenez-vous à Rocamadour, Souillac, Gramat, Martel et Saint-Céré ?',
    answer:
      'Oui. Etoilys réalise des visites de classement dans toute la Vallée de la Dordogne. Dans le Lot, nous intervenons notamment à Rocamadour, Souillac, Gramat, Martel, Saint-Céré, Padirac, Carennac, Autoire, Loubressac et Bretenoux.',
  },
  ...CITY_COMMON_FAQ,
];
