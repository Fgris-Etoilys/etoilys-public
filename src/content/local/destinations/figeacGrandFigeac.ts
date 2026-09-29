import type { LocalFaqItem, LocalV6TaxModule } from '../types';
import { CITY_COMMON_FAQ } from '../cities/sharedCityFaq';

export const FIGEAC_GRAND_FIGEAC_SERVICE_COMMUNES = [
  'Figeac',
  'Cajarc',
  'Marcilhac-sur-Célé',
  'Capdenac-le-Haut',
  'Lacapelle-Marival',
  'Cardaillac',
  'Bagnac-sur-Célé',
  'Espagnac-Sainte-Eulalie',
  'Faycelles',
  'Béduer',
  'Brengues',
  'Corn',
  'Sauliac-sur-Célé',
  'Saint-Sulpice',
] as const;

export const FIGEAC_GRAND_FIGEAC_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'Un exemple concret à Figeac : l’effet du classement sur la taxe de séjour',
  highlightedTitleText: 'taxe de séjour',
  paragraphs: [
    'Dans la partie lotoise du Grand-Figeac, les vallées du Lot et du Célé accueillent des gîtes, maisons de vacances et petits meublés de tourisme autour de Figeac, Cajarc, Marcilhac-sur-Célé ou Lacapelle-Marival. Le classement donne un repère officiel aux voyageurs et peut aussi alléger leur taxe de séjour.',
    'À Figeac, pour une réservation à 150 € la nuit hors taxe de séjour et quatre personnes, un meublé non classé représente 10,80 € de taxe de séjour par nuit, contre 4,90 € pour un meublé classé 2 étoiles.',
  ],
  exampleLabel: 'Exemple à Figeac',
  exampleTitle: 'Taxe de séjour pour 4 personnes',
  exampleSubtitle: 'Logement à 150 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '10,80 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '4,90 € par nuit' },
  ],
  savingsHeadline: '5,90 € de taxe de séjour en moins par nuit, soit une baisse d’environ 55 %',
  savingsDetail:
    'Pour les voyageurs, cela représente 41,30 € de taxe de séjour en moins sur 7 nuits.',
  sourceNote: 'Tarifs 2026 applicables à Figeac, taxes additionnelles comprises.',
};

export const FIGEAC_GRAND_FIGEAC_FAQ: LocalFaqItem[] = [
  {
    question: 'Intervenez-vous à Figeac, Cajarc, Marcilhac-sur-Célé et Lacapelle-Marival ?',
    answer:
      'Oui. Cette page couvre le bassin lotois de Figeac et du Grand-Figeac, notamment Figeac, Cajarc, Marcilhac-sur-Célé, Capdenac-le-Haut, Lacapelle-Marival, Cardaillac, Bagnac-sur-Célé, Espagnac-Sainte-Eulalie, Faycelles, Béduer, Brengues, Corn, Sauliac-sur-Célé et Saint-Sulpice.',
  },
  ...CITY_COMMON_FAQ,
];
