import { ArrowDown } from 'lucide-react';

interface SectionNavProps {
  label: string;
  items: readonly { id: string; label: string }[];
}

export default function SectionNav({ label, items }: SectionNavProps) {
  return (
    <nav aria-label={label} className="border-t border-ink/20 pt-4">
      <ul className="flex flex-wrap gap-x-8 gap-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="editorial-link ui-focus min-h-11 text-sm">
              {item.label}
              <ArrowDown size={14} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
