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
  title: 'Un exemple concret à Cahors : l’effet du classement sur la taxe de séjour',
  highlightedTitleText: 'taxe de séjour',
  paragraphs: [
    'Entre le centre historique de Cahors, le vignoble et les villages de la vallée du Lot, le secteur accueille de nombreux gîtes, maisons de vacances et appartements proposés en location saisonnière. Dans ce contexte local, l’écart de taxe de séjour entre un meublé non classé et un meublé classé donne un exemple concret de l’intérêt du classement.',
    'À Cahors, un meublé non classé relève en 2026 d’un tarif proportionnel au prix de la nuitée. Un meublé classé bénéficie au contraire d’un montant fixe par personne selon son nombre d’étoiles.',
    'Sur une réservation à 150 € la nuit hors taxe de séjour pour quatre adultes, un meublé classé 2 étoiles permet par exemple de réduire la taxe de séjour de 5,28 € par nuit.',
  ],
  exampleLabel: 'Exemple à Cahors',
  exampleTitle: 'Taxe de séjour pour 4 adultes',
  exampleSubtitle: 'Logement à 150 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '9,72 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '4,44 € par nuit' },
  ],
  savingsHeadline: '5,28 € de taxe de séjour en moins par nuit, soit une baisse d’environ 54 %',
  savingsDetail:
    'Pour les voyageurs, cela représente 36,96 € de taxe de séjour en moins sur une semaine.',
  sourceNote: 'Tarifs 2026 du Grand Cahors, taxes additionnelles comprises.',
};

export const CAHORS_VALLEE_LOT_FAQ: LocalFaqItem[] = [
  {
    question:
      'Intervenez-vous aussi autour de Saint-Cirq-Lapopie, du vignoble de Cahors et du Quercy Blanc ?',
    answer:
      'Oui. Cette page couvre le bassin touristique de Cahors et de la vallée du Lot, notamment Cahors, Saint-Cirq-Lapopie, Puy-l’Évêque, Prayssac, Luzech, Montcuq-en-Quercy-Blanc, Lalbenque, Limogne-en-Quercy, le Vignoble de Cahors et le Quercy Blanc.',
  },
  ...CITY_COMMON_FAQ,
];
