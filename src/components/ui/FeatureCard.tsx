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
  const linkClasses = 'editorial-link ui-focus mt-5 min-h-11 text-sm';
  const linkContent = (
    <>
      {linkLabel}
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </>
  );

  return (
    <Card hover={false} className={`h-full flex flex-col p-6 sm:p-8 ${className}`}>
      <div className="mb-5">
        <Icon className="h-7 w-7 text-copper" strokeWidth={1.4} aria-hidden="true" />
      </div>
      <h3 className="font-roboto text-xl font-semibold leading-snug tracking-tight text-ink mb-3">
        {title}
      </h3>
      <p className="text-muted leading-comfortable flex-1">{description}</p>
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
