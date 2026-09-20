import { useEffect, useEffectEvent, type RefObject } from 'react';

export function useDialog({
  isOpen,
  dialogRef,
  initialFocus,
  onClose,
}: {
  isOpen: boolean;
  dialogRef: RefObject<HTMLElement | null>;
  initialFocus: string;
  onClose: () => void;
}) {
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (dialog.querySelector<HTMLElement>(initialFocus) ?? dialog).focus({ preventScroll: true });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      const controls = Array.from(
        dialog.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]')
      ).filter(
        (element) =>
          element.tabIndex >= 0 &&
          !element.matches(':disabled, input[type="hidden"]') &&
          !element.closest('[hidden], [inert]')
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      const active = document.activeElement;
      if (!first || !controls.some((element) => element === active)) {
        event.preventDefault();
        ((event.shiftKey ? last : first) ?? dialog).focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [isOpen, dialogRef, initialFocus]);
}
