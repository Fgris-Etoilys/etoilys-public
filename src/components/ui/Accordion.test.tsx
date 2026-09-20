import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Accordion from './Accordion';
import { expectNoA11yViolations } from '../../test/a11y';

const items = [
  { question: 'First question', answer: <a href="/procedure">First answer</a> },
  { question: 'Second question', answer: <p>Second answer</p> },
];

describe('Accordion', () => {
  afterEach(cleanup);

  it('keeps answers mounted but hidden, and opens only one panel per group', async () => {
    const { container, rerender } = render(<Accordion items={items} />);
    const buttons = screen.getAllByRole('button');
    const first = screen.getByRole('button', { name: 'First question' });
    const second = screen.getByRole('button', { name: 'Second question' });
    const ids = buttons.map((button) => button.getAttribute('aria-controls'));

    expect(screen.queryAllByRole('region')).toHaveLength(0);
    const link = screen.getByRole('link', { hidden: true });
    expect(link).not.toBeVisible();
    expect(link.closest('[hidden]')).not.toBeNull();

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(link).toBeVisible();
    expect(screen.getByRole('region')).toHaveAttribute('aria-labelledby', first.id);

    fireEvent.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(link).not.toBeVisible();
    expect(screen.getAllByRole('region')).toHaveLength(1);
    expect(screen.getByRole('region')).toHaveAttribute('id', ids[1]);

    rerender(<Accordion items={items} />);
    expect(screen.getAllByRole('button').map((b) => b.getAttribute('aria-controls'))).toEqual(ids);
    fireEvent.click(second);
    expect(screen.queryAllByRole('region')).toHaveLength(0);
    expect(screen.getByRole('link', { hidden: true })).toBe(link);
    await expectNoA11yViolations(container);
  });

  it('gives separate groups unique IDs and independent open panels', () => {
    const { container } = render(
      <>
        <Accordion items={items} />
        <Accordion items={items} />
      </>
    );
    const buttons = screen.getAllByRole('button');
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('type', 'button');
      expect(document.getElementById(button.getAttribute('aria-controls') ?? '')).toHaveAttribute(
        'aria-labelledby',
        button.id
      );
    });
    screen
      .getAllByRole('button', { name: 'First question' })
      .forEach((button) => fireEvent.click(button));
    expect(screen.getAllByRole('region')).toHaveLength(2);
  });

  it('keeps compact density single-open', () => {
    render(<Accordion items={items} density="compact" />);
    const first = screen.getByRole('button', { name: 'First question' });
    const second = screen.getByRole('button', { name: 'Second question' });

    expect(first).toHaveClass('py-[22px]');
    fireEvent.click(first);
    fireEvent.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });
});
