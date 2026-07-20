import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import {
  ACTUALITES_CATEGORY_FILTERS,
  actualitesArticlesByRecency,
  getFeaturedActualiteArticle,
  getArticleCategoryLabel,
  type ActualitesCategoryFilter,
} from '../content/actualitesArticles';

function renderAt(pathname: string) {
  window.history.pushState({}, 'Actualites test', pathname);
  return render(<App />);
}

function getFilterButton(filter: ActualitesCategoryFilter) {
  const label =
    filter === 'all'
      ? 'Tous'
      : ACTUALITES_CATEGORY_FILTERS.find((option) => option.value === filter)?.label;

  if (!label) {
    throw new Error(`Missing test filter label for ${filter}`);
  }

  return screen.getByRole('button', { name: label });
}

describe('Actualites page', () => {
  afterEach(() => {
    cleanup();
  });

  it('features the most recently published article on the all filter without duplicating it', () => {
    renderAt('/actualites');

    const featuredArticle = getFeaturedActualiteArticle();
    expect(featuredArticle).not.toBeNull();

    if (!featuredArticle) return;

    expect(screen.getAllByRole('heading', { level: 2, name: featuredArticle.title })).toHaveLength(
      1
    );
    expect(
      screen.getByRole('link', { name: `Lire l’article ${featuredArticle.title}` })
    ).toBeInTheDocument();
  });

  it('renders every filter as a pressed button only when active', () => {
    renderAt('/actualites?categorie=fiscalite');

    expect(
      screen.getByText(
        'Décryptages, guides pratiques et informations utiles sur le classement et la réglementation des meublés de tourisme.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Explorer les actualités')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Classement' })).not.toBeInTheDocument();

    ACTUALITES_CATEGORY_FILTERS.forEach((filter) => {
      expect(getFilterButton(filter.value)).toHaveAttribute(
        'aria-pressed',
        filter.value === 'fiscalite' ? 'true' : 'false'
      );
    });
  });

  it('normalizes an unknown category parameter back to the all filter URL', async () => {
    renderAt('/actualites?categorie=inconnue');

    await waitFor(() => {
      expect(window.location.pathname + window.location.search).toBe('/actualites');
    });

    expect(getFilterButton('all')).toHaveAttribute('aria-pressed', 'true');
  });

  it('removes the category parameter when the all filter is clicked', async () => {
    renderAt('/actualites?categorie=obligations');

    fireEvent.click(getFilterButton('all'));

    await waitFor(() => {
      expect(window.location.pathname + window.location.search).toBe('/actualites');
    });
    expect(getFilterButton('all')).toHaveAttribute('aria-pressed', 'true');
  });

  it('restores the previous category filter with browser history', async () => {
    renderAt('/actualites');

    fireEvent.click(getFilterButton('fiscalite'));
    await waitFor(() => {
      expect(window.location.search).toBe('?categorie=fiscalite');
    });

    fireEvent.click(getFilterButton('obligations'));
    await waitFor(() => {
      expect(window.location.search).toBe('?categorie=obligations');
    });

    window.history.back();

    await waitFor(() => {
      expect(window.location.search).toBe('?categorie=fiscalite');
      expect(getFilterButton('fiscalite')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  it('shows the exact empty state for a category without articles', async () => {
    renderAt('/actualites?categorie=classement');

    expect(
      screen.getByText('Aucun article n’est encore publié dans cette catégorie.')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Voir toutes les actualités' }));

    await waitFor(() => {
      expect(window.location.pathname + window.location.search).toBe('/actualites');
    });
  });

  it('keeps filtered category cards complete and accessible', () => {
    renderAt('/actualites?categorie=fiscalite');

    const fiscalArticles = actualitesArticlesByRecency.filter(
      (article) => article.category === 'fiscalite'
    );

    fiscalArticles.forEach((article) => {
      expect(screen.getByRole('heading', { level: 2, name: article.title })).toBeInTheDocument();
      expect(screen.getAllByText(getArticleCategoryLabel(article.category)).length).toBeGreaterThan(
        0
      );
      expect(
        screen.getAllByText(`${article.readingTimeMinutes} min de lecture`).length
      ).toBeGreaterThan(0);
      expect(
        screen.getByRole('link', { name: `Lire l’article ${article.title}` })
      ).toBeInTheDocument();

      if (article.updatedAt && article.updatedAt !== article.publishedAt) {
        expect(
          screen.getAllByText(`Mis à jour le ${article.updatedDate ?? article.date}`).length
        ).toBeGreaterThan(0);
        expect(screen.queryByText(`Publié le ${article.date}`)).not.toBeInTheDocument();
      } else {
        expect(screen.getAllByText(`Publié le ${article.date}`).length).toBeGreaterThan(0);
      }
    });
  });
});
