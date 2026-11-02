import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DemandeClassementForm from '../components/forms/DemandeClassementForm';
import { formContent } from '../i18n/formContent';
import type { Locale } from '../i18n/locales';
import { localizedRoutes } from '../i18n/localizedRoutes';
import { expectNoA11yViolations } from './a11y';
import {
  clickNext,
  clickPrevious,
  clickSubmit,
  communeDto,
  communesRequests,
  COMMUNES_MULTIPLES,
  COMMUNE_UNIQUE,
  completeCoordonneesStep,
  completeLogementStep,
  currentStepLabel,
  fieldByName,
  flushPromises,
  hasField,
  installTurnstileMock,
  jsonResponse,
  mockDemandeApi,
  reachFinalStep,
  setField,
  submitBody,
  submitRequests,
  SUCCESS_BODY,
  WIZARD_VALUES,
} from './demandeClassementWizard';

const analytics = vi.hoisted(() => ({
  trackFormStarted: vi.fn(() => true),
  trackFormValidationFailed: vi.fn(),
  trackFormSubmitAttempted: vi.fn(),
  trackFormSubmitSucceeded: vi.fn(),
  trackFormSubmitFailed: vi.fn(),
}));
const openAiAds = vi.hoisted(() => ({ trackLeadCreatedConversion: vi.fn() }));

vi.mock('../utils/analytics', () => analytics);
vi.mock('../utils/openAiAds', () => openAiAds);

const locales: Locale[] = ['fr', 'en', 'nl'];
const PHONE_LINK = 'a[href="tel:+33649551540"]';
const multipleCommunes = () => jsonResponse(COMMUNES_MULTIPLES);
let turnstile: ReturnType<typeof installTurnstileMock>;

const renderForm = (locale: Locale = 'fr') => {
  const { container } = render(
    <MemoryRouter>
      <DemandeClassementForm locale={locale} />
    </MemoryRouter>
  );
  return container;
};

const postalCodeOf = (url: string) => new URL(url, 'http://test').searchParams.get('codePostal');

const reachVerifiedFinalStep = async (locale: Locale = 'fr', token = 'first-token') => {
  await reachFinalStep(locale);
  turnstile.verify(token);
};

// Après une erreur, le widget n'est réinitialisé qu'une fois l'alerte rendue : ce reset effacerait
// un jeton fourni trop tôt, ce qui rendrait le test dépendant du temps d'exécution.
const renewTurnstileToken = async (token: string) => {
  await waitFor(() => expect(turnstile.reset).toHaveBeenCalled());
  turnstile.verify(token);
};

beforeEach(() => {
  Object.values(analytics).forEach((mock) => mock.mockClear());
  analytics.trackFormStarted.mockReturnValue(true);
  openAiAds.trackLeadCreatedConversion.mockReset();
  vi.stubEnv('VITE_TURNSTILE_SITE_KEY', 'test-key');
  turnstile = installTurnstileMock();
  mockDemandeApi();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  delete window.turnstile;
});

