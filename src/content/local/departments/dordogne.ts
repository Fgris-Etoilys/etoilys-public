import { Award, Calculator, Percent, PiggyBank } from 'lucide-react';
import type {
  DepartmentLandingPageConfig,
  DepartmentPricingLocality,
  LocalFaqItem,
  LocalProcedureStep,
  LocalSource,
  LocalTableRow,
} from '../types';
import { LOCAL_CLASSIFICATION_PROCEDURE } from '../sharedLocalContent';

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

export const DORDOGNE_STATISTICS = [
  { value: '8 030', label: 'meublés de tourisme au 31 décembre 2025' },
  { value: '43 836', label: 'lits en meublés de tourisme' },
  { value: '3 011', label: 'meublés classés' },
  { value: '2 019 186', label: 'nuitées via plateformes en 2024' },
];

const DORDOGNE_VISIBLE_COMMUNE_COUNT = 5;

export const DORDOGNE_V5_SERVICE_SECTORS = DORDOGNE_SERVICE_SECTORS.map((sector) => ({
  name: sector.name,
  visibleCommunes: sector.communes.slice(0, DORDOGNE_VISIBLE_COMMUNE_COUNT),
  collapsedCommunes: sector.communes.slice(DORDOGNE_VISIBLE_COMMUNE_COUNT),
}));

export const DORDOGNE_PRICING_SEARCH_LOCALITIES: DepartmentPricingLocality[] = [
  {
    id: 'bergerac',
    label: 'Bergerac',
    postalCode: '24100',
  },
  {
    id: 'perigueux',
    label: 'Périgueux',
    postalCode: '24000',
  },
  {
    id: 'sarlat-la-caneda',
    label: 'Sarlat-la-Canéda',
    postalCode: '24200',
  },
  {
    id: 'lalinde',
    label: 'Lalinde',
    postalCode: '24150',
  },
  {
    id: 'eymet',
    label: 'Eymet',
    postalCode: '24500',
  },
];

