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

function expectHeadingSequence(expectedHeadings: Array<string | RegExp>) {
  const headings = screen.getAllByRole('heading').map((heading) => heading.textContent ?? '');
  let cursor = -1;

  expectedHeadings.forEach((expectedHeading) => {
    const nextIndex = headings.findIndex((heading, index) => {
      if (index <= cursor) return false;
      return typeof expectedHeading === 'string'
        ? heading === expectedHeading
        : expectedHeading.test(heading);
    });

    expect(
      nextIndex,
      `Missing heading after index ${cursor}: ${String(expectedHeading)}`
    ).toBeGreaterThan(cursor);
    cursor = nextIndex;
  });
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

  it('renders Dordogne with the V5 section order and shared common blocks', () => {
    renderDepartmentPage(DORDOGNE_DEPARTMENT_PAGE);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de gîte et meublé de tourisme en Dordogne',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expectHeadingSequence([
      'Classement de gîte et meublé de tourisme en Dordogne',
      'Pourquoi classer votre meublé ?',
      'Classement de meublés en Dordogne : les secteurs couverts',
      'Quel tarif pour classer votre meublé en Dordogne ?',
      'Votre classement en 3 étapes',
      'Pourquoi choisir Etoilys pour votre classement en Dordogne ?',
      'Un territoire touristique où les meublés ont une vraie place',
      'Questions fréquentes sur le classement en Dordogne',
      'Demander le classement de votre meublé en Dordogne',
    ]);
    expect(screen.getByRole('heading', { name: 'Fiscalité micro-BIC' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Taxe de séjour' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Gagnez en visibilité auprès des voyageurs' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Cotisations sociales/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Pages locales en/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voir la page Bergerac →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
  });

  it('keeps collapsed Dordogne communes rendered while toggling visibility accessibly', () => {
    renderDepartmentPage(DORDOGNE_DEPARTMENT_PAGE);

    expect(document.body).toHaveTextContent('Gardonne');

    const toggle = screen.getAllByRole('button', { name: 'Voir plus de communes' })[0];
    expect(toggle).toBeDefined();
    const firstToggle = toggle!;
    expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(firstToggle);
    expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('resolves Dordogne V1 pricing by postal code and commune without hiding the picker', () => {
    renderDepartmentPage(DORDOGNE_DEPARTMENT_PAGE);

    const input = screen.getByRole('combobox', { name: 'Commune ou code postal' });
    fireEvent.change(input, { target: { value: '24100' } });

    expect(input).toHaveValue('24100');
    expect(screen.getByText('Tarif applicable pour 24100')).toBeInTheDocument();
    expect(screen.getByText('Tarif public')).toBeInTheDocument();
    expect(screen.getAllByText('240 € TTC').length).toBeGreaterThan(0);
    expect(screen.getByText('Adhérent à un office de tourisme partenaire')).toBeInTheDocument();
    expect(screen.getAllByText('200 € TTC').length).toBeGreaterThan(0);

    fireEvent.change(input, { target: { value: 'Bergerac' } });
    fireEvent.mouseDown(screen.getByRole('option', { name: 'Bergerac / 24100' }));

    expect(input).toHaveValue('Bergerac / 24100');
    expect(screen.getByText('Tarif applicable pour Bergerac / 24100')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Nontron' } });
    expect(screen.getByText(/Saisissez un code postal/)).toBeInTheDocument();
    expect(screen.queryByText(/Tarif applicable pour Nontron/i)).not.toBeInTheDocument();
  });

  it('handles partial, other-covered and uncovered postal codes without auto-redirect', () => {
    renderDepartmentPage(DORDOGNE_DEPARTMENT_PAGE);

    const input = screen.getByRole('combobox', { name: 'Commune ou code postal' });
    fireEvent.change(input, { target: { value: '2410' } });
    expect(
      screen.getByText(/Continuez la saisie du code postal sur 5 chiffres/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/n’est pas encore implanté/i)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: '33000' } });
    expect(screen.getByText(/Ce code postal se situe en Gironde/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voir les tarifs en Gironde' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-gironde'
    );

    fireEvent.change(input, { target: { value: '47000' } });
    expect(screen.getByText(/Ce code postal se situe en Lot-et-Garonne/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voir les tarifs en Lot-et-Garonne' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-lot-et-garonne'
    );

    fireEvent.change(input, { target: { value: '78000' } });
    expect(
      screen.getByText('Etoilys n’est pas encore implanté dans ce département.')
    ).toBeInTheDocument();
  });

  it('renders Gironde-specific city links and linked FAQ answer through the legacy renderer', () => {
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
