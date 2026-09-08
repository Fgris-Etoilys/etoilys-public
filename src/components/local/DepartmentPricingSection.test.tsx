import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DepartmentPricingSection from './DepartmentPricingSection';
import { DORDOGNE_DEPARTMENT_PAGE } from '../../content/local/departments/dordogne';
import { getPricingProfile } from '../../content/local/pricing';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Dordogne pricing variant', () => {
  it('requires a commune selection and preserves pricing, keyboard search and fallback paths', async () => {
    const config = DORDOGNE_DEPARTMENT_PAGE.pricing;
    if (!config) throw new Error('Dordogne pricing config is required');
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
        <DepartmentPricingSection config={config} variant="dordogne" />
      </MemoryRouter>
    );
    const input = screen.getByRole('combobox', { name: 'Commune' });
    expect(container.querySelector('.dd-pricing-amount')).toBeNull();
    fireEvent.focus(input);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /réessayer/i }));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());

    fireEvent.change(input, { target: { value: 'per' } });
    expect(await screen.findByRole('option', { name: 'Périgueux' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(container.querySelector('.dd-pricing-amount')).toHaveTextContent(
      profile.standard.amount
    );
    expect(screen.getByRole('link', { name: 'Demander mon classement' })).toHaveAttribute(
      'href',
      '/demande-classement'
    );
    const multiple = container.querySelector('details');
    expect(multiple).not.toHaveAttribute('open');
    profile.multiProperty?.rows.forEach((row) => expect(multiple).toHaveTextContent(row.amount));

    fireEvent.change(input, { target: { value: 'Commune absente' } });
    expect(container.querySelector('.dd-pricing-amount')).toBeNull();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /indiquez votre adresse/i })).toHaveAttribute(
      'href',
      '/demande-classement'
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
