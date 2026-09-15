import type { ReactNode } from 'react';
import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProofStripItem {
  icon?: LucideIcon;
  value?: ReactNode;
  title: string;
  description?: ReactNode;
  link?: {
    href: string;
    label: string;
  };
}

interface ProofStripProps {
  items: readonly ProofStripItem[];
}

export default function ProofStrip({ items }: ProofStripProps) {
  return (
    <div className="border-y border-ink/10 bg-surface">
      <ul className="container-editorial editorial-proof-strip">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="editorial-proof-item">
              {Icon ? (
                <Icon
                  size={27}
                  strokeWidth={1.3}
                  className="shrink-0 text-copper"
                  aria-hidden="true"
                />
              ) : (
                <span className="editorial-proof-value">{item.value}</span>
              )}
              <div>
                <p className="editorial-proof-title">{item.title}</p>
                {item.link ? (
                  item.link.href.startsWith('/') && !item.link.href.startsWith('//') ? (
                    <Link to={item.link.href} className="editorial-proof-link ui-focus">
                      {item.link.label}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  ) : (
                    <a
                      href={item.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-proof-link ui-focus"
                    >
                      {item.link.label}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                  )
                ) : (
                  item.description && <p className="editorial-proof-subtext">{item.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
