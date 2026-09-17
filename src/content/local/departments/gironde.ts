import type { LocalFaqItem, LocalProcedureStep, LocalSource, LocalTableRow } from '../types';

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
      'Non. Le classement ne remplace pas les formalités déclaratives ou d’enregistrement applicables localement. Les [prérequis au classement](/prerequis-au-classement) présentent les principaux points à vérifier.',
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
