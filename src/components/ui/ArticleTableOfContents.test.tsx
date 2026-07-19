import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ArticleSectionHeading from './ArticleSectionHeading';
import ArticleTableOfContents, { type ArticleTableOfContentsItem } from './ArticleTableOfContents';

const tableOfContents: readonly ArticleTableOfContentsItem[] = [
  { id: 'section-one', label: 'Première section' },
  { id: 'section-two', label: 'Deuxième section' },
];

describe('ArticleTableOfContents', () => {
  afterEach(() => {
    cleanup();
    window.history.pushState({}, 'Test', '/');
    vi.unstubAllGlobals();
  });

  it('renders desktop navigation with the expected accessibility attributes', () => {
    render(<ArticleTableOfContents items={tableOfContents} variant="desktop" />);

    const navigation = screen.getByRole('navigation', { name: 'Sommaire de l’article' });
    expect(navigation).toHaveClass('table-of-contents-scrollbar');
    expect(navigation.closest('aside')).toHaveClass('hidden', 'xl:block');
    expect(screen.getByRole('link', { name: 'Première section' })).toHaveAttribute(
      'href',
      '#section-one'
    );
  });

  it('renders a collapsible mobile navigation and closes it after link click', () => {
    const { container } = render(
      <>
        <ArticleTableOfContents items={tableOfContents} variant="mobile" />
        <ArticleSectionHeading id="section-one">Section one</ArticleSectionHeading>
        <ArticleSectionHeading id="section-two">Section two</ArticleSectionHeading>
      </>
    );

    const details = container.querySelector('details');
    expect(details).toHaveClass('xl:hidden');
    expect(screen.getByText('Dans cet article')).toBeInTheDocument();

    details?.setAttribute('open', '');
    const link = screen.getByRole('link', { name: 'Deuxième section' });

    fireEvent.click(link);

    expect(details).not.toHaveAttribute('open');
    expect(link).toHaveAttribute('aria-current', 'location');
  });

  it('uses the URL fragment as the active section when available', () => {
    window.history.pushState({}, 'Test', '/actualites/test#section-two');

    render(<ArticleTableOfContents items={tableOfContents} variant="desktop" />);

    expect(screen.getByRole('link', { name: 'Deuxième section' })).toHaveAttribute(
      'aria-current',
      'location'
    );
    expect(screen.getByRole('link', { name: 'Première section' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('does not mark a section active without fragment, click or observer signal', () => {
    render(<ArticleTableOfContents items={tableOfContents} variant="desktop" />);

    expect(screen.getByRole('link', { name: 'Première section' })).not.toHaveAttribute(
      'aria-current'
    );
    expect(screen.getByRole('link', { name: 'Deuxième section' })).not.toHaveAttribute(
      'aria-current'
    );
  });

  it('updates aria-current from IntersectionObserver', () => {
    const observers: Array<{
      callback: IntersectionObserverCallback;
      disconnect: ReturnType<typeof vi.fn>;
      observe: ReturnType<typeof vi.fn>;
    }> = [];

    class MockIntersectionObserver {
      readonly disconnect = vi.fn();
      readonly observe = vi.fn();

      constructor(readonly callback: IntersectionObserverCallback) {
        observers.push(this);
      }
    }

    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    render(
      <>
        <ArticleTableOfContents items={tableOfContents} variant="desktop" />
        <ArticleSectionHeading id="section-one">Première section</ArticleSectionHeading>
        <ArticleSectionHeading id="section-two">Deuxième section</ArticleSectionHeading>
      </>
    );

    const secondHeading = document.getElementById('section-two');
    expect(secondHeading).not.toBeNull();
    if (secondHeading === null) {
      throw new Error('Missing section-two heading');
    }

    act(() => {
      observers[0]?.callback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 0.5,
            target: secondHeading,
          } as unknown as IntersectionObserverEntry,
        ],
        observers[0] as unknown as IntersectionObserver
      );
    });

    expect(screen.getByRole('link', { name: 'Deuxième section' })).toHaveAttribute(
      'aria-current',
      'location'
    );
  });
});
