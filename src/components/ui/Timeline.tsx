import type { ReactNode } from 'react';

interface TimelineStep {
  number: number;
  title: string;
  description: ReactNode;
}

interface TimelineProps {
  steps: readonly TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  return (
    <div className="space-y-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex gap-4 sm:gap-6">
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-control bg-ink text-white font-semibold text-lg">
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div className="w-px flex-1 bg-ink/20 mt-3 min-h-[60px]" aria-hidden="true"></div>
            )}
          </div>
          <div className="min-w-0 flex-1 pb-8">
            <h3 className="text-xl font-roboto font-semibold tracking-tight text-ink mb-2">
              {step.title}
            </h3>
            <div className="text-muted leading-comfortable">{step.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
