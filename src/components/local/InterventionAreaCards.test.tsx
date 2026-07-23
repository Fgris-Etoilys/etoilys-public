import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InterventionAreaCards from './InterventionAreaCards';
import type { DepartmentInterventionArea } from '../../content/localServiceAreas';

const dordogneArea: DepartmentInterventionArea = {
  id: 'dordogne',
  name: 'Dordogne',
  path: '/classement-meuble-tourisme-dordogne',
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
  description: 'Page départementale Gironde.',
  localPages: [],
};

const lotEtGaronneArea: DepartmentInterventionArea = {
  id: 'lot-et-garonne',
  name: 'Lot-et-Garonne',
  path: '/classement-meuble-tourisme-lot-et-garonne',
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

function renderCards(areas: DepartmentInterventionArea[]) {
  return render(
    <MemoryRouter>
      <InterventionAreaCards areas={areas} />
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
});
