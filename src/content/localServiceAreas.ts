export type LocalAreaStatus = 'available' | 'comingSoon';

export interface LocalArea {
  name: string;
  href?: string;
  status: LocalAreaStatus;
  description: string;
}

export interface LocalStatistic {
  value: string;
  label: string;
}

export interface LocalTableRow {
  key: string;
  label: string;
  value: string;
}

export interface LocalProcedureStep {
  number: number;
  title: string;
  description: string;
}

export interface LocalFaqItem {
  question: string;
  answer: string;
}

export interface LocalSource {
  label: string;
  href: string;
}

export const LOCAL_AREAS: LocalArea[] = [
  {
    name: 'Dordogne',
    href: '/classement-meuble-tourisme-dordogne',
    status: 'available',
    description:
      'Classement des meublés de tourisme en Dordogne : informations locales, zones d’intervention, bénéfices du classement et demande en ligne.',
  },
  {
    name: 'Gironde',
    href: '/classement-meuble-tourisme-gironde',
    status: 'available',
    description:
      'Classement des meublés de tourisme en Gironde : informations locales, secteurs d’intervention, bénéfices du classement et demande en ligne.',
  },
  {
    name: 'Lot-et-Garonne',
    href: '/classement-meuble-tourisme-lot-et-garonne',
    status: 'available',
    description:
      'Classement de meublés de tourisme autour d’Agen, Villeneuve-sur-Lot, Marmande et des secteurs proches.',
  },
];

export const LOCAL_COMMUNES = [
  'Bergerac',
  'Sarlat-la-Canéda',
  'Périgueux',
  'Eymet',
  'Issigeac',
  'Lalinde',
  'Monpazier',
  'Domme',
  'Beynac-et-Cazenac',
  'La Roque-Gageac',
  'Les Eyzies',
  'Montignac-Lascaux',
  'Terrasson-Lavilledieu',
  'Nontron',
  'Ribérac',
  'Mussidan',
  'Sainte-Alvère',
  'Beaumont-du-Périgord',
  'Montpon-Ménestérol',
  'Saint-Astier',
  'Neuvic',
  'Vergt',
  'Saint-Aulaye',
  'Sainte-Foy-la-Grande et secteurs proches',
];

export const DORDOGNE_STATISTICS: LocalStatistic[] = [
  { value: '8 030', label: 'meublés de tourisme au 31 décembre 2025' },
  { value: '43 836', label: 'lits en meublés de tourisme' },
  { value: '3 011', label: 'meublés classés' },
  { value: '2 019 186', label: 'nuitées via plateformes en 2024' },
];

export const DORDOGNE_TOURISM_ROWS: LocalTableRow[] = [
  { key: 'meubles-tourisme', label: 'Meublés de tourisme', value: '8 030' },
  { key: 'lits-meubles-tourisme', label: 'Lits en meublés de tourisme', value: '43 836' },
  { key: 'meubles-classes', label: 'Meublés classés', value: '3 011' },
  { key: 'lits-meubles-classes', label: 'Lits en meublés classés', value: '15 195' },
  {
    key: 'lits-marchands',
    label: 'Lits marchands tous hébergements confondus',
    value: '136 932',
  },
  {
    key: 'part-meubles',
    label: 'Part des meublés saisonniers dans les lits marchands',
    value: '32 %',
  },
];

export const GIRONDE_TOURISM_ROWS: LocalTableRow[] = [
  { key: 'lits-touristiques', label: 'Lits touristiques en Gironde en 2024', value: '561 000' },
  { key: 'lits-marchands', label: 'Lits marchands', value: '261 000' },
  {
    key: 'part-meubles-locations',
    label: 'Part des meublés et locations dans les lits marchands',
    value: '38 %',
  },
  {
    key: 'logements-plateformes',
    label: 'Logements entiers proposés sur Airbnb, Booking et Abritel en 2024',
    value: '46 000',
  },
  { key: 'nuitees-touristiques', label: 'Nuitées touristiques en 2025', value: '47,4 M' },
];

