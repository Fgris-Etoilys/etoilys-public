import type { LocalFaqItem, LocalV6TaxModule, LocalV6TerritorialModule } from '../types';
import { CITY_COMMON_FAQ } from '../cities/sharedCityFaq';

// Repères vérifiés le 9 novembre 2026 contre le COG 2026 et la liste des 35 communes du portail de
// taxe de séjour du Grand Narbonne. Sélection représentative, pas une délimitation : Etoilys couvre
// tout le département. Narbonne-Plage fait partie de Narbonne ; Gruissan et Leucate, hors du Grand
// Narbonne pour la taxe de séjour, ne sont pas listées.
export const NARBONNE_COTE_DU_MIDI_SERVICE_COMMUNES = [
  'Narbonne',
  'Bages',
  'Peyriac-de-Mer',
  'Sigean',
  'Port-la-Nouvelle',
  'La Palme',
  'Fleury',
  'Coursan',
  'Cuxac-d’Aude',
  'Vinassan',
  'Armissan',
  'Salles-d’Aude',
  'Sallèles-d’Aude',
  'Moussan',
  'Caves',
  'Montredon-des-Corbières',
  'Portel-des-Corbières',
  'Bizanet',
] as const;

// Tarifs officiels du Grand Narbonne au 01/01/2026, vérifiés le 9 novembre 2026 :
// - affiche des tarifs fixes : https://grandnarbonne.taxesejour.fr/portail/293361/download
// - affiche du tarif proportionnel : https://grandnarbonne.taxesejour.fr/portail/293371/download
// Meublé 2 étoiles : 1,30 € par adulte et par nuit, taxes additionnelles de 10 % et 34 % incluses.
// Meublé non classé : 5 % du coût HT par occupant, plafonné à 3,00 € + taxes additionnelles.
// 150 € / 4 occupants = 37,50 € ; 5 % = 1,875 € (plafond non atteint) ; × 1,44 = 2,70 € par adulte.
// Gruissan (forfait pour les classés, portail communal) et Leucate (portail propre) sont hors barème.
// L’exemple suppose quatre adultes non exonérés ; ce détail et les taxes additionnelles restent hors
// du texte visible, volontairement simple.
export const NARBONNE_COTE_DU_MIDI_TAX_MODULE: LocalV6TaxModule = {
  type: 'tax-comparison',
  title: 'À Narbonne, le classement peut alléger la taxe de séjour de vos voyageurs',
  highlightedTitleText: 'taxe de séjour',
  paragraphs: [
    'Du centre historique de Narbonne aux plages de la Côte du Midi, le secteur accueille de nombreux gîtes, maisons de vacances et appartements en location saisonnière. La taxe de séjour donne un exemple concret de ce que le classement peut changer pour vos voyageurs.',
    'À Narbonne, la taxe de séjour d’un meublé non classé dépend du prix de la nuitée. Pour un meublé classé, c’est un montant fixe par personne, selon le nombre d’étoiles.',
    'Sur une réservation à 150 € HT la nuit pour quatre adultes, un meublé classé 2 étoiles permet par exemple à vos voyageurs de payer 5,60 € de taxe de séjour en moins par nuit. Attention : Gruissan et Leucate ont leurs propres modalités, ces montants ne s’y appliquent pas automatiquement.',
  ],
  exampleLabel: 'Exemple à Narbonne en 2026',
  exampleTitle: 'Taxe de séjour pour 4 adultes',
  exampleSubtitle: 'Logement à 150 € HT la nuit',
  comparison: [
    { key: 'unclassified', label: 'Meublé non classé', value: '10,80 € par nuit' },
    { key: 'classified', label: 'Meublé classé 2 étoiles', value: '5,20 € par nuit' },
  ],
  savingsHeadline: '5,60 € de taxe de séjour en moins par nuit, soit une baisse d’environ 52 %',
  savingsDetail:
    'Pour quatre adultes, cela représente 39,20 € de taxe de séjour en moins sur une semaine.',
  sourceNote: 'Tarifs 2026 du Grand Narbonne.',
};

