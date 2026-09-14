import { useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: readonly AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const id = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-surface border border-ink/15 rounded-editorial">
          <button
            type="button"
            id={`${id}-trigger-${index}`}
            aria-controls={`${id}-panel-${index}`}
            onClick={() => toggleItem(index)}
            className="ui-focus w-full flex items-center justify-between rounded-editorial p-5 sm:p-6 text-left transition-colors duration-200 motion-reduce:transition-none hover:bg-surface-hover"
            aria-expanded={openIndex === index}
          >
            <span className="text-lg font-semibold text-ink pr-4">{item.question}</span>
            <ChevronDown
              aria-hidden="true"
              className={`h-5 w-5 text-copper flex-shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            id={`${id}-panel-${index}`}
            role="region"
            aria-labelledby={`${id}-trigger-${index}`}
            hidden={openIndex !== index}
          >
            <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-muted leading-comfortable [&_a]:editorial-inline-link">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
