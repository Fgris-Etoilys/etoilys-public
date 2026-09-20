import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../components/forms/ContactForm';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';
import { formContent } from '../i18n/formContent';
import type { Locale } from '../i18n/locales';

const analytics = vi.hoisted(() => ({
  trackFormStarted: vi.fn(),
  trackFormValidationFailed: vi.fn(),
  trackFormSubmitAttempted: vi.fn(),
  trackFormSubmitSucceeded: vi.fn(),
  trackFormSubmitFailed: vi.fn(),
}));

vi.mock('../utils/analytics', () => analytics);
vi.mock('../utils/openAiAds', () => ({ trackLeadCreatedConversion: vi.fn() }));

type FormKind = 'contact' | 'demandeClassement';
const kinds: FormKind[] = ['contact', 'demandeClassement'];
const locales: Locale[] = ['fr', 'en', 'nl'];
const cases = kinds.flatMap((kind) => locales.map((locale) => ({ kind, locale })));
const values = {
  nom: 'Doe',
  prenom: 'Jane',
  email: 'jane@example.com',
  telephone: '06 12 34 56 78',
  adresse: '1 rue du Test, 24150 Mauzac',
  message: 'Question about my accommodation',
};
let verify: (token: string) => void;
const reset = vi.fn();

function renderForm(kind: FormKind, locale: Locale) {
  const { container } = render(
    <MemoryRouter>
      {kind === 'contact' ? (
        <ContactForm locale={locale} />
      ) : (
        <DemandeClassementForm locale={locale} />
      )}
    </MemoryRouter>
  );
  const form = container.querySelector('form');
  if (!form) throw new Error('Missing form');
  return form;
}

function field(form: HTMLFormElement, name: string) {
  const element = form.elements.namedItem(name);
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
    throw new Error(`Missing field: ${name}`);
  }
  return element;
}

function fill(form: HTMLFormElement, kind: FormKind) {
  Object.entries(values).forEach(([name, value]) => {
    if (form.elements.namedItem(name)) {
      fireEvent.change(field(form, name), {
        target: { value: name === 'message' && kind === 'demandeClassement' ? '' : value },
      });
    }
  });
  fireEvent.click(field(form, 'consent'));
  act(() => verify('verified-token'));
}

beforeEach(() => {
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-key');
  window.turnstile = {
    render: vi.fn((_container, options) => {
      verify = options.callback;
      return 'test-widget';
    }),
    reset,
    remove: vi.fn(),
  };
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({ success: true, message: 'ok' }), { status: 200 })
  );
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  delete window.turnstile;
});

