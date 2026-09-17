import type { LocalFaqItem, LocalV6EditorialNotice, LocalV6TaxModule } from '../types';
import { BERGERAC_FAQ } from './bergerac';

export const BORDEAUX_SERVICE_COMMUNES = [
  'Bordeaux',
  'Mérignac',
  'Pessac',
  'Talence',
  'Bègles',
  'Le Bouscat',
  'Bruges',
  'Cenon',
  'Floirac',
  'Lormont',
  'Villenave-d’Ornon',
  'Gradignan',
] as const;

export const BORDEAUX_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'À Bordeaux, mieux se différencier peut aussi coûter moins cher à vos voyageurs',
  highlightedTitleText: 'moins cher à vos voyageurs',
  paragraphs: [
    'Bordeaux attire aussi bien les voyageurs venus profiter de la ville que ceux qui souhaitent découvrir les vignobles et le reste de la Gironde. Face à une offre de locations saisonnières particulièrement dense, le classement donne à votre logement un repère officiel qui peut l’aider à mieux se distinguer au moment de réserver.',
    'À Bordeaux Métropole, cet intérêt se retrouve aussi très concrètement dans la taxe de séjour. Pour une réservation à 150 € la nuit hors taxe de séjour et quatre adultes, un meublé classé 2 étoiles représente 5,04 € de taxe de séjour en moins par nuit, soit 35,28 € économisés sur une semaine.',
  ],
  exampleLabel: 'Exemple à Bordeaux',
  exampleTitle: 'Taxe de séjour pour 4 adultes',
  exampleSubtitle: 'Logement à 150 € la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '10,80 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '5,76 € par nuit' },
  ],
  savingsHeadline: '5,04 € de taxe de séjour en moins par nuit, soit une baisse d’environ 47 %',
  savingsDetail:
    'Pour les voyageurs, cela représente 35,28 € de taxe de séjour en moins sur une semaine.',
  sourceNote: 'Tarifs 2026 de Bordeaux Métropole, taxes additionnelles comprises.',
};

export const BORDEAUX_LOCAL_NOTICE: LocalV6EditorialNotice = {
  title: 'À Bordeaux, quelques règles locales à connaître',
  paragraphs: [
    'Le classement de votre meublé est indépendant de certaines démarches locales liées à la location touristique. À Bordeaux, pensez notamment à vérifier les règles applicables concernant l’enregistrement, la résidence principale et, selon votre situation, le changement d’usage.',
  ],
  items: [
    'le numéro d’enregistrement obligatoire pour la location d’un logement entier ;',
    'la limite de 90 jours par année civile lorsqu’il s’agit de la résidence principale ;',
    'l’autorisation de changement d’usage applicable aux résidences secondaires, avec une éventuelle compensation selon la situation du bien.',
  ],
  conclusion:
    'Ces formalités restent indépendantes du classement et doivent être vérifiées auprès de la Ville de Bordeaux avant la mise en location.',
  source: {
    label: 'Consulter le guide propriétaire de la Ville de Bordeaux',
    href: 'https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires',
  },
};

export const BORDEAUX_FAQ: LocalFaqItem[] = [
  ...BERGERAC_FAQ,
  {
    question: 'Le classement me permet-il automatiquement de louer mon logement à Bordeaux ?',
    answer:
      'Non. Le classement et les formalités locales sont deux démarches distinctes. Selon votre logement, vous devez notamment vérifier le numéro d’enregistrement, la limite applicable à une résidence principale et les règles de changement d’usage.',
  },
];
