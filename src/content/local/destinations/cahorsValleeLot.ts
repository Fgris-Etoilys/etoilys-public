import type { LocalFaqItem, LocalV6TaxModule } from '../types';
import { CITY_COMMON_FAQ } from '../cities/sharedCityFaq';

export const CAHORS_VALLEE_LOT_SERVICE_COMMUNES = [
  'Cahors',
  'Saint-Cirq-Lapopie',
  'Puy-l’Évêque',
  'Prayssac',
  'Luzech',
  'Montcuq-en-Quercy-Blanc',
  'Lalbenque',
  'Limogne-en-Quercy',
] as const;

export const CAHORS_VALLEE_LOT_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'À Cahors, le classement peut aussi réduire la taxe de séjour',
  highlightedTitleText: 'réduire la taxe de séjour',
  paragraphs: [
    'Entre Cahors, le vignoble, les villages de la vallée du Lot et les portes du Quercy Blanc, le classement donne à votre meublé un repère officiel lisible pour les voyageurs. Il peut aussi modifier concrètement le montant de taxe de séjour payé par vos hôtes.',
    'À Cahors, pour une réservation à 150 € la nuit hors taxe de séjour et quatre personnes, un meublé classé 2 étoiles permet 5,28 € d’économie par nuit par rapport au même logement non classé.',
  ],
  exampleLabel: 'Exemple à Cahors',
  exampleTitle: 'Taxe de séjour pour 4 personnes',
  exampleSubtitle: 'Logement à 150 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: 'Montant de référence' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '5,28 € de moins par nuit' },
  ],
  savingsHeadline: '5,28 € de taxe de séjour en moins par nuit',
  savingsDetail:
    'Pour les voyageurs, l’écart devient visible dès quelques nuits, en particulier sur les séjours familiaux dans la vallée du Lot.',
  sourceNote: 'Exemple fourni pour Cahors : 150 € la nuit, 4 personnes, meublé classé 2 étoiles.',
};

export const CAHORS_VALLEE_LOT_FAQ: LocalFaqItem[] = [
  {
    question:
      'Intervenez-vous aussi autour de Saint-Cirq-Lapopie, du vignoble de Cahors et du Quercy Blanc ?',
    answer:
      'Oui. Cette page couvre le bassin touristique de Cahors et de la vallée du Lot, notamment Cahors, Saint-Cirq-Lapopie, Puy-l’Évêque, Prayssac, Luzech, Montcuq-en-Quercy-Blanc, Lalbenque, Limogne-en-Quercy, le Vignoble de Cahors et le Quercy Blanc. Elle évite de disperser ces secteurs sur des pages locales séparées.',
  },
  ...CITY_COMMON_FAQ,
];
