import { createElement, Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LocalFaqItem } from '../types';

export type CityCommonFaqId =
  | 'target-category'
  | 'fiscal-effects'
  | 'grouped-visits'
  | 'urgent-visit'
  | 'classification-delay'
  | 'missing-criteria';

type CityCommonFaqDefinition = LocalFaqItem & {
  id: CityCommonFaqId;
};

const CITY_COMMON_FAQ_DEFINITIONS = [
  {
    id: 'target-category',
    question: 'Comment savoir quelle catégorie viser ?',
    answer: createElement(
      Fragment,
      null,
      'Le ',
      createElement(Link, { to: '/simulateur' }, 'simulateur Etoilys'),
      ' permet d’obtenir une première estimation à partir des caractéristiques du logement. Il aide à situer la catégorie visée avant la visite officielle.'
    ),
  },
  {
    id: 'fiscal-effects',
    question: 'Quels sont les effets du classement sur la fiscalité ?',
    answer: createElement(
      Fragment,
      null,
      'Le classement peut ouvrir un cadre fiscal plus favorable pour les meublés de tourisme, notamment en micro-BIC. Vous pouvez estimer l’impact avec le ',
      createElement(Link, { to: '/simulateur-fiscal-classement' }, 'simulateur fiscal'),
      '.'
    ),
  },
  {
    id: 'grouped-visits',
    question: 'Peut-on regrouper la visite de plusieurs gîtes ?',
    answer:
      'Oui. Chaque logement doit être visité séparément, mais plusieurs visites peuvent être organisées le même jour. Indiquez toutes les adresses dans votre demande afin que nous puissions confirmer l’organisation et le tarif applicables.',
  },
  {
    id: 'urgent-visit',
    question: 'Une visite peut-elle être organisée en urgence ?',
    answer:
      'Oui. Une visite prioritaire peut être organisée lorsqu’un inspecteur se déplace spécifiquement pour votre logement. Ce déplacement dédié entraîne un tarif plus élevé que les tarifs standards ou groupés ; le montant est toujours confirmé avant validation.',
  },
  {
    id: 'classification-delay',
    question: 'Sous quel délai obtient-on le classement après la visite ?',
    answer:
      'Les documents officiels sont délivrés sous 7 jours après la visite, si aucun élément complémentaire n’est requis à l’issue de la visite pour valider le classement demandé.',
  },
  {
    id: 'missing-criteria',
    question: 'Que se passe-t-il s’il manque quelques critères après la visite ?',
    answer:
      'Selon la nature du critère, certains justificatifs ou petits compléments peuvent être pris en compte après la visite lorsque le référentiel le permet. Etoilys vous indique précisément ce qui peut encore être transmis, sans garantir une catégorie qui ne serait pas atteinte.',
  },
] as const satisfies readonly CityCommonFaqDefinition[];

export function buildCityCommonFaqItems(
  questionOverrides: Partial<Record<CityCommonFaqId, string>> = {}
) {
  return CITY_COMMON_FAQ_DEFINITIONS.map(({ id, question, answer }) => ({
    question: questionOverrides[id] ?? question,
    answer: answer as ReactNode,
  })) satisfies LocalFaqItem[];
}

export const CITY_COMMON_FAQ = buildCityCommonFaqItems();
