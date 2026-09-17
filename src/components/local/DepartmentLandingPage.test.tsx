import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentLandingPage from './DepartmentLandingPage';
import type { LocalLandingPageV6DepartmentConfig } from '../../content/local/types';
import { trackCtaClick } from '../../utils/analytics';
import {
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION,
  LOCAL_V6_DEPARTMENT_HERO_INDEXES,
  LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
} from '../../content/local/v6Pages';

vi.mock('../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../utils/analytics')>()),
  trackCtaClick: vi.fn(),
}));

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
    vi.mocked(trackCtaClick).mockClear();
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

  it('uses the shared department hero copy and localized image captions', () => {
    [
      DORDOGNE_LOCAL_LANDING_PAGE_V6,
      GIRONDE_LOCAL_LANDING_PAGE_V6,
      LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
    ].forEach((config) => {
      expect(config.hero.description).toBe(LOCAL_V6_DEPARTMENT_HERO_DESCRIPTION);
      expect(config.hero.image.index).toBe(LOCAL_V6_DEPARTMENT_HERO_INDEXES[config.departmentId]);
    });

    const { unmount } = renderDepartmentPage(GIRONDE_LOCAL_LANDING_PAGE_V6);
    expect(screen.getByText('Saint-Émilion, Gironde')).toBeInTheDocument();
    expect(screen.getByText('33 / LA GIRONDE')).toBeInTheDocument();
    expect(screen.getByAltText('Front de mer et promenade à Arcachon')).toBeInTheDocument();
    expect(screen.getByText('Front de mer d’Arcachon.')).toBeInTheDocument();
    unmount();

    renderDepartmentPage(LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6);
    expect(screen.getByText('Nérac, Lot-et-Garonne')).toBeInTheDocument();
    expect(screen.getByText('47 / LOT-ET-GARONNE')).toBeInTheDocument();
    expect(
      screen.getByAltText('Tour horloge et maisons de pierre à Monflanquin')
    ).toBeInTheDocument();
    expect(screen.getByText('Monflanquin, Lot-et-Garonne.')).toBeInTheDocument();
  });

  it('keeps department FAQ shared, deduplicated and free of retired tariff copy', () => {
    const girondeQuestions = GIRONDE_LOCAL_LANDING_PAGE_V6.faq.items.map((item) => item.question);
    const lotEtGaronneQuestions = LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6.faq.items.map(
      (item) => item.question
    );

    expect(new Set(girondeQuestions).size).toBe(girondeQuestions.length);
    expect(new Set(lotEtGaronneQuestions).size).toBe(lotEtGaronneQuestions.length);
    expect(girondeQuestions[0]).toBe('Intervenez-vous dans ma commune en Gironde ?');
    expect(girondeQuestions).toContain(
      'Etoilys intervient-il sur le Bassin d’Arcachon ou le littoral médocain ?'
    );
    expect(lotEtGaronneQuestions[0]).toBe(
      'Intervenez-vous dans ma commune dans le Lot-et-Garonne ?'
    );

    renderDepartmentPage(LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6);
    expect(document.body).not.toHaveTextContent(/Aucun tarif fixe/i);
  });

  it('switches FAQ background when a local notice exists without a local tax module', () => {
    renderDepartmentPage({
      ...DORDOGNE_LOCAL_LANDING_PAGE_V6,
      localNotice: {
        title: 'Notice locale de test',
        paragraphs: ['Texte de notice.'],
      },
    });

    expect(
      screen.getByRole('heading', { name: 'Notice locale de test' }).closest('section')
    ).toHaveClass('bg-paper');
    expect(
      screen
        .getByRole('heading', { name: 'Questions fréquentes sur le classement en Dordogne' })
        .closest('section')
    ).toHaveClass('bg-surface-neutral');
  });

  it('keeps FAQ on paper when no local module or notice exists', () => {
    renderDepartmentPage(DORDOGNE_LOCAL_LANDING_PAGE_V6);

    expect(
      screen
        .getByRole('heading', { name: 'Questions fréquentes sur le classement en Dordogne' })
        .closest('section')
    ).toHaveClass('bg-paper');
  });

  it.each([GIRONDE_LOCAL_LANDING_PAGE_V6, LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6])(
    'keeps migrated department CTA analytics on white buttons',
    (config) => {
      renderDepartmentPage(config);
      const conversionLinks = screen.getAllByRole('link', { name: 'Demander mon classement' });
      const heroCta = conversionLinks[0];
      const finalCta = conversionLinks[conversionLinks.length - 1];
      if (!heroCta || !finalCta) throw new Error('Missing conversion links');
      heroCta.addEventListener('click', (event: MouseEvent) => event.preventDefault());
      finalCta.addEventListener('click', (event: MouseEvent) => event.preventDefault());

      fireEvent.click(heroCta);
      expect(trackCtaClick).toHaveBeenLastCalledWith({
        ctaId: 'cta_white_demande_classement',
        destinationPath: '/demande-classement',
      });
      fireEvent.click(finalCta);
      expect(trackCtaClick).toHaveBeenLastCalledWith({
        ctaId: 'cta_white_demande_classement',
        destinationPath: '/demande-classement',
      });
    }
  );
});
