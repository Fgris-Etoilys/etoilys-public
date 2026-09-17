import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentLandingPage from './DepartmentLandingPage';
import type { LocalLandingPageV6DepartmentConfig } from '../../content/local/types';
import {
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
} from '../../content/local/v6Pages';

const COMMUNE_INDEX_FIXTURE = {
  c: [
    { id: '24352', label: 'Ribérac', departmentCode: '24' },
    { id: '33063', label: 'Bordeaux', departmentCode: '33' },
    { id: '47001', label: 'Agen', departmentCode: '47' },
  ],
};

function renderDepartmentPage(config: LocalLandingPageV6DepartmentConfig) {
  return render(
    <MemoryRouter>
      <DepartmentLandingPage config={config} />
    </MemoryRouter>
  );
}

function readPageSource(fileName: string): string {
  return readFileSync(path.resolve(process.cwd(), 'src', 'pages', 'locales', fileName), 'utf8');
}

function readWrapperSource(fileName: string): string {
  return readFileSync(path.resolve(process.cwd(), 'src', 'components', 'local', fileName), 'utf8');
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

  it('keeps route pages as thin wrappers around V6 configs', () => {
    expect(readWrapperSource('DepartmentLandingPage.tsx')).not.toMatch(/layoutVersion ===|v5|v4/);
    expect(readPageSource('ClassementDordogne.tsx')).toContain(
      '<DepartmentLandingPage config={DORDOGNE_LOCAL_LANDING_PAGE_V6}'
    );
    expect(readPageSource('ClassementGironde.tsx')).toContain(
      '<DepartmentLandingPage config={GIRONDE_LOCAL_LANDING_PAGE_V6}'
    );
    expect(readPageSource('ClassementLotEtGaronne.tsx')).toContain(
      '<DepartmentLandingPage config={LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6}'
    );
  });

  it.each([
    [
      DORDOGNE_LOCAL_LANDING_PAGE_V6,
      'Classement de gîtes et meublés de tourisme en Dordogne',
      'Quel tarif pour classer votre meublé en Dordogne ?',
      '/data/communes-dordogne-index.v1.json',
    ],
    [
      GIRONDE_LOCAL_LANDING_PAGE_V6,
      'Classement de gîtes et meublés de tourisme en Gironde',
      'Quel tarif pour classer votre meublé en Gironde ?',
      '/data/communes-gironde-index.v1.json',
    ],
    [
      LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
      'Classement de gîtes et meublés de tourisme dans le Lot-et-Garonne',
      'Quel tarif pour classer votre meublé dans le Lot-et-Garonne ?',
      '/data/communes-lot-et-garonne-index.v1.json',
    ],
  ])(
    'renders %s with V6 surfaces and its own commune index',
    async (config, h1, pricingTitle, indexUrl) => {
      renderDepartmentPage(config);

      expect(screen.getByRole('heading', { level: 1, name: h1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      expect(screen.getByRole('heading', { name: pricingTitle })).toBeInTheDocument();
      expect(document.querySelector('.local-v6-landing')).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: 'Commune' })).toBeInTheDocument();

      fireEvent.focus(screen.getByRole('combobox', { name: 'Commune' }));
      expect(fetch).toHaveBeenCalledWith(indexUrl, { signal: expect.any(AbortSignal) });
    }
  );

  it('keeps collapsed sector communes rendered and toggled accessibly', () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

    expect(document.body).toHaveTextContent('Gardonne');
    const toggle = screen.getAllByRole('button', { name: '+6 communes' })[0];
    if (!toggle) throw new Error('Missing sector toggle');

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveTextContent('Masquer les 6 communes');
  });
});
