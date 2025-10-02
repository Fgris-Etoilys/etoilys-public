import { Link } from 'react-router-dom';
import Card from './Card';
import { ArrowRight } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  image: string;
  href: string;
  date?: string;
}

export default function ArticleCard({ title, excerpt, image, href, date }: ArticleCardProps) {
  return (
    <Card className='overflow-hidden h-full flex flex-col'>
      <div className='aspect-[16/9] overflow-hidden'>
        <img
          src={image}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
        />
      </div>
      <div className='p-6 flex-1 flex flex-col'>
        {date && (
          <time className='text-sm text-textLight mb-2'>{date}</time>
        )}
        <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-3'>
          {title}
        </h3>
        <p className='text-textLight leading-comfortable mb-4 line-clamp-3 flex-1'>
          {excerpt}
        </p>
        <Link
          to={href}
          className='inline-flex items-center gap-2 text-primary-300 hover:text-primary-400 font-medium transition-colors duration-200'
        >
          Lire plus
          <ArrowRight className='h-4 w-4' />
        </Link>
      </div>
    </Card>
  );
}
