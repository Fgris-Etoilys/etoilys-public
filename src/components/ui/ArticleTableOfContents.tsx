import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import Card from './Card';

export interface ArticleTableOfContentsItem {
  id: string;
  label: string;
}

type ArticleTableOfContentsVariant = 'desktop' | 'mobile';

interface ArticleTableOfContentsProps {
  items: readonly ArticleTableOfContentsItem[];
  variant: ArticleTableOfContentsVariant;
}

function getHashId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) {
    return null;
  }

  try {
    return decodeURIComponent(hash);
  } catch {
    return null;
  }
}

function getActiveHashId(items: readonly ArticleTableOfContentsItem[]): string | null {
  const hashId = getHashId();
  return hashId && items.some((item) => item.id === hashId) ? hashId : null;
}

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

export default function ArticleTableOfContents({ items, variant }: ArticleTableOfContentsProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(() =>
    getActiveHashId(items)
  );
  const mobileDetailsRef = useRef<HTMLDetailsElement>(null);
  const clickedSectionIdRef = useRef<string | null>(activeSectionId);

  useEffect(() => {
    const handleHashChange = () => {
      const hashActiveId = getActiveHashId(items);
      setActiveSectionId(hashActiveId ?? clickedSectionIdRef.current);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [items]);

  useEffect(() => {
    const hashActiveId = getActiveHashId(items);
    setActiveSectionId(hashActiveId ?? clickedSectionIdRef.current);
  }, [items]);

  useEffect(() => {
    if (items.length === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio
          )[0];

        if (activeEntry?.target.id) {
          setActiveSectionId(activeEntry.target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );

    items.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }

    event.preventDefault();
    clickedSectionIdRef.current = id;
    setActiveSectionId(id);
    window.history.pushState({}, '', `#${encodeURIComponent(id)}`);
    section.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });

    if (variant === 'mobile') {
      mobileDetailsRef.current?.removeAttribute('open');
    }
  }

  const links = (
    <ol className="space-y-1">
      {items.map((item) => {
        const isActive = activeSectionId === item.id;

        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? 'location' : undefined}
              className={`block rounded-lg px-3 py-2 text-sm leading-snug no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 motion-reduce:transition-none ${
                isActive
                  ? 'bg-primary-100 font-semibold text-primary-500'
                  : 'text-gray-700 hover:bg-primary-100 hover:text-primary-500'
              }`}
              onClick={(event) => handleLinkClick(event, item.id)}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (variant === 'desktop') {
    return (
      <aside className="hidden xl:block">
        <Card hover={false} className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col p-4">
          <p className="mb-3 font-playfair text-xl font-semibold text-gray-900">Dans cet article</p>
          <nav
            aria-label="Sommaire de l’article"
            className="table-of-contents-scrollbar -mx-1 flex-1 overflow-y-auto px-1 pr-2"
          >
            {links}
          </nav>
        </Card>
      </aside>
    );
  }

  return (
    <details
      ref={mobileDetailsRef}
      className="mb-10 rounded-card border border-primary-200 bg-primary-100/60 p-4 xl:hidden"
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-lg text-base font-semibold text-themePrimary-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 [&::-webkit-details-marker]:hidden">
        <span>Dans cet article</span>
        <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0" />
      </summary>
      <nav aria-label="Sommaire de l’article" className="mt-3 border-t border-primary-200 pt-3">
        {links}
      </nav>
    </details>
  );
}
