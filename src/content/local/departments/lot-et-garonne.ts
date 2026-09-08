import { Award, Calculator, Percent, PiggyBank } from 'lucide-react';
import type {
  DepartmentLandingPageConfig,
  LocalFaqItem,
  LocalProcedureStep,
  LocalSource,
  LocalTableRow,
} from '../types';

export const LOT_ET_GARONNE_TOURISM_ROWS: LocalTableRow[] = [
  { key: 'meubles', label: 'Meublés dans le Lot-et-Garonne en 2025', value: '1 210' },
  { key: 'lits-meubles', label: 'Lits en meublés en 2025', value: '7 325' },
  {
    key: 'meubles-classes',
    label: 'Part des meublés classés',
    value: '51,9 %',
  },
  {
    key: 'nuits-reservees',
    label: 'Évolution des nuits réservées en 2024',
    value: '+10,2 %',
  },
  { key: 'sejour-moyen', label: 'Durée moyenne de séjour', value: '3,62 jours' },
];

export const LOT_ET_GARONNE_SERVICE_SECTORS = [
  {
    name: 'Agenais et coteaux au nord d’Agen',
    communes: [
      'Agen',
      'Le Passage',
      'Foulayronnes',
      'Pont-du-Casse',
      'Colayrac-Saint-Cirq',
      'Saint-Hilaire-de-Lusignan',
      'Bajamont',
      'Laroque-Timbaut',
      'Beauville',
    ],
  },
  {
    name: 'Confluent, Prayssas et vallée de la Garonne',
    communes: [
      'Aiguillon',
      'Damazan',
      'Port-Sainte-Marie',
      'Prayssas',
      'Clairac',
      'Buzet-sur-Baïse',
      'Saint-Sardos',
      'Bruch',
      'Nicole',
    ],
  },
  {
    name: 'Val de Garonne et Marmandais',
    communes: [
      'Marmande',
      'Tonneins',
      'Sainte-Bazeille',
      'Gontaud-de-Nogaret',
      'Le Mas-d’Agenais',
      'Virazeil',
      'Meilhan-sur-Garonne',
      'Fourques-sur-Garonne',
      'Cocumont',
      'Seyches',
    ],
  },
  {
    name: 'Villeneuvois, Lot-et-Tolzac et vallée du Lot',
    communes: [
      'Villeneuve-sur-Lot',
      'Sainte-Livrade-sur-Lot',
      'Pujols',
      'Casseneuil',
      'Bias',
      'Le Lédat',
      'Penne-d’Agenais',
      'Castelmoron-sur-Lot',
      'Le Temple-sur-Lot',
      'Fongrave',
      'Monclar',
      'Pinel-Hauterive',
      'Tombebœuf',
    ],
  },
  {
    name: 'Fumel et vallée du Lot',
    communes: [
      'Fumel',
      'Monsempron-Libos',
      'Montayral',
      'Saint-Vite',
      'Condezaygues',
      'Saint-Sylvestre-sur-Lot',
      'Tournon-d’Agenais',
      'Dausse',
      'Bourlens',
      'Anthé',
    ],
  },
  {
    name: 'Bastides, Pays de Lauzun et Pays de Duras',
    communes: [
      'Monflanquin',
      'Villeréal',
      'Castillonnès',
      'Cancon',
      'Lauzun',
      'Miramont-de-Guyenne',
      'Duras',
      'Allemans-du-Dropt',
      'Lévignac-de-Guyenne',
      'Monbahus',
      'La Sauvetat-du-Dropt',
      'Cahuzac',
    ],
  },
  {
    name: 'Casteljaloux et Coteaux / Landes de Gascogne nord',
    communes: [
      'Casteljaloux',
      'Pompogne',
      'Bouglon',
      'Grézet-Cavagnan',
      'Villefranche-du-Queyran',
      'Fargues-sur-Ourbise',
      'Antagnac',
      'Poussignac',
      'Ruffiac',
      'Pindères',
    ],
  },
];

