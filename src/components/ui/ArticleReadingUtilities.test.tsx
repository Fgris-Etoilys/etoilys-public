import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ArticleReadingUtilities from './ArticleReadingUtilities';
import {
  ARTICLE_BACK_TO_TOP_SCROLL_THRESHOLD,
  calculateReadingProgress,
} from './articleReadingUtilities.helpers';

const BACK_TO_TOP_LABEL = 'Retour en haut de l’article';

let animationFrameId = 0;
let pendingAnimationFrames = new Map<number, FrameRequestCallback>();

class ResizeObserverMock {
  static instances: ResizeObserverMock[] = [];

  observe = vi.fn();
  disconnect = vi.fn();

  constructor(public callback: ResizeObserverCallback) {
    ResizeObserverMock.instances.push(this);
  }

  trigger() {
    this.callback([], this as unknown as ResizeObserver);
  }
}

function setViewport(scrollY: number, innerHeight = 500) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: innerHeight,
  });
}

function setReducedMotionPreference(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function flushAnimationFrames() {
  const callbacks = [...pendingAnimationFrames.values()];
  pendingAnimationFrames.clear();
  callbacks.forEach((callback) => callback(0));
}

function setDocumentBounds(element: Element, top: number, bottom: number) {
  element.getBoundingClientRect = vi.fn(() => ({
    top: top - window.scrollY,
    bottom: bottom - window.scrollY,
    left: 0,
    right: 0,
    x: 0,
    y: top - window.scrollY,
    width: 0,
    height: bottom - top,
    toJSON: () => ({}),
  }));
}

function ReadingUtilitiesFixture() {
  const startRef = useRef<HTMLHeadingElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ArticleReadingUtilities startRef={startRef} endRef={endRef} />
      <h1 ref={startRef} tabIndex={-1}>
        Titre article
      </h1>
      <div ref={endRef} data-testid="editorial-content">
        Corps editorial
      </div>
    </>
  );
}

function renderMeasuredUtilities({
  scrollY = 0,
  viewportHeight = 500,
  startY = 100,
  endY = 2100,
}: {
  scrollY?: number;
  viewportHeight?: number;
  startY?: number;
  endY?: number;
} = {}) {
  setViewport(scrollY, viewportHeight);
  const result = render(<ReadingUtilitiesFixture />);
  const heading = screen.getByRole('heading', { level: 1, name: 'Titre article' });
  const editorialContent = screen.getByTestId('editorial-content');

  setDocumentBounds(heading, startY, startY + 60);
  setDocumentBounds(editorialContent, startY + 400, endY);

  act(() => {
    flushAnimationFrames();
    ResizeObserverMock.instances.forEach((observer) => observer.trigger());
    flushAnimationFrames();
    fireEvent.scroll(window);
    flushAnimationFrames();
  });

  return { ...result, heading, editorialContent };
}

describe('calculateReadingProgress', () => {
  it('clamps progress between 0 and 100', () => {
    const input = { viewportHeight: 500, startY: 100, endY: 2100 };

    expect(calculateReadingProgress({ ...input, scrollY: 0 })).toBe(0);
    expect(calculateReadingProgress({ ...input, scrollY: 850 })).toBe(50);
    expect(calculateReadingProgress({ ...input, scrollY: 1600 })).toBe(100);
    expect(calculateReadingProgress({ ...input, scrollY: 2000 })).toBe(100);
  });

  it('reaches 100 when the viewport can contain the measured area end immediately after the start', () => {
    expect(
      calculateReadingProgress({
        scrollY: 100,
        viewportHeight: 500,
        startY: 100,
        endY: 400,
      })
    ).toBe(100);
  });
});

describe('ArticleReadingUtilities', () => {
  beforeEach(() => {
    ResizeObserverMock.instances = [];
    animationFrameId = 0;
    pendingAnimationFrames = new Map<number, FrameRequestCallback>();
    vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      animationFrameId += 1;
      pendingAnimationFrames.set(animationFrameId, callback);
      return animationFrameId;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      pendingAnimationFrames.delete(id);
    });
    setReducedMotionPreference(false);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('keeps the decorative progress bar hidden at the top of the page', () => {
    renderMeasuredUtilities({ scrollY: 0 });

    expect(screen.getByTestId('article-reading-progress')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('article-reading-progress')).toHaveClass('opacity-0');
  });

  it('shows the decorative progress bar after scroll and updates its width', () => {
    renderMeasuredUtilities({ scrollY: 850 });

    expect(screen.getByTestId('article-reading-progress')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('article-reading-progress')).toHaveClass('opacity-100');
    expect(screen.getByTestId('article-reading-progress-bar')).toHaveStyle({ width: '50%' });
  });

  it('keeps the back-to-top button inaccessible before the vertical threshold', () => {
    renderMeasuredUtilities({ scrollY: ARTICLE_BACK_TO_TOP_SCROLL_THRESHOLD - 1 });

    expect(screen.queryByRole('button', { name: BACK_TO_TOP_LABEL })).not.toBeInTheDocument();
  });

  it('shows the back-to-top button after the threshold and keeps responsive visibility in CSS', () => {
    renderMeasuredUtilities({ scrollY: ARTICLE_BACK_TO_TOP_SCROLL_THRESHOLD });

    const button = screen.getByRole('button', { name: BACK_TO_TOP_LABEL });
    expect(button).toHaveClass('xl:hidden');
    expect(button).toHaveClass('opacity-100');
  });

  it('hides the back-to-top button when the measured editorial end enters the viewport', () => {
    renderMeasuredUtilities({ scrollY: 1600 });

    expect(screen.queryByRole('button', { name: BACK_TO_TOP_LABEL })).not.toBeInTheDocument();
    expect(screen.getByTestId('article-reading-progress-bar')).toHaveStyle({
      width: '100%',
    });
  });

  it('scrolls to the heading and moves focus to it', () => {
    const { heading } = renderMeasuredUtilities({ scrollY: ARTICLE_BACK_TO_TOP_SCROLL_THRESHOLD });
    const scrollIntoViewMock = vi.spyOn(heading, 'scrollIntoView');
    const focusMock = vi.spyOn(heading, 'focus');

    screen.getByRole('button', { name: BACK_TO_TOP_LABEL }).click();

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(focusMock).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('respects reduced motion for back-to-top scrolling', () => {
    setReducedMotionPreference(true);
    const { heading } = renderMeasuredUtilities({ scrollY: ARTICLE_BACK_TO_TOP_SCROLL_THRESHOLD });
    const scrollIntoViewMock = vi.spyOn(heading, 'scrollIntoView');

    screen.getByRole('button', { name: BACK_TO_TOP_LABEL }).click();

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('observes measured elements and disconnects on unmount', () => {
    const { unmount } = renderMeasuredUtilities();
    const observer = ResizeObserverMock.instances[0];

    if (!observer) {
      throw new Error('Expected ResizeObserver to be created');
    }

    expect(observer.observe).toHaveBeenCalledTimes(2);

    unmount();

    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('does not render reading utilities when the component is not used', () => {
    render(
      <main>
        <h1>Actualités</h1>
      </main>
    );

    expect(screen.queryByTestId('article-reading-progress')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: BACK_TO_TOP_LABEL })).not.toBeInTheDocument();
  });
});
