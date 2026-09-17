import { MemoryRouter } from 'react-router-dom';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { actualitesArticlesByRecency } from '../../content/actualitesArticles';
import ActualitesArticleCard from './ActualitesArticleCard';
import FeaturedActualiteCard from './FeaturedActualiteCard';

function getTestArticle() {
  const article = actualitesArticlesByRecency[0];
  if (!article) {
    throw new Error('Missing actualites article fixture');
  }
  return article;
}

describe('Actualites article cards', () => {
  afterEach(cleanup);

  it('renders the standard card as one semantic article with one full-card link', () => {
    const article = getTestArticle();

    render(
      <MemoryRouter>
        <ActualitesArticleCard article={article} />
      </MemoryRouter>
    );

    const card = screen.getByRole('article');
    const links = within(card).getAllByRole('link');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', article.href);
    expect(links[0]).toContainElement(screen.getByRole('heading', { name: article.title }));
  });

  it('renders the featured card as one semantic article with one full-card link', () => {
    const article = getTestArticle();

    render(
      <MemoryRouter>
        <FeaturedActualiteCard article={article} />
      </MemoryRouter>
    );

    const card = screen.getByRole('article');
    const links = within(card).getAllByRole('link');

    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute('href', article.href);
    expect(links[0]).toContainElement(screen.getByRole('heading', { name: article.title }));
  });
});