export const LOT_ET_GARONNE_PROCEDURE_STEPS: LocalProcedureStep[] = [
  {
    number: 1,
    title: 'Vous déposez une demande en ligne',
    description:
      'Vous indiquez les informations principales : logement, adresse, capacité, situation, coordonnées.',
  },
  {
    number: 2,
    title: 'Un inspecteur reprend contact avec vous',
    description:
      'L’objectif est de vérifier le périmètre, la catégorie visée, les délais et les modalités d’intervention.',
  },
  {
    number: 3,
    title: 'Votre logement est évalué selon la grille officielle',
    description:
      'L’inspecteur se déplace dans votre logement et effectue la visite de contrôle avec vous.',
  },
  {
    number: 4,
    title: 'Vous ajustez votre demande si nécessaire',
    description:
      'À l’issue de la visite, Etoilys vous indique si la catégorie demandée semble atteignable et, si besoin, les points à corriger ou à ajuster.',
  },
  {
    number: 5,
    title: 'Vous recevez les documents de classement',
    description:
      'Après la visite, vous recevez le rapport de contrôle, la grille complétée et la proposition de décision de classement.',
  },
  {
    number: 6,
    title: 'Le classement est valable 5 ans',
    description:
      'Une fois acquis, le classement est valable 5 ans. Vous pouvez ensuite l’utiliser dans vos démarches, vos annonces et vos échanges avec la collectivité.',
  },
];

export const LOT_ET_GARONNE_FAQ: LocalFaqItem[] = [
  {
    question: 'Quels logements peuvent être concernés ?',
    answer:
      'Dans le Lot-et-Garonne, le classement peut concerner un gîte près d’une bastide, une maison familiale dans une vallée, un appartement à Agen, une location saisonnière à Marmande, un logement autour de Villeneuve-sur-Lot ou une résidence secondaire louée à la saison. Le terme officiel reste meublé de tourisme.',
  },
  {
    question: 'Peut-on faire classer un gîte dans le Lot-et-Garonne ?',
    answer:
      'Oui. Un gîte situé dans le Lot-et-Garonne peut faire l’objet d’une demande de classement s’il est meublé et proposé à une clientèle de passage. Cette situation peut concerner des hébergements proches des bastides, des vallées, de Monflanquin ou des principaux secteurs touristiques du département.',
  },
  {
    question: 'Peut-on faire classer un logement Airbnb dans le Lot-et-Garonne ?',
    answer:
      'Oui. Un logement loué sur Airbnb peut être classé si le logement répond au cadre du meublé de tourisme. Une diffusion sur Booking ou Abritel n’empêche pas non plus la démarche : l’évaluation concerne le bien, ses équipements, sa capacité et son niveau de confort.',
  },
  {
    question: 'Un appartement ou un studio dans le Lot-et-Garonne peut-il être classé ?',
    answer:
      'Oui. Un appartement à Agen, un studio à Marmande, un logement à Villeneuve-sur-Lot ou une petite location saisonnière dans une commune rurale peuvent être classés si les critères applicables sont réunis. La grille nationale s’adapte à la typologie du logement évalué.',
  },
  {
    question: 'Etoilys intervient-il à Agen, Villeneuve-sur-Lot ou Marmande ?',
    answer:
      'Oui, Etoilys peut étudier les demandes de classement dans le Lot-et-Garonne, notamment autour d’Agen, Villeneuve-sur-Lot, Marmande, Casteljaloux, Lauzun, Castillonès, Villeréal, Cancon, Damazan et des secteurs proches. Les modalités exactes d’intervention sont confirmées après réception de votre demande.',
  },
  {
    question:
      'Le classement est-il obligatoire pour louer un meublé de tourisme dans le Lot-et-Garonne ?',
    answer:
      'Non, le classement officiel reste une démarche volontaire. En revanche, d’autres obligations peuvent s’appliquer, comme la déclaration en mairie, la taxe de séjour ou certaines règles locales.',
  },
  {
    question: 'Combien de temps le classement est-il valable ?',
    answer: 'Le classement d’un meublé de tourisme est valable 5 ans.',
  },
  {
    question: 'Le classement remplace-t-il la déclaration en mairie ?',
    answer:
      'Non. Le classement et la déclaration en mairie sont deux démarches différentes. Les [prérequis au classement](/prerequis-au-classement) présentent les principaux points à vérifier.',
  },
  {
    question: 'Le classement peut-il avoir un intérêt fiscal ?',
    answer:
      'Oui, pour les propriétaires relevant du micro-BIC, le classement peut créer une différence importante entre meublé classé et non classé. La situation fiscale doit toutefois être vérifiée selon le cas du propriétaire.',
  },
  {
    question: 'Combien coûte une visite de classement dans le Lot-et-Garonne ?',
    answer:
      'Etoilys confirme les modalités d’intervention et le tarif applicable après réception de la demande. Aucun tarif fixe n’est affiché publiquement sur cette page.',
  },
];

