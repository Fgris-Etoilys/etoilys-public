import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentPricingSection, { LocalPricingProfileSummary } from './DepartmentPricingSection';
import { getPricingProfile, PRICING_PROFILES } from '../../content/local/pricing';
import {
  DORDOGNE_LOCAL_LANDING_PAGE_V6,
  GIRONDE_LOCAL_LANDING_PAGE_V6,
  LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6,
} from '../../content/local/v6Pages';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Department pricing picker', () => {
  it('requires a commune selection and preserves pricing, keyboard search and fallback paths', async () => {
    const config = DORDOGNE_LOCAL_LANDING_PAGE_V6.pricing.picker;
    const profile = getPricingProfile(config.defaultPricingProfileId);
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

  it('resolves Gironde and Lot-et-Garonne through independent business profile ids', async () => {
    const girondeAmount = PRICING_PROFILES['gironde-standard'].standard.amount;
    const bordeauxAmount = PRICING_PROFILES['bordeaux-standard'].standard.amount;
    const lotEtGaronneAmount = PRICING_PROFILES['lot-et-garonne-standard'].standard.amount;
    PRICING_PROFILES['gironde-standard'].standard.amount = '111 €';
    PRICING_PROFILES['bordeaux-standard'].standard.amount = '222 €';
    PRICING_PROFILES['lot-et-garonne-standard'].standard.amount = '333 €';
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => ({
        ok: true,
        json: async () =>
          url.includes('gironde')
            ? { c: [{ id: '33063', label: 'Bordeaux', departmentCode: '33' }] }
            : { c: [{ id: '47001', label: 'Agen', departmentCode: '47' }] },
      }))
    );

    try {
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
      fireEvent.change(input, {
        target: { value: 'bor' },
      });
      expect(await screen.findByRole('option', { name: 'Bordeaux' })).toBeInTheDocument();
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText('Votre meublé à Bordeaux')).toBeInTheDocument();
      expect(screen.getByText(/222\s€/)).toBeInTheDocument();
      expect(screen.queryByText(/111\s€/)).not.toBeInTheDocument();
      expect(GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker.defaultPricingProfileId).toBe(
        'gironde-standard'
      );
      expect(GIRONDE_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides['33063']).toBe(
        'bordeaux-standard'
      );
      unmount();

      render(
        <MemoryRouter>
          <DepartmentPricingSection
            config={LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6.pricing.picker}
            presentation="panel"
          />
        </MemoryRouter>
      );
      input = screen.getByRole('combobox', { name: 'Commune' });
      fireEvent.focus(input);
      fireEvent.change(input, {
        target: { value: 'age' },
      });
      expect(await screen.findByRole('option', { name: 'Agen' })).toBeInTheDocument();
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(screen.getByText('Votre meublé à Agen')).toBeInTheDocument();
      expect(screen.getByText(/333\s€/)).toBeInTheDocument();
      expect(LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6.pricing.picker.defaultPricingProfileId).toBe(
        'lot-et-garonne-standard'
      );
      expect(LOT_ET_GARONNE_LOCAL_LANDING_PAGE_V6.pricing.picker.overrides).toEqual({});
    } finally {
      PRICING_PROFILES['gironde-standard'].standard.amount = girondeAmount;
      PRICING_PROFILES['bordeaux-standard'].standard.amount = bordeauxAmount;
      PRICING_PROFILES['lot-et-garonne-standard'].standard.amount = lotEtGaronneAmount;
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
