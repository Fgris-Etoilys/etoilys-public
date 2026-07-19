import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import ArticleSources, { type ArticleSource } from './ArticleSources';

function makeSources(count: number): ArticleSource[] {
  return Array.from({ length: count }, (_, index) => {
    const sourceNumber = index + 1;

    return {
      id: `source-${sourceNumber}`,
      organization: `Organisation ${sourceNumber}`,
      title: `Document officiel ${sourceNumber}`,
      url: `https://example.com/source-${sourceNumber}`,
      detail: sourceNumber === 1 ? 'Détail complémentaire.' : undefined,
    };
  });
}

describe('ArticleSources', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when the source list is empty', () => {
    const { container } = render(<ArticleSources sources={[]} />);

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole('heading', { level: 2, name: 'Sources officielles' })
    ).not.toBeInTheDocument();
  });

  it('renders two sources directly in a semantic section list', () => {
    render(<ArticleSources sources={makeSources(2)} />);

    const section = screen
      .getByRole('heading', { level: 2, name: 'Sources officielles' })
      .closest('section');

    expect(section).toHaveAttribute('id', 'sources-officielles');
    expect(within(section as HTMLElement).getByRole('list')).toBeInTheDocument();
    expect(within(section as HTMLElement).getAllByRole('listitem')).toHaveLength(2);
    expect(screen.queryByText(/Afficher les/)).not.toBeInTheDocument();
  });

  it('renders three sources without a collapsible block', () => {
    render(<ArticleSources sources={makeSources(3)} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(document.querySelector('details')).not.toBeInTheDocument();
  });

  it('renders four sources with the first three visible and one additional source in details', () => {
    render(<ArticleSources sources={makeSources(4)} />);

    const details = document.querySelector('details');
    const summary = document.querySelector('summary');

    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(details).toBeInTheDocument();
    expect(summary).toHaveTextContent("Afficher l'autre source");
    expect(summary).toHaveTextContent('Masquer les sources supplémentaires');
    expect(summary?.tagName).toBe('SUMMARY');

    summary?.focus();
    expect(document.activeElement).toBe(summary);
    fireEvent.click(summary as HTMLElement);
    expect(details).toHaveAttribute('open');
    fireEvent.click(summary as HTMLElement);
    expect(details).not.toHaveAttribute('open');
  });

  it('renders ten sources with a dynamic summary label and every source present in the DOM', () => {
    render(<ArticleSources sources={makeSources(10)} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(10);
    expect(screen.getByText('Afficher les 7 autres sources')).toBeInTheDocument();
    expect(screen.getByText('Organisation 10')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Document officiel 10/ })).toBeInTheDocument();
  });

  it('keeps external links secure and announces the new tab accessibly', () => {
    render(<ArticleSources sources={makeSources(1)} />);

    const link = screen.getByRole('link', {
      name: /Document officiel 1\s*\(ouvre dans un nouvel onglet\)/,
    });

    expect(link).toHaveAttribute('href', 'https://example.com/source-1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(link).getByText('(ouvre dans un nouvel onglet)')).toHaveClass('sr-only');
  });
});
