import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest';
import { formContent } from '../i18n/formContent';
import type { Locale } from '../i18n/locales';

type ApiHandler = (url: string, init?: RequestInit) => Response | Promise<Response>;

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const communeDto = (codeInsee: string, nom: string, codePostal = '24150') => ({
  codeInsee,
  nom,
  codesPostaux: [codePostal],
  millesime: 2026,
  territoire: { siren: '200000172', nom: 'CC de test', type: 'CC' },
});

export const COMMUNE_UNIQUE = communeDto('24260', 'Mauzac-et-Grand-Castang');

export const COMMUNES_MULTIPLES = [
  communeDto('24082', 'Carsac-Aillac', '24200'),
  communeDto('24520', 'Sarlat-la-Canéda', '24200'),
];

export const SUCCESS_BODY = { success: true, message: 'ok' };

export const WIZARD_VALUES = {
  adresse: '1 rue du Test',
  nom: 'Doe',
  prenom: 'Jane',
  email: 'jane@example.com',
  telephone: '06 12 34 56 78',
};

const isCommunesRequest = (input: unknown) => String(input).includes('/public/communes');

/** Route `fetch` selon l'URL : le wizard enchaîne des GET communes et le POST du formulaire. */
export const mockDemandeApi = ({
  communes = () => jsonResponse([COMMUNE_UNIQUE]),
  submit = () => jsonResponse(SUCCESS_BODY),
}: { communes?: ApiHandler; submit?: ApiHandler } = {}) =>
  vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async (input, init) =>
      isCommunesRequest(input) ? communes(String(input), init) : submit(String(input), init)
    );

const fetchCalls = () => vi.mocked(globalThis.fetch).mock.calls;

export const communesRequests = () => fetchCalls().filter(([input]) => isCommunesRequest(input));

export const submitRequests = () => fetchCalls().filter(([input]) => !isCommunesRequest(input));

/** Corps du dernier POST du formulaire. */
export const submitBody = (): Record<string, unknown> => {
  const requests = submitRequests();
  const request = requests[requests.length - 1];
  return JSON.parse(String(request?.[1]?.body)) as Record<string, unknown>;
};

export const installTurnstileMock = () => {
  let callback: ((token: string) => void) | undefined;
  const mock = {
    render: vi.fn((_container: HTMLElement, options: { callback: (token: string) => void }) => {
      callback = options.callback;
      return 'test-widget';
    }),
    reset: vi.fn(),
    remove: vi.fn(),
  };
  window.turnstile = mock;

  return {
    ...mock,
    verify: (token: string) => act(() => callback?.(token)),
  };
};

export const fieldByName = <T extends HTMLElement = HTMLInputElement>(name: string): T => {
  const element = document.querySelector<T>(`[name="${name}"]`);
  if (!element) throw new Error(`Missing field: ${name}`);
  return element;
};

export const hasField = (name: string) => document.querySelector(`[name="${name}"]`) !== null;

export const setField = (name: string, value: string) => {
  fireEvent.change(fieldByName(name), { target: { value } });
};

export const clickNext = (locale: Locale) => {
  fireEvent.click(
    screen.getByRole('button', { name: formContent[locale].demandeClassement.actions.next })
  );
};

export const clickPrevious = (locale: Locale) => {
  fireEvent.click(
    screen.getByRole('button', { name: formContent[locale].demandeClassement.actions.previous })
  );
};

export const clickSubmit = (locale: Locale) => {
  fireEvent.click(
    screen.getByRole('button', { name: formContent[locale].demandeClassement.submitButton })
  );
};

export const currentStepLabel = () =>
  document.querySelector('[aria-current="step"]')?.textContent ?? '';

export const completeLogementStep = async (locale: Locale, codePostal = '24150') => {
  setField('codePostal', codePostal);
  await waitFor(() => expect(hasField('adresse')).toBe(true));
  setField('adresse', WIZARD_VALUES.adresse);
  clickNext(locale);
};

export const completeCoordonneesStep = (locale: Locale) => {
  setField('nom', WIZARD_VALUES.nom);
  setField('prenom', WIZARD_VALUES.prenom);
  setField('email', WIZARD_VALUES.email);
  setField('telephone', WIZARD_VALUES.telephone);
  clickNext(locale);
};

/** Amène le wizard à la dernière étape, classement et consentement renseignés, sans jeton Turnstile. */
export const reachFinalStep = async (locale: Locale, classement = 'NC') => {
  await completeLogementStep(locale);
  completeCoordonneesStep(locale);
  setField('classementActuelDeclare', classement);
  fireEvent.click(fieldByName('consent'));
};

export const flushPromises = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve));
  });
