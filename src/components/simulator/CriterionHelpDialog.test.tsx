import { useState } from 'react';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { GridCriterion } from '../../content/simulatorGrid';
import type { CritereAide } from '../../content/criteresAide';
import CriterionHelpDialog from './CriterionHelpDialog';

const criterion: GridCriterion = {
  num_critere: 57,
  libelle: 'Critère de test',
  points: 2,
  peut_etre_non_applicable: true,
  categories: [],
};

const aide: CritereAide = {
  numero: 57,
  titre: criterion.libelle,
  description: 'Introduction\n- Première consigne\n  - Précision',
  description_suite: 'Complément après illustration',
  illustration: '/illustration-test.svg',
  non_applicabilite: 'Condition de non-applicabilité',
  notes: 'Note complémentaire',
};

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

describe('CriterionHelpDialog', () => {
  it('contains keyboard focus and restores the trigger and body scroll on Escape', () => {
    function HelpExample() {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <>
          <button onClick={() => setIsOpen(true)}>Ouvrir</button>
          <CriterionHelpDialog
            criterion={isOpen ? criterion : null}
            aide={aide}
            isLoading={false}
            onClose={() => setIsOpen(false)}
          />
        </>
      );
    }

    document.body.style.overflow = 'scroll';
    render(<HelpExample />);
    const trigger = screen.getByRole('button');
    trigger.focus();
    const restoreFocus = vi.spyOn(trigger, 'focus');
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    const closeButton = within(dialog).getByRole('button');
    const content = within(dialog).getByRole('region');
    expect(closeButton).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true });
    expect(content).toHaveFocus();
    fireEvent.keyDown(content, { key: 'Tab' });
    expect(closeButton).toHaveFocus();
    fireEvent.keyDown(closeButton, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(restoreFocus).toHaveBeenCalledWith({ preventScroll: true });
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('keeps structured help and image ordering when loading completes without moving focus', () => {
    const initialClose = vi.fn();
    const latestClose = vi.fn();
    const { rerender } = render(
      <CriterionHelpDialog criterion={criterion} aide={null} isLoading onClose={initialClose} />
    );
    const content = screen.getByRole('region');
    content.focus();
    rerender(
      <CriterionHelpDialog
        criterion={{ ...criterion }}
        aide={aide}
        isLoading={false}
        onClose={latestClose}
      />
    );
    expect(content).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(content, { key: 'Escape' });
    expect(initialClose).not.toHaveBeenCalled();
    expect(latestClose).toHaveBeenCalledOnce();
    expect(screen.getAllByRole('list')).toHaveLength(2);
    expect(screen.getByText(aide.non_applicabilite!)).toBeInTheDocument();
    expect(screen.getByText(aide.notes!)).toBeInTheDocument();
    expect(
      screen.getByRole('img').compareDocumentPosition(screen.getByText(aide.description_suite!)) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('cleans up when its trigger has been removed', () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
    const restoreFocus = vi.spyOn(trigger, 'focus');
    document.body.style.overflow = 'auto';
    const onClose = vi.fn();
    const { unmount } = render(
      <CriterionHelpDialog criterion={criterion} aide={aide} isLoading={false} onClose={onClose} />
    );
    trigger.remove();
    unmount();
    expect(document.body.style.overflow).toBe('auto');
    expect(restoreFocus).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });
});
