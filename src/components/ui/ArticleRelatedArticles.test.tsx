import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import type { ActualiteArticle } from '../../content/actualitesArticles';
import ArticleRelatedArticles from './ArticleRelatedArticles';

function makeArticle(slug: string, updated = false): ActualiteArticle {
  const article: ActualiteArticle = {
    slug,
    title: `Titre ${slug}`,
    excerpt: `Résumé court ${slug}`,
    relatedSummary: `Résumé connexe complet ${slug}.`,
    imageKey: 'articleMeubles20252026',
    href: `/actualites/${slug}`,
    category: 'reglementation',
    readingTimeMinutes: 5,
    authorId: 'florian-grisorio',
    authorName: 'Florian Grisorio',
    date: '19 juillet 2026',
    publishedAt: '2026-07-19',
  };

  if (updated) {
    article.updatedDate = '20 juillet 2026';
    article.updatedAt = '2026-07-20';
  }

  return article;
}

function renderRelatedArticles(articles: readonly ActualiteArticle[]) {
  return render(
    <MemoryRouter>
      <ArticleRelatedArticles articles={articles} />
    </MemoryRouter>
  );
}

describe('ArticleRelatedArticles', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a semantic related articles section with accessible links', () => {
    renderRelatedArticles([makeArticle('one'), makeArticle('two', true)]);

    const sectionHeading = screen.getByRole('heading', { level: 2, name: 'À lire aussi' });
    const list = screen.getByRole('list', { name: 'Articles connexes' });
    const items = within(list).getAllByRole('listitem');

    expect(sectionHeading).toHaveAttribute('id', 'related-heading');
    expect(list).toHaveAttribute('tabindex', '0');
    expect(items).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'Titre one' })).toHaveAttribute(
      'href',
      '/actualites/one'
    );
    expect(screen.getByRole('link', { name: 'Lire l’article Titre one' })).toHaveAttribute(
      'href',
      '/actualites/one'
    );
    expect(screen.getByText('Publié le 19 juillet 2026')).toBeInTheDocument();
    expect(screen.getByText('Mis à jour le 20 juillet 2026')).toBeInTheDocument();
    expect(screen.getByText('Résumé connexe complet one.')).toBeInTheDocument();
    expect(screen.queryByText('Résumé court one')).not.toBeInTheDocument();
    expect(screen.queryByText('Lire plus')).not.toBeInTheDocument();
  });

  it('limits rendering to 3 cards', () => {
    renderRelatedArticles([
      makeArticle('one'),
      makeArticle('two'),
      makeArticle('three'),
      makeArticle('four'),
    ]);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders nothing without related articles', () => {
    const { container } = renderRelatedArticles([]);

    expect(container).toBeEmptyDOMElement();
  });
});
