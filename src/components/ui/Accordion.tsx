import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='space-y-4'>
      {items.map((item, index) => (
        <div
          key={index}
          className='bg-white border border-gray-200 rounded-card overflow-hidden'
        >
          <button
            onClick={() => toggleItem(index)}
            className='w-full flex items-center justify-between p-6 text-left transition-colors duration-200 hover:bg-gray-50'
            aria-expanded={openIndex === index}
          >
            <span className='text-lg font-playfair font-semibold text-gray-900 pr-4'>
              {item.question}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-primary-300 flex-shrink-0 transition-transform duration-300 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`transition-all duration-300 ease-in-out ${
              openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className='px-6 pb-6 text-textLight leading-comfortable'>
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
