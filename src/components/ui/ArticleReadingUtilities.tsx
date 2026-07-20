import { useEffect, useRef, useState, type RefObject } from 'react';
import { ArrowUp } from 'lucide-react';
import {
  ARTICLE_BACK_TO_TOP_SCROLL_THRESHOLD,
  calculateReadingProgress,
} from './articleReadingUtilities.helpers';

interface ArticleReadingUtilitiesProps {
  startRef: RefObject<HTMLElement | null>;
  endRef: RefObject<HTMLElement | null>;
}

function getDocumentTop(element: HTMLElement, scrollY: number): number {
  return element.getBoundingClientRect().top + scrollY;
}

function getDocumentBottom(element: HTMLElement, scrollY: number): number {
  return element.getBoundingClientRect().bottom + scrollY;
}

function getScrollBehavior(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function roundProgress(progress: number): number {
  return Math.round(progress * 10) / 10;
}

export default function ArticleReadingUtilities({
  startRef,
  endRef,
}: ArticleReadingUtilitiesProps) {
  const [progress, setProgress] = useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);
  const [isBackToTopVisible, setIsBackToTopVisible] = useState(false);
  const progressRef = useRef(0);
  const isProgressVisibleRef = useRef(false);
  const isBackToTopVisibleRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startElement = startRef.current;
    const endElement = endRef.current;

    if (!startElement || !endElement) {
      return undefined;
    }

    const measure = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const startY = getDocumentTop(startElement, scrollY);
      const endY = Math.max(startY, getDocumentBottom(endElement, scrollY));
      const nextProgress = roundProgress(
        calculateReadingProgress({ scrollY, viewportHeight, startY, endY })
      );
      const nextProgressVisible = scrollY > 0;
      const isFooterEnteringViewport = scrollY + viewportHeight >= endY;
      const nextBackToTopVisible =
        scrollY >= ARTICLE_BACK_TO_TOP_SCROLL_THRESHOLD && !isFooterEnteringViewport;

      if (Math.abs(nextProgress - progressRef.current) >= 0.1) {
        progressRef.current = nextProgress;
        setProgress(nextProgress);
      }

      if (nextProgressVisible !== isProgressVisibleRef.current) {
        isProgressVisibleRef.current = nextProgressVisible;
        setIsProgressVisible(nextProgressVisible);
      }

      if (nextBackToTopVisible !== isBackToTopVisibleRef.current) {
        isBackToTopVisibleRef.current = nextBackToTopVisible;
        setIsBackToTopVisible(nextBackToTopVisible);
      }
    };

    const scheduleMeasure = () => {
      if (typeof window.requestAnimationFrame !== 'function') {
        measure();
        return;
      }

      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        measure();
      });
    };

    scheduleMeasure();
    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMeasure);

    resizeObserver?.observe(startElement);
    resizeObserver?.observe(endElement);

    return () => {
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      resizeObserver?.disconnect();

      if (animationFrameRef.current !== null && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startRef, endRef]);

  const handleBackToTop = () => {
    const target = startRef.current;
    if (!target) {
      return;
    }

    target.scrollIntoView({ behavior: getScrollBehavior(), block: 'start' });

    try {
      target.focus({ preventScroll: true });
    } catch {
      target.focus();
    }
  };

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-x-0 top-[var(--etoilys-header-height,4.5rem)] z-[55] h-1 bg-primary-100/70 transition-opacity duration-150 motion-reduce:transition-none ${
          isProgressVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
        data-testid="article-reading-progress"
      >
        <div
          className="h-full bg-primary-400 transition-[width] duration-150 motion-reduce:transition-none"
          data-testid="article-reading-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        type="button"
        aria-label="Retour en haut de l’article"
        aria-hidden={isBackToTopVisible ? undefined : 'true'}
        tabIndex={isBackToTopVisible ? 0 : -1}
        className={`fixed bottom-[calc(var(--etoilys-cookie-banner-offset,0px)+5rem+env(safe-area-inset-bottom))] right-4 z-[50] inline-flex h-12 w-12 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-500 shadow-card transition-[opacity,transform,background-color,border-color,color] duration-200 hover:border-primary-300 hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 motion-reduce:transition-none sm:right-6 xl:hidden ${
          isBackToTopVisible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
        onClick={handleBackToTop}
      >
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>
    </>
  );
}
