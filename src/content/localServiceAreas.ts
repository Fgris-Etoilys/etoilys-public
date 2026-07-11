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

export const DORDOGNE_SERVICE_SECTORS = [
  {
    name: 'Bergeracois et sud Dordogne',
    communes: [
      'Bergerac',
      'Prigonrieux',
      'Creysse',
      'La Force',
      'Mouleydier',
      'Gardonne',
      'Monbazillac',
      'Sigoulès-et-Flaugeac',
      'Issigeac',
      'Eymet',
      'Port-Sainte-Foy-et-Ponchapt',
    ],
  },
  {
    name: 'Bastides Dordogne-Périgord',
    communes: [
      'Lalinde',
      'Beaumont-du-Périgord',
      'Monpazier',
      'Le Buisson-de-Cadouin',
      'Trémolat',
      'Limeuil',
      'Couze-et-Saint-Front',
      'Badefols-sur-Dordogne',
      'Molières',
      'Biron',
      'Sainte-Alvère',
    ],
  },
  {
    name: 'Sarlat et Périgord Noir',
    communes: [
      'Sarlat-la-Canéda',
      'Domme',
      'La Roque-Gageac',
      'Beynac-et-Cazenac',
      'Castelnaud-la-Chapelle',
      'Saint-Cyprien',
      'Pays de Belvès',
      'Siorac-en-Périgord',
      'Villefranche-du-Périgord',
      'Daglan',
    ],
  },
  {
    name: 'Vallée de la Vézère et Terrassonnais',
    communes: [
      'Les Eyzies',
      'Montignac-Lascaux',
      'Le Bugue',
      'Rouffignac-Saint-Cernin-de-Reilhac',
      'Saint-Léon-sur-Vézère',
      'Terrasson-Lavilledieu',
      'Thenon',
      'Hautefort',
      'Condat-sur-Vézère',
    ],
  },
  {
    name: 'Périgueux et Périgord central',
    communes: [
      'Périgueux',
      'Boulazac Isle Manoire',
      'Trélissac',
      'Coulounieix-Chamiers',
      'Marsac-sur-l’Isle',
      'Chancelade',
      'Champcevinel',
      'Vergt',
      'Sorges-et-Ligueux-en-Périgord',
      'Savignac-les-Églises',
    ],
  },
  {
    name: 'Vallée de l’Isle, Double et Mussidanais',
    communes: [
      'Saint-Astier',
      'Neuvic',
      'Mussidan',
      'Saint-Médard-de-Mussidan',
      'Montpon-Ménestérol',
      'Saint-Laurent-des-Hommes',
      'Douzillac',
      'Saint-Léon-sur-l’Isle',
      'Villamblard',
      'Sourzac',
    ],
  },
  {
    name: 'Ribéracois, Dronne et Belle',
    communes: [
      'Ribérac',
      'Brantôme-en-Périgord',
      'Bourdeilles',
      'Mareuil en Périgord',
      'Tocane-Saint-Apre',
      'Lisle',
      'Montagrier',
      'Verteillac',
      'La Tour-Blanche-Cercles',
      'Saint-Aulaye-Puymangou',
    ],
  },
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

export const GIRONDE_SERVICE_SECTORS = [
  {
    name: 'Bordeaux Métropole et rive droite',
    communes: [
      'Bordeaux',
      'Mérignac',
      'Pessac',
      'Talence',
      'Bègles',
      'Cenon',
      'Lormont',
      'Floirac',
      'Le Bouscat',
      'Bruges',
      'Eysines',
      'Blanquefort',
      'Ambarès-et-Lagrave',
      'Bouliac',
      'Artigues-près-Bordeaux',
    ],
  },
  {
    name: 'Coteaux bordelais et Saint-Loubès',
    communes: [
      'Tresses',
      'Fargues-Saint-Hilaire',
      'Carignan-de-Bordeaux',
      'Sallebœuf',
      'Yvrac',
      'Sainte-Eulalie',
      'Saint-Loubès',
      'Saint-Sulpice-et-Cameyrac',
      'Beychac-et-Caillau',
      'Montussan',
      'Latresne',
      'Camblanes-et-Meynac',
      'Quinsac',
      'Langoiran',
    ],
  },
  {
    name: 'Montesquieu et sud de Bordeaux',
    communes: [
      'La Brède',
      'Léognan',
      'Martillac',
      'Cadaujac',
      'Beautiran',
      'Saint-Médard-d’Eyrans',
      'Saucats',
      'Ayguemorte-les-Graves',
      'Castres-Gironde',
      'Saint-Selve',
    ],
  },
  {
    name: 'Libournais, Fronsadais et Saint-Émilion',
    communes: [
      'Libourne',
      'Saint-Émilion',
      'Pomerol',
      'Fronsac',
      'La Lande-de-Fronsac',
      'Galgon',
      'Vérac',
      'Coutras',
      'Saint-Denis-de-Pile',
      'Izon',
      'Vayres',
      'Guîtres',
      'Saint-Seurin-sur-l’Isle',
      'Lussac',
      'Puisseguin',
      'Montagne',
      'Saint-Sulpice-de-Faleyrens',
    ],
  },
  {
    name: 'Castillon, Pays Foyen et est girondin',
    communes: [
      'Castillon-la-Bataille',
      'Saint-Magne-de-Castillon',
      'Branne',
      'Rauzan',
      'Gensac',
      'Pujols',
      'Sainte-Foy-la-Grande',
      'Pineuilh',
      'Pellegrue',
      'Saint-Avit-Saint-Nazaire',
      'Eynesse',
    ],
  },
  {
    name: 'Haute-Gironde, Blayais et Cubzaguais',
    communes: [
      'Saint-André-de-Cubzac',
      'Cubzac-les-Ponts',
      'Bourg',
      'Blaye',
      'Saint-Ciers-sur-Gironde',
      'Étauliers',
      'Eyrans',
      'Val-de-Livenne',
      'Braud-et-Saint-Louis',
      'Cavignac',
      'Saint-Savin',
      'Saint-Yzan-de-Soudiac',
      'Laruscade',
    ],
  },
  {
    name: 'Entre-deux-Mers et vallée de la Garonne',
    communes: [
      'Créon',
      'Sadirac',
      'La Sauve',
      'Targon',
      'Sauveterre-de-Guyenne',
      'Monségur',
      'La Réole',
      'Gironde-sur-Dropt',
      'Cadillac-sur-Garonne',
      'Podensac',
      'Cérons',
      'Barsac',
      'Preignac',
      'Langon',
      'Toulenne',
      'Fargues',
      'Roaillan',
      'Bazas',
    ],
  },
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
    question: 'Quels logements peuvent être concernés ?',
    answer:
      'En Gironde, le classement peut concerner un appartement à Bordeaux, une maison de vacances sur le bassin d’Arcachon, un gîte viticole autour de Saint-Émilion, un studio, une résidence secondaire ou une location saisonnière proche du littoral. Le classement porte sur le logement, sous la catégorie officielle de meublé de tourisme.',
  },
  {
    question: 'Peut-on faire classer un gîte en Gironde ?',
    answer:
      'Oui. Un gîte en Gironde peut faire l’objet d’une demande de classement, par exemple dans un secteur viticole, dans l’Entre-deux-Mers, autour de Saint-Émilion ou dans un territoire rural du département. Le mot « gîte » décrit l’usage courant du logement ; la procédure officielle reste celle du meublé de tourisme.',
  },
  {
    question: 'Peut-on faire classer un logement Airbnb en Gironde ?',
    answer:
      'Oui. Un logement proposé sur Airbnb peut être classé si le bien lui-même entre dans le champ des meublés de tourisme. Pour les logements diffusés aussi sur Booking ou Abritel, le principe est le même : le classement s’applique au logement visité, pas à la plateforme.',
  },
  {
    question: 'Un appartement ou un studio en Gironde peut-il être classé ?',
    answer:
      'Oui. Un appartement bordelais, un studio, un logement de vacances sur le littoral ou une résidence secondaire près du bassin d’Arcachon peuvent être classés si les critères de la grille nationale sont respectés. La localisation ne remplace pas l’évaluation du logement lui-même.',
  },
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
    value:
      'Pour les revenus 2026 déclarés en 2027 : 30 % d’abattement, dans la limite de 15 000 € de recettes.',
  },
  {
    key: 'classe',
    label: 'Meublé de tourisme classé',
    value:
      'Pour les revenus 2026 déclarés en 2027 : 50 % d’abattement, dans la limite de 83 600 € de recettes.',
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
    question: 'Quels logements peuvent être concernés ?',
    answer:
      'En Dordogne, le classement peut concerner des logements très variés : gîte rural, maison de vacances en Périgord, appartement à Bergerac, logement familial près de Sarlat ou résidence secondaire louée à la saison. Le nom utilisé dans l’annonce n’est pas déterminant : la procédure officielle porte sur le logement en tant que meublé de tourisme.',
  },
  {
    question: 'Peut-on faire classer un gîte en Dordogne ?',
    answer:
      'Oui. Un gîte situé en Dordogne peut faire l’objet d’une demande de classement s’il correspond à un logement meublé proposé à une clientèle de passage. Le terme « gîte » est très courant en Périgord, mais le classement officiel reste celui des meublés de tourisme.',
  },
  {
    question: 'Peut-on faire classer un logement Airbnb en Dordogne ?',
    answer:
      'Oui. Un logement diffusé sur Airbnb peut être classé si le logement lui-même répond au cadre du meublé de tourisme. La même logique vaut pour une annonce publiée sur Booking ou Abritel : la plateforme ne change pas la nature de la visite de classement.',
  },
  {
    question: 'Un appartement ou un studio en Dordogne peut-il être classé ?',
    answer:
      'Oui. Un appartement à Bergerac, un studio, une petite maison de vacances ou un logement proche de Sarlat peuvent être classés si les critères applicables sont réunis. La visite tient compte de la configuration réelle du logement, de ses équipements et de sa capacité.',
  },
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
