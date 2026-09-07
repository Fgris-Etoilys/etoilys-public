import { Award, Calculator, Percent, PiggyBank } from 'lucide-react';
import type {
  DepartmentLandingPageConfig,
  LocalFaqItem,
  LocalProcedureStep,
  LocalSource,
  LocalTableRow,
} from '../types';

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

export const GIRONDE_DEPARTMENT_PAGE: DepartmentLandingPageConfig = {
  departmentId: 'gironde',
  hero: {
    assetKey: 'girondeHero',
    alt: 'Vue de Saint-Émilion en Gironde',
    eyebrow: 'Gironde',
    h1: 'Classement de gîte et meublé de tourisme en Gironde',
    paragraphs: [
      'Vous louez un appartement, une maison de vacances, un gîte ou une location saisonnière en Gironde ? Etoilys accompagne les propriétaires qui souhaitent demander le classement officiel de leur meublé de tourisme.',
      'Entre Bordeaux, le Libournais, Saint-Émilion, l’Entre-deux-Mers, le Sud-Gironde, le Blayais, le Bassin d’Arcachon et le littoral médocain, la Gironde est un territoire touristique majeur. Dans ce contexte, le classement peut renforcer la lisibilité de votre logement et avoir des effets concrets sur la fiscalité, la taxe de séjour et la présentation de votre offre auprès des voyageurs.',
    ],
    imageClassName: 'h-full w-full object-cover object-center',
    overlayClassName: 'absolute inset-0 bg-black/60',
  },
  benefits: {
    title: 'Les bénéfices concrets du classement pour votre meublé en Gironde',
    paragraphs: [
      'La Gironde attire des clientèles très différentes : séjours urbains à Bordeaux, œnotourisme autour de Saint-Émilion et du Médoc, vacances sur le Bassin d’Arcachon, séjours nature dans l’Entre-deux-Mers, itinérances à vélo, escapades patrimoniales ou familiales.',
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
          'Les étoiles donnent un repère simple et reconnu au voyageur, notamment dans un département où l’offre de meublés, gîtes et locations saisonnières est importante.',
      },
    ],
    cofracDescription:
      'Etoilys réalise les visites officielles de classement en Gironde dans le cadre de son accréditation Cofrac Inspection n°3-2394.',
  },
  tourism: {
    title: 'Une Gironde touristique aux profils de locations très variés',
    introParagraphs: [
      'La Gironde ne se résume pas à Bordeaux. Entre le bassin d’Arcachon, le Médoc, Saint-Émilion, Libourne, l’Entre-deux-Mers et la métropole bordelaise, les propriétaires de meublés de tourisme font face à des situations très différentes.',
      'Certains louent un appartement urbain, d’autres une maison de vacances, un gîte viticole ou une résidence secondaire proche du littoral. Dans tous les cas, le classement permet de donner un cadre officiel au logement et d’éclairer les voyageurs sur son niveau de confort.',
      'Les chiffres publiés par Gironde Tourisme et l’INSEE confirment le poids du tourisme dans le département.',
    ],
    image: {
      assetKey: 'girondeTerritory',
      alt: 'Promenade littorale en Gironde',
    },
    cardTitle: 'Données Gironde',
    rows: GIRONDE_TOURISM_ROWS,
    sourceNote: 'Sources : Gironde Tourisme, Chiffres clés 2025 et Enquête clientèle 2025.',
    afterTitle: 'En Gironde, les meublés de tourisme ne sont pas un marché secondaire',
    afterParagraphs: [
      'Avec 38 % des lits marchands en meublés et locations, la Gironde fait partie des territoires où la location saisonnière occupe une place importante dans l’offre touristique.',
      'En 2024, Gironde Tourisme recensait aussi 46 000 logements entiers proposés à la location sur Airbnb, Booking et Abritel. L’INSEE confirme cette dynamique : la Gironde est le département néo-aquitain qui concentre le plus de nuitées réservées via les plateformes en 2024.',
      'Dans ce contexte, le classement n’est pas seulement une formalité administrative. Il permet à votre logement de s’inscrire dans un cadre officiel, plus lisible pour les voyageurs, et peut avoir des effets concrets sur la fiscalité, la taxe de séjour et les cotisations sociales.',
    ],
  },
  serviceArea: {
    title: 'Classement de meublés en Gironde : les secteurs couverts',
    intro:
      'Etoilys intervient en Gironde sur une zone concentrée autour du Libournais, de la Haute-Gironde, de Bordeaux Métropole, de l’Entre-deux-Mers, de Montesquieu, de la vallée de la Garonne et du nord du Sud-Gironde.',
    sectors: GIRONDE_SERVICE_SECTORS,
    sectorLinks: {
      'Bordeaux Métropole et rive droite': {
        label: 'Voir la page Bordeaux →',
        href: '/classement-meuble-tourisme-bordeaux',
      },
    },
    outro:
      'Cette liste n’est pas exhaustive. Si votre commune n’apparaît pas, vous pouvez tout de même déposer une demande : Etoilys vous confirmera les possibilités d’intervention selon la localisation du logement et l’organisation des tournées.',
  },
  procedure: {
    title: 'Comment se déroule une visite de classement avec Etoilys ?',
    intro:
      'Vous déposez votre demande, nous vérifions le périmètre avec vous, puis la visite est organisée sur place selon la grille officielle.',
    image: {
      assetKey: 'girondeCoast',
      alt: 'Littoral girondin et dune du Pilat',
    },
    steps: GIRONDE_PROCEDURE_STEPS,
    simulatorPrompt: {
      title: 'Vous voulez avoir une première idée du classement possible ?',
      description:
        'Le simulateur Etoilys permet d’estimer la catégorie que votre logement pourrait viser avant une visite officielle sur place.',
    },
  },
  tariff: {
    title: 'Combien coûte une visite de classement en Gironde ?',
    paragraphs: [
      'Le tarif d’une visite dépend de plusieurs éléments simples : la localisation du logement, le délai souhaité, le nombre de meublés à classer et la possibilité de regrouper plusieurs visites dans le même secteur.',
      'Après réception de votre demande, Etoilys vous confirme les modalités d’intervention et le tarif applicable avant toute validation. Vous savez donc à quoi vous engager avant de fixer la visite.',
    ],
  },
  faq: {
    title: 'Questions fréquentes',
    items: GIRONDE_FAQ,
    sectionClassName: 'bg-white py-section',
  },
  finalCta: {
    title: 'Demander le classement de votre meublé en Gironde',
    paragraphs: [
      'Vous louez ou préparez la mise en location d’un meublé de tourisme en Gironde ? Etoilys peut vous accompagner pour organiser la visite de classement.',
      'Déposez votre demande en ligne : nous vous confirmerons les modalités d’intervention, le tarif applicable et les prochaines disponibilités avant toute validation.',
    ],
  },
  sources: GIRONDE_SOURCES,
};
