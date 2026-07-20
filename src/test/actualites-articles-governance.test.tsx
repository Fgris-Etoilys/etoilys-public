import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import App from '../App';
import {
  actualitesArticlesByRecency,
  formatReadingTime,
  getArticleCategoryLabel,
  getRelatedArticles,
} from '../content/actualitesArticles';
import { getArticleAuthor } from '../content/articleAuthors';
import { getArticleStructuredData } from '../content/articleStructuredData';

function renderAt(pathname: string) {
  window.history.pushState({}, 'Article test', pathname);
  return render(<App />);
}

function getHeadingLevel(heading: Element): number {
  return Number(heading.tagName.replace(/^H/i, ''));
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
      expect(getArticleAuthor(article.authorId).name).toBe(article.authorName);
      expect(getRelatedArticles(article)).toHaveLength(3);
    });
  });

  it('renders one H1 per active article page through the shared layout', () => {
    actualitesArticlesByRecency.forEach((article) => {
      const { unmount } = renderAt(article.href);
      const headings = screen.getAllByRole('heading', { level: 1 });
      const articleElement = screen.getByRole('article', { name: article.title });

      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent(article.title);
      expect(articleElement).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'À lire aussi' })).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Florian Grisorio' })
      ).toBeInTheDocument();
      expect(screen.queryByText('Lire plus')).not.toBeInTheDocument();

      const articleHeadings = Array.from(articleElement.querySelectorAll('h1, h2, h3, h4, h5, h6'));

      expect(articleHeadings[0]).toHaveTextContent(article.title);
      articleHeadings.reduce((previousLevel, heading) => {
        const currentLevel = getHeadingLevel(heading);

        expect(currentLevel, `${article.href}: ${heading.textContent}`).toBeLessThanOrEqual(
          previousLevel + 1
        );

        return currentLevel;
      }, 0);

      unmount();
    });
  }, 10000);

  it('keeps rendered article tables named and associated with column and row headers', () => {
    actualitesArticlesByRecency.forEach((article) => {
      const { unmount } = renderAt(article.href);
      const articleElement = screen.getByRole('article', { name: article.title });
      const tables = within(articleElement).queryAllByRole('table');

      tables.forEach((table) => {
        expect(table, article.href).toHaveAccessibleName();
        expect(within(table).getAllByRole('columnheader').length, article.href).toBeGreaterThan(0);
        expect(within(table).getAllByRole('rowheader').length, article.href).toBeGreaterThan(0);

        within(table)
          .getAllByRole('columnheader')
          .forEach((header) => {
            expect(header).toHaveAttribute('scope', 'col');
          });

        within(table)
          .getAllByRole('rowheader')
          .forEach((header) => {
            expect(header).toHaveAttribute('scope', 'row');
          });
      });

      unmount();
    });
  }, 10000);

  it('keeps article pages off the legacy ArticleHeaderMeta component', () => {
    const pagesDir = path.resolve(process.cwd(), 'src', 'pages', 'actualites');
    const pageSources = readdirSync(pagesDir)
      .filter((fileName) => fileName.endsWith('.tsx'))
      .map((fileName) => readFileSync(path.join(pagesDir, fileName), 'utf8'));

    expect(pageSources.some((source) => source.includes('ArticleHeaderMeta'))).toBe(false);
  });

  it('keeps article takeaways and official sources on shared components', () => {
    const pagesDir = path.resolve(process.cwd(), 'src', 'pages', 'actualites');

    readdirSync(pagesDir)
      .filter((fileName) => fileName.endsWith('.tsx'))
      .forEach((fileName) => {
        const source = readFileSync(path.join(pagesDir, fileName), 'utf8');

        expect(source, fileName).toContain("from '../../components/ui/KeyTakeaways'");
        expect(source, fileName).toContain("from '../../components/ui/ArticleSources'");
        expect(source, fileName).toContain('<KeyTakeaways');
        expect(source, fileName).toContain('<ArticleSources');
        expect(source, fileName).not.toContain('bg-primary-100 border-l-4');
        expect(source, fileName).not.toContain('<h2 className="text-h4 mb-4">À retenir</h2>');
        expect(source, fileName).not.toContain(
          '<h2 className="text-h4 mb-6">Sources officielles</h2>'
        );
      });
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
        const tableOfContentsSource = source.match(
          /const tableOfContents: readonly ArticleTableOfContentsItem\[\] = \[([\s\S]*?)\];/
        )?.[1];
        const tableOfContentsIds = [...(tableOfContentsSource ?? '').matchAll(/id:\s*'([^']+)'/g)]
          .map((match) => match[1])
          .filter(Boolean);
        const sectionHeadingIds = [...source.matchAll(/<ArticleSectionHeading id="([^"]+)"/g)].map(
          (match) => match[1]
        );

        expect(source).not.toContain('<h2 className="mt-12 mb-4">');
        expect(tableOfContentsSource, fileName).toBeDefined();
        expect(tableOfContentsIds).toHaveLength(sectionHeadingIds.length);
        expect(new Set(tableOfContentsIds)).toEqual(new Set(sectionHeadingIds));
      });
  });
});
