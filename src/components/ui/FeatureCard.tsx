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
  const linkClasses =
    'ui-focus mt-auto inline-flex min-h-[30px] items-center gap-[7px] pt-[6px] text-[11px] font-normal text-ink underline decoration-ink/40 underline-offset-4 hover:text-ink-hover hover:decoration-current';
  const linkContent = (
    <>
      {linkLabel}
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </>
  );

  return (
    <Card
      hover={false}
      className={`h-full flex flex-col border-ink/10 p-[26px] min-[681px]:p-[22px] min-[900px]:p-[30px] ${className}`}
    >
      <div className="mb-4 min-[900px]:mb-[23px]">
        <Icon className="h-[30px] w-[30px] text-copper" strokeWidth={1.4} aria-hidden="true" />
      </div>
      <h3 className="mb-[14px] font-roboto text-[18px] font-semibold leading-[1.4] tracking-[-0.025em] text-ink min-[900px]:text-[21px]">
        {title}
      </h3>
      <p className="flex-1 text-[14px] leading-[1.75] text-muted">{description}</p>
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
