import { useEffect, useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import FactuellePiecesTab from './FactuellePiecesTab';
import { ToastProvider } from '../../ui/Toast';
import { useFactuelleSimulation } from '../../../hooks/useFactuelleSimulation';
import {
  parseEvaluationFactuelle,
  type FactuellePieceTarget,
} from '../../../utils/simulatorFactuelle.types';
import {
  besoin,
  catalogueResponse,
  chambre,
  evaluationResponse,
  FACTUELLE_SIMULATION_ID as ID,
  faitsResponse,
  salleEau1,
} from '../../../test/factuelleFixtures';

vi.mock('../../../utils/analytics', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../utils/analytics')>()),
  trackClassementSimulatorPieceSaved: vi.fn(),
  trackClassementSimulatorPieceDeleted: vi.fn(),
}));

const evaluation = parseEvaluationFactuelle(
  evaluationResponse({
    besoins: [
      besoin({ piece_id: 'piece-chambre', champ: 'inspection.rangements', num_critere: 23 }),
    ],
  })
);

function Harness({ target }: { target: FactuellePieceTarget | null }) {
  const factuelle = useFactuelleSimulation(ID);
  const loadFactuelle = factuelle.load;
  const [current, setCurrent] = useState(target);
  const [received, setReceived] = useState(target);
  if (target !== received) {
    setReceived(target);
    setCurrent(target);
  }

  useEffect(() => {
    void loadFactuelle(ID, evaluation);
  }, [loadFactuelle]);

  if (!factuelle.snapshot) return null;
  return (
    <ToastProvider>
      <FactuellePiecesTab
        factuelle={factuelle}
        snapshot={factuelle.snapshot}
        gridSummary={null}
        contextBusy={false}
        target={current}
        onTargetHandled={() => setCurrent(null)}
        onFactsChanged={() => undefined}
      />
    </ToastProvider>
  );
}

function mockReads() {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockImplementation(
      async (input) =>
        new Response(
          JSON.stringify(
            String(input).endsWith('/catalogue')
              ? catalogueResponse
              : faitsResponse([chambre, salleEau1])
          ),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    );
}

const rangementsField = (dialog: HTMLElement) =>
  dialog.querySelector<HTMLElement>('[data-factuelle-field="inspection.rangements"]');

describe('FactuellePiecesTab — navigation ciblée', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  it('ouvre la pièce et le champ ciblés, y compris pour deux demandes successives identiques', async () => {
    mockReads();
    const target = { piece_id: 'piece-chambre', champ: 'inspection.rangements', num_critere: 23 };
    const view = render(<Harness target={{ requestId: 1, ...target }} />);

    let dialog = await screen.findByRole('dialog', { name: /chambre parentale/i });
    const field = rangementsField(dialog);
    await waitFor(() => expect(field?.contains(document.activeElement)).toBe(true));
    expect(field).toHaveAttribute('data-highlight', 'missing');

    fireEvent.click(within(field ?? dialog).getByRole('button', { name: 'Non' }));
    expect(field).not.toHaveAttribute('data-highlight');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Annuler' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    view.rerender(<Harness target={{ requestId: 2, ...target }} />);
    dialog = await screen.findByRole('dialog', { name: /chambre parentale/i });
    await waitFor(() =>
      expect(rangementsField(dialog)?.contains(document.activeElement)).toBe(true)
    );
  });

  it('ouvre la bonne section et focalise l’ajout quand la pièce n’existe pas encore', async () => {
    mockReads();
    render(
      <Harness
        target={{
          requestId: 1,
          piece_id: null,
          champ: 'sanitaires.lavabo_eau_chaude',
          num_critere: 39,
        }}
      />
    );

    await waitFor(() =>
      expect(screen.getByRole('tab', { name: /salles d’eau/i })).toHaveAttribute(
        'aria-selected',
        'true'
      )
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /ajouter une salle d’eau/i })).toHaveFocus()
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
