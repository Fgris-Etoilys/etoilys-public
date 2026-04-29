import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    cleanup();
  });

  it('opens immediately when the trigger is hovered', () => {
    render(<Tooltip srLabel="Information">Contenu du tooltip</Tooltip>);

    const trigger = screen.getByRole('button', { name: 'Information' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    expect(tooltip).toHaveClass('hidden');

    fireEvent.mouseEnter(trigger);

    expect(tooltip).toHaveClass('block');
    expect(tooltip).toHaveAttribute('aria-hidden', 'false');
  });

  it('stays open when the mouse reaches the tooltip before the dismiss delay', () => {
    render(<Tooltip srLabel="Information">Contenu du tooltip</Tooltip>);

    const trigger = screen.getByRole('button', { name: 'Information' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    fireEvent.mouseEnter(tooltip);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(tooltip).toHaveClass('block');
    expect(tooltip).toHaveAttribute('aria-hidden', 'false');
  });

  it('closes after 400 ms once the mouse has left the trigger and tooltip', () => {
    render(<Tooltip srLabel="Information">Contenu du tooltip</Tooltip>);

    const trigger = screen.getByRole('button', { name: 'Information' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });

    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    fireEvent.mouseEnter(tooltip);
    fireEvent.mouseLeave(tooltip);

    act(() => {
      vi.advanceTimersByTime(399);
    });

    expect(tooltip).toHaveClass('block');

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(tooltip).toHaveClass('hidden');
    expect(tooltip).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders linked content inside the tooltip', () => {
    render(
      <Tooltip srLabel="Information">
        <span>Texte du tooltip</span>
        <a href="https://example.com">Lien utile</a>
      </Tooltip>
    );

    const trigger = screen.getByRole('button', { name: 'Information' });

    fireEvent.mouseEnter(trigger);

    expect(screen.getByRole('link', { name: 'Lien utile' })).toHaveAttribute(
      'href',
      'https://example.com'
    );
  });
});
