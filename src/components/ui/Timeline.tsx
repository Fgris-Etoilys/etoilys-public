import type { ReactNode } from 'react';

interface TimelineStep {
  number: number;
  title: string;
  description: ReactNode;
  meta?: ReactNode;
}

interface TimelineProps {
  steps: readonly TimelineStep[];
  layout?: 'vertical' | 'horizontal';
}

export default function Timeline({ steps, layout = 'vertical' }: TimelineProps) {
  return (
    <ol
      className={`editorial-timeline ${layout === 'horizontal' ? 'editorial-timeline-horizontal' : ''}`}
    >
      {steps.map((step) => (
        <li key={step.number} className="editorial-timeline-step">
          <span
            className="editorial-step-number w-12 flex-shrink-0 font-playfair text-4xl text-copper"
            aria-hidden="true"
          >
            {String(step.number).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="editorial-step-title font-roboto text-xl font-semibold leading-snug tracking-tight text-ink mb-3">
              {step.title}
            </h3>
            {step.meta && <div className="editorial-step-meta mb-3">{step.meta}</div>}
            <div className="editorial-step-description text-muted leading-comfortable">
              {step.description}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
