import { FocusEvent, ReactNode, useEffect, useId, useRef, useState } from 'react';

interface TooltipProps {
  srLabel: string;
  children: ReactNode;
  placement?: 'top' | 'bottom';
  className?: string;
  triggerClassName?: string;
}

const DISMISS_DELAY_MS = 400;

export default function Tooltip({
  srLabel,
  children,
  placement = 'bottom',
  className = '',
  triggerClassName = '',
}: TooltipProps) {
  const tooltipId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const dismissTimerRef = useRef<number | null>(null);
  const isTriggerHoveredRef = useRef(false);
  const isTooltipHoveredRef = useRef(false);
  const hasFocusWithinRef = useRef(false);

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

  return (
    <span className={`relative inline-flex ${className}`} onFocus={handleFocus} onBlur={handleBlur}>
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
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isOpen}
        className={`absolute left-1/2 z-50 w-80 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-left text-xs leading-relaxed text-gray-700 shadow-card ${tooltipVisibilityClassName} ${tooltipPositionClassName}`}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      >
        {children}
      </span>
    </span>
  );
}
