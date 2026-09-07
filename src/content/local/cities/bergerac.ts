import type { LocalFaqItem, LocalProcedureStep } from '../types';

export const BERGERAC_SERVICE_COMMUNES = [
  'Bergerac',
  'Creysse',
  'Prigonrieux',
  'Monbazillac',
  'Cours-de-Pile',
  'Lembras',
  'Mouleydier',
  'La Force',
  'Gardonne',
  'Sigoulès-et-Flaugeac',
  'Issigeac',
  'Eymet',
  'Lalinde',
];

export const BERGERAC_PROCEDURE_STEPS: LocalProcedureStep[] = [
  {
    number: 1,
    title: 'Vous envoyez votre demande',
    description:
      'Remplissez le formulaire en 30 secondes. Un inspecteur proche de chez vous vous recontacte sous 24h ouvrées.',
  },
  {
    number: 2,
    title: 'Nous organisons la visite',
    description:
      'Etoilys confirme le tarif et vous propose une date d’intervention dans le secteur de Bergerac.',
  },
  {
    number: 3,
    title: 'Nous réalisons le classement',
    description:
      'La visite est effectuée sur place selon le référentiel officiel. Vous recevez ensuite les documents correspondant au classement obtenu.',
  },
];

export const BERGERAC_FAQ: LocalFaqItem[] = [
  {
    question: 'Comment savoir quelle catégorie viser ?',
    answer:
      'Le [simulateur Etoilys](/simulateur) permet d’obtenir une première estimation à partir des caractéristiques du logement. Il aide à situer la catégorie visée avant la visite officielle.',
  },
  {
    question: 'Quels sont les effets du classement sur la fiscalité ?',
    answer:
      'Le classement peut ouvrir un cadre fiscal plus favorable pour les meublés de tourisme, notamment en micro-BIC. Vous pouvez estimer l’impact avec le [simulateur fiscal](/simulateur-fiscal-classement).',
  },
  {
    question: 'Peut-on regrouper la visite de plusieurs gîtes ?',
    answer:
      'Oui. Chaque logement doit être visité séparément, mais plusieurs visites peuvent être organisées le même jour. Indiquez toutes les adresses dans votre demande afin que nous puissions confirmer l’organisation et le tarif applicables.',
  },
  {
    question: 'Une visite peut-elle être organisée en urgence ?',
    answer:
      'Oui. Une visite prioritaire peut être organisée lorsqu’un inspecteur se déplace spécifiquement pour votre logement. Ce déplacement dédié entraîne un tarif plus élevé que les tarifs standards ou groupés ; le montant est toujours confirmé avant validation.',
  },
  {
    question: 'Sous quel délai obtient-on le classement après la visite ?',
    answer:
      'Les documents officiels sont délivrés sous 7 jours après la visite, si aucun élément complémentaire n’est requis à l’issue de la visite pour valider le classement demandé.',
  },
  {
    question: 'Que se passe-t-il s’il manque quelques critères après la visite ?',
    answer:
      'Selon la nature du critère, certains justificatifs ou petits compléments peuvent être pris en compte après la visite lorsque le référentiel le permet. Etoilys vous indique précisément ce qui peut encore être transmis, sans garantir une catégorie qui ne serait pas atteinte.',
  },
];
