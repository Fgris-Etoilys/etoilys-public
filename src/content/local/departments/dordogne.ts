import type { LocalSource, LocalTableRow } from '../types';

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
  { value: '8 030', label: 'meublés de tourisme' },
  { value: '3 011', label: 'meublés classés' },
  { value: '32 %', label: 'des lits marchands en meublés saisonniers' },
];

const DORDOGNE_VISIBLE_COMMUNE_COUNT = 5;

export const DORDOGNE_V6_SERVICE_SECTORS = DORDOGNE_SERVICE_SECTORS.map((sector) => ({
  name: sector.name,
  visibleCommunes: sector.communes.slice(0, DORDOGNE_VISIBLE_COMMUNE_COUNT),
  collapsedCommunes: sector.communes.slice(DORDOGNE_VISIBLE_COMMUNE_COUNT),
}));

export const DORDOGNE_V5_TOURISM_ROWS: LocalTableRow[] = [
  { key: 'meubles-tourisme', label: 'meublés de tourisme', value: '8 030' },
  { key: 'meubles-classes', label: 'meublés classés', value: '3 011' },
  {
    key: 'part-lits-marchands',
    label: 'des lits marchands en meublés saisonniers',
    value: '32 %',
  },
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
