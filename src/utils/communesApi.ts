import { getApiUrl } from './api';

// Le backend plafonne `taille` à 50 et renvoie un tableau sans total : seule une page incomplète
// prouve que la liste est exhaustive. La taille par défaut (20) tronque certains codes postaux.
const COMMUNES_PAGE_SIZE = 50;
const COMMUNES_MAX_PAGES = 5;
const COMMUNES_TIMEOUT_MS = 10_000;

export interface CommuneOption {
  codeInsee: string;
  nom: string;
}

const isCommuneOption = (value: unknown): value is CommuneOption =>
  typeof value === 'object' &&
  value !== null &&
  'codeInsee' in value &&
  typeof value.codeInsee === 'string' &&
  value.codeInsee.length > 0 &&
  'nom' in value &&
  typeof value.nom === 'string' &&
  value.nom.length > 0;

const fetchCommunesPage = async (
  codePostal: string,
  page: number,
  signal: AbortSignal
): Promise<CommuneOption[]> => {
  const query = new URLSearchParams({
    codePostal,
    taille: String(COMMUNES_PAGE_SIZE),
    page: String(page),
  });
  const response = await fetch(getApiUrl(`/public/communes?${query.toString()}`), {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Communes API responded with HTTP ${response.status}`);
  }

  const body: unknown = await response.json();
  if (!Array.isArray(body) || !body.every(isCommuneOption)) {
    throw new Error('Invalid communes API response');
  }

  // Le territoire et le millésime de la réponse publique ne sont jamais conservés côté site.
  return body.map(({ codeInsee, nom }: CommuneOption) => ({ codeInsee, nom }));
};

/**
 * Renvoie toutes les communes officielles d'un code postal. Toute panne (réponse non 200, JSON
 * invalide, réseau, délai dépassé) rejette la promesse : l'appelant reste bloquant, sans choix inventé.
 */
export const fetchCommunesByPostalCode = async (
  codePostal: string,
  signal: AbortSignal
): Promise<CommuneOption[]> => {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener('abort', abort);
  const timeout = setTimeout(abort, COMMUNES_TIMEOUT_MS);

  try {
    const communes: CommuneOption[] = [];
    for (let page = 0; page < COMMUNES_MAX_PAGES; page += 1) {
      const pageCommunes = await fetchCommunesPage(codePostal, page, controller.signal);
      communes.push(...pageCommunes);
      if (pageCommunes.length < COMMUNES_PAGE_SIZE) {
        return communes;
      }
    }
    throw new Error('Communes API returned too many pages');
  } finally {
    clearTimeout(timeout);
    signal.removeEventListener('abort', abort);
  }
};
