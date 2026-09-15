import { Check } from 'lucide-react';

interface HeroReassuranceProps {
  items: readonly string[];
}

export default function HeroReassurance({ items }: HeroReassuranceProps) {
  return (
    <ul className="hero-reassurance">
      {items.map((item) => (
        <li key={item}>
          <Check size={15} aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
