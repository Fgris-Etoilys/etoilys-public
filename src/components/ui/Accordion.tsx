import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';

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
    <div className="border-t border-ink/20">
      {items.map((item, index) => (
        <div key={index} className="border-b border-ink/20">
          <button
            type="button"
            id={`${id}-trigger-${index}`}
            aria-controls={`${id}-panel-${index}`}
            onClick={() => toggleItem(index)}
            className="ui-focus w-full flex items-center justify-between gap-4 py-5 text-left transition-colors duration-200 motion-reduce:transition-none hover:text-copper"
            aria-expanded={openIndex === index}
          >
            <span className="text-base font-medium text-ink sm:text-lg">{item.question}</span>
            <Plus
              aria-hidden="true"
              className={`h-5 w-5 text-copper flex-shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                openIndex === index ? 'rotate-45' : ''
              }`}
            />
          </button>
          <div
            id={`${id}-panel-${index}`}
            role="region"
            aria-labelledby={`${id}-trigger-${index}`}
            hidden={openIndex !== index}
          >
            <div className="pb-6 pr-9 text-muted leading-comfortable [&_a]:editorial-inline-link">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
