import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import ArticleLayout, { type ArticleLayoutArticle } from './ArticleLayout';

const baseArticle: ArticleLayoutArticle = {
  title: 'Titre article test',
  excerpt: 'Résumé article test',
  href: '/actualites/article-test',
  category: 'classement',
  readingTimeMinutes: 5,
  authorName: 'Florian Grisorio',
  publishedAt: '2026-07-19',
};

const tableOfContents = [
  { id: 'section-1', label: 'Section 1' },
  { id: 'section-2', label: 'Section 2' },
  { id: 'section-3', label: 'Section 3' },
  { id: 'section-4', label: 'Section 4' },
  { id: 'section-5', label: 'Section 5' },
];

type ArticleLayoutInput = ArticleLayoutArticle & { imageKey?: string };

function renderLayout(
  article: ArticleLayoutInput,
  slots: {
    footerCta?: ReactNode;
    sources?: ReactNode;
    relatedArticles?: ReactNode;
    authorBlock?: ReactNode;
  } = {},
  layoutTableOfContents: typeof tableOfContents = []
) {
  return render(
    <MemoryRouter>
      <ArticleLayout
        article={article}
        lede={<p>Chapô de test</p>}
        keyTakeaways={
          <div>
            <h2>À retenir</h2>
            <p>Point clé</p>
          </div>
        }
        tableOfContents={layoutTableOfContents}
        footerCta={slots.footerCta}
        sources={slots.sources}
        relatedArticles={slots.relatedArticles}
        authorBlock={slots.authorBlock}
      >
        <h2>Corps de l’article</h2>
        <p>Contenu principal</p>
      </ArticleLayout>
    </MemoryRouter>
  );
}

describe('ArticleLayout', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the article shell in the expected order', () => {
    renderLayout({ ...baseArticle, imageKey: 'articleMeubles20252026' });

    const text = document.body.textContent ?? '';
    const orderedLabels = [
      'Retour aux actualités',
      'Classement',
      'Titre article test',
      'Publié le 19 juillet 2026',
      'Chapô de test',
      'À retenir',
      'Corps de l’article',
    ];

    orderedLabels.reduce((previousIndex, label) => {
      const currentIndex = text.indexOf(label);
      expect(currentIndex).toBeGreaterThan(previousIndex);
      return currentIndex;
    }, -1);

    const article = screen.getByRole('article');
    const heading = screen.getByRole('heading', { level: 1, name: 'Titre article test' });
    const backLink = screen.getByRole('link', { name: 'Retour aux actualités' });
    const takeawaysHeading = screen.getByRole('heading', { level: 2, name: 'À retenir' });
    const bodyHeading = screen.getByRole('heading', { level: 2, name: 'Corps de l’article' });
    const lede = screen.getByText('Chapô de test').parentElement;

    expect(article).toHaveAttribute('aria-labelledby', heading.id);
    expect(backLink).toHaveClass('inline-flex', 'min-h-11', 'rounded-full');
    expect(lede).toHaveClass('article-lede', 'mb-10', 'sm:mb-12');
    expect(takeawaysHeading.compareDocumentPosition(bodyHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );
    expect(screen.queryByRole('img', { name: 'Titre article test' })).not.toBeInTheDocument();
  });

  it('shows update date only when it differs from the publication date', () => {
    const { rerender } = render(
      <MemoryRouter>
        <ArticleLayout
          article={baseArticle}
          lede={<p>Chapô de test</p>}
          keyTakeaways={<p>À retenir</p>}
        >
          <p>Contenu principal</p>
        </ArticleLayout>
      </MemoryRouter>
    );

    expect(screen.queryByText(/Mis à jour le/i)).not.toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <ArticleLayout
          article={{ ...baseArticle, updatedAt: '2026-07-20' }}
          lede={<p>Chapô de test</p>}
          keyTakeaways={<p>À retenir</p>}
        >
          <p>Contenu principal</p>
        </ArticleLayout>
      </MemoryRouter>
    );

    expect(screen.getByText(/Mis à jour le 20 juillet 2026/i)).toBeInTheDocument();
  });

  it('renders category and reading time metadata', () => {
    renderLayout({
      ...baseArticle,
      category: 'guides-pratiques',
      imageKey: 'articlePreparerVisiteClassement',
    });

    expect(screen.getByText('Guides pratiques')).toBeInTheDocument();
    expect(screen.getByText('5 min de lecture')).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Titre article test' })).not.toBeInTheDocument();
  });

  it('does not render a cover image or empty footer wrapper when slots are absent', () => {
    const { container } = renderLayout(baseArticle);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('footer')).not.toBeInTheDocument();
  });

  it('renders footer slots in the required order', () => {
    renderLayout(baseArticle, {
      footerCta: <section>CTA final</section>,
      sources: <section>Sources officielles</section>,
      relatedArticles: <section>À lire aussi</section>,
      authorBlock: <section>Florian Grisorio</section>,
    });

    const footerText = document.querySelector('footer')?.textContent ?? '';
    const orderedLabels = ['CTA final', 'Sources officielles', 'À lire aussi', 'Florian Grisorio'];

    expect(document.querySelector('footer')).toHaveClass('pt-10', 'sm:pt-12');
    expect(document.querySelector('.article-footer-slots')).toBeInTheDocument();

    orderedLabels.reduce((previousIndex, label) => {
      const currentIndex = footerText.indexOf(label);
      expect(currentIndex).toBeGreaterThan(previousIndex);
      return currentIndex;
    }, -1);
  });

  it('does not render the table of contents for a short article with fewer than five sections', () => {
    const { container } = renderLayout(baseArticle, {}, tableOfContents.slice(0, 4));

    expect(
      container.querySelector('nav[aria-label="Sommaire de l’article"]')
    ).not.toBeInTheDocument();
  });

  it('renders the table of contents when the article has at least five sections', () => {
    const { container } = renderLayout(baseArticle, {}, tableOfContents);

    expect(container.querySelectorAll('nav[aria-label="Sommaire de l’article"]')).toHaveLength(2);
  });

  it('renders the table of contents when reading time is six minutes or more', () => {
    const { container } = renderLayout(
      { ...baseArticle, readingTimeMinutes: 6 },
      {},
      tableOfContents.slice(0, 1)
    );

    expect(container.querySelectorAll('nav[aria-label="Sommaire de l’article"]')).toHaveLength(2);
  });
});
