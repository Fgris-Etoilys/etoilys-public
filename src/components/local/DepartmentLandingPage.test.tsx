import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentLandingPage from './DepartmentLandingPage';
import type {
  DepartmentLandingPageConfig,
  LocalLandingPageV6DepartmentConfig,
} from '../../content/local/types';
import { DORDOGNE_LOCAL_LANDING_PAGE_V6 } from '../../content/local/v6Pages';
import { GIRONDE_DEPARTMENT_PAGE } from '../../content/local/departments/gironde';
import { LOT_ET_GARONNE_DEPARTMENT_PAGE } from '../../content/local/departments/lot-et-garonne';

const COMMUNE_INDEX_FIXTURE = {
  c: [
    { id: '24352', label: 'Ribérac', departmentCode: '24' },
    { id: '24274', label: 'Monbazillac', departmentCode: '24' },
    { id: '24322', label: 'Périgueux', departmentCode: '24' },
  ],
};

function renderDepartmentPage(
  config: DepartmentLandingPageConfig | LocalLandingPageV6DepartmentConfig
) {
  return render(
    <MemoryRouter>
      <DepartmentLandingPage config={config} />
    </MemoryRouter>
  );
}

function readPageSource(fileName: string): string {
  return readFileSync(path.resolve(process.cwd(), 'src', 'pages', 'locales', fileName), 'utf8');
}

function readIndexCss(): string {
  return readFileSync(path.resolve(process.cwd(), 'src', 'index.css'), 'utf8');
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

  it('keeps route pages as thin wrappers and limits V6 to Dordogne for now', () => {
    expect(readPageSource('ClassementDordogne.tsx')).toContain(
      '<DepartmentLandingPage config={DORDOGNE_LOCAL_LANDING_PAGE_V6}'
    );
    expect(readPageSource('ClassementDordogne.tsx')).not.toContain('<section');
    expect(readPageSource('ClassementBergerac.tsx')).toContain(
      '<CityLandingPage config={BERGERAC_LOCAL_LANDING_PAGE_V6}'
    );

    ['ClassementGironde.tsx', 'ClassementLotEtGaronne.tsx'].forEach((fileName) => {
      const source = readPageSource(fileName);

      expect(source).toContain('<DepartmentLandingPage config=');
      expect(source).not.toContain('<section');
      expect(source).not.toContain('SmartImage');
    });
  });

  it('renders Dordogne with the V6 section order and golden-master common blocks', () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de gîtes et meublés de tourisme en Dordogne',
      })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expectHeadingSequence([
      'Classement de gîtes et meublés de tourisme en Dordogne',
      'Pourquoi faire classer votre meublé de tourisme ?',
      'Dans quelles communes de Dordogne intervenons-nous ?',
      'Quel tarif pour classer votre meublé en Dordogne ?',
      'Votre classement en trois étapes',
      'Pourquoi choisir Etoilys pour votre classement ?',
      'Questions fréquentes sur le classement en Dordogne',
      'Demandez le classement de votre meublé en Dordogne',
    ]);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Sélectionnez votre commune' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Sélectionnez votre commune' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Une fiscalité micro-BIC plus favorable' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Une taxe de séjour maîtrisée' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Un repère officiel de qualité' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /Cotisations sociales/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bergerac →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bergerac'
    );
    expect(document.body).not.toHaveTextContent(/V1|politique tarifaire|repère éditorial/i);
  });

  it('keeps the Dordogne intervention and focus contracts on generic V6 classes', () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

    expect(document.querySelector('.local-v6-sector-list')).toBeInTheDocument();
    expect(document.querySelector('.dd-service-area')).toBeNull();
    expect(document.querySelector('.dd-landing')).toBeNull();

    const css = readIndexCss();
    expect(css).toContain('.local-v6-sector-list');
    expect(css).toContain('background: #fff;');
    expect(css).toContain('border: 1px solid rgb(var(--color-ink) / 0.13);');
    expect(css).toContain('border-radius: 12px;');
    expect(css).toContain('padding: 20px 24px;');
    expect(css).toContain(':is(a, button, input, summary):not(.ui-field-error):not(');
    expect(css).toContain('.editorial-focus-inverse *');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('.local-v6-landing *');
  });

  it('keeps collapsed Dordogne communes rendered while toggling visibility accessibly', () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

    expect(document.body).toHaveTextContent('Gardonne');

    const toggle = screen.getAllByRole('button', { name: '+6 communes' })[0];
    expect(toggle).toBeDefined();
    const firstToggle = toggle!;
    expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(firstToggle);
    expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
    expect(firstToggle).toHaveTextContent('Masquer les 6 communes');
  });

  it('preserves Dordogne rich FAQ links and external link attributes', () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

    fireEvent.click(
      screen.getByRole('button', { name: 'Etoilys est-il accrédité pour réaliser le classement ?' })
    );
    expect(
      screen.getByRole('link', { name: 'Consulter notre portée d’accréditation.' })
    ).toHaveAttribute('target', '_blank');
    expect(
      screen.getByRole('link', { name: 'Consulter notre portée d’accréditation.' })
    ).toHaveAttribute('rel', 'noopener noreferrer');

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Mon gîte ou mon logement proposé sur Airbnb peut-il être classé ?',
      })
    );
    expect(screen.getByRole('link', { name: 'Consulter les prérequis.' })).toHaveAttribute(
      'href',
      '/prerequis-au-classement'
    );
  });

  it('resolves Dordogne pricing through partial commune autocomplete and successive searches', async () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

    const input = screen.getByRole('combobox', { name: 'Commune' });
    fireEvent.change(input, { target: { value: 'Rib' } });

    expect(await screen.findByRole('option', { name: 'Ribérac' })).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'true');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Votre meublé à Ribérac')).toBeInTheDocument();
    expect(
      screen.getByText(/Le montant applicable est confirmé avant tout engagement/)
    ).toBeInTheDocument();
    expect(screen.getByText('Tarif public')).toBeInTheDocument();
    expect(
      screen.getByText('Si vous êtes adhérent à un office de tourisme partenaire d’Etoilys.')
    ).toBeInTheDocument();
    expect(screen.getAllByText(/240\s€/)).not.toHaveLength(0);

    fireEvent.change(input, { target: { value: 'Mon' } });
    const monbazillac = await screen.findByRole('option', { name: 'Monbazillac' });
    fireEvent.mouseDown(monbazillac);

    expect(input).toHaveValue('Monbazillac');
    expect(screen.getByText('Votre meublé à Monbazillac')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Pér' } });
    expect(await screen.findByRole('option', { name: 'Périgueux' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Votre meublé à Périgueux')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/data/communes-dordogne-index.v1.json', {
      signal: expect.any(AbortSignal),
    });
  });

  it('keeps the Dordogne picker scoped to Dordogne communes', async () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

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

  it('keeps Gironde and Lot-et-Garonne on the legacy department renderer', () => {
    renderDepartmentPage(GIRONDE_DEPARTMENT_PAGE);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Classement de gîte et meublé de tourisme en Gironde',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voir la page Bordeaux →' })).toHaveAttribute(
      'href',
      '/classement-meuble-tourisme-bordeaux'
    );
    cleanup();

    renderDepartmentPage(LOT_ET_GARONNE_DEPARTMENT_PAGE);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Lot-et-Garonne/);
    expect(screen.queryByRole('link', { name: /Voir la page/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder|à venir|bientôt/i)).not.toBeInTheDocument();
  });
});
