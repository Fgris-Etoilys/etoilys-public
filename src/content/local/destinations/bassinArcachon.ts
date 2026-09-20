import type { LocalFaqItem, LocalV6TaxModule } from '../types';
import { CITY_COMMON_FAQ } from '../cities/sharedCityFaq';

export const BASSIN_ARCACHON_SERVICE_COMMUNES = [
  'Arcachon',
  'La Teste-de-Buch',
  'Gujan-Mestras',
  'Le Teich',
  'Biganos',
  'Audenge',
  'Lanton',
  'Andernos-les-Bains',
  'Arès',
  'Lège-Cap-Ferret',
  'Mios',
  'Marcheprime',
] as const;

export const BASSIN_ARCACHON_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'Sur le Bassin, les étoiles peuvent aussi alléger la taxe de séjour',
  highlightedTitleText: 'la taxe de séjour',
  paragraphs: [
    'Du Cap Ferret à Arcachon, en passant par Andernos, Gujan-Mestras ou Pyla-sur-Mer, le Bassin concentre une offre de locations saisonnières particulièrement dense. Dans ce contexte, le classement apporte à votre logement un repère officiel simple à comprendre pour les voyageurs. Il peut aussi avoir un effet très concret sur le coût de leur séjour.',
    'À Arcachon, pour une réservation à 250 € la nuit hors taxe de séjour et six adultes, un meublé non classé représente 13,86 € de taxe de séjour par nuit, contre 7,78 € pour un meublé classé 2 étoiles. Cela représente 6,08 € de moins par nuit, soit 42,56 € sur une semaine.',
  ],
  exampleLabel: 'Exemple à Arcachon',
  exampleTitle: 'Taxe de séjour pour 6 adultes',
  exampleSubtitle: 'Logement à 250 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '13,86 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '7,78 € par nuit' },
  ],
  savingsHeadline: '6,08 € de taxe de séjour en moins par nuit, soit une baisse d’environ 44 %',
  savingsDetail:
    'Pour les voyageurs, cela représente 42,56 € de taxe de séjour en moins sur une semaine.',
  sourceNote: 'Tarifs 2026 d’Arcachon, taxes additionnelles comprises.',
};

export const BASSIN_ARCACHON_FAQ: LocalFaqItem[] = [
  {
    question:
      'Intervenez-vous aussi au Cap Ferret, à Pyla-sur-Mer et dans les autres communes du Bassin ?',
    answer:
      'Oui. Etoilys intervient dans les 12 communes du Bassin d’Arcachon, notamment à Arcachon, La Teste-de-Buch, Gujan-Mestras, Andernos-les-Bains et Lège-Cap-Ferret. Cela couvre également les secteurs de Pyla-sur-Mer, Cazaux, Cap Ferret, Claouey, Le Canon ou L’Herbe.',
  },
  ...CITY_COMMON_FAQ,
];