describe('form interaction contracts', () => {
  it.each(cases)(
    'shows local validation and focuses the first invalid field: $kind / $locale',
    ({ kind, locale }) => {
      const form = renderForm(kind, locale);
      const content = formContent[locale];
      const requiredNames =
        kind === 'contact'
          ? ['nom', 'email', 'message', 'consent']
          : ['nom', 'prenom', 'email', 'telephone', 'adresse', 'consent'];

      expect(form).toHaveAttribute('novalidate');
      expect(field(form, 'nom')).toHaveAttribute(
        'autocomplete',
        kind === 'contact' ? 'name' : 'family-name'
      );
      expect(field(form, 'email')).toHaveAttribute('autocomplete', 'email');
      fireEvent.submit(form);

      requiredNames.forEach((name) => {
        expect(field(form, name)).toBeRequired();
        expect(field(form, name)).toHaveAttribute('aria-invalid', 'true');
        expect(field(form, name)).toHaveAccessibleDescription();
      });
      expect(field(form, 'nom')).toHaveFocus();
      expect(screen.getByText(content.turnstile.required)).toBeVisible();
      expect(globalThis.fetch).not.toHaveBeenCalled();
      if (kind === 'demandeClassement') {
        expect(field(form, 'prenom')).toHaveAttribute('autocomplete', 'given-name');
        expect(field(form, 'telephone')).toHaveAttribute('autocomplete', 'tel');
        expect(field(form, 'adresse')).toHaveAttribute('autocomplete', 'off');
        expect(field(form, 'message')).not.toBeRequired();
        expect(field(form, 'message')).not.toHaveAttribute('aria-invalid', 'true');
      }

      fireEvent.change(field(form, 'email'), { target: { value: 'invalid-email' } });
      fireEvent.submit(form);
      expect(field(form, 'email')).toHaveAccessibleDescription(content.validation.emailInvalid);
      if (kind === 'demandeClassement') {
        fireEvent.change(field(form, 'telephone'), { target: { value: '123' } });
        fireEvent.submit(form);
        expect(field(form, 'telephone')).toHaveAccessibleDescription(
          content.validation.telephoneInvalid
        );
      }
      expect(analytics.trackFormStarted).toHaveBeenCalledTimes(1);
    }
  );

  it.each(cases)(
    'keeps values and associates backend validation: $kind / $locale',
    async ({ kind, locale }) => {
      vi.mocked(globalThis.fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            success: false,
            errorCode: 'VALIDATION_FAILED',
            fieldErrorCodes: { email: 'INVALID_EMAIL' },
            fieldErrors: { email: 'Untranslated fallback' },
          }),
          { status: 400 }
        )
      );
      const form = renderForm(kind, locale);
      fill(form, kind);
      fireEvent.submit(form);

      await waitFor(() => expect(field(form, 'email')).toHaveAttribute('aria-invalid', 'true'));
      expect(field(form, 'email')).toHaveAccessibleDescription(
        formContent[locale].api.fieldErrors.email.INVALID_EMAIL
      );
      expect(field(form, 'email')).toHaveFocus();
      expect(field(form, 'email')).toHaveValue(values.email);
      expect(field(form, 'nom')).toHaveValue(values.nom);
      expect(screen.getByText(formContent[locale].api.errorCodes.VALIDATION_FAILED)).toBeVisible();
      expect(screen.queryByText('Untranslated fallback')).not.toBeInTheDocument();
      expect(reset).toHaveBeenCalledWith('test-widget');
      expect(analytics.trackFormSubmitFailed).toHaveBeenCalledWith(
        kind === 'contact' ? 'contact' : 'demande_classement',
        'api',
        ['email']
      );
    }
  );

  it.each(cases)(
    'submits once, resets all fields and keeps success visible: $kind / $locale',
    async ({ kind, locale }) => {
      let resolve!: (response: Response) => void;
      const pending = new Promise<Response>((done) => {
        resolve = done;
      });
      vi.mocked(globalThis.fetch).mockReturnValueOnce(pending);
      const form = renderForm(kind, locale);
      fill(form, kind);
      reset.mockClear();
      fireEvent.submit(form);
      fireEvent.submit(form);

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole('button', { name: formContent[locale][kind].submitting })
      ).toBeDisabled();
      expect(field(form, 'email')).toBeDisabled();
      const request = vi.mocked(globalThis.fetch).mock.calls[0];
      expect(request?.[0]).toBe(
        `/api/public/forms/${kind === 'contact' ? 'contact' : 'classement'}`
      );
      expect(JSON.parse(String(request?.[1]?.body))).toEqual({
        ...(kind === 'contact'
          ? { nom: values.nom, email: values.email, message: values.message }
          : { ...values, message: '' }),
        consent: true,
        consentVersion: 'privacy-v1',
        preferredLanguage: locale,
        turnstileToken: 'verified-token',
      });

      vi.useFakeTimers();
      await act(async () => {
        resolve(new Response(JSON.stringify({ success: true, message: 'ok' }), { status: 200 }));
        await pending;
      });
      const success = screen.getByRole('status');
      expect(success).toBeVisible();
      expect(success).toHaveFocus();
      expect(form).not.toBeVisible();
      Object.keys(values).forEach((name) => {
        if (form.elements.namedItem(name)) expect(field(form, name)).toHaveValue('');
      });
      expect(field(form, 'consent')).not.toBeChecked();
      expect(reset).toHaveBeenCalledWith('test-widget');
      expect(analytics.trackFormSubmitSucceeded).toHaveBeenCalledTimes(1);

      act(() => vi.advanceTimersByTime(6000));
      expect(success).toBeVisible();
      vi.useRealTimers();
      fireEvent.click(
        screen.getByRole('button', { name: formContent[locale][kind].successAction })
      );
      expect(form).toBeVisible();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(field(form, 'nom')).toHaveFocus();
      expect(analytics.trackFormSubmitAttempted).toHaveBeenCalledTimes(1);
      expect(analytics.trackFormSubmitSucceeded).toHaveBeenCalledTimes(1);
    }
  );

  it.each(kinds)('preserves raw backend field errors without error codes: %s', async (kind) => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          code: 'INVALID_REQUEST',
          message: 'Invalid request',
          fieldErrors: { email: 'Use another email address' },
        }),
        { status: 400 }
      )
    );
    const form = renderForm(kind, 'en');
    fill(form, kind);
    fireEvent.submit(form);

    await waitFor(() =>
      expect(field(form, 'email')).toHaveAccessibleDescription('Use another email address')
    );
    expect(field(form, 'email')).toHaveValue(values.email);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it.each(kinds)('handles business validation failure returned with HTTP 200: %s', async (kind) => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          errorCode: 'VALIDATION_FAILED',
          fieldErrorCodes: { email: 'INVALID_EMAIL' },
        }),
        { status: 200 }
      )
    );
    const form = renderForm(kind, 'nl');
    fill(form, kind);
    fireEvent.submit(form);

    await waitFor(() =>
      expect(field(form, 'email')).toHaveAccessibleDescription(
        formContent.nl.api.fieldErrors.email.INVALID_EMAIL
      )
    );
    expect(field(form, 'email')).toHaveValue(values.email);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(analytics.trackFormSubmitSucceeded).not.toHaveBeenCalled();
    expect(reset).toHaveBeenCalledWith('test-widget');
  });
});
