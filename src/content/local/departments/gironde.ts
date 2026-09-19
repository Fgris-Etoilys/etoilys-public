import type { LocalSource, LocalTableRow } from '../types';

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
    name: 'Bordeaux Métropole',
    communes: [
      'Bordeaux',
      'Mérignac',
      'Pessac',
      'Talence',
      'Bègles',
      'Villenave-d’Ornon',
      'Gradignan',
      'Le Bouscat',
      'Bruges',
      'Blanquefort',
      'Cenon',
      'Lormont',
      'Floirac',
      'Bouliac',
    ],
  },
  {
    name: 'Bassin d’Arcachon et Val de l’Eyre',
    communes: [
      'Arcachon',
      'La Teste-de-Buch',
      'Gujan-Mestras',
      'Le Teich',
      'Biganos',
      'Audenge',
      'Lanton',
      'Andernos-les-Bains',
      'Arès',
      'Lège-Cap-Ferret',
      'Salles',
      'Belin-Béliet',
    ],
  },
  {
    name: 'Médoc, estuaire et littoral atlantique',
    communes: [
      'Lacanau',
      'Carcans',
      'Hourtin',
      'Vendays-Montalivet',
      'Soulac-sur-Mer',
      'Le Verdon-sur-Mer',
      'Lesparre-Médoc',
      'Pauillac',
      'Saint-Estèphe',
      'Margaux-Cantenac',
      'Castelnau-de-Médoc',
      'Saint-Laurent-Médoc',
    ],
  },
  {
    name: 'Libournais, Saint-Émilionnais et Fronsadais',
    communes: [
      'Libourne',
      'Saint-Émilion',
      'Pomerol',
      'Fronsac',
      'Coutras',
      'Saint-Denis-de-Pile',
      'Vayres',
      'Izon',
      'Lussac',
      'Montagne',
      'Puisseguin',
      'Guîtres',
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
      'Braud-et-Saint-Louis',
      'Étauliers',
      'Saint-Savin',
      'Cavignac',
      'Saint-Yzan-de-Soudiac',
      'Laruscade',
      'Val-de-Livenne',
    ],
  },
  {
    name: 'Entre-deux-Mers, Castillonnais et Pays Foyen',
    communes: [
      'Créon',
      'Targon',
      'Sauveterre-de-Guyenne',
      'La Réole',
      'Monségur',
      'Branne',
      'Rauzan',
      'Castillon-la-Bataille',
      'Gensac',
      'Sainte-Foy-la-Grande',
      'Pineuilh',
      'Pellegrue',
    ],
  },
  {
    name: 'Graves, Sauternais et Sud-Gironde',
    communes: [
      'La Brède',
      'Léognan',
      'Martillac',
      'Cadaujac',
      'Beautiran',
      'Cadillac-sur-Garonne',
      'Podensac',
      'Barsac',
      'Preignac',
      'Langon',
      'Saint-Macaire',
      'Sauternes',
      'Bazas',
      'Villandraut',
    ],
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
