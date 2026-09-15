import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  linkHref?: string | undefined;
  linkLabel?: string | undefined;
  className?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  linkHref,
  linkLabel,
  className = '',
}: FeatureCardProps) {
  const linkClasses = 'editorial-link ui-focus mt-auto pt-5 text-sm';
  const linkContent = (
    <>
      {linkLabel}
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </>
  );

  return (
    <Card hover={false} className={`h-full flex flex-col p-6 sm:p-[30px] ${className}`}>
      <div className="mb-5 sm:mb-6">
        <Icon className="h-[30px] w-[30px] text-copper" strokeWidth={1.4} aria-hidden="true" />
      </div>
      <h3 className="mb-3 font-roboto text-[21px] font-semibold leading-snug text-ink">{title}</h3>
      <p className="flex-1 text-sm leading-comfortable text-muted">{description}</p>
      {linkHref &&
        linkLabel &&
        (linkHref.startsWith('#') ? (
          <a href={linkHref} className={linkClasses}>
            {linkContent}
          </a>
        ) : linkHref.startsWith('/') && !linkHref.startsWith('//') ? (
          <Link to={linkHref} className={linkClasses}>
            {linkContent}
          </Link>
        ) : (
          <a href={linkHref} target="_blank" rel="noopener noreferrer" className={linkClasses}>
            {linkContent}
          </a>
        ))}
    </Card>
  );
}