describe('étape Logement', () => {
  it.each(locales)('blocks progress and focuses the postal code when empty: %s', (locale) => {
    renderForm(locale);

    clickNext(locale);

    expect(fieldByName('codePostal')).toHaveAttribute('aria-invalid', 'true');
    expect(fieldByName('codePostal')).toHaveFocus();
    expect(fieldByName('codePostal')).toHaveAccessibleDescription(
      formContent[locale].validation.codePostalRequired
    );
    expect(currentStepLabel()).toContain(formContent[locale].demandeClassement.steps[0]);
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(analytics.trackFormValidationFailed).toHaveBeenCalledWith('demande_classement', [
      'codePostal',
    ]);
  });

  it('only searches once five digits are entered and keeps digits only', async () => {
    renderForm();

    setField('codePostal', '24a1');
    expect(fieldByName('codePostal')).toHaveValue('241');
    expect(communesRequests()).toHaveLength(0);

    setField('codePostal', '24 150');
    expect(fieldByName('codePostal')).toHaveValue('24150');
    await screen.findByText(COMMUNE_UNIQUE.nom);

    expect(communesRequests()).toHaveLength(1);
    expect(postalCodeOf(String(communesRequests()[0]?.[0]))).toBe('24150');
  });

  it.each(locales)('auto-selects and displays a single commune: %s', async (locale) => {
    renderForm(locale);

    setField('codePostal', '24150');

    expect(await screen.findByText(COMMUNE_UNIQUE.nom)).toBeVisible();
    expect(hasField('commune')).toBe(false);
    await waitFor(() => expect(hasField('adresse')).toBe(true));
    expect(fieldByName('adresse')).toBeRequired();
    expect(document.body).not.toHaveTextContent(COMMUNE_UNIQUE.codeInsee);
    expect(document.body).not.toHaveTextContent(COMMUNE_UNIQUE.territoire.siren);
  });

  it.each(locales)('requires a choice among several communes: %s', async (locale) => {
    mockDemandeApi({ communes: multipleCommunes });
    renderForm(locale);
    const { demandeClassement, validation } = formContent[locale];

    setField('codePostal', '24200');
    await waitFor(() => expect(hasField('commune')).toBe(true));
    const select = fieldByName<HTMLSelectElement>('commune');

    expect(select).toBeRequired();
    expect(select).toHaveValue('');
    expect(select.options[0]).toHaveTextContent(demandeClassement.placeholders.commune);
    expect(hasField('adresse')).toBe(false);

    clickNext(locale);
    expect(select).toHaveAccessibleDescription(validation.communeRequired);
    expect(select).toHaveFocus();
    expect(currentStepLabel()).toContain(demandeClassement.steps[0]);

    setField('commune', '24520');
    expect(select).toHaveValue('24520');
    expect(select).not.toHaveAttribute('aria-invalid');
    expect(fieldByName('adresse')).toBeVisible();
  });

  it.each(locales)(
    'invites to correct the postal code when nothing matches: %s',
    async (locale) => {
      mockDemandeApi({ communes: () => jsonResponse([]) });
      renderForm(locale);
      const { communeLookup, steps } = formContent[locale].demandeClassement;

      setField('codePostal', '00000');

      await waitFor(() =>
        expect(fieldByName('codePostal')).toHaveAccessibleDescription(communeLookup.notFound)
      );
      expect(hasField('commune')).toBe(false);
      expect(hasField('adresse')).toBe(false);

      clickNext(locale);
      expect(fieldByName('codePostal')).toHaveFocus();
      expect(currentStepLabel()).toContain(steps[0]);
      expect(submitRequests()).toHaveLength(0);
    }
  );

  it('invalidates the selection when the postal code changes and keeps the address', async () => {
    mockDemandeApi({
      communes: (url) =>
        postalCodeOf(url) === '24200' ? multipleCommunes() : jsonResponse([COMMUNE_UNIQUE]),
    });
    renderForm();

    setField('codePostal', '24150');
    await waitFor(() => expect(hasField('adresse')).toBe(true));
    setField('adresse', WIZARD_VALUES.adresse);

    setField('codePostal', '2415');
    expect(hasField('adresse')).toBe(false);
    expect(screen.queryByText(COMMUNE_UNIQUE.nom)).not.toBeInTheDocument();

    setField('codePostal', '24200');
    await waitFor(() => expect(hasField('commune')).toBe(true));
    expect(fieldByName('commune')).toHaveValue('');
    clickNext('fr');
    expect(currentStepLabel()).toContain(formContent.fr.demandeClassement.steps[0]);

    setField('commune', '24082');
    expect(fieldByName('adresse')).toHaveValue(WIZARD_VALUES.adresse);
  });

  it.each(locales)(
    'stays blocked with retry and phone when the API is down: %s',
    async (locale) => {
      let attempts = 0;
      mockDemandeApi({
        communes: () => {
          attempts += 1;
          return attempts === 1
            ? jsonResponse({ code: 'UNAVAILABLE', message: 'Down' }, 503)
            : jsonResponse([COMMUNE_UNIQUE]);
        },
      });
      const container = renderForm(locale);
      const { communeLookup, steps } = formContent[locale].demandeClassement;

      setField('codePostal', '24150');

      expect(await screen.findByRole('alert')).toHaveTextContent(communeLookup.unavailable);
      expect(container.querySelector(PHONE_LINK)).toBeVisible();
      expect(hasField('adresse')).toBe(false);

      clickNext(locale);
      expect(currentStepLabel()).toContain(steps[0]);
      expect(screen.getByRole('alert')).toHaveFocus();

      fireEvent.click(screen.getByRole('button', { name: communeLookup.retry }));

      expect(await screen.findByText(COMMUNE_UNIQUE.nom)).toBeVisible();
      await waitFor(() => expect(hasField('adresse')).toBe(true));
      expect(screen.queryByText(communeLookup.unavailable)).not.toBeInTheDocument();
      expect(communesRequests()).toHaveLength(2);
    }
  );

  it('disables progress while a search is pending', async () => {
    let resolve!: (response: Response) => void;
    mockDemandeApi({
      communes: () =>
        new Promise<Response>((done) => {
          resolve = done;
        }),
    });
    renderForm();
    const { actions, communeLookup } = formContent.fr.demandeClassement;

    setField('codePostal', '24150');

    expect(screen.getByText(communeLookup.loading)).toBeVisible();
    expect(screen.getByRole('button', { name: actions.next })).toBeDisabled();

    await act(async () => resolve(jsonResponse([COMMUNE_UNIQUE])));
    await screen.findByText(COMMUNE_UNIQUE.nom);
    expect(screen.getByRole('button', { name: actions.next })).toBeEnabled();
  });
});

