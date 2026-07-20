import type { ArticleAuthor } from '../../content/articleAuthors';

interface ArticleAuthorBlockProps {
  author: ArticleAuthor;
}

export default function ArticleAuthorBlock({ author }: ArticleAuthorBlockProps) {
  return (
    <section className="mt-8 border-t border-gray-200 pt-8" aria-labelledby="article-author-title">
      <div className="flex gap-4 rounded-card border border-gray-200 bg-primary-100/40 px-5 py-4">
        <img
          src={author.imageSrc}
          alt={author.imageAlt}
          width="320"
          height="320"
          loading="lazy"
          decoding="async"
          className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
        />
        <div className="max-w-2xl">
          <h2 id="article-author-title" className="mb-2 text-lg font-semibold text-gray-900">
            {author.name}
          </h2>
          <p className="text-sm leading-comfortable text-gray-700">{author.bio}</p>
        </div>
      </div>
    </section>
  );
}
