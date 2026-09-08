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
