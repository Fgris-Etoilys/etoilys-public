import type { LocalFaqItem, LocalV6TaxModule, LocalV6TerritorialModule } from '../types';
import { CITY_COMMON_FAQ } from './sharedCityFaq';

// Repères vérifiés le 9 novembre 2026 contre le COG 2026 et le rattachement du dataset de taxe de
// séjour : les 14 communes voisines relèvent de Carcassonne Agglo. Sélection représentative, pas une
// délimitation : Etoilys couvre tout le département.
export const CARCASSONNE_SERVICE_COMMUNES = [
  'Carcassonne',
  'Trèbes',
  'Pennautier',
  'Palaja',
  'Cazilhac',
  'Villemoustaussou',
  'Pezens',
  'Conques-sur-Orbiel',
  'Lavalette',
  'Berriac',
  'Villegailhenc',
  'Villedubert',
  'Cavanac',
  'Roullens',
  'Alairac',
] as const;

// Tarifs officiels de la commune de Carcassonne au 01/01/2026, délibération du 26 juin 2025,
// vérifiés le 9 novembre 2026 :
// - guide des tarifs fixes : https://carcassonne.taxesejour.fr/portail/306541/download
// - guide des tarifs proportionnels : https://carcassonne.taxesejour.fr/portail/306551/download
// - délibération : https://www.carcassonne.fr/actes-administratifs/taxe-de-sejour-fixation-des-tarifs-2026
// Meublé 2 étoiles : 1,44 € par adulte et par nuit, taxes additionnelles de 10 % et 34 % incluses.
// Meublé non classé : 5 % du coût HT par occupant, plafonné à 3,34 € + taxes additionnelles.
// 150 € / 4 occupants = 37,50 € ; 5 % = 1,875 € (plafond non atteint) ; × 1,44 = 2,70 € par adulte.
// L’exemple suppose quatre adultes non exonérés. Ces montants ne valent que pour la commune de
// Carcassonne : l’Agglo applique 1,01 € en 2 étoiles et un plafond de 2,88 €, taxes comprises.
// Délibération du 28 mai 2026 pour les tarifs au 1er janvier 2027 : revoir les mentions « 2026 ».
export const CARCASSONNE_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'À Carcassonne, le classement peut aussi alléger la taxe de séjour',
  highlightedTitleText: 'taxe de séjour',
  paragraphs: [
    'Entre la Cité médiévale, la Bastide Saint-Louis et le canal du Midi, Carcassonne accueille de nombreux gîtes et locations saisonnières. Le classement apporte un repère officiel aux voyageurs et peut aussi réduire le montant de leur taxe de séjour.',
    'À Carcassonne, pour une location à 150 € HT la nuit et quatre adultes, un meublé non classé représente 10,80 € de taxe de séjour par nuit, contre 5,76 € pour un meublé classé 2 étoiles. Soit 5,04 € de moins par nuit pour les voyageurs. Les communes voisines relevant de Carcassonne Agglo disposent d’un barème différent.',
  ],
  exampleLabel: 'Exemple à Carcassonne en 2026',
  exampleTitle: 'Taxe de séjour pour 4 adultes',
  exampleSubtitle: 'Logement à 150 € HT la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '10,80 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '5,76 € par nuit' },
  ],
  savingsHeadline: '5,04 € de taxe de séjour en moins par nuit, soit une baisse d’environ 47 %',
  savingsDetail:
    'Pour quatre adultes, cela représente 35,28 € de taxe de séjour en moins sur une semaine.',
  sourceNote: 'Tarifs 2026 de la commune de Carcassonne, taxes additionnelles comprises.',
};

// Sources vérifiées le 9 novembre 2026. Le paiement mensuel suit le bandeau du portail communal, dont
// la rubrique « Reversement » liste encore des échéances trimestrielles. Le numéro d’enregistrement
// national est annoncé par ce portail pour le quatrième trimestre 2026, sans date ni ouverture
// confirmée : revoir la première carte à son ouverture. Aucune de ces trois pages ne présente
// d’organisme de contrôle concurrent.
export const CARCASSONNE_TERRITORIAL_MODULE: LocalV6TerritorialModule = {
  type: 'territorial-service',
  title: 'Les démarches utiles pour votre meublé à Carcassonne',
  intro:
    'Déclaration du logement, taxe de séjour, prise en compte de votre classement : voici les principaux services à connaître à Carcassonne et dans les communes voisines.',
  items: [
    {
      title: 'Déclarer votre meublé à Carcassonne',
      body: 'La Ville de Carcassonne oriente les propriétaires de meublés de tourisme vers le service DéclaLoc pour leur déclaration préalable en mairie, notamment lorsque le logement n’est pas leur résidence principale. Selon votre situation, d’autres formalités peuvent s’appliquer. Le classement officiel ne remplace pas ces démarches.',
      link: {
        label: 'Consulter les démarches de déclaration à Carcassonne',
        href: 'https://carcassonne.taxesejour.fr/portail/homepage-declaloc',
      },
    },
    {
      title: 'Déclarer et payer la taxe de séjour à Carcassonne',
      body: 'La commune de Carcassonne dispose de son propre portail de taxe de séjour. Les déclarations sont mensuelles et, depuis le 1er octobre 2026, les paiements sont eux aussi effectués chaque mois, au lieu de chaque trimestre. Après un classement ou un renouvellement, pensez à vérifier que la catégorie en étoiles de votre logement est bien prise en compte.',
      link: {
        label: 'Accéder au portail de taxe de séjour de Carcassonne',
        href: 'https://carcassonne.taxesejour.fr/',
      },
    },
    {
      title: 'Trèbes, Palaja, Pennautier : un autre barème',
      body: 'Dans les communes voisines relevant de Carcassonne Agglo, les tarifs et les démarches de taxe de séjour ne sont pas nécessairement ceux de la ville de Carcassonne. L’Agglo publie son propre barème et renvoie vers son portail de déclaration. Vérifiez toujours la collectivité compétente selon l’adresse exacte de votre meublé.',
      link: {
        label: 'Consulter les règles de taxe de séjour de Carcassonne Agglo',
        href: 'https://www.carcassonne-agglo.fr/mon-agglo/elus-et-instances/grand-carcassonne-tourisme/la-taxe-de-sejour/',
      },
    },
  ],
};

export const CARCASSONNE_FAQ: LocalFaqItem[] = [
  {
    question: 'Intervenez-vous à Trèbes, Palaja et dans les communes autour de Carcassonne ?',
    answer:
      'Oui. Etoilys intervient à Carcassonne et dans les communes environnantes, notamment Trèbes, Palaja, Pennautier, Villemoustaussou, Cazilhac, Pezens et Conques-sur-Orbiel. Nos inspecteurs couvrent également le reste de l’Aude, avec un tarif confirmé avant tout engagement.',
  },
  {
    question: 'La taxe de séjour est-elle identique à Carcassonne et dans les communes voisines ?',
    answer:
      'Non. La ville de Carcassonne possède son propre barème et son portail de taxe de séjour. Les autres communes relevant de Carcassonne Agglo utilisent les modalités définies par l’agglomération. Vérifiez toujours les règles applicables à la commune où se situe votre logement.',
  },
  ...CITY_COMMON_FAQ,
];
