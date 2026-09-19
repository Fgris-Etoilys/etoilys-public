import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentPricingSection, { LocalPricingProfileSummary } from './DepartmentPricingSection';
import { getPricingProfile, PRICING_PROFILES } from '../../content/local/pricing';
import {
  AVEYRON_LOCAL_LANDING_PAGE_V6,
  BORDEAUX_LOCAL_LANDING_PAGE_V6,
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOT_LOCAL_LANDING_PAGE_V6,
} from '../../content/local/v6Pages';
import type { PricingProfile } from '../../content/local/pricing';

const PAYS_FOYEN_GIRONDE_CODES = [
  '33020',
  '33094',
  '33160',
  '33223',
  '33242',
  '33246',
  '33247',
  '33269',
  '33277',
  '33316',
  '33324',
  '33354',
  '33360',
  '33369',
  '33377',
  '33378',
  '33402',
  '33462',
  '33467',
] as const;

function requireFlatProfile(profile: PricingProfile) {
  expect(profile.kind).toBe('flat');
  if (profile.kind !== 'flat') throw new Error('Expected a flat pricing profile');
  return profile;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Department pricing picker', () => {
  it('requires a commune selection and preserves pricing, keyboard search and fallback paths', async () => {
    const config = DORDOGNE_LOCAL_LANDING_PAGE_V6.pricing.picker;
    const profile = requireFlatProfile(getPricingProfile(config.defaultPricingProfileId));
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValue({
        ok: true,
        json: async () => ({ c: [{ id: '24322', label: 'Périgueux', departmentCode: '24' }] }),
      });
    vi.stubGlobal('fetch', fetchMock);

    const { container } = render(
      <MemoryRouter>
        <DepartmentPricingSection config={config} presentation="panel" />
      </MemoryRouter>
    );
    const input = screen.getByRole('combobox', { name: 'Commune' });
    expect(
      screen.getByRole('heading', { level: 3, name: 'Sélectionnez votre commune' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Sélectionnez votre commune' })
    ).not.toBeInTheDocument();
    expect(container.querySelector('.local-v6-pricing-amount')).toBeNull();
    fireEvent.focus(input);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());

    fireEvent.change(input, { target: { value: 'per' } });
    expect(await screen.findByRole('option', { name: 'Périgueux' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByText('Votre meublé à Périgueux')).toBeInTheDocument();
    expect(container.querySelector('.local-v6-pricing-amount')).toHaveTextContent(
      profile.standard.amount
    );
    expect(
      screen.getByText('Si vous êtes adhérent à un office de tourisme partenaire d’Etoilys.')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Demander mon classement' })).toHaveAttribute(
      'href',
      '/demande-classement'
    );
    const multiple = container.querySelector('details');
    expect(multiple).not.toHaveAttribute('open');
    profile.multiProperty?.rows.forEach((row) => expect(multiple).toHaveTextContent(row.amount));

    fireEvent.change(input, { target: { value: 'Commune absente' } });
    expect(container.querySelector('.local-v6-pricing-amount')).toBeNull();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /indiquez votre adresse/i })).toHaveAttribute(
      'href',
      '/demande-classement'
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('keeps the list closed when communes finish loading after blur', async () => {
    const config = GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker;
    let resolvePayload:
      | ((value: { c: Array<{ id: string; label: string; departmentCode: string }> }) => void)
      | null = null;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolvePayload = (value) =>
            resolve({
              ok: true,
              json: async () => value,
            } as Response);
        })
    );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <DepartmentPricingSection config={config} presentation="panel" />
      </MemoryRouter>
    );
    const input = screen.getByRole('combobox', { name: 'Commune' });

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'bor' } });
    fireEvent.blur(input);

    await act(async () => {
      resolvePayload?.({ c: [{ id: '33063', label: 'Bordeaux', departmentCode: '33' }] });
    });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('option', { name: 'Bordeaux' })).not.toBeInTheDocument();
  });

  it('resolves Gironde default communes to tiered pricing and Pays Foyen to Dordogne', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          c: [
            { id: '33063', label: 'Bordeaux', departmentCode: '33' },
            { id: '33402', label: 'Sainte-Foy-la-Grande', departmentCode: '33' },
            { id: '33324', label: 'Pineuilh', departmentCode: '33' },
          ],
        }),
      }))
    );

    const { unmount } = render(
      <MemoryRouter>
        <DepartmentPricingSection
          config={GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker}
          presentation="panel"
        />
      </MemoryRouter>
    );
    let input = screen.getByRole('combobox', { name: 'Commune' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'bor' } });
    expect(await screen.findByRole('option', { name: 'Bordeaux' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Votre meublé à Bordeaux')).toBeInTheDocument();
    expect(screen.getByText('Studio / T1')).toBeInTheDocument();
    expect(screen.getByText(/180\s€/)).toBeInTheDocument();
    expect(screen.getByText('T2 / T3 / T4')).toBeInTheDocument();
    expect(screen.getByText(/200\s€/)).toBeInTheDocument();
    expect(screen.getByText('T5 et plus')).toBeInTheDocument();
    expect(screen.getByText(/250\s€/)).toBeInTheDocument();
    expect(screen.getByText('Renouvellement : -20 %')).toBeInTheDocument();
    expect(
      screen.getByText(/classement initial a été réalisé par Etoilys ou Gironde Tourisme/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/office de tourisme partenaire/i)).not.toBeInTheDocument();
    expect(GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker.defaultPricingProfileId).toBe(
      'gironde-standard'
    );
    expect(GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides['33063']).toBeUndefined();
    unmount();

    render(
      <MemoryRouter>
        <DepartmentPricingSection
          config={GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker}
          presentation="panel"
        />
      </MemoryRouter>
    );
    input = screen.getByRole('combobox', { name: 'Commune' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'sainte foy' } });
    expect(await screen.findByRole('option', { name: 'Sainte-Foy-la-Grande' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(screen.getByText('Votre meublé à Sainte-Foy-la-Grande')).toBeInTheDocument();
    expect(screen.getAllByText(/240\s€/).length).toBeGreaterThan(0);
    expect(screen.queryByText('Studio / T1')).not.toBeInTheDocument();
    expect(GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides['33402']).toBe(
      'dordogne-standard'
    );
    expect(GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides['33324']).toBe(
      'dordogne-standard'
    );
    PAYS_FOYEN_GIRONDE_CODES.forEach((code) => {
      expect(GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides[code]).toBe(
        'dordogne-standard'
      );
    });
    expect(Object.keys(GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides)).toHaveLength(
      PAYS_FOYEN_GIRONDE_CODES.length
    );
  });

  it('renders Bordeaux direct pricing with the shared Gironde tiered values', () => {
    render(
      <MemoryRouter>
        <LocalPricingProfileSummary
          pricingProfile={getPricingProfile(
            BORDEAUX_LOCAL_LANDING_PAGE_V6.pricing.pricingProfileId
          )}
          localityLabel="Bordeaux"
          presentation="direct"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Votre meublé à Bordeaux')).toBeInTheDocument();
    expect(screen.getByText('Studio / T1')).toBeInTheDocument();
    expect(screen.getByText(/180\s€/)).toBeInTheDocument();
    expect(screen.getByText('T2 / T3 / T4')).toBeInTheDocument();
    expect(screen.getByText(/200\s€/)).toBeInTheDocument();
    expect(screen.getByText('T5 et plus')).toBeInTheDocument();
    expect(screen.getByText(/250\s€/)).toBeInTheDocument();
    expect(screen.getByText('Renouvellement : -20 %')).toBeInTheDocument();
    expect(
      screen.queryByText(getPricingProfile('bordeaux-standard').note ?? '')
    ).not.toBeInTheDocument();
  });

  it('renders the Lot pricing profile without partner tariff', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ c: [{ id: '46042', label: 'Cahors', departmentCode: '46' }] }),
      }))
    );

    render(
      <MemoryRouter>
        <DepartmentPricingSection
          config={LOT_LOCAL_LANDING_PAGE_V6.pricing.picker}
          presentation="panel"
        />
      </MemoryRouter>
    );

    const input = screen.getByRole('combobox', { name: 'Commune' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'cah' } });
    expect(await screen.findByRole('option', { name: 'Cahors' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(LOT_LOCAL_LANDING_PAGE_V6.pricing.picker.defaultPricingProfileId).toBe('lot-standard');
    expect(LOT_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides).toEqual({});
    expect(screen.getByText('Votre meublé à Cahors')).toBeInTheDocument();
    expect(screen.getAllByText(/200\s€/)).toHaveLength(2);
    expect(screen.getByText('Deuxième logement et suivants')).toBeInTheDocument();
    expect(screen.getByText('160 € par logement TTC')).toBeInTheDocument();
    expect(screen.queryByText(/office de tourisme partenaire/i)).not.toBeInTheDocument();
  });

  it('resolves Aveyron through its independent standard profile id', async () => {
    const aveyronProfile = requireFlatProfile(PRICING_PROFILES['aveyron-standard']);
    const dordogneProfile = requireFlatProfile(PRICING_PROFILES['dordogne-standard']);
    const aveyronAmount = aveyronProfile.standard.amount;
    const dordogneAmount = dordogneProfile.standard.amount;
    aveyronProfile.standard.amount = '444 €';
    dordogneProfile.standard.amount = '555 €';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ c: [{ id: '12202', label: 'Rodez', departmentCode: '12' }] }),
      }))
    );

    try {
      render(
        <MemoryRouter>
          <DepartmentPricingSection
            config={AVEYRON_LOCAL_LANDING_PAGE_V6.pricing.picker}
            presentation="panel"
          />
        </MemoryRouter>
      );

      const input = screen.getByRole('combobox', { name: 'Commune' });
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: 'rod' } });
      expect(await screen.findByRole('option', { name: 'Rodez' })).toBeInTheDocument();
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(AVEYRON_LOCAL_LANDING_PAGE_V6.pricing.picker.defaultPricingProfileId).toBe(
        'aveyron-standard'
      );
      expect(AVEYRON_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides).toEqual({});
      expect(PRICING_PROFILES['aveyron-standard']).not.toBe(PRICING_PROFILES['dordogne-standard']);
      expect(PRICING_PROFILES['aveyron-standard'].id).toBe('aveyron-standard');
      expect(PRICING_PROFILES['dordogne-standard'].id).toBe('dordogne-standard');
      expect(screen.getByText('Votre meublé à Rodez')).toBeInTheDocument();
      expect(screen.getByText(/444\s€/)).toBeInTheDocument();
      expect(screen.queryByText(/555\s€/)).not.toBeInTheDocument();
    } finally {
      aveyronProfile.standard.amount = aveyronAmount;
      dordogneProfile.standard.amount = dordogneAmount;
    }
  });

  it('keeps direct pricing compact without picker divider or duplicated note', () => {
    const profile = getPricingProfile('dordogne-standard');
    const { container } = render(
      <MemoryRouter>
        <LocalPricingProfileSummary
          pricingProfile={profile}
          localityLabel="Bergerac"
          presentation="direct"
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Votre meublé à Bergerac')).toBeInTheDocument();
    expect(container.querySelector('.local-v6-pricing-result')).toHaveClass(
      'local-v6-pricing-result-direct'
    );
    expect(screen.queryByText(profile.note ?? '')).not.toBeInTheDocument();
  });
});
