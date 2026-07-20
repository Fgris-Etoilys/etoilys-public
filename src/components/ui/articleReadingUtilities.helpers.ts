export const ARTICLE_BACK_TO_TOP_SCROLL_THRESHOLD = 800;

interface ReadingProgressInput {
  scrollY: number;
  viewportHeight: number;
  startY: number;
  endY: number;
}

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export function calculateReadingProgress({
  scrollY,
  viewportHeight,
  startY,
  endY,
}: ReadingProgressInput): number {
  const measuredEndY = Math.max(startY, endY);
  const scrollYAtEnd = Math.max(startY, measuredEndY - Math.max(0, viewportHeight));
  const scrollableDistance = scrollYAtEnd - startY;

  if (scrollableDistance <= 0) {
    return scrollY >= startY ? 100 : 0;
  }

  return clampPercentage(((scrollY - startY) / scrollableDistance) * 100);
}
