import type { LocalProcedureStep } from '../types';
import { CITY_COMMON_FAQ } from './sharedCityFaq';

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

export const BERGERAC_FAQ = CITY_COMMON_FAQ;