describe('réponses de recherche réordonnées', () => {
  const deferCommunes = () => {
    const pending = new Map<
      string,
      { resolve: (response: Response) => void; reject: (reason: unknown) => void }
    >();
    // Le mock ignore volontairement l'annulation : la réponse arrive quand même, en retard.
    mockDemandeApi({
      communes: (url) =>
        new Promise<Response>((resolve, reject) => {
          pending.set(String(postalCodeOf(url)), { resolve, reject });
        }),
    });
    return pending;
  };
  const LATE_COMMUNE = communeDto('24520', 'Sarlat-la-Canéda', '24200');

  it('never replaces the current results with a late response', async () => {
    const pending = deferCommunes();
    renderForm();

    setField('codePostal', '24200');
    setField('codePostal', '24150');
    await act(async () => pending.get('24150')?.resolve(jsonResponse([COMMUNE_UNIQUE])));
    await screen.findByText(COMMUNE_UNIQUE.nom);

    await act(async () => pending.get('24200')?.resolve(jsonResponse([LATE_COMMUNE])));
    await flushPromises();

    expect(screen.queryByText(LATE_COMMUNE.nom)).not.toBeInTheDocument();
    expect(screen.getByText(COMMUNE_UNIQUE.nom)).toBeVisible();

    setField('adresse', WIZARD_VALUES.adresse);
    clickNext('fr');
    completeCoordonneesStep('fr');
    setField('classementActuelDeclare', 'NC');
    fireEvent.click(fieldByName('consent'));
    turnstile.verify('token');
    clickSubmit('fr');

    await waitFor(() => expect(submitRequests()).toHaveLength(1));
    expect(submitBody()).toMatchObject({
      codePostal: '24150',
      commune: COMMUNE_UNIQUE.nom,
      codeInsee: COMMUNE_UNIQUE.codeInsee,
    });
  });

  it('ignores a late failure of a previous search', async () => {
    const pending = deferCommunes();
    renderForm();

    setField('codePostal', '24200');
    setField('codePostal', '24150');
    await act(async () => pending.get('24150')?.resolve(jsonResponse([COMMUNE_UNIQUE])));
    await screen.findByText(COMMUNE_UNIQUE.nom);

    await act(async () => pending.get('24200')?.reject(new Error('network down')));
    await flushPromises();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText(COMMUNE_UNIQUE.nom)).toBeVisible();
  });

  it('ignores a late response once the postal code is no longer complete', async () => {
    const pending = deferCommunes();
    renderForm();

    setField('codePostal', '24200');
    setField('codePostal', '2420');
    await act(async () => pending.get('24200')?.resolve(jsonResponse([LATE_COMMUNE])));
    await flushPromises();

    expect(screen.queryByText(LATE_COMMUNE.nom)).not.toBeInTheDocument();
    expect(hasField('adresse')).toBe(false);
  });

  it('aborts the previous search when a new one starts', async () => {
    deferCommunes();
    renderForm();

    setField('codePostal', '24200');
    const firstSignal = communesRequests()[0]?.[1]?.signal;
    expect(firstSignal?.aborted).toBe(false);

    setField('codePostal', '24150');

    expect(firstSignal?.aborted).toBe(true);
  });
});

describe('navigation entre les étapes', () => {
  it('keeps results and selection when coming back from step 3 to step 1 with several communes', async () => {
    mockDemandeApi({ communes: multipleCommunes });
    renderForm();

    setField('codePostal', '24200');
    await waitFor(() => expect(hasField('commune')).toBe(true));
    setField('commune', '24520');
    setField('adresse', WIZARD_VALUES.adresse);
    clickNext('fr');
    completeCoordonneesStep('fr');
    setField('classementActuelDeclare', 'INCONNU');
    setField('message', 'Deux autres gîtes');
    fireEvent.click(fieldByName('consent'));
    expect(communesRequests()).toHaveLength(1);

    clickPrevious('fr');
    expect(fieldByName('nom')).toHaveValue(WIZARD_VALUES.nom);
    expect(fieldByName('telephone')).toHaveValue(WIZARD_VALUES.telephone);
    clickPrevious('fr');

    const select = fieldByName<HTMLSelectElement>('commune');
    expect(Array.from(select.options, (option) => option.textContent)).toEqual([
      formContent.fr.demandeClassement.placeholders.commune,
      ...COMMUNES_MULTIPLES.map(({ nom }) => nom),
    ]);
    expect(select).toHaveValue('24520');
    expect(fieldByName('codePostal')).toHaveValue('24200');
    expect(fieldByName('adresse')).toHaveValue(WIZARD_VALUES.adresse);
    expect(communesRequests()).toHaveLength(1);

    clickNext('fr');
    clickNext('fr');
    expect(fieldByName('classementActuelDeclare')).toHaveValue('INCONNU');
    expect(fieldByName('message')).toHaveValue('Deux autres gîtes');
    expect(fieldByName('consent')).toBeChecked();
    turnstile.verify('token');
    clickSubmit('fr');

    await waitFor(() => expect(submitRequests()).toHaveLength(1));
    expect(submitBody()).toMatchObject({
      codePostal: '24200',
      commune: 'Sarlat-la-Canéda',
      codeInsee: '24520',
    });
  });

  it('keeps a single commune when coming back to step 1', async () => {
    renderForm();

    await completeLogementStep('fr');
    clickPrevious('fr');

    expect(screen.getByText(COMMUNE_UNIQUE.nom)).toBeVisible();
    expect(fieldByName('adresse')).toHaveValue(WIZARD_VALUES.adresse);
    expect(communesRequests()).toHaveLength(1);
  });

  it('validates on Enter without submitting before the last step', async () => {
    const container = renderForm();
    const form = container.querySelector('form') as HTMLFormElement;

    setField('codePostal', '24150');
    await waitFor(() => expect(hasField('adresse')).toBe(true));
    setField('adresse', WIZARD_VALUES.adresse);
    fireEvent.submit(form);
    expect(hasField('nom')).toBe(true);

    fireEvent.submit(form);
    expect(fieldByName('nom')).toHaveAttribute('aria-invalid', 'true');
    expect(fieldByName('nom')).toHaveFocus();
    expect(submitRequests()).toHaveLength(0);
  });

  it.each(locales)(
    'moves focus to the step title and marks the current step: %s',
    async (locale) => {
      renderForm(locale);
      const { sections, steps } = formContent[locale].demandeClassement;

      await completeLogementStep(locale);

      expect(currentStepLabel()).toContain(steps[1]);
      expect(screen.getByText(sections.contact)).toHaveFocus();
      expect(document.querySelectorAll('.inquiry-step-number svg')).toHaveLength(1);
      expect(document.querySelector('[aria-current="step"] svg')).toBeNull();

      clickPrevious(locale);
      expect(currentStepLabel()).toContain(steps[0]);
      expect(screen.getByText(sections.property)).toHaveFocus();
      expect(document.querySelectorAll('.inquiry-step-number svg')).toHaveLength(0);
    }
  );

  it('renders Turnstile only on the last step and drops the token when leaving it', async () => {
    renderForm();

    await completeLogementStep('fr');
    expect(turnstile.render).not.toHaveBeenCalled();

    completeCoordonneesStep('fr');
    expect(turnstile.render).toHaveBeenCalledTimes(1);
    expect(turnstile.reset).not.toHaveBeenCalled();
    setField('classementActuelDeclare', 'NC');
    fireEvent.click(fieldByName('consent'));
    turnstile.verify('stale-token');

    clickPrevious('fr');
    expect(turnstile.remove).toHaveBeenCalledWith('test-widget');

    clickNext('fr');
    expect(turnstile.render).toHaveBeenCalledTimes(2);
    expect(turnstile.reset).not.toHaveBeenCalled();
    clickSubmit('fr');
    expect(screen.getByText(formContent.fr.turnstile.required)).toBeVisible();
    expect(submitRequests()).toHaveLength(0);

    turnstile.verify('fresh-token');
    clickSubmit('fr');
    await waitFor(() => expect(submitRequests()).toHaveLength(1));
    expect(submitBody()).toMatchObject({ turnstileToken: 'fresh-token' });
  });
});

