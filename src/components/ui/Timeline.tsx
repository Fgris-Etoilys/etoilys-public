import { ReactNode } from 'react';

interface TimelineStep {
  number: number;
  title: string;
  description: string;
}

interface TimelineProps {
  steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  return (
    <div className='space-y-8'>
      {steps.map((step, index) => (
        <div key={step.number} className='flex gap-6'>
          <div className='flex flex-col items-center flex-shrink-0'>
            <div className='flex items-center justify-center w-12 h-12 rounded-full bg-primary-300 text-white font-bold text-lg'>
              {step.number}
            </div>
            {index < steps.length - 1 && (
              <div className='w-0.5 h-full bg-primary-200 mt-2 min-h-[60px]'></div>
            )}
          </div>
          <div className='flex-1 pb-8'>
            <h3 className='text-xl font-playfair font-semibold text-gray-900 mb-2'>
              {step.title}
            </h3>
            <p className='text-textLight leading-comfortable'>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
