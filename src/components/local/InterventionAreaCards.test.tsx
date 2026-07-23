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
    expect(screen.queryByText('Pages locales dédiées')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /agen|bergerac|villeneuve/i })
    ).not.toBeInTheDocument();
  });

  it('renders exactly one child link with the expected path', () => {
    renderCards([dordogneArea]);

    const link = screen.getByRole('link', { name: 'Bergerac et le Bergeracois' });

    expect(screen.getByText('Pages locales dédiées')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/classement-meuble-tourisme-bergerac');
  });

  it('keeps departments without children unchanged when another department has children', () => {
    renderCards(fixtureAreas);

    const girondeHeading = screen.getByRole('heading', { name: 'Gironde' });
    const girondeCard = girondeHeading.parentElement?.parentElement;

    expect(screen.getByRole('link', { name: 'Bergerac et le Bergeracois' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
    expect(screen.getByRole('link', { name: 'Agen et l’Agenais' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-agen'
    );
    expect(
      screen.getByRole('link', { name: 'Villeneuve-sur-Lot et le Villeneuvois' })
    ).toHaveAttribute('href', '/classement-meuble-tourisme-villeneuve-sur-lot');
    expect(girondeCard).toBeDefined();
    expect(
      within(girondeCard as HTMLElement).queryByText('Pages locales dédiées')
    ).not.toBeInTheDocument();
  });
});
