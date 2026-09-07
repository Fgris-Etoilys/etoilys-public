import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentLandingPage from './DepartmentLandingPage';
import type { DepartmentLandingPageConfig } from '../../content/local/types';
import { DORDOGNE_DEPARTMENT_PAGE } from '../../content/local/departments/dordogne';
import { GIRONDE_DEPARTMENT_PAGE } from '../../content/local/departments/gironde';
import { LOT_ET_GARONNE_DEPARTMENT_PAGE } from '../../content/local/departments/lot-et-garonne';

function renderDepartmentPage(config: DepartmentLandingPageConfig) {
  return render(
    <MemoryRouter>
      <DepartmentLandingPage config={config} />
    </MemoryRouter>
  );
}

function readPageSource(fileName: string): string {
  return readFileSync(path.resolve(process.cwd(), 'src', 'pages', 'locales', fileName), 'utf8');
}

describe('DepartmentLandingPage', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps routed department pages as thin renderer wrappers', () => {
    ['ClassementDordogne.tsx', 'ClassementGironde.tsx', 'ClassementLotEtGaronne.tsx'].forEach(
      (fileName) => {
        const source = readPageSource(fileName);

        expect(source).toContain('<DepartmentLandingPage config=');
        expect(source).not.toContain('<section');
        expect(source).not.toContain('SmartImage');
      }
    );
  });

  it('renders Dordogne-specific content and links from its config', () => {
    renderDepartmentPage(DORDOGNE_DEPARTMENT_PAGE);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de gîte et meublé de tourisme en Dordogne',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Données Dordogne/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Pages locales en/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voir la page Bergerac →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
    expect(screen.getByRole('link', { name: 'Estimer l’impact fiscal' })).toHaveAttribute(
      'href',
      '/simulateur-fiscal-classement'
    );
    expect(screen.getByRole('link', { name: 'Comparer la taxe de séjour' })).toHaveAttribute(
      'href',
      '/simulateur-taxe-sejour'
    );
  });

  it('renders Gironde-specific city links and linked FAQ answer', () => {
    renderDepartmentPage(GIRONDE_DEPARTMENT_PAGE);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de gîte et meublé de tourisme en Gironde',
      })
    ).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Pages locales en/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voir la page Bordeaux →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bordeaux'
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Le classement remplace-t-il la déclaration en mairie ?' })
    );

    expect(screen.getByRole('link', { name: 'prérequis au classement' })).toHaveAttribute(
      'href',
      '/prerequis-au-classement'
    );
  });

  it('omits local page and sector-link blocks when a department has no children', () => {
    renderDepartmentPage(LOT_ET_GARONNE_DEPARTMENT_PAGE);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Lot-et-Garonne/);
    expect(screen.queryByRole('heading', { name: /Pages locales en/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Voir la page/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder|à venir|bientôt/i)).not.toBeInTheDocument();
  });
});