describe('classement actuel', () => {
  it.each(locales)(
    'has no preselected value and requires an explicit choice: %s',
    async (locale) => {
      renderForm(locale);
      const { demandeClassement, validation } = formContent[locale];

      await completeLogementStep(locale);
      completeCoordonneesStep(locale);
      const select = fieldByName<HTMLSelectElement>('classementActuelDeclare');

      expect(select).toBeRequired();
      expect(select).toHaveValue('');
      expect(select.options[0]).toHaveTextContent(
        demandeClassement.placeholders.classementActuelDeclare
      );
      expect(Array.from(select.options, (option) => option.value)).toEqual([
        '',
        'NC',
        'UNE_ETOILE',
        'DEUX_ETOILES',
        'TROIS_ETOILES',
        'QUATRE_ETOILES',
        'CINQ_ETOILES',
        'INCONNU',
      ]);

      fireEvent.click(fieldByName('consent'));
      turnstile.verify('token');
      clickSubmit(locale);

      expect(select).toHaveAccessibleDescription(validation.classementRequired);
      expect(select).toHaveFocus();
      expect(submitRequests()).toHaveLength(0);
    }
  );

  it('uses the exact French placeholder', () => {
    expect(formContent.fr.demandeClassement.placeholders.classementActuelDeclare).toBe(
      'Sélectionnez votre situation'
    );
  });

  it.each(['NC', 'INCONNU', 'CINQ_ETOILES'])(
    'sends the chosen value untouched: %s',
    async (value) => {
      renderForm();

      await reachFinalStep('fr', value);
      turnstile.verify('token');
      clickSubmit('fr');

      await waitFor(() => expect(submitRequests()).toHaveLength(1));
      expect(submitBody().classementActuelDeclare).toBe(value);
    }
  );
});

describe('limite de longueur de l’adresse', () => {
  const reachAddressField = async () => {
    setField('codePostal', '24150');
    await waitFor(() => expect(hasField('adresse')).toBe(true));
  };

  it.each(locales)(
    'rejects 256 characters with a clear error and no truncation: %s',
    async (locale) => {
      renderForm(locale);
      await reachAddressField();
      const tooLong = 'a'.repeat(256);

      expect(fieldByName('adresse')).not.toHaveAttribute('maxlength');
      setField('adresse', tooLong);
      clickNext(locale);

      expect(fieldByName('adresse')).toHaveValue(tooLong);
      expect(fieldByName('adresse')).toHaveFocus();
      expect(fieldByName('adresse')).toHaveAccessibleDescription(
        formContent[locale].validation.adresseTooLong
      );
      expect(currentStepLabel()).toContain(formContent[locale].demandeClassement.steps[0]);
    }
  );

  it('accepts exactly 255 characters, ignoring surrounding spaces', async () => {
    renderForm();
    await reachAddressField();

    setField('adresse', `  ${'a'.repeat(255)}  `);
    clickNext('fr');

    expect(hasField('nom')).toBe(true);
  });

  it('shows a localized error when the backend rejects the address length', async () => {
    mockDemandeApi({
      submit: () =>
        jsonResponse(
          {
            success: false,
            error: 'Données invalides.',
            errorCode: 'VALIDATION_FAILED',
            fieldErrors: { adresse: 'La valeur dépasse la longueur maximale autorisée.' },
            fieldErrorCodes: { adresse: 'TOO_LONG' },
          },
          400
        ),
    });
    renderForm('en');

    await reachFinalStep('en');
    turnstile.verify('token');
    clickSubmit('en');

    await waitFor(() =>
      expect(fieldByName('adresse')).toHaveAccessibleDescription(
        formContent.en.api.fieldErrors.adresse.TOO_LONG
      )
    );
    await waitFor(() => expect(fieldByName('adresse')).toHaveFocus());
  });
});

