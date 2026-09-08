import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentLandingPage from './DepartmentLandingPage';
import type { DepartmentLandingPageConfig } from '../../content/local/types';
import { DORDOGNE_DEPARTMENT_PAGE } from '../../content/local/departments/dordogne';
import { GIRONDE_DEPARTMENT_PAGE } from '../../content/local/departments/gironde';
import { LOT_ET_GARONNE_DEPARTMENT_PAGE } from '../../content/local/departments/lot-et-garonne';

const COMMUNE_INDEX_FIXTURE = {
  c: [
    { id: '24352', label: 'Ribérac', departmentCode: '24' },
    { id: '24274', label: 'Monbazillac', departmentCode: '24' },
    { id: '24322', label: 'Périgueux', departmentCode: '24' },
  ],
};

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
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => COMMUNE_INDEX_FIXTURE,
      }))
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('keeps shared department wrappers and reuses configured pricing on the dedicated Dordogne page', () => {
    ['ClassementGironde.tsx', 'ClassementLotEtGaronne.tsx'].forEach((fileName) => {
      const source = readPageSource(fileName);

      expect(source).toContain('<DepartmentLandingPage config=');
      expect(source).not.toContain('<section');
      expect(source).not.toContain('SmartImage');
    });
    expect(readPageSource('ClassementDordogne.tsx')).toContain(
      '<DepartmentPricingSection config={DORDOGNE_DEPARTMENT_PAGE.pricing}'
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
    expect(screen.getByRole('link', { name: 'Bergerac →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
    expect(document.body).not.toHaveTextContent(/Cette liste n’est pas exhaustive/i);
    expect(document.body).not.toHaveTextContent(/V1|politique tarifaire|repère éditorial/i);
  });

  it('keeps collapsed Dordogne communes rendered while toggling visibility accessibly', () => {
    renderDepartmentPage(DORDOGNE_DEPARTMENT_PAGE);

    expect(document.body).toHaveTextContent('Gardonne');

    const toggle = screen.getAllByRole('button', { name: '+6 communes' })[0];
    expect(toggle).toBeDefined();
    const firstToggle = toggle!;
    expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(firstToggle);
    expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
    expect(firstToggle).toHaveTextContent('Masquer les 6 communes');
    expect(screen.queryByRole('link', { name: 'Voir la page Bergerac →' })).not.toBeInTheDocument();
  });

  it('resolves Dordogne pricing through partial commune autocomplete and successive searches', async () => {
    renderDepartmentPage(DORDOGNE_DEPARTMENT_PAGE);

    const input = screen.getByRole('combobox', { name: 'Commune' });
    fireEvent.change(input, { target: { value: 'Rib' } });

    expect(await screen.findByRole('option', { name: 'Ribérac' })).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Tarif applicable à Ribérac')).toBeInTheDocument();
    expect(
      screen.getByText(/Le montant applicable est confirmé avant tout engagement/)
    ).toBeInTheDocument();
    expect(screen.getByText('Tarif public')).toBeInTheDocument();
    expect(screen.getAllByText(/240\s€/)).not.toHaveLength(0);

    fireEvent.change(input, { target: { value: 'Mon' } });
    const monbazillac = await screen.findByRole('option', { name: 'Monbazillac' });
    fireEvent.mouseDown(monbazillac);

    expect(input).toHaveValue('Monbazillac');
    expect(screen.getByText('Tarif applicable à Monbazillac')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Pér' } });
    expect(await screen.findByRole('option', { name: 'Périgueux' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Tarif applicable à Périgueux')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/data/communes-dordogne-index.v1.json', {
      signal: expect.any(AbortSignal),
    });
  });

  it('keeps the Dordogne picker scoped to Dordogne communes', async () => {
    renderDepartmentPage(DORDOGNE_DEPARTMENT_PAGE);

    const input = screen.getByRole('combobox', { name: 'Commune' });
    fireEvent.change(input, { target: { value: 'Bordeaux' } });
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByRole('option', { name: 'Bordeaux' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Bordeaux se situe/i)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Versailles' } });
    expect(screen.queryByRole('option', { name: 'Versailles' })).not.toBeInTheDocument();
    expect(screen.queryByText(/Versailles se situe/i)).not.toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Découvrez toutes nos zones d’intervention.' })
    ).toHaveAttribute('href', '/zones-intervention');
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
