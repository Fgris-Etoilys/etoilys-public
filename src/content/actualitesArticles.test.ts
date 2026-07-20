import { describe, expect, it } from 'vitest';
import {
  actualitesArticlesByRecency,
  getFeaturedActualiteArticle,
  getRelatedArticles,
  validateRelatedArticleSlugs,
  type ActualiteArticle,
} from './actualitesArticles';

function makeArticle(input: {
  slug: string;
  category: ActualiteArticle['category'];
  publishedAt?: string;
  updatedAt?: string;
  relatedArticleSlugs?: readonly string[];
}): ActualiteArticle {
  const article: ActualiteArticle = {
    slug: input.slug,
    title: `Article ${input.slug}`,
    excerpt: `Résumé ${input.slug}`,
    relatedSummary: `Résumé connexe ${input.slug}.`,
    imageKey: 'articleMeubles20252026',
    href: `/actualites/${input.slug}`,
    category: input.category,
    readingTimeMinutes: 5,
    authorId: 'florian-grisorio',
    authorName: 'Florian Grisorio',
    date: '20 juillet 2026',
    publishedAt: input.publishedAt ?? '2026-07-20',
  };

  if (input.updatedAt) {
    article.updatedAt = input.updatedAt;
    article.updatedDate = '21 juillet 2026';
  }

  if (input.relatedArticleSlugs) {
    article.relatedArticleSlugs = input.relatedArticleSlugs;
  }

  return article;
}

describe('actualites article related articles', () => {
  it('selects the featured list article from the most recent publication date only', () => {
    const oldestUpdated = makeArticle({
      slug: 'oldest-updated',
      category: 'reglementation',
      publishedAt: '2026-01-01',
      updatedAt: '2026-07-21',
    });
    const newestPublished = makeArticle({
      slug: 'newest-published',
      category: 'fiscalite',
      publishedAt: '2026-07-20',
    });
    const middlePublished = makeArticle({
      slug: 'middle-published',
      category: 'obligations',
      publishedAt: '2026-06-01',
    });

    expect(
      getFeaturedActualiteArticle([oldestUpdated, middlePublished, newestPublished])?.slug
    ).toBe('newest-published');
  });

  it('uses the first recency-sorted active article as the default featured article', () => {
    expect(getFeaturedActualiteArticle()?.slug).toBe(actualitesArticlesByRecency[0]?.slug);
  });

  it('uses manual selection as authoritative without completing it', () => {
    const current = makeArticle({
      slug: 'current',
      category: 'fiscalite',
      relatedArticleSlugs: ['manual-one', 'manual-two'],
    });
    const articles = [
      current,
      makeArticle({ slug: 'manual-one', category: 'reglementation' }),
      makeArticle({ slug: 'manual-two', category: 'obligations' }),
      makeArticle({ slug: 'same-category', category: 'fiscalite' }),
    ];

    expect(getRelatedArticles(current, articles).map((article) => article.slug)).toEqual([
      'manual-one',
      'manual-two',
    ]);
  });

  it('falls back to same category then recency only without manual selection', () => {
    const current = makeArticle({ slug: 'current', category: 'fiscalite' });
    const articles = [
      makeArticle({ slug: 'newest-other', category: 'obligations' }),
      makeArticle({ slug: 'same-one', category: 'fiscalite' }),
      current,
      makeArticle({ slug: 'same-two', category: 'fiscalite' }),
      makeArticle({ slug: 'older-other', category: 'reglementation' }),
    ];

    expect(getRelatedArticles(current, articles).map((article) => article.slug)).toEqual([
      'same-one',
      'same-two',
      'newest-other',
    ]);
  });

  it('excludes current article, removes duplicates and caps the result to 3', () => {
    const current = makeArticle({
      slug: 'current',
      category: 'fiscalite',
      relatedArticleSlugs: ['current', 'one', 'one', 'two', 'three', 'four'],
    });
    const articles = [
      current,
      makeArticle({ slug: 'one', category: 'fiscalite' }),
      makeArticle({ slug: 'two', category: 'fiscalite' }),
      makeArticle({ slug: 'three', category: 'fiscalite' }),
      makeArticle({ slug: 'four', category: 'fiscalite' }),
    ];

    expect(getRelatedArticles(current, articles).map((article) => article.slug)).toEqual([
      'one',
      'two',
      'three',
    ]);
  });

  it('validates invalid manual related article configuration', () => {
    expect(() =>
      validateRelatedArticleSlugs([
        { href: '/actualites/current', relatedArticleSlugs: ['current'] },
        { href: '/actualites/other' },
      ])
    ).toThrow(/cannot reference itself/);

    expect(() =>
      validateRelatedArticleSlugs([
        { href: '/actualites/current', relatedArticleSlugs: ['other', 'other'] },
        { href: '/actualites/other' },
      ])
    ).toThrow(/duplicate/);

    expect(() =>
      validateRelatedArticleSlugs([
        { href: '/actualites/current', relatedArticleSlugs: ['missing'] },
        { href: '/actualites/other' },
      ])
    ).toThrow(/unknown/);

    expect(() =>
      validateRelatedArticleSlugs([
        {
          href: '/actualites/current',
          relatedArticleSlugs: ['one', 'two', 'three', 'four'],
        },
        { href: '/actualites/one' },
        { href: '/actualites/two' },
        { href: '/actualites/three' },
        { href: '/actualites/four' },
      ])
    ).toThrow(/more than 3/);
  });

  it('keeps every active article with a valid manual selection of up to 3 articles', () => {
    actualitesArticlesByRecency.forEach((article) => {
      const relatedArticles = getRelatedArticles(article);

      expect(relatedArticles.length).toBeGreaterThan(0);
      expect(relatedArticles).toHaveLength(Math.min(article.relatedArticleSlugs?.length ?? 3, 3));
      expect(relatedArticles).toHaveLength(
        new Set(relatedArticles.map((entry) => entry.slug)).size
      );
      expect(relatedArticles.some((entry) => entry.slug === article.slug)).toBe(false);
    });
  });
});