export const LOT_ET_GARONNE_SOURCES: LocalSource[] = [
  {
    label: 'Tourisme Lot-et-Garonne — Mémento du Tourisme en Lot-et-Garonne 2025',
    href: 'https://pro.tourisme-lotetgaronne.com/wp-content/uploads/2025/06/TourismeLotetGaronne_ChiffresCles2025.pdf',
  },
  {
    label: 'ADRT Lot-et-Garonne — Classement des meublés de tourisme',
    href: 'https://pro.tourisme-lotetgaronne.com/accompagnement/classement-2/classement-des-meubles-de-tourisme/',
  },
  {
    label: 'Atout France — Classement des meublés de tourisme',
    href: 'https://www.atout-france.fr/fr/classement/meuble-de-tourisme',
  },
  {
    label: 'Direction générale des Entreprises — Les meublés de tourisme',
    href: 'https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-meubles-de-tourisme',
  },
  {
    label: 'Service-Public — Déclaration en mairie des meublés de tourisme',
    href: 'https://www.service-public.fr/particuliers/vosdroits/R14321',
  },
  {
    label: 'Service-Public Entreprendre — Taxe de séjour touristique',
    href: 'https://entreprendre.service-public.gouv.fr/vosdroits/F31635',
  },
];

export const LOT_ET_GARONNE_DEPARTMENT_PAGE: DepartmentLandingPageConfig = {
  departmentId: 'lot-et-garonne',
  hero: {
    assetKey: 'lotEtGaronneHero',
    alt: 'Village du Lot-et-Garonne au bord de l’eau',
    eyebrow: 'Lot-et-Garonne',
    h1: 'Classement de gîte et meublé de tourisme dans le Lot-et-Garonne',
    paragraphs: [
      'Vous louez un gîte, une maison de vacances ou un meublé de tourisme dans le Lot-et-Garonne ? Etoilys vous accompagne pour organiser la visite de classement officielle de votre logement, notamment autour d’Agen, Villeneuve-sur-Lot, Marmande, Casteljaloux, Lauzun ou Villeréal.',
      'Entre hébergements familiaux, maisons de vacances, gîtes ruraux et séjours nature, le département présente une offre touristique diffuse. Dans ce contexte, le classement permet de donner un cadre officiel au logement et de rendre l’offre plus lisible pour les voyageurs.',
    ],
    imageClassName: 'h-full w-full object-cover object-center',
    overlayClassName: 'absolute inset-0 bg-black/50',
  },
  benefits: {
    title: 'Pourquoi faire classer un meublé de tourisme dans le Lot-et-Garonne ?',
    paragraphs: [
      'Le Lot-et-Garonne rassemble des situations de location variées : gîtes, maisons de vacances, logements familiaux, résidences secondaires, hébergements proches des bastides ou locations situées autour des principaux bassins de vie.',
      'Le classement ne sert pas seulement à obtenir des étoiles. Pour un propriétaire, il peut aussi jouer sur la fiscalité, la taxe de séjour, les cotisations sociales et la présentation du logement auprès des voyageurs.',
    ],
    items: [
      {
        icon: Calculator,
        title: 'Fiscalité micro-BIC',
        description:
          'Un meublé classé conserve un cadre micro-BIC plus favorable qu’un meublé non classé, avec un plafond plus élevé et un abattement forfaitaire plus important selon les règles applicables.',
      },
      {
        icon: Percent,
        title: 'Taxe de séjour',
        description:
          'Une taxe de séjour plus lisible, souvent plus avantageuse, et plus simple à présenter à vos voyageurs.',
      },
      {
        icon: PiggyBank,
        title: 'Cotisations sociales',
        description:
          'Si vous relevez du régime micro-social, le classement peut aussi changer le cadre applicable : les meublés de tourisme classés bénéficient d’un taux spécifique de 6 %, sous conditions de seuils.',
      },
      {
        icon: Award,
        title: 'Repère officiel pour les voyageurs',
        description:
          'Les étoiles donnent un repère simple et reconnu au voyageur, notamment dans un département où les gîtes, maisons de vacances et locations saisonnières occupent une place réelle.',
      },
    ],
    cofracDescription:
      'Etoilys réalise les visites officielles de classement dans le Lot-et-Garonne dans le cadre de son accréditation Cofrac Inspection n°3-2394.',
  },
  tourism: {
    title: 'Un territoire rural où les meublés touristiques structurent l’accueil local',
    introParagraphs: [
      'Dans le Lot-et-Garonne, l’hébergement touristique repose largement sur une offre diffuse : maisons de vacances, gîtes, résidences secondaires et logements saisonniers répartis entre vallées, bastides, villages de caractère et pôles urbains comme Agen, Marmande ou Villeneuve-sur-Lot.',
      'Les données du Mémento du Tourisme en Lot-et-Garonne 2025 montrent que les meublés occupent une place réelle dans l’offre locale, avec un parc identifié et une part significative de logements déjà classés.',
    ],
    image: {
      assetKey: 'lotEtGaronneTerritory',
      alt: 'Maison et territoire touristique dans le Lot-et-Garonne',
    },
    cardTitle: 'Données Lot-et-Garonne',
    rows: LOT_ET_GARONNE_TOURISM_ROWS,
    sourceNote:
      'Source : Mémento du Tourisme en Lot-et-Garonne 2025, Tourisme Lot-et-Garonne / SIRTAQUI / Lighthouse.',
    afterTitle: 'Un classement déjà bien installé dans le département',
    afterParagraphs: [
      'Avec plus de la moitié des meublés recensés déjà classés, le classement fait partie des pratiques bien identifiées dans le Lot-et-Garonne. Pour un propriétaire, ce n’est donc pas seulement une démarche administrative : c’est aussi un moyen d’inscrire son logement dans un cadre déjà largement utilisé par l’offre locale.',
      'Dans un territoire où les hébergements sont très variés — gîtes ruraux, maisons de vacances, logements familiaux ou résidences secondaires louées à la saison — le classement apporte un repère commun. Il permet de présenter le logement selon une grille nationale, valable 5 ans, avec une catégorie de 1 à 5 étoiles.',
      'Le classement ne remplace pas la qualité de l’accueil ni la personnalité du bien. Mais dans un département où une part importante des meublés est déjà classée, il peut aider à rendre l’offre plus lisible pour les voyageurs.',
    ],
  },
  serviceArea: {
    title: 'Classement de meublés en Lot-et-Garonne : les secteurs couverts',
    intro:
      'Etoilys intervient dans le Lot-et-Garonne sur une zone couvrant notamment l’Agenais, la vallée de la Garonne, le Val de Garonne, le Villeneuvois, la vallée du Lot, le Fumélois, les bastides du Haut-Agenais, le Pays de Lauzun, le Pays de Duras et le secteur de Casteljaloux.',
    sectors: LOT_ET_GARONNE_SERVICE_SECTORS,
    outro: '',
  },
  procedure: {
    title: 'Comment se déroule une visite de classement avec Etoilys ?',
    intro:
      'Vous déposez votre demande, nous vérifions le périmètre avec vous, puis la visite est organisée sur place selon la grille officielle.',
    image: {
      assetKey: 'lotEtGaronneCanal',
      alt: 'Château et paysage rural dans le Lot-et-Garonne',
    },
    steps: LOT_ET_GARONNE_PROCEDURE_STEPS,
    simulatorPrompt: {
      title: 'Vous voulez avoir une première idée du classement possible ?',
      description:
        'Le simulateur Etoilys permet d’estimer la catégorie que votre logement pourrait viser avant une visite officielle sur place.',
    },
  },
  tariff: {
    title: 'Combien coûte une visite de classement dans le Lot-et-Garonne ?',
    paragraphs: [
      'Le tarif d’une visite dépend de plusieurs éléments simples : la localisation du logement, le délai souhaité, le nombre de meublés à classer et la possibilité de regrouper plusieurs visites dans le même secteur.',
      'Après réception de votre demande, Etoilys vous confirme les modalités d’intervention et le tarif applicable avant toute validation. Vous savez donc à quoi vous engager avant de fixer la visite.',
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    items: LOT_ET_GARONNE_FAQ,
    sectionClassName: 'bg-white py-section',
  },
  finalCta: {
    title: 'Demander le classement de votre meublé dans le Lot-et-Garonne',
    paragraphs: [
      'Vous louez ou préparez la mise en location d’un meublé de tourisme dans le Lot-et-Garonne ? Etoilys peut vous accompagner pour organiser la visite de classement.',
      'Déposez votre demande en ligne : nous vous confirmerons les modalités d’intervention, le tarif applicable et les prochaines disponibilités avant toute validation.',
    ],
  },
  sources: LOT_ET_GARONNE_SOURCES,
};
