import type { ArticleAuthor } from '../../content/articleAuthors';

interface ArticleAuthorBlockProps {
  author: ArticleAuthor;
}

export default function ArticleAuthorBlock({ author }: ArticleAuthorBlockProps) {
  return (
    <section className="mt-8 border-t border-ink/15 pt-8" aria-labelledby="article-author-title">
      <div className="flex gap-4 rounded-editorial border border-ink/15 bg-paper px-5 py-4">
        <img
          src={author.imageSrc}
          alt=""
          width="320"
          height="320"
          loading="lazy"
          decoding="async"
          className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
        />
        <div className="max-w-2xl">
          <h2 id="article-author-title" className="mb-2 text-lg font-semibold text-ink">
            {author.name}
          </h2>
          <p className="text-sm leading-comfortable text-muted">{author.bio}</p>
        </div>
      </div>
    </section>
  );
}