// Sources vérifiées le 9 novembre 2026. Portail communal de déclaration et portail intercommunal de
// taxe de séjour restent distincts. Téléservice national d’enregistrement annoncé par la DGE pour
// le quatrième trimestre 2026, sans date ni ouverture confirmée : revoir la première carte et la
// FAQ sur la déclaration à son ouverture. L’envoi de la décision par courriel vient de la page
// classement de l’office de tourisme, non liée car elle présente des organismes concurrents : la
// carte renvoie vers la page de la Ville de Narbonne, qui donne les coordonnées du service.
export const NARBONNE_COTE_DU_MIDI_TERRITORIAL_MODULE: LocalV6TerritorialModule = {
  type: 'territorial-service',
  title: 'Les démarches utiles pour votre meublé à Narbonne et sur la Côte du Midi',
  intro:
    'Déclaration du meublé, taxe de séjour, mise à jour du classement : plusieurs démarches concernent directement les propriétaires de locations saisonnières à Narbonne. Voici les principaux interlocuteurs et outils locaux à connaître.',
  items: [
    {
      title: 'Déclarer votre meublé à Narbonne',
      body: 'La Ville de Narbonne met à disposition un service de télédéclaration pour les meublés de tourisme. Selon la situation du logement, notamment lorsqu’il ne constitue pas la résidence principale du loueur, une autorisation de changement d’usage peut également être nécessaire. Vérifiez les formalités applicables avant de commercialiser votre logement : le classement officiel ne remplace pas ces démarches.',
      link: {
        label: 'Consulter les démarches de déclaration à Narbonne',
        href: 'https://narbonne.taxesejour.fr/portail/homepage-declaloc',
      },
    },
    {
      title: 'Déclarer la taxe de séjour au Grand Narbonne',
      body: 'Le Grand Narbonne dispose d’un portail dédié à la taxe de séjour au réel. Les hébergeurs concernés y déclarent chaque mois les nuitées commercialisées directement, avant le 15 du mois suivant. Lorsque les plateformes de réservation collectent et reversent la taxe, vérifiez les déclarations restant à effectuer : une déclaration à zéro peut notamment être nécessaire si aucune nuitée n’a été commercialisée directement.',
      link: {
        label: 'Accéder au portail de taxe de séjour du Grand Narbonne',
        href: 'https://grandnarbonne.taxesejour.fr/',
      },
    },
    {
      title: 'Signaler votre classement après la visite',
      body: 'Une fois votre classement obtenu, pensez à faire actualiser la catégorie de votre hébergement auprès du service de taxe de séjour compétent. L’Office de tourisme de la Côte du Midi indique qu’une copie de la décision de classement peut être transmise au service du Grand Narbonne par courriel. Actualisez également le nombre d’étoiles dans vos annonces Airbnb, Booking ou autres plateformes. Si votre logement se situe à Gruissan ou à Leucate, vérifiez les démarches spécifiques auprès de la collectivité concernée.',
      link: {
        label: 'Contacter le service de taxe de séjour du Grand Narbonne',
        href: 'https://www.narbonne.fr/taxe-sejour',
      },
    },
  ],
};

export const NARBONNE_COTE_DU_MIDI_FAQ: LocalFaqItem[] = [
  {
    question: 'Intervenez-vous à Narbonne-Plage et dans les communes autour de Narbonne ?',
    answer:
      'Oui. Etoilys intervient à Narbonne, Narbonne-Plage et dans les communes environnantes, notamment Bages, Peyriac-de-Mer, Sigean, Port-la-Nouvelle, Fleury, Coursan et Vinassan. Nos inspecteurs couvrent également le reste du département de l’Aude. L’organisation de la visite est confirmée selon l’adresse du logement.',
  },
  {
    question: 'Quel tarif pour faire classer plusieurs meublés à Narbonne ?',
    answer:
      'La visite individuelle coûte 240 € TTC, ou 200 € TTC si vous êtes adhérent d’un office de tourisme partenaire d’Etoilys. Pour plusieurs logements, un tarif dégressif peut être proposé sur demande. Précisez le nombre de meublés concernés pour obtenir une proposition adaptée.',
  },
  {
    question: 'Le classement remplace-t-il la déclaration en mairie ?',
    answer:
      'Non. Le classement officiel de 1 à 5 étoiles est distinct des formalités de déclaration ou d’enregistrement du meublé de tourisme. À Narbonne, un service de télédéclaration est proposé par la mairie. Selon la situation de votre logement, d’autres autorisations peuvent également être nécessaires.',
  },
  ...CITY_COMMON_FAQ,
];
