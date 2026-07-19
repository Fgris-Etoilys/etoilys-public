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
      className="group block h-full rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
      aria-label={`Lire l'article : ${title}`}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="aspect-[16/9] overflow-hidden">
          <SmartImage
            assetKey={imageKey}
            alt={title}
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6 flex-1 flex flex-col">
          {category && (
            <span className="mb-3 inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-500">
              {getArticleCategoryLabel(category)}
            </span>
          )}
          {date && <time className="text-sm text-textLight mb-2">{date}</time>}
          <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-3">{title}</h3>
          <p className="text-textLight leading-comfortable mb-4 line-clamp-3 flex-1">{excerpt}</p>
          <span className="inline-flex items-center gap-2 text-primary-400 group-hover:text-primary-500 font-medium transition-colors duration-200">
            Lire plus
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