export const DORDOGNE_V5_TOURISM_ROWS: LocalTableRow[] = [
  { key: 'meubles-tourisme', label: 'meublés de tourisme au 31 décembre 2025', value: '8 030' },
  { key: 'meubles-classes', label: 'meublés classés', value: '3 011' },
  { key: 'nuitees-plateformes', label: 'nuitées via plateformes en 2024', value: '2 019 186' },
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
      'Non. Le classement ne remplace pas les formalités déclaratives ou d’enregistrement applicables localement. Avant de déposer une demande, vous pouvez consulter les [prérequis au classement](/prerequis-au-classement).',
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

export const DORDOGNE_V5_FAQ: LocalFaqItem[] = [
  {
    question: 'Etoilys intervient-il dans ma commune en Dordogne ?',
    answer:
      'Etoilys intervient dans une large partie de la Dordogne, notamment dans le Bergeracois, le Périgord Noir, le Grand Périgueux, la vallée de la Dordogne et plusieurs secteurs proches. La liste affichée sur cette page sert de repère éditorial et n’est pas un annuaire exhaustif des communes couvertes.',
  },
  {
    question: 'Comment connaître le tarif exact pour mon logement ?',
    answer:
      'Saisissez votre code postal à 5 chiffres dans le module tarifs. Pour cette V1, les codes postaux de Dordogne en 24xxx utilisent la politique tarifaire Dordogne actuellement validée.',
  },
  {
    question: 'Combien de temps faut-il pour organiser la visite ?',
    answer:
      'Après votre demande, Etoilys reprend contact avec vous sous 24h ouvrées pour confirmer le périmètre, le tarif et les prochaines disponibilités. La visite est ensuite organisée selon votre secteur et les tournées prévues.',
  },
  {
    question: 'Que se passe-t-il si des critères manquent ?',
    answer:
      'L’inspecteur vous indique les points constatés pendant la visite. Selon la nature du critère, certains justificatifs ou compléments peuvent être transmis après la visite lorsque le référentiel le permet.',
  },
  {
    question: 'Peut-on regrouper plusieurs logements ?',
    answer:
      'Oui. Chaque meublé doit être visité séparément, mais plusieurs visites peuvent être organisées le même jour dans le même secteur. Indiquez toutes les adresses dans votre demande pour confirmer l’organisation et le tarif applicables.',
  },
  {
    question: 'Le classement est-il obligatoire ?',
    answer:
      'Non. Le classement d’un meublé de tourisme reste une démarche volontaire. Il peut toutefois avoir un intérêt pour la fiscalité micro-BIC, la taxe de séjour et la lisibilité de votre annonce.',
  },
  {
    question: 'Etoilys est-il habilité pour réaliser le classement ?',
    answer:
      'Oui. Etoilys est accrédité Cofrac Inspection n°3-2394 pour réaliser les visites officielles de classement des meublés de tourisme.',
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

export const DORDOGNE_DEPARTMENT_PAGE: DepartmentLandingPageConfig = {
  departmentId: 'dordogne',
  layoutVersion: 'v5',
  hero: {
    assetKey: 'dordogneHero',
    alt: 'Paysage de Dordogne autour d’un secteur touristique',
    eyebrow: 'Dordogne',
    h1: 'Classement de gîte et meublé de tourisme en Dordogne',
    paragraphs: [
      'Vous louez un gîte, une maison de vacances, un appartement ou une location saisonnière en Dordogne ? Etoilys réalise la visite officielle directement dans votre logement, avec une démarche simple et un tarif consultable par commune ou code postal.',
    ],
    imageClassName: 'h-full w-full object-cover object-top',
    overlayClassName: 'absolute inset-0 bg-black/60',
  },
  benefits: {
    title: 'Les bénéfices concrets du classement pour votre meublé en Dordogne',
    paragraphs: [
      'La Dordogne accueille chaque année une clientèle touristique importante, attirée par le Périgord Noir, la vallée de la Dordogne, les bastides, les villages classés, le patrimoine préhistorique, la gastronomie et les séjours nature.',
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
          'Les étoiles donnent un repère simple et reconnu au voyageur, notamment dans un territoire touristique comme la Dordogne, où les gîtes et locations saisonnières sont nombreux.',
      },
    ],
    cofracDescription:
      'Etoilys réalise les visites officielles de classement en Dordogne dans le cadre de son accréditation Cofrac Inspection n°3-2394.',
  },
  tourism: {
    title: 'Un territoire touristique où les meublés ont une vraie place',
    introParagraphs: [
      'En Dordogne, les meublés de tourisme représentent une part importante de l’offre d’hébergement touristique.',
      'Les données touristiques départementales confirment le poids du secteur : fin 2025, la Dordogne comptait :',
    ],
    image: {
      assetKey: 'dordogneLandscape',
      alt: 'Village et paysage de Dordogne',
    },
    cardTitle: 'Données Dordogne',
    rows: DORDOGNE_V5_TOURISM_ROWS,
    sourceNote: 'Source : CDT Dordogne 2025.',
    afterTitle: 'En Dordogne, les meublés de tourisme ne sont pas un marché de niche',
    afterParagraphs: [
      'Avec plus de 8 000 meublés de tourisme recensés fin 2025, la Dordogne fait partie des territoires où la location saisonnière occupe une place importante dans l’offre touristique.',
      'La taxe de séjour varie selon la commune ou l’EPCI. Le classement donne un repère officiel et permet de comparer plus clairement les effets locaux, notamment avec le simulateur de taxe de séjour.',
    ],
  },
  serviceArea: {
    title: 'Classement de meublés en Dordogne : les secteurs couverts',
    intro:
      'Etoilys intervient en Dordogne sur une large zone couvrant notamment le Bergeracois, le Périgord Noir, la vallée de la Dordogne, la vallée de la Vézère, le Grand Périgueux, la vallée de l’Isle, le Ribéracois et une partie du nord-ouest du département.',
    sectors: DORDOGNE_V5_SERVICE_SECTORS,
    sectorLinks: {
      'Bergeracois et sud Dordogne': {
        label: 'Voir la page Bergerac →',
        href: '/classement-meuble-tourisme-bergerac',
      },
    },
    outro:
      'Cette liste n’est pas exhaustive. Si votre commune n’apparaît pas, vous pouvez tout de même déposer une demande : Etoilys vous confirmera les possibilités d’intervention selon la localisation du logement et l’organisation des tournées.',
  },
  procedure: {
    title: LOCAL_CLASSIFICATION_PROCEDURE.title,
    intro: LOCAL_CLASSIFICATION_PROCEDURE.intro,
    image: {
      assetKey: 'dordogneInterior',
      alt: 'Intérieur de maison de vacances',
    },
    steps: LOCAL_CLASSIFICATION_PROCEDURE.steps,
    simulatorPrompt: {
      title: 'Vous voulez avoir une première idée du classement possible ?',
      description:
        'Utilisez le simulateur Etoilys pour estimer la catégorie que votre logement pourrait viser, avant une visite officielle sur place.',
    },
  },
  tariff: {
    title: 'Combien coûte une visite de classement en Dordogne ?',
    paragraphs: [
      'Le tarif d’une visite dépend de plusieurs éléments simples : la localisation du logement, le délai souhaité, le nombre de meublés à classer et la possibilité de regrouper plusieurs visites dans le même secteur.',
      'Après réception de votre demande, Etoilys vous confirme les modalités d’intervention et le tarif applicable avant toute validation. Vous savez donc à quoi vous engager avant de fixer la visite.',
    ],
  },
  pricing: {
    title: 'Quel tarif pour classer votre meublé en Dordogne ?',
    intro:
      'Indiquez une commune de référence ou un code postal. En Dordogne V1, le code postal à 5 chiffres est la référence tarifaire et les codes 24xxx utilisent la politique Dordogne actuellement validée.',
    inputLabel: 'Commune ou code postal',
    placeholder: 'Ex. Bergerac ou 24100',
    defaultPricingProfileId: 'dordogne-standard',
    overrides: {},
    searchLocalities: DORDOGNE_PRICING_SEARCH_LOCALITIES,
  },
  faq: {
    title: 'Questions fréquentes sur le classement en Dordogne',
    items: DORDOGNE_V5_FAQ,
    sectionClassName: 'bg-white py-section',
  },
  finalCta: {
    title: 'Demander le classement de votre meublé en Dordogne',
    paragraphs: [
      'Vous louez ou préparez la mise en location d’un meublé de tourisme en Dordogne ? Etoilys peut vous accompagner pour organiser la visite de classement.',
      'Déposez votre demande en ligne : nous vous confirmerons les modalités d’intervention, le tarif applicable et les prochaines disponibilités avant toute validation.',
    ],
  },
  sources: DORDOGNE_SOURCES,
};
