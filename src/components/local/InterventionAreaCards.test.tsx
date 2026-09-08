import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InterventionAreaCards from './InterventionAreaCards';
import type { DepartmentInterventionArea } from '../../content/local/types';

const dordogneArea: DepartmentInterventionArea = {
  id: 'dordogne',
  name: 'Dordogne',
  path: '/classement-meuble-tourisme-dordogne',
  departmentCode: '24',
  regionId: 'nouvelle-aquitaine',
  status: 'published',
  displayOrder: 10,
  description: 'Page départementale Dordogne.',
  localPages: [
    {
      id: 'bergeracois',
      label: 'Bergerac et le Bergeracois',
      path: '/classement-meuble-tourisme-bergerac',
    },
  ],
};

const girondeArea: DepartmentInterventionArea = {
  id: 'gironde',
  name: 'Gironde',
  path: '/classement-meuble-tourisme-gironde',
  departmentCode: '33',
  regionId: 'nouvelle-aquitaine',
  status: 'published',
  displayOrder: 20,
  description: 'Page départementale Gironde.',
  localPages: [],
};

const lotEtGaronneArea: DepartmentInterventionArea = {
  id: 'lot-et-garonne',
  name: 'Lot-et-Garonne',
  path: '/classement-meuble-tourisme-lot-et-garonne',
  departmentCode: '47',
  regionId: 'nouvelle-aquitaine',
  status: 'published',
  displayOrder: 30,
  description: 'Page départementale Lot-et-Garonne.',
  localPages: [
    {
      id: 'agenais',
      label: 'Agen et l’Agenais',
      path: '/classement-meuble-tourisme-agen',
    },
    {
      id: 'villeneuvois',
      label: 'Villeneuve-sur-Lot et le Villeneuvois',
      path: '/classement-meuble-tourisme-villeneuve-sur-lot',
    },
    {
      id: 'marmandais',
      label: 'Marmande et le Marmandais',
      path: '/classement-meuble-tourisme-marmande',
    },
    {
      id: 'albret',
      label: 'Nérac et l’Albret',
      path: '/classement-meuble-tourisme-nerac',
    },
  ],
};

const fixtureAreas = [dordogneArea, girondeArea, lotEtGaronneArea];
const fiveDepartmentFixture: DepartmentInterventionArea[] = [
  ...fixtureAreas,
  {
    id: 'lot' as DepartmentInterventionArea['id'],
    name: 'Lot',
    path: '/classement-meuble-tourisme-lot',
    departmentCode: '46',
    regionId: 'occitanie',
    status: 'published',
    displayOrder: 40,
    description: 'Page départementale Lot.',
    localPages: [],
  },
  {
    id: 'aveyron' as DepartmentInterventionArea['id'],
    name: 'Aveyron',
    path: '/classement-meuble-tourisme-aveyron',
    departmentCode: '12',
    regionId: 'occitanie',
    status: 'published',
    displayOrder: 50,
    description: 'Page départementale Aveyron.',
    localPages: [],
  },
];

function renderCards(
  areas: DepartmentInterventionArea[],
  options: { departmentHeadingLevel?: 3 | 4 | 5 | 6 } = {}
) {
  const props =
    options.departmentHeadingLevel === undefined
      ? { areas }
      : { areas, departmentHeadingLevel: options.departmentHeadingLevel };

  return render(
    <MemoryRouter>
      <InterventionAreaCards {...props} />
    </MemoryRouter>
  );
}

describe('InterventionAreaCards', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not render an empty local pages block for departments without children', () => {
    renderCards([girondeArea]);

    expect(screen.getByRole('heading', { name: 'Gironde' })).toBeInTheDocument();
    expect(screen.queryByText('Pages locales')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /agen|bergerac|villeneuve/i })
    ).not.toBeInTheDocument();
  });

  it('renders a single local page link directly without subtitle', () => {
    renderCards([dordogneArea]);

    const link = screen.getByRole('link', { name: 'Bergerac et le Bergeracois →' });

    expect(screen.queryByText('Pages locales')).not.toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/classement-meuble-tourisme-bergerac');
  });

  it('renders a subtitle for multiple local pages and limits links to three', () => {
    renderCards(fixtureAreas);

    const girondeHeading = screen.getByRole('heading', { name: 'Gironde' });
    const girondeCard = girondeHeading.parentElement?.parentElement;

    expect(screen.getByRole('link', { name: 'Bergerac et le Bergeracois →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
    expect(screen.getByText('Pages locales')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Agen et l’Agenais →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-agen'
    );
    expect(
      screen.getByRole('link', { name: 'Villeneuve-sur-Lot et le Villeneuvois →' })
    ).toHaveAttribute('href', '/classement-meuble-tourisme-villeneuve-sur-lot');
    expect(screen.getByRole('link', { name: 'Marmande et le Marmandais →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-marmande'
    );
    expect(screen.queryByRole('link', { name: 'Nérac et l’Albret →' })).not.toBeInTheDocument();
    expect(girondeCard).toBeDefined();
    expect(within(girondeCard as HTMLElement).queryByText('Pages locales')).not.toBeInTheDocument();
  });

  it('renders five department cards without dropping department links', () => {
    renderCards(fiveDepartmentFixture);

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(5);
    expect(screen.getByRole('link', { name: 'Consulter la page Dordogne' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-dordogne'
    );
    expect(screen.getByRole('link', { name: 'Consulter la page Aveyron' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-aveyron'
    );
  });

  it('can render department titles below a regional heading level', () => {
    renderCards([dordogneArea], { departmentHeadingLevel: 4 });

    expect(screen.getByRole('heading', { level: 4, name: 'Dordogne' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: 'Dordogne' })).not.toBeInTheDocument();
  });
});
