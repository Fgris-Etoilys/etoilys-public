import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getArticleAuthor } from '../../content/articleAuthors';
import ArticleAuthorBlock from './ArticleAuthorBlock';

describe('ArticleAuthorBlock', () => {
  it('renders the centralized author profile without a link', () => {
    const author = getArticleAuthor('florian-grisorio');

    const { container } = render(<ArticleAuthorBlock author={author} />);

    expect(screen.getByRole('heading', { level: 2, name: 'Florian Grisorio' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      expect.stringContaining('florian-grisorio.jpg')
    );
    expect(screen.getByText(author.bio)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
