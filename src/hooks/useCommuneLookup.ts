import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchCommunesByPostalCode, type CommuneOption } from '../utils/communesApi';

export type CommuneLookup =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; communes: CommuneOption[] }
  | { status: 'empty' }
  | { status: 'unavailable' };

/**
 * À monter dans le composant qui survit aux changements d'étape : les résultats restent ainsi
 * disponibles au retour sur l'étape Logement, sans nouvelle recherche.
 */
export function useCommuneLookup() {
  const [lookup, setLookup] = useState<CommuneLookup>({ status: 'idle' });
  const latestRequestId = useRef(0);
  const controller = useRef<AbortController | null>(null);

  const cancelCurrentRequest = useCallback(() => {
    latestRequestId.current += 1;
    controller.current?.abort();
    controller.current = null;
  }, []);

  useEffect(() => cancelCurrentRequest, [cancelCurrentRequest]);

  const reset = useCallback(() => {
    cancelCurrentRequest();
    setLookup({ status: 'idle' });
  }, [cancelCurrentRequest]);

  /**
   * Lance toujours une nouvelle recherche, même pour le code postal courant. Renvoie les communes
   * trouvées, ou `null` si la recherche a échoué ou n'est plus la plus récente.
   */
  const search = useCallback(
    async (codePostal: string): Promise<CommuneOption[] | null> => {
      cancelCurrentRequest();
      const requestId = latestRequestId.current;
      const requestController = new AbortController();
      controller.current = requestController;
      setLookup({ status: 'loading' });

      try {
        const communes = await fetchCommunesByPostalCode(codePostal, requestController.signal);
        // L'annulation ne suffit pas : une réponse déjà reçue peut arriver après une recherche plus récente.
        if (requestId !== latestRequestId.current) return null;
        setLookup(communes.length > 0 ? { status: 'ready', communes } : { status: 'empty' });
        return communes;
      } catch {
        if (requestId !== latestRequestId.current) return null;
        setLookup({ status: 'unavailable' });
        return null;
      }
    },
    [cancelCurrentRequest]
  );

  return { lookup, search, reset };
}
