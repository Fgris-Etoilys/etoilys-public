import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import KeyTakeaways from './KeyTakeaways';

const textItems = [
  { id: 'one', content: 'Premier point clé' },
  { id: 'two', content: 'Second point clé' },
];

describe('KeyTakeaways', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the bullets variant with the shared heading and semantic list items', () => {
    render(<KeyTakeaways variant="bullets" items={textItems} />);

    expect(screen.getByRole('heading', { level: 2, name: 'À retenir' })).toBeInTheDocument();
    const list = screen.getByRole('list');

    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Premier point clé')).toBeInTheDocument();
  });

  it('renders the metrics variant as a description list', () => {
    const { container } = render(
      <KeyTakeaways
        variant="metrics"
        items={[
          {
            id: 'threshold',
            value: '15 000 €',
            label: 'Seuil',
            detail: 'Montant à vérifier dans le texte officiel.',
          },
        ]}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'À retenir' })).toBeInTheDocument();
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelector('dt')).toHaveTextContent('Seuil');
    expect(container.querySelector('dd')).toHaveTextContent('15 000 €');
    expect(container.querySelector('dd')).toHaveTextContent(
      'Montant à vérifier dans le texte officiel.'
    );
  });

  it('renders the comparison variant through the shared accessible comparison table', () => {
    render(
      <KeyTakeaways
        variant="comparison"
        caption="Comparaison de deux situations"
        columns={[
          { key: 'situation', label: 'Situation' },
          { key: 'rule', label: 'Règle' },
        ]}
        rows={[
          { key: 'one', cells: { situation: 'Situation A', rule: 'Règle A' } },
          { key: 'two', cells: { situation: 'Situation B', rule: 'Règle B' } },
        ]}
        items={[{ id: 'note', content: 'Complément court structuré.' }]}
      />
    );

    expect(screen.getByRole('heading', { level: 2, name: 'À retenir' })).toBeInTheDocument();
    expect(
      screen.getByRole('table', { name: 'Comparaison de deux situations' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Situation',
      'Règle',
    ]);
    expect(screen.getByRole('rowheader', { name: 'Situation A' })).toBeInTheDocument();
    expect(screen.getByText('Complément court structuré.')).toBeInTheDocument();
  });

  it('renders the warning variant as an identifiable aside with a main message', () => {
    render(
      <KeyTakeaways
        variant="warning"
        message="Point de vigilance principal."
        items={[{ id: 'short', content: 'Complément court.' }]}
      />
    );

    const aside = screen.getByRole('complementary', { name: 'À retenir' });

    expect(within(aside).getByRole('heading', { level: 2, name: 'À retenir' })).toBeInTheDocument();
    expect(within(aside).getByText('Point de vigilance principal.')).toBeInTheDocument();
    expect(within(aside).getByRole('listitem')).toHaveTextContent('Complément court.');
    expect(aside.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('throws in development instead of silently truncating text items above the limit', () => {
    expect(() =>
      render(
        <KeyTakeaways
          variant="bullets"
          items={[
            { id: 'one', content: 'Un' },
            { id: 'two', content: 'Deux' },
            { id: 'three', content: 'Trois' },
            { id: 'four', content: 'Quatre' },
            { id: 'five', content: 'Cinq' },
            { id: 'six', content: 'Six' },
          ]}
        />
      )
    ).toThrow(/at most 5 items/);
  });

  it('throws in development when comparison rows are outside the supported range', () => {
    expect(() =>
      render(
        <KeyTakeaways
          variant="comparison"
          caption="Comparaison incomplète"
          columns={[{ key: 'situation', label: 'Situation' }]}
          rows={[{ key: 'one', cells: { situation: 'Situation A' } }]}
        />
      )
    ).toThrow(/expects 2 or 3 rows/);
  });
});
