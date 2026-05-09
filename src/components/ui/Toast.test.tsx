import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ToastProvider, useToast, type ToastType } from './Toast';

function ToastTrigger({
  message = 'Notification affichée.',
  type = 'success',
  durationMs = 1000,
}: {
  message?: string;
  type?: ToastType;
  durationMs?: number;
}) {
  const { showToast } = useToast();

  return (
    <button type="button" onClick={() => showToast(message, { type, durationMs })}>
      Afficher
    </button>
  );
}

describe('ToastProvider', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('affiche une notification de succès accessible', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ToastTrigger message="La pièce a été ajoutée." />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /afficher/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/la pièce a été ajoutée/i);
  });

  it('affiche une notification d’erreur avec le rôle alert', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ToastTrigger message="Impossible de générer le PDF." type="error" />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /afficher/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/impossible de générer le pdf/i);
  });

  it('retire automatiquement une notification après sa durée', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <ToastTrigger message="Lien copié." durationMs={1200} />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /afficher/i }));
    expect(screen.getByText(/lien copié/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1199);
    });
    expect(screen.getByText(/lien copié/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByText(/lien copié/i)).not.toBeInTheDocument();
  });

  it('nettoie le timer quand une notification est démontée', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount } = render(
      <ToastProvider>
        <ToastTrigger message="Notification temporaire." durationMs={5000} />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /afficher/i }));
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
