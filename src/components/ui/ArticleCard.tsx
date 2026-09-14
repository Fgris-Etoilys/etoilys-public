import { Link } from 'react-router-dom';
import Card from './Card';
import { ArrowRight } from 'lucide-react';
import SmartImage from './SmartImage';
import { getArticleCategoryLabel, type ArticleCategory } from '../../content/actualitesArticles';
import type { ImageAssetKey } from '../../content/imageManifest';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  imageKey: ImageAssetKey;
  href: string;
  category?: ArticleCategory;
  date?: string;
}

export default function ArticleCard({
  title,
  excerpt,
  imageKey,
  href,
  category,
  date,
}: ArticleCardProps) {
  return (
    <Link
      to={href}
      className="ui-focus group block h-full rounded-editorial text-ink hover:text-ink"
      aria-label={`Lire l'article : ${title}`}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="aspect-[16/9] overflow-hidden">
          <SmartImage
            assetKey={imageKey}
            alt={title}
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 flex-1 flex flex-col">
          {category && (
            <span className="mb-3 inline-flex w-fit rounded-control bg-paper px-3 py-1 text-xs font-semibold text-ink">
              {getArticleCategoryLabel(category)}
            </span>
          )}
          {date && <time className="text-sm text-muted mb-2">{date}</time>}
          <h3 className="text-xl font-roboto font-semibold tracking-tight text-ink mb-3">
            {title}
          </h3>
          <p className="text-muted leading-comfortable mb-4 line-clamp-3 flex-1">{excerpt}</p>
          <span className="inline-flex items-center gap-2 text-ink underline decoration-ink/30 underline-offset-4 group-hover:decoration-current font-medium">
            Lire plus
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
