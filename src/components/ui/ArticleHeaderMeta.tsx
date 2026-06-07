import { Link } from 'react-router-dom';

interface ArticleHeaderMetaProps {
  publishedAt: string;
  publishedDate: string;
  author: string;
  readingTime: string;
  updatedAt?: string;
  updatedDate?: string;
  backHref?: string;
  backLabel?: string;
}

export default function ArticleHeaderMeta({
  publishedAt,
  publishedDate,
  author,
  readingTime,
  updatedAt,
  updatedDate,
  backHref = '/actualites',
  backLabel = 'Actualités',
}: ArticleHeaderMetaProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
      <Link to={backHref} className="text-white/80 transition-colors hover:text-white">
        ← {backLabel}
      </Link>
      <span aria-hidden="true">•</span>
      <time dateTime={publishedAt}>Publié le {publishedDate}</time>
      {updatedAt && updatedDate && (
        <>
          <span aria-hidden="true">•</span>
          <time dateTime={updatedAt}>Mis à jour le {updatedDate}</time>
        </>
      )}
      <span aria-hidden="true">•</span>
      <span>{author}</span>
      <span aria-hidden="true">•</span>
      <span>{readingTime}</span>
    </div>
  );
}
