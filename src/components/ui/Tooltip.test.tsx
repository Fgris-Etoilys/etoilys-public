import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Tooltip from './Tooltip';

const createRect = ({
  left = 0,
  top = 0,
  width = 0,
  height = 0,
}: {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}): DOMRect => {
  const rect = {
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  };

  return rect as DOMRect;
};

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
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

  it('keeps the tooltip inside the viewport when the trigger is close to the right edge', () => {
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(360);

    render(<Tooltip srLabel="Information">Contenu du tooltip</Tooltip>);

    const trigger = screen.getByRole('button', { name: 'Information' });
    const tooltip = screen.getByRole('tooltip', { hidden: true });
    const container = trigger.parentElement;

    if (!container) {
      throw new Error('Tooltip trigger container was not rendered');
    }

    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(
      createRect({ left: 330, width: 16, height: 16 })
    );
    vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue(
      createRect({ left: 178, width: 320, height: 96 })
    );

    fireEvent.mouseEnter(trigger);

    expect(tooltip.getAttribute('style')).toContain('max-width: calc(100vw - 32px)');
    expect(tooltip.getAttribute('style')).toContain('transform: translateX(calc(-50% + -154px))');
  });
});