describe('soumission', () => {
  it.each(locales)('sends the exact contract and tracks one conversion: %s', async (locale) => {
    renderForm(locale);

    await reachFinalStep(locale);
    setField('message', 'Deux autres gîtes');
    turnstile.verify('verified-token');
    clickSubmit(locale);

    await screen.findByRole('status');
    const request = submitRequests()[0];
    expect(request?.[0]).toBe('/api/public/forms/classement');
    const body = submitBody();
    expect(body).toEqual({
      submissionId: expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      ),
      codePostal: '24150',
      commune: COMMUNE_UNIQUE.nom,
      codeInsee: COMMUNE_UNIQUE.codeInsee,
      ...WIZARD_VALUES,
      classementActuelDeclare: 'NC',
      message: 'Deux autres gîtes',
      consent: true,
      consentVersion: 'privacy-v1',
      preferredLanguage: locale,
      turnstileToken: 'verified-token',
    });
    expect(body).not.toHaveProperty('territoire');
    expect(body).not.toHaveProperty('millesime');
    expect(analytics.trackFormSubmitSucceeded).toHaveBeenCalledTimes(1);
    expect(openAiAds.trackLeadCreatedConversion).toHaveBeenCalledTimes(1);
  });

  it('allows an empty optional message', async () => {
    renderForm();

    await reachVerifiedFinalStep();
    expect(fieldByName<HTMLTextAreaElement>('message')).not.toBeRequired();
    clickSubmit('fr');

    await screen.findByRole('status');
    expect(submitBody().message).toBe('');
  });

  it('sends once on double submit and disables the actions while pending', async () => {
    let resolve!: (response: Response) => void;
    mockDemandeApi({
      submit: () =>
        new Promise<Response>((done) => {
          resolve = done;
        }),
    });
    const container = renderForm();
    const form = container.querySelector('form') as HTMLFormElement;
    const { actions, submitting } = formContent.fr.demandeClassement;

    await reachVerifiedFinalStep();
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(submitRequests()).toHaveLength(1);
    expect(screen.getByRole('button', { name: submitting })).toBeDisabled();
    expect(screen.getByRole('button', { name: actions.previous })).toBeDisabled();
    expect(fieldByName('classementActuelDeclare')).toBeDisabled();

    await act(async () => resolve(jsonResponse(SUCCESS_BODY)));
    await screen.findByRole('status');
    expect(analytics.trackFormSubmitSucceeded).toHaveBeenCalledTimes(1);
  });

  it('reuses the same UUID after a lost response and a renewed Turnstile token, with one conversion', async () => {
    let attempts = 0;
    mockDemandeApi({
      submit: () => {
        attempts += 1;
        if (attempts === 1) throw new Error('response lost');
        return jsonResponse(SUCCESS_BODY);
      },
    });
    renderForm();

    await reachVerifiedFinalStep('fr', 'first-token');
    clickSubmit('fr');

    expect(await screen.findByRole('alert')).toHaveTextContent(formContent.fr.api.genericError);
    await waitFor(() => expect(turnstile.reset).toHaveBeenCalledWith('test-widget'));
    expect(openAiAds.trackLeadCreatedConversion).not.toHaveBeenCalled();
    const firstId = submitBody().submissionId;

    clickSubmit('fr');
    expect(submitRequests()).toHaveLength(1);
    expect(screen.getByText(formContent.fr.turnstile.required)).toBeVisible();

    turnstile.verify('second-token');
    clickSubmit('fr');

    await screen.findByRole('status');
    expect(submitBody()).toMatchObject({ submissionId: firstId, turnstileToken: 'second-token' });
    expect(analytics.trackFormSubmitSucceeded).toHaveBeenCalledTimes(1);
    expect(openAiAds.trackLeadCreatedConversion).toHaveBeenCalledTimes(1);
  });

  it.each(locales)(
    'shows the phone and counts no conversion on a 409 conflict: %s',
    async (locale) => {
      mockDemandeApi({
        submit: () =>
          jsonResponse(
            {
              success: false,
              error: 'Cet identifiant de soumission a déjà été utilisé avec d’autres données.',
              errorCode: 'SUBMISSION_CONFLICT',
            },
            409
          ),
      });
      const container = renderForm(locale);
      const { api, demandeClassement } = formContent[locale];

      await reachVerifiedFinalStep(locale);
      clickSubmit(locale);

      const alert = await screen.findByRole('alert');
      expect(alert).toHaveTextContent(api.errorCodes.SUBMISSION_CONFLICT);
      await waitFor(() => expect(alert).toHaveFocus());
      expect(container.querySelector(`.inquiry-error ${PHONE_LINK}`)).toBeVisible();
      expect(currentStepLabel()).toContain(demandeClassement.steps[2]);
      expect(analytics.trackFormSubmitSucceeded).not.toHaveBeenCalled();
      expect(openAiAds.trackLeadCreatedConversion).not.toHaveBeenCalled();
    }
  );

  it('keeps the same UUID after a conflict', async () => {
    mockDemandeApi({
      submit: () =>
        jsonResponse({ success: false, error: 'Conflit', errorCode: 'SUBMISSION_CONFLICT' }, 409),
    });
    renderForm();

    await reachVerifiedFinalStep();
    clickSubmit('fr');
    await screen.findByRole('alert');
    const firstId = submitBody().submissionId;

    await renewTurnstileToken('second-token');
    clickSubmit('fr');
    await waitFor(() => expect(submitRequests()).toHaveLength(2));

    expect(submitBody().submissionId).toBe(firstId);
  });

  it.each([
    { errorCode: 'SUBMISSION_CONFLICT', status: 409 },
    { errorCode: 'FORM_OUTDATED', status: 400 },
    { errorCode: 'REFERENTIAL_UNAVAILABLE', status: 503 },
    { errorCode: 'TURNSTILE_INVALID', status: 403 },
  ] as const)(
    'keeps the $errorCode message visible when a new Turnstile token arrives',
    async ({ errorCode, status }) => {
      mockDemandeApi({
        submit: () => jsonResponse({ success: false, error: 'Échec', errorCode }, status),
      });
      renderForm();

      await reachVerifiedFinalStep();
      clickSubmit('fr');
      await screen.findByRole('alert');

      await renewTurnstileToken('second-token');

      expect(screen.getByRole('alert')).toHaveTextContent(formContent.fr.api.errorCodes[errorCode]);
    }
  );

  it('clears the submission error on the next submission', async () => {
    let attempts = 0;
    mockDemandeApi({
      submit: () => {
        attempts += 1;
        return attempts === 1
          ? jsonResponse(
              { success: false, error: 'Échec', errorCode: 'PERSISTENCE_UNAVAILABLE' },
              503
            )
          : jsonResponse(SUCCESS_BODY);
      },
    });
    renderForm();

    await reachVerifiedFinalStep();
    clickSubmit('fr');
    await screen.findByRole('alert');
    await renewTurnstileToken('second-token');

    clickSubmit('fr');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await screen.findByRole('status');
  });

  it('clears the submission error when a field changes', async () => {
    mockDemandeApi({
      submit: () =>
        jsonResponse({ success: false, error: 'Échec', errorCode: 'SUBMISSION_CONFLICT' }, 409),
    });
    renderForm();

    await reachVerifiedFinalStep();
    clickSubmit('fr');
    await screen.findByRole('alert');
    await renewTurnstileToken('second-token');

    setField('message', 'Une précision');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it.each(locales)('asks to refresh an outdated form: %s', async (locale) => {
    mockDemandeApi({
      submit: () =>
        jsonResponse({ success: false, error: 'Obsolète', errorCode: 'FORM_OUTDATED' }, 400),
    });
    renderForm(locale);

    await reachVerifiedFinalStep(locale);
    clickSubmit(locale);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      formContent[locale].api.errorCodes.FORM_OUTDATED
    );
    expect(openAiAds.trackLeadCreatedConversion).not.toHaveBeenCalled();
  });

  it.each([
    { errorCode: 'REFERENTIAL_UNAVAILABLE', showsPhone: true },
    { errorCode: 'PERSISTENCE_UNAVAILABLE', showsPhone: false },
  ] as const)(
    'keeps the UUID and offers a retry on $errorCode',
    async ({ errorCode, showsPhone }) => {
      mockDemandeApi({
        submit: () => jsonResponse({ success: false, error: 'Indisponible', errorCode }, 503),
      });
      const container = renderForm();

      await reachVerifiedFinalStep();
      clickSubmit('fr');

      expect(await screen.findByRole('alert')).toHaveTextContent(
        formContent.fr.api.errorCodes[errorCode]
      );
      expect(container.querySelector(`.inquiry-error ${PHONE_LINK}`) !== null).toBe(showsPhone);
      const firstId = submitBody().submissionId;

      await renewTurnstileToken('second-token');
      clickSubmit('fr');
      await waitFor(() => expect(submitRequests()).toHaveLength(2));
      expect(submitBody().submissionId).toBe(firstId);
    }
  );

  it.each(locales)(
    'returns to the step of a backend field error and keeps values: %s',
    async (locale) => {
      mockDemandeApi({
        submit: () =>
          jsonResponse(
            {
              success: false,
              error: 'Données invalides.',
              errorCode: 'VALIDATION_FAILED',
              fieldErrors: { email: 'Untranslated fallback' },
              fieldErrorCodes: { email: 'INVALID_EMAIL' },
            },
            400
          ),
      });
      renderForm(locale);
      const { api, demandeClassement } = formContent[locale];

      await reachVerifiedFinalStep(locale);
      clickSubmit(locale);

      await waitFor(() => expect(fieldByName('email')).toHaveFocus());
      expect(currentStepLabel()).toContain(demandeClassement.steps[1]);
      expect(fieldByName('email')).toHaveAccessibleDescription(api.fieldErrors.email.INVALID_EMAIL);
      expect(fieldByName('email')).toHaveValue(WIZARD_VALUES.email);
      expect(fieldByName('nom')).toHaveValue(WIZARD_VALUES.nom);
      expect(screen.getByText(api.errorCodes.VALIDATION_FAILED)).toBeVisible();
      expect(screen.queryByText('Untranslated fallback')).not.toBeInTheDocument();
      expect(turnstile.remove).toHaveBeenCalledWith('test-widget');
      expect(analytics.trackFormSubmitFailed).toHaveBeenCalledWith('demande_classement', 'api', [
        'email',
      ]);
    }
  );

  it('preserves raw backend field errors without error codes', async () => {
    mockDemandeApi({
      submit: () =>
        jsonResponse(
          {
            code: 'INVALID_REQUEST',
            message: 'Invalid request',
            fieldErrors: { email: 'Use another email address' },
          },
          400
        ),
    });
    renderForm('en');

    await reachVerifiedFinalStep('en');
    clickSubmit('en');

    await waitFor(() =>
      expect(fieldByName('email')).toHaveAccessibleDescription('Use another email address')
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('handles a business validation failure returned with HTTP 200', async () => {
    mockDemandeApi({
      submit: () =>
        jsonResponse({
          success: false,
          errorCode: 'VALIDATION_FAILED',
          fieldErrorCodes: { email: 'INVALID_EMAIL' },
        }),
    });
    renderForm('nl');

    await reachVerifiedFinalStep('nl');
    clickSubmit('nl');

    await waitFor(() =>
      expect(fieldByName('email')).toHaveAccessibleDescription(
        formContent.nl.api.fieldErrors.email.INVALID_EMAIL
      )
    );
    expect(analytics.trackFormSubmitSucceeded).not.toHaveBeenCalled();
    expect(openAiAds.trackLeadCreatedConversion).not.toHaveBeenCalled();
  });
});

describe('commune refusée par le backend', () => {
  const invalidCommuneResponse = () =>
    jsonResponse(
      {
        success: false,
        error: 'Données invalides.',
        errorCode: 'VALIDATION_FAILED',
        fieldErrors: { commune: 'La commune sélectionnée ne correspond pas au code postal.' },
        fieldErrorCodes: { commune: 'INVALID_COMMUNE' },
      },
      400
    );

  it.each(locales)(
    'forces a new search with the same postal code on INVALID_COMMUNE: %s',
    async (locale) => {
      let submissions = 0;
      mockDemandeApi({
        communes: multipleCommunes,
        submit: () => {
          submissions += 1;
          return submissions === 1 ? invalidCommuneResponse() : jsonResponse(SUCCESS_BODY);
        },
      });
      renderForm(locale);
      const { api, demandeClassement } = formContent[locale];

      setField('codePostal', '24200');
      await waitFor(() => expect(hasField('commune')).toBe(true));
      setField('commune', '24520');
      setField('adresse', WIZARD_VALUES.adresse);
      clickNext(locale);
      completeCoordonneesStep(locale);
      setField('classementActuelDeclare', 'NC');
      fireEvent.click(fieldByName('consent'));
      turnstile.verify('first-token');
      clickSubmit(locale);

      await waitFor(() => expect(communesRequests()).toHaveLength(2));
      expect(postalCodeOf(String(communesRequests()[1]?.[0]))).toBe('24200');
      await waitFor(() => expect(currentStepLabel()).toContain(demandeClassement.steps[0]));
      await waitFor(() => expect(hasField('commune')).toBe(true));
      const select = fieldByName<HTMLSelectElement>('commune');
      expect(select).toHaveValue('');
      expect(select).toHaveAccessibleDescription(api.fieldErrors.commune.INVALID_COMMUNE);
      expect(hasField('adresse')).toBe(false);
      expect(openAiAds.trackLeadCreatedConversion).not.toHaveBeenCalled();
      const firstId = submitBody().submissionId;

      setField('commune', '24082');
      expect(fieldByName('adresse')).toHaveValue(WIZARD_VALUES.adresse);
      clickNext(locale);
      clickNext(locale);
      turnstile.verify('second-token');
      clickSubmit(locale);

      await screen.findByRole('status');
      expect(submitBody()).toMatchObject({
        submissionId: firstId,
        commune: 'Carsac-Aillac',
        codeInsee: '24082',
        turnstileToken: 'second-token',
      });
      expect(openAiAds.trackLeadCreatedConversion).toHaveBeenCalledTimes(1);
    }
  );

  it('auto-selects again after a forced search returning a single commune', async () => {
    mockDemandeApi({ submit: invalidCommuneResponse });
    renderForm();

    await reachVerifiedFinalStep();
    clickSubmit('fr');

    await waitFor(() => expect(communesRequests()).toHaveLength(2));
    await waitFor(() => expect(hasField('adresse')).toBe(true));
    expect(screen.getByText(COMMUNE_UNIQUE.nom)).toBeVisible();
    expect(screen.getByText(formContent.fr.api.fieldErrors.commune.INVALID_COMMUNE)).toBeVisible();
  });

  it('never displays the backend INSEE message and maps it to the commune', async () => {
    mockDemandeApi({
      submit: () =>
        jsonResponse(
          {
            success: false,
            error: 'Données invalides.',
            errorCode: 'VALIDATION_FAILED',
            fieldErrors: { codeInsee: "Le code INSEE n'est pas valide." },
            fieldErrorCodes: { codeInsee: 'INVALID_VALUE' },
          },
          400
        ),
    });
    renderForm();

    await reachVerifiedFinalStep();
    clickSubmit('fr');

    await waitFor(() => expect(communesRequests()).toHaveLength(2));
    await screen.findByText(formContent.fr.api.fieldErrors.commune.INVALID_COMMUNE);
    expect(currentStepLabel()).toContain(formContent.fr.demandeClassement.steps[0]);
    expect(document.body).not.toHaveTextContent(/INSEE/i);
  });
});

describe('nouvelle demande après un succès', () => {
  it.each(locales)(
    'restarts on step 1 with empty fields, a new UUID and restored focus: %s',
    async (locale) => {
      mockDemandeApi({ communes: multipleCommunes });
      const container = renderForm(locale);
      const form = container.querySelector('form') as HTMLFormElement;
      const { demandeClassement } = formContent[locale];

      setField('codePostal', '24200');
      await waitFor(() => expect(hasField('commune')).toBe(true));
      setField('commune', '24520');
      setField('adresse', WIZARD_VALUES.adresse);
      clickNext(locale);
      completeCoordonneesStep(locale);
      setField('classementActuelDeclare', 'NC');
      fireEvent.click(fieldByName('consent'));
      turnstile.verify('first-token');
      clickSubmit(locale);

      const success = await screen.findByRole('status');
      await waitFor(() => expect(success).toHaveFocus());
      expect(form).not.toBeVisible();
      const firstId = submitBody().submissionId;

      fireEvent.click(screen.getByRole('button', { name: demandeClassement.successAction }));

      expect(form).toBeVisible();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(currentStepLabel()).toContain(demandeClassement.steps[0]);
      expect(fieldByName('codePostal')).toHaveValue('');
      expect(fieldByName('codePostal')).toHaveFocus();
      expect(hasField('commune')).toBe(false);
      expect(hasField('adresse')).toBe(false);

      setField('codePostal', '24200');
      await waitFor(() => expect(hasField('commune')).toBe(true));
      expect(fieldByName('commune')).toHaveValue('');
      setField('commune', '24082');
      expect(fieldByName('adresse')).toHaveValue('');
      setField('adresse', '2 rue du Test');
      clickNext(locale);
      expect(fieldByName('nom')).toHaveValue('');
      completeCoordonneesStep(locale);
      expect(fieldByName('classementActuelDeclare')).toHaveValue('');
      expect(fieldByName('message')).toHaveValue('');
      expect(fieldByName('consent')).not.toBeChecked();
      setField('classementActuelDeclare', 'INCONNU');
      fireEvent.click(fieldByName('consent'));
      turnstile.verify('second-token');
      clickSubmit(locale);

      await screen.findByRole('status');
      expect(submitRequests()).toHaveLength(2);
      expect(submitBody().submissionId).not.toBe(firstId);
      expect(submitBody()).toMatchObject({ codeInsee: '24082', adresse: '2 rue du Test' });
      expect(analytics.trackFormSubmitSucceeded).toHaveBeenCalledTimes(2);
      expect(openAiAds.trackLeadCreatedConversion).toHaveBeenCalledTimes(2);
    }
  );

  it('does not show the previous commune after restarting', async () => {
    renderForm();

    await reachVerifiedFinalStep();
    clickSubmit('fr');
    await screen.findByRole('status');
    fireEvent.click(
      screen.getByRole('button', { name: formContent.fr.demandeClassement.successAction })
    );

    expect(screen.queryByText(COMMUNE_UNIQUE.nom)).not.toBeInTheDocument();
  });

  it('tracks form_started only once across the wizard', async () => {
    renderForm();

    await reachVerifiedFinalStep();

    expect(analytics.trackFormStarted).toHaveBeenCalledTimes(1);
  });
});

describe('contenu public', () => {
  it.each(locales)(
    'never mentions technical identifiers or the recipient inspector: %s',
    (locale) => {
      const copy = JSON.stringify(formContent[locale].demandeClassement);

      expect(copy).not.toMatch(/INSEE|SIREN|EPCI/i);
      expect(JSON.stringify(formContent[locale].api.errorCodes)).not.toMatch(/INSEE|SIREN|EPCI/i);
      expect(JSON.stringify(formContent[locale].api.fieldErrors)).not.toMatch(/INSEE|SIREN|EPCI/i);
    }
  );

  it.each(locales)('shows the localized privacy link on the last step: %s', async (locale) => {
    const container = renderForm(locale);
    const privacyLink = `a[href="${localizedRoutes.confidentialite[locale]}"]`;

    expect(container.querySelector(privacyLink)).not.toBeInTheDocument();

    await reachFinalStep(locale);

    expect(container.querySelector(privacyLink)).toBeVisible();
  });

  it.each(locales)('has no accessibility violation on any step: %s', async (locale) => {
    mockDemandeApi({ communes: multipleCommunes });
    const container = renderForm(locale);

    await expectNoA11yViolations(container);

    setField('codePostal', '24200');
    await waitFor(() => expect(hasField('commune')).toBe(true));
    await expectNoA11yViolations(container);
    setField('commune', '24520');
    setField('adresse', WIZARD_VALUES.adresse);
    clickNext(locale);
    await expectNoA11yViolations(container);

    completeCoordonneesStep(locale);
    await expectNoA11yViolations(container);
  });
});
