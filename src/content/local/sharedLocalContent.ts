import type { LocalProcedureStep } from './types';

export const LOCAL_CLASSIFICATION_PROCEDURE_STEPS: LocalProcedureStep[] = [
  {
    number: 1,
    title: 'Vous envoyez votre demande',
    description:
      'Remplissez le formulaire en 30 secondes. Un inspecteur Etoilys vous recontacte sous 24h ouvrées.',
  },
  {
    number: 2,
    title: 'Nous organisons la visite',
    description:
      'Etoilys confirme le tarif et vous propose une date d’intervention dans votre secteur.',
  },
  {
    number: 3,
    title: 'Nous réalisons le classement',
    description:
      'La visite est effectuée sur place selon le référentiel officiel. Vous recevez ensuite les documents correspondant au classement obtenu.',
  },
];

export const LOCAL_CLASSIFICATION_PROCEDURE = {
  title: 'Votre classement en 3 étapes',
  intro: '',
  steps: LOCAL_CLASSIFICATION_PROCEDURE_STEPS,
};

export const LOCAL_V6_HERO_REASSURANCE = [
  'Rappel sous 24 h ouvrées',
  'Visite en moyenne sous deux semaines',
  'Aucun frais de déplacement',
] as const;

export const LOCAL_V6_PRICING_CHECKLIST = [
  'Aucun frais de déplacement : la visite et les documents de classement sont inclus.',
  'Des tarifs dégressifs pour plusieurs meublés visités le même jour dans le même secteur.',
  'Un tarif confirmé avant tout engagement, quelle que soit la catégorie d’étoiles demandée.',
] as const;

export const LOCAL_V6_PROCESS_STEPS: readonly LocalProcedureStep[] = [
  {
    number: 1,
    title: 'Vous nous parlez de votre logement.',
    description:
      'Envoyez vos coordonnées et l’adresse du meublé. Nous vous rappelons sous 24 h ouvrées pour préciser votre projet.',
  },
  {
    number: 2,
    title: 'Nous préparons la visite ensemble.',
    description:
      'Nous confirmons le tarif et les modalités, puis convenons d’une date. La visite a lieu en moyenne sous deux semaines.',
  },
  {
    number: 3,
    title: 'Votre logement est évalué sur place.',
    description:
      'Après le contrôle selon la grille officielle, vous recevez les documents et la proposition de classement.',
  },
];

export const LOCAL_V6_COMMON_PROCEDURE = {
  title: 'Votre classement en trois étapes',
  eyebrow: 'DE LA DEMANDE AUX ÉTOILES',
  steps: LOCAL_V6_PROCESS_STEPS,
  link: {
    href: '/procedure',
    label: 'La procédure en détail',
  },
  note: 'Nos inspecteurs vous accompagnent à chaque étape, de votre demande à la remise des documents de classement.',
} as const;
