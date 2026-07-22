import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentLocalPages from './DepartmentLocalPages';
import type { LocalInterventionPage } from '../../content/localServiceAreas';

const bergeracPage: LocalInterventionPage = {
  id: 'bergerac',
  label: 'Bergerac et le Bergeracois',
  path: '/classement-meuble-tourisme-bergerac',
};

const sarlatPage: LocalInterventionPage = {
  id: 'sarlat',
  label: 'Sarlat et le Périgord Noir',
  path: '/classement-meuble-tourisme-sarlat',
};

function renderDepartmentLocalPages(localPages: LocalInterventionPage[]) {
  return render(
    <MemoryRouter>
      <DepartmentLocalPages departmentName="Dordogne" localPages={localPages} />
    </MemoryRouter>
  );
}

describe('DepartmentLocalPages', () => {
  afterEach(() => {
    cleanup();
  });

  it('returns null with an empty local pages list', () => {
    const { container } = renderDepartmentLocalPages([]);

    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders one accessible crawlable local page link', () => {
    renderDepartmentLocalPages([bergeracPage]);

    expect(screen.getByRole('heading', { name: 'Pages locales en Dordogne' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bergerac et le Bergeracois' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
  });

  it('renders multiple local page links without placeholders', () => {
    renderDepartmentLocalPages([bergeracPage, sarlatPage]);

    expect(screen.getByRole('link', { name: 'Bergerac et le Bergeracois' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
    expect(screen.getByRole('link', { name: 'Sarlat et le Périgord Noir' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-sarlat'
    );
    expect(
      screen.queryByRole('link', { name: /à venir|bientôt|placeholder/i })
    ).not.toBeInTheDocument();
  });
});
