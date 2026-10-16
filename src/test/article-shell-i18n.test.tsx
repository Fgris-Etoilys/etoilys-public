import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { getArticleAuthor } from '../content/articleAuthors';
import type { ArticleLayoutArticle } from '../components/ui/ArticleLayout';
import ArticleLayout from '../components/ui/ArticleLayout';
import ArticleAuthorBlock from '../components/ui/ArticleAuthorBlock';
import ArticleSources from '../components/ui/ArticleSources';
import KeyTakeaways from '../components/ui/KeyTakeaways';

const englishArticle = {
  slug: 'english-article',
  title: 'English article title',
  excerpt: 'English excerpt',
  relatedSummary: 'English related summary',
  href: '/en/articles/english-article',
  category: 'guides-pratiques',
  readingTimeMinutes: 5,
  authorId: 'florian-grisorio',
  authorName: 'Florian Grisorio',
  publishedAt: '2026-07-19',
} satisfies ArticleLayoutArticle;

describe('English article shell', () => {
  afterEach(() => {
    cleanup();
  });

  it('localizes the layout metadata and navigation while preserving French defaults elsewhere', () => {
    render(
      <MemoryRouter>
        <ArticleLayout
          article={englishArticle}
          locale="en"
          lede={<p>English lede</p>}
          keyTakeaways={<p>English takeaways</p>}
          tableOfContents={[
            { id: 'one', label: 'One' },
            { id: 'two', label: 'Two' },
            { id: 'three', label: 'Three' },
            { id: 'four', label: 'Four' },
            { id: 'five', label: 'Five' },
          ]}
        >
          <h2 id="one">One</h2>
        </ArticleLayout>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/en');
    expect(screen.getByText('Practical guides')).toBeInTheDocument();
    expect(screen.getByText('Published on 19 July 2026')).toBeInTheDocument();
    expect(screen.getByText('5 min read')).toBeInTheDocument();
    expect(screen.getAllByRole('navigation', { name: 'Article table of contents' })).toHaveLength(
      2
    );
    expect(screen.getAllByText('In this article')).toHaveLength(2);
  });

  it('localizes takeaways, sources and the existing author identity', () => {
    const author = getArticleAuthor('florian-grisorio');
    const { container } = render(
      <>
        <KeyTakeaways
          locale="en"
          variant="bullets"
          items={[{ id: 'one', content: 'One practical point.' }]}
        />
        <ArticleSources
          locale="en"
          sources={Array.from({ length: 4 }, (_, index) => ({
            id: `source-${index}`,
            organization: 'Atout France',
            title: `Source ${index + 1}`,
            url: `https://example.com/${index + 1}`,
          }))}
        />
        <ArticleAuthorBlock author={author} locale="en" />
      </>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Key takeaways' })).toBeInTheDocument();
    const sources = screen
      .getByRole('heading', { level: 2, name: 'Official sources' })
      .closest('section');
    expect(within(sources as HTMLElement).getByText('Show the other source')).toBeInTheDocument();
    expect(within(sources as HTMLElement).getByText('Hide additional sources')).toBeInTheDocument();
    expect(within(sources as HTMLElement).getAllByText('(Opens in a new tab)')).toHaveLength(4);
    expect(container).toHaveTextContent(
      'President of Etoilys, a Cofrac-accredited inspection body for the classification of furnished tourist accommodation.'
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Florian Grisorio' })).toBeInTheDocument();
  });
});
