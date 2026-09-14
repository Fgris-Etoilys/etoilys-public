import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import Card from './Card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  linkHref?: string;
  linkLabel?: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  linkHref,
  linkLabel,
}: FeatureCardProps) {
  return (
    <Card hover={false} className="h-full p-6 sm:p-8">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-control bg-paper mb-5">
        <Icon className="h-6 w-6 text-copper" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-roboto font-semibold tracking-tight text-ink mb-3">{title}</h3>
      <p className="text-muted leading-comfortable">{description}</p>
      {linkHref && linkLabel && (
        <a
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="editorial-inline-link mt-4 inline-flex min-h-11 items-center text-sm font-medium"
        >
          {linkLabel}
        </a>
      )}
    </Card>
  );
}