export const GIRONDE_PRIORITY_SECTORS = [
  'Bordeaux',
  'Bordeaux Métropole',
  'Libourne',
  'Saint-Émilion',
  'Castillon-la-Bataille',
  'Sainte-Foy-la-Grande',
  'Entre-deux-Mers',
  'Créon',
  'Cadillac',
  'Langon',
  'La Réole',
  'Blaye',
  'Bourg',
  'Coutras',
  'Saint-André-de-Cubzac',
  'Saint-Loubès',
  'Branne',
  'Sauveterre-de-Guyenne',
  'Monségur',
  'Pellegrue',
];

export const GIRONDE_PROCEDURE_STEPS: LocalProcedureStep[] = [
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

export const GIRONDE_FAQ: LocalFaqItem[] = [
  {
    question: 'Le classement d’un meublé de tourisme est-il obligatoire en Gironde ?',
    answer:
      'Non. Le classement est une démarche facultative. Un logement peut être un meublé de tourisme même s’il n’est pas classé. En revanche, le classement peut présenter un intérêt pour la lisibilité du logement, la taxe de séjour et la fiscalité micro-BIC selon la situation du propriétaire.',
  },
  {
    question: 'Le classement remplace-t-il la déclaration en mairie ?',
    answer:
      'Non. Le classement ne remplace pas les formalités déclaratives ou d’enregistrement applicables localement.',
  },
  {
    question: 'Le classement est-il valable partout en France ?',
    answer:
      'Oui, le classement est une démarche officielle nationale. Il attribue une catégorie de 1 à 5 étoiles selon une grille nationale. Les règles locales de location restent toutefois à vérifier commune par commune.',
  },
  {
    question: 'Combien de temps le classement est-il valable ?',
    answer:
      'Le classement est valable 5 ans. Passé ce délai, une nouvelle demande est nécessaire pour conserver le classement.',
  },
  {
    question: 'Etoilys intervient-il à Bordeaux, Libourne et Saint-Émilion ?',
    answer:
      'Oui, Etoilys peut étudier les demandes de classement en Gironde, notamment autour de Bordeaux, Libourne, Saint-Émilion, l’Entre-deux-Mers, le Sud-Gironde et les secteurs proches. La zone exacte d’intervention est confirmée après votre demande.',
  },
  {
    question: 'Etoilys intervient-il sur le Bassin d’Arcachon ou le littoral médocain ?',
    answer:
      'Les demandes situées sur le Bassin d’Arcachon, le littoral médocain ou les secteurs plus éloignés sont étudiées selon la localisation du logement et l’organisation des tournées. Indiquez la commune dans votre demande pour recevoir une réponse claire avant toute validation.',
  },
  {
    question: 'Peut-on faire classer plusieurs logements en même temps ?',
    answer:
      'Oui, mais chaque meublé doit être visité séparément et évalué selon la grille applicable. Si vous avez plusieurs logements, indiquez-le dans votre demande pour organiser la tournée de façon efficace.',
  },
  {
    question: 'Le classement garantit-il plus de réservations ?',
    answer:
      'Non. Le classement donne un repère officiel de confort et de services, mais il ne garantit pas un taux d’occupation, un prix moyen ou une hausse automatique des réservations.',
  },
  {
    question: 'Le classement change-t-il la taxe de séjour ?',
    answer:
      'Il peut changer la façon dont la taxe de séjour est calculée. Les meublés classés relèvent d’un barème par étoile, tandis que les hébergements sans classement ou en attente de classement relèvent en principe d’un calcul proportionnel compris entre 1 % et 5 % du prix de la nuitée par personne, dans la limite du tarif le plus élevé adopté localement.',
  },
];

export const GIRONDE_SOURCES: LocalSource[] = [
  {
    label: 'Gironde Tourisme — Chiffres clés 2025',
    href: 'https://www.gironde-tourisme.com/espace-pro/wp-content/uploads/sites/2/2025/06/Chiffres-cles-2025.pdf',
  },
  {
    label: 'Gironde Tourisme — Enquête clientèle 2025',
    href: 'https://www.gironde-tourisme.com/espace-pro/2026/05/29/enquete-clientele-tourisme-gironde-2025/',
  },
  {
    label:
      'INSEE — En Nouvelle-Aquitaine, les locations de meublés touristiques en forte progression',
    href: 'https://www.insee.fr/fr/statistiques/8673310',
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
  {
    label: 'Bordeaux — Location touristique à Bordeaux, guide propriétaires',
    href: 'https://www.bordeaux.fr/location-touristique-bordeaux--guide-proprietaires',
  },
  {
    label: 'Bordeaux Métropole — Taxe de séjour',
    href: 'https://taxedesejour.bordeaux-metropole.fr/',
  },
  {
    label: 'Grand Saint-Émilionnais — Taxe de séjour',
    href: 'https://grandsaintemilionnais.taxesejour.fr/',
  },
];

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

export const LOT_ET_GARONNE_PRIORITY_SECTORS = [
  'Agen',
  'Villeneuve-sur-Lot',
  'Marmande',
  'Casteljaloux',
  'Fumel',
  'Tonneins',
  'Sainte-Livrade-sur-Lot',
  'Le Passage',
  'Aiguillon',
  'Lauzun',
  'Castillonès',
  'Villeréal',
  'Cancon',
  'Damazan',
  'Monflanquin',
  'Penne-d’Agenais',
  'Pujols',
  'Clairac',
  'Duras',
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
      'Non. Le classement et la déclaration en mairie sont deux démarches différentes. Un meublé classé peut toujours devoir être déclaré selon les règles applicables dans la commune.',
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

export const DORDOGNE_MICRO_BIC_ROWS: LocalTableRow[] = [
  {
    key: 'non-classe',
    label: 'Meublé de tourisme non classé',
    value: '30 % d’abattement, plafond de recettes de 15 000 €',
  },
  {
    key: 'classe',
    label: 'Meublé de tourisme classé',
    value: '50 % d’abattement, plafond de recettes de 77 700 € pour les revenus 2025',
  },
];

export const DORDOGNE_LOCAL_CHECK_ROWS: LocalTableRow[] = [
  {
    key: 'declaration',
    label: 'Déclaration en mairie',
    value:
      'Un meublé de tourisme doit faire l’objet des formalités déclaratives applicables. Les règles évoluent avec la généralisation de l’enregistrement.',
  },
  {
    key: 'taxe-sejour',
    label: 'Taxe de séjour',
    value:
      'Le tarif dépend de la commune ou de l’EPCI, du classement et du mode de calcul appliqué localement.',
  },
  {
    key: 'residence-principale',
    label: 'Résidence principale',
    value:
      'La règle nationale de 120 jours peut être abaissée par certaines communes, dans les conditions prévues par la loi.',
  },
  {
    key: 'residence-secondaire',
    label: 'Résidence secondaire',
    value:
      'Les règles peuvent être différentes, notamment en cas de changement d’usage dans certaines communes.',
  },
  {
    key: 'copropriete',
    label: 'Copropriété',
    value:
      'Le règlement de copropriété peut encadrer ou interdire certains usages. Le classement ne neutralise pas le règlement de l’immeuble.',
  },
  {
    key: 'fiscalite',
    label: 'Fiscalité',
    value:
      'Le classement peut modifier le plafond et l’abattement micro-BIC, mais le bon régime dépend de votre situation.',
  },
  {
    key: 'capacite',
    label: 'Capacité d’accueil',
    value:
      'Un logement de plus de 15 personnes peut entraîner d’autres règles, notamment en matière d’ERP.',
  },
];

export const DORDOGNE_PROCEDURE_STEPS: LocalProcedureStep[] = [
  {
    number: 1,
    title: 'Vous déposez une demande en ligne',
    description:
      'Vous indiquez les informations principales : logement, adresse, capacité, situation, coordonnées.',
  },
  {
    number: 2,
    title: 'Un inspecteur local reprend contact avec vous sous 24h',
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

export const DORDOGNE_FAQ: LocalFaqItem[] = [
  {
    question: 'Le classement d’un meublé de tourisme est-il obligatoire en Dordogne ?',
    answer:
      'Non. Le classement est une démarche facultative. Un logement peut être un meublé de tourisme même s’il n’est pas classé. En revanche, le classement peut présenter un intérêt pour la lisibilité du logement, la taxe de séjour et la fiscalité micro-BIC selon la situation du propriétaire.',
  },
  {
    question: 'Le classement remplace-t-il la déclaration en mairie ?',
    answer:
      'Non. Le classement ne remplace pas les formalités déclaratives ou d’enregistrement applicables localement.',
  },
  {
    question: 'Le classement est-il valable partout en France ?',
    answer:
      'Oui, le classement est une démarche officielle nationale. Il attribue une catégorie de 1 à 5 étoiles selon une grille nationale. Les règles locales de location restent toutefois à vérifier commune par commune.',
  },
  {
    question: 'Combien de temps le classement est-il valable ?',
    answer:
      'Le classement est valable 5 ans. Passé ce délai, une nouvelle demande est nécessaire pour conserver le classement.',
  },
  {
    question: 'Etoilys intervient-il à Sarlat, Bergerac et Périgueux ?',
    answer:
      'Oui, Etoilys intervient en Dordogne, notamment autour de Bergerac, Sarlat-la-Canéda, Périgueux et dans les secteurs touristiques proches. La zone exacte d’intervention est confirmée après votre demande.',
  },
  {
    question: 'Peut-on faire classer plusieurs logements en même temps ?',
    answer:
      'Oui, mais chaque meublé doit être visité séparément et évalué selon la grille applicable. Si vous avez plusieurs logements, indiquez-le dans votre demande pour organiser la tournée de façon efficace.',
  },
  {
    question: 'Le classement garantit-il plus de réservations ?',
    answer:
      'Non. Le classement donne un repère officiel de confort et de services, mais il ne garantit pas un taux d’occupation, un prix moyen ou une hausse automatique des réservations.',
  },
  {
    question: 'Le classement change-t-il la taxe de séjour ?',
    answer:
      'Il peut changer la façon dont la taxe de séjour est calculée. Les meublés classés relèvent d’un barème par étoile, tandis que les hébergements sans classement ou en attente de classement relèvent en principe d’un calcul proportionnel compris entre 1 % et 5 % du prix de la nuitée par personne, dans la limite du tarif le plus élevé adopté localement.',
  },
];

export const DORDOGNE_SOURCES: LocalSource[] = [
  {
    label:
      'Comité départemental du tourisme de la Dordogne — Tableau de bord de suivi de l’économie touristique départementale 2025',
    href: 'https://www.dordogne-perigord-tourisme.fr/app/uploads/dordogne-perigord/2026/05/Tableau-de-bord-2025.pdf',
  },
  {
    label:
      'INSEE — En Nouvelle-Aquitaine, les locations de meublés touristiques en forte progression',
    href: 'https://www.insee.fr/fr/statistiques/8673310',
  },
  {
    label:
      'Ministère de la Transition écologique — Guide pratique 2025 de la réglementation des meublés de tourisme',
    href: 'https://www.ecologie.gouv.fr/sites/default/files/documents/25113_GuidePratique2025MeubleTourisme.pdf',
  },
  {
    label: 'Service-Public — Locations touristiques : de nouvelles règles en 2025 ?',
    href: 'https://www.service-public.gouv.fr/particuliers/actualites/A17883',
  },
  {
    label: 'Service-Public Entreprendre — Taxe de séjour touristique : quels sont les tarifs ?',
    href: 'https://entreprendre.service-public.gouv.fr/vosdroits/F31635',
  },
  {
    label:
      'Comité départemental du tourisme de la Dordogne — Plaquette classement des meublés de tourisme en Dordogne 2025',
    href: 'https://www.dordogne-perigord-tourisme.fr/app/uploads/dordogne-perigord/2025/10/Plaquette-classement-meubles-de-tourisme-Dordogne-2025.pdf',
  },
];
