import {
  CSSProperties,
  FocusEvent,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

interface TooltipProps {
  srLabel: string;
  children: ReactNode;
  placement?: 'top' | 'bottom';
  className?: string;
  triggerClassName?: string;
}

const DISMISS_DELAY_MS = 400;
const VIEWPORT_MARGIN_PX = 16;
const TOOLTIP_MAX_WIDTH_STYLE = `calc(100vw - ${VIEWPORT_MARGIN_PX * 2}px)`;

export default function Tooltip({
  srLabel,
  children,
  placement = 'bottom',
  className = '',
  triggerClassName = '',
}: TooltipProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [horizontalOffset, setHorizontalOffset] = useState(0);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const tooltipRef = useRef<HTMLSpanElement | null>(null);
  const dismissTimerRef = useRef<number | null>(null);
  const isTriggerHoveredRef = useRef(false);
  const isTooltipHoveredRef = useRef(false);
  const hasFocusWithinRef = useRef(false);

  const updateTooltipPosition = useCallback(() => {
    const container = containerRef.current;
    const tooltip = tooltipRef.current;
    if (!container || !tooltip) return;

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const containerRect = container.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const tooltipWidth = Math.min(tooltipRect.width, viewportWidth - VIEWPORT_MARGIN_PX * 2);

    const centeredLeft = containerRect.left + containerRect.width / 2 - tooltipWidth / 2;
    const minLeft = VIEWPORT_MARGIN_PX;
    const maxLeft = Math.max(minLeft, viewportWidth - VIEWPORT_MARGIN_PX - tooltipWidth);
    const constrainedLeft = Math.min(Math.max(centeredLeft, minLeft), maxLeft);
    const nextOffset = Math.round(constrainedLeft - centeredLeft);

    setHorizontalOffset((currentOffset) =>
      currentOffset === nextOffset ? currentOffset : nextOffset
    );
  }, []);

  const clearDismissTimer = () => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  };

  const openTooltip = () => {
    clearDismissTimer();
    setIsOpen(true);
  };

  const scheduleDismiss = () => {
    clearDismissTimer();
    dismissTimerRef.current = window.setTimeout(() => {
      if (
        !isTriggerHoveredRef.current &&
        !isTooltipHoveredRef.current &&
        !hasFocusWithinRef.current
      ) {
        setIsOpen(false);
      }
      dismissTimerRef.current = null;
    }, DISMISS_DELAY_MS);
  };

  useEffect(() => clearDismissTimer, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      setHorizontalOffset(0);
      return;
    }

    updateTooltipPosition();
  }, [isOpen, updateTooltipPosition]);

  useEffect(() => {
    if (!isOpen) return undefined;

    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition, true);

    return () => {
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition, true);
    };
  }, [isOpen, updateTooltipPosition]);

  const handleTriggerMouseEnter = () => {
    isTriggerHoveredRef.current = true;
    openTooltip();
  };

  const handleTriggerMouseLeave = () => {
    isTriggerHoveredRef.current = false;
    scheduleDismiss();
  };

  const handleTooltipMouseEnter = () => {
    isTooltipHoveredRef.current = true;
    openTooltip();
  };

  const handleTooltipMouseLeave = () => {
    isTooltipHoveredRef.current = false;
    scheduleDismiss();
  };

  const handleFocus = () => {
    hasFocusWithinRef.current = true;
    openTooltip();
  };

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    const nextFocusedElement = event.relatedTarget;
    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
      return;
    }

    hasFocusWithinRef.current = false;
    scheduleDismiss();
  };

  const tooltipPositionClassName = placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  const tooltipVisibilityClassName = isOpen ? 'block' : 'hidden';
  const tooltipStyle: CSSProperties = {
    maxWidth: TOOLTIP_MAX_WIDTH_STYLE,
    transform: `translateX(calc(-50% + ${horizontalOffset}px))`,
  };

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex ${className}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <button
        type="button"
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 text-[10px] text-gray-600 ${triggerClassName}`}
        aria-label={srLabel}
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={handleTriggerMouseEnter}
        onMouseLeave={handleTriggerMouseLeave}
      >
        i
      </button>
      <span
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isOpen}
        className={`absolute left-1/2 z-50 w-80 rounded-lg border border-gray-200 bg-white p-3 text-left text-xs leading-relaxed text-gray-700 shadow-card ${tooltipVisibilityClassName} ${tooltipPositionClassName}`}
        style={tooltipStyle}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      >
        {children}
      </span>
    </span>
  );
}
