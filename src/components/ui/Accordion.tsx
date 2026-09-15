import { useId, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: readonly AccordionItem[];
  density?: 'default' | 'compact';
}

export default function Accordion({ items, density = 'default' }: AccordionProps) {
  const id = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isCompact = density === 'compact';
  const triggerClasses = isCompact
    ? 'ui-focus w-full flex items-center justify-between gap-[25px] py-[22px] text-left transition-colors duration-200 motion-reduce:transition-none hover:text-copper'
    : 'ui-focus w-full flex items-center justify-between gap-4 py-5 text-left transition-colors duration-200 motion-reduce:transition-none hover:text-copper';
  const questionClasses = isCompact
    ? 'text-[14px] font-[550] leading-[1.6] text-ink'
    : 'text-base font-medium text-ink sm:text-lg';
  const answerClasses = isCompact
    ? 'pb-[23px] pr-[30px] text-[13px] leading-[1.8] text-muted [&_a]:editorial-inline-link'
    : 'pb-6 pr-9 text-muted leading-comfortable [&_a]:editorial-inline-link';
  const iconClasses = isCompact ? 'h-[23px] w-[23px]' : 'h-5 w-5';

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
            className={triggerClasses}
            aria-expanded={openIndex === index}
          >
            <span className={questionClasses}>{item.question}</span>
            <Plus
              aria-hidden="true"
              className={`${iconClasses} text-copper flex-shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
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
            <div className={answerClasses}>{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
