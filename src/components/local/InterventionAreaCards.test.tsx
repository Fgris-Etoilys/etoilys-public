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
  coverageMode: 'sectors',
  displayOrder: 10,
  description: 'Page départementale Dordogne.',
  hubLinkLabel: 'Classement en Dordogne →',
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
  coverageMode: 'sectors',
  displayOrder: 20,
  description: 'Page départementale Gironde.',
  hubLinkLabel: 'Classement en Gironde →',
  localPages: [],
};

const fixtureAreas = [dordogneArea, girondeArea];

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

  it('renders one focusable department destination per entry', () => {
    renderCards(fixtureAreas);

    expect(screen.getByRole('link', { name: 'Classement en Dordogne' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-dordogne'
    );
    expect(screen.getByRole('link', { name: 'Classement en Gironde' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-gironde'
    );
    expect(
      document.querySelectorAll('a[href="/classement-meuble-tourisme-dordogne"]')
    ).toHaveLength(1);
  });

  it('keeps local child links in a separate tinted footer', () => {
    renderCards([dordogneArea]);

    const card = screen.getByRole('heading', { name: 'Dordogne' }).closest('article');
    expect(card).toBeTruthy();
    expect(card).toHaveClass('flex', 'h-full', 'flex-col');
    expect(screen.getByRole('link', { name: 'Classement en Dordogne' })).toHaveClass('flex-1');
    const footer = within(card as HTMLElement)
      .getByText('Dans ce département')
      .closest('footer');
    expect(footer).toBeTruthy();
    expect(footer).toHaveClass('shrink-0');
    expect(within(footer as HTMLElement).getByRole('link', { name: /Bergerac/ })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
  });

  it('keeps the department focus ring inside the clipped card', () => {
    renderCards([dordogneArea]);

    expect(screen.getByRole('link', { name: 'Classement en Dordogne' })).toHaveClass(
      'outline-offset-[-3px]',
      'focus-visible:outline'
    );
  });

  it('does not render an empty local child footer for departments without children', () => {
    renderCards([girondeArea]);

    const card = screen.getByRole('heading', { name: 'Gironde' }).closest('article');
    expect(within(card as HTMLElement).queryByText('Dans ce département')).not.toBeInTheDocument();
  });

  it('does not nest anchors', () => {
    renderCards([dordogneArea]);

    expect(document.querySelector('a a')).toBeNull();
  });

  it('can render department titles below a regional heading level', () => {
    renderCards([dordogneArea], { departmentHeadingLevel: 4 });

    expect(screen.getByRole('heading', { level: 4, name: 'Dordogne' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: 'Dordogne' })).not.toBeInTheDocument();
  });
});
