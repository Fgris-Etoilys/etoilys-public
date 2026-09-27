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
    'Autour de Rocamadour, Souillac, Gramat, Martel et Saint-Céré, le classement donne à votre meublé un repère officiel clair pour les voyageurs. Il peut aussi rendre la taxe de séjour plus lisible et plus avantageuse selon le barème local.',
    'À Rocamadour, pour une réservation à 150 € la nuit et quatre personnes, un meublé classé 2 étoiles représente 5,18 € de taxe de séjour par nuit, contre 10,80 € pour le même logement non classé.',
  ],
  exampleLabel: 'Exemple à Rocamadour',
  exampleTitle: 'Taxe de séjour pour 4 personnes',
  exampleSubtitle: 'Logement à 150 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '10,80 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '5,18 € par nuit' },
  ],
  savingsHeadline: '5,62 € de taxe de séjour en moins par nuit',
  savingsDetail:
    'Pour les voyageurs, cela représente 39,34 € de taxe de séjour en moins sur 7 nuits.',
  sourceNote:
    'Exemple fourni pour Rocamadour : 4 personnes, logement à 150 € la nuit, meublé classé 2 étoiles.',
};

export const VALLEE_DORDOGNE_FAQ: LocalFaqItem[] = [
  {
    question: 'Intervenez-vous à Rocamadour, Souillac, Gramat, Martel et Saint-Céré ?',
    answer:
      'Oui. Etoilys réalise des visites de classement dans toute la Vallée de la Dordogne, notamment à Rocamadour, Souillac, Gramat, Martel et Saint-Céré, mais aussi à Padirac, Carennac, Autoire, Loubressac et dans les communes voisines. Cette page présente plus particulièrement notre intervention dans la partie lotoise de la vallée.',
  },
  ...CITY_COMMON_FAQ,
];
