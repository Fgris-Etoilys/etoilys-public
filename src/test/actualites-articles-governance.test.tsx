import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import {
  actualitesArticlesByRecency,
  formatReadingTime,
  getArticleCategoryLabel,
} from '../content/actualitesArticles';
import { getArticleStructuredData } from '../content/articleStructuredData';

function renderAt(pathname: string) {
  window.history.pushState({}, 'Article test', pathname);
  return render(<App />);
}

describe('actualites article governance', () => {
  afterEach(() => {
    cleanup();
  });

  it('keeps every active article backed by category, reading time and structured metadata', () => {
    actualitesArticlesByRecency.forEach((article) => {
      expect(getArticleCategoryLabel(article.category)).toMatch(/\S/);
      expect(article.readingTimeMinutes).toBeGreaterThan(0);
      expect(formatReadingTime(article.readingTimeMinutes)).toMatch(/min de lecture$/);
      expect(getArticleStructuredData(article.href)).not.toBeNull();
    });
  });

  it('renders one H1 per active article page through the shared layout', () => {
    actualitesArticlesByRecency.forEach((article) => {
      const { unmount } = renderAt(article.href);
      const headings = screen.getAllByRole('heading', { level: 1 });

      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent(article.title);
      expect(screen.getByRole('article', { name: article.title })).toBeInTheDocument();

      unmount();
    });
  });

  it('keeps article pages off the legacy ArticleHeaderMeta component', () => {
    const pagesDir = path.resolve(process.cwd(), 'src', 'pages', 'actualites');
    const pageSources = readdirSync(pagesDir)
      .filter((fileName) => fileName.endsWith('.tsx'))
      .map((fileName) => readFileSync(path.join(pagesDir, fileName), 'utf8'));

    expect(pageSources.some((source) => source.includes('ArticleHeaderMeta'))).toBe(false);
  });

  it('renders a table of contents on every active article page', () => {
    actualitesArticlesByRecency.forEach((article) => {
      const { unmount } = renderAt(article.href);

      expect(
        screen.getAllByRole('navigation', { name: 'Sommaire de l’article' }).length
      ).toBeGreaterThan(0);

      unmount();
    });
  });

  it('keeps table of contents entries aligned with stable article section ids', () => {
    const pagesDir = path.resolve(process.cwd(), 'src', 'pages', 'actualites');

    readdirSync(pagesDir)
      .filter((fileName) => fileName.endsWith('.tsx'))
      .forEach((fileName) => {
        const source = readFileSync(path.join(pagesDir, fileName), 'utf8');
        const tableOfContentsIds = [...source.matchAll(/id:\s*'([^']+)'/g)].map(
          (match) => match[1]
        );
        const sectionHeadingIds = [...source.matchAll(/<ArticleSectionHeading id="([^"]+)"/g)].map(
          (match) => match[1]
        );

        expect(source).not.toContain('<h2 className="mt-12 mb-4">');
        expect(tableOfContentsIds).toHaveLength(sectionHeadingIds.length);
        expect(new Set(tableOfContentsIds)).toEqual(new Set(sectionHeadingIds));
      });
  });
});
