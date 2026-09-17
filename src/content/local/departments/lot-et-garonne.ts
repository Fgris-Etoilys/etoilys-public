import type { LocalSource, LocalTableRow } from '../types';

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
