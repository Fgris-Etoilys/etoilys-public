import { useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useDialog } from '../../hooks/useDialog';

interface SimulatorDialogProps {
  title: string;
  eyebrow?: string;
  closeLabel: string;
  /** Sélecteur du premier élément focalisé à l'ouverture. */
  initialFocus?: string;
  /** Un brouillon en cours ne doit pas se perdre sur un clic hors de la fenêtre. */
  closeOnOverlayClick?: boolean;
  /** Dialogue imbriqué ouvert par-dessus (aide). */
  paused?: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Actions toujours visibles sous le corps défilant. */
  footer: ReactNode;
  onSubmit?: () => void;
}

/** Fenêtre latérale (plein écran sur mobile) : seul le corps défile, les actions restent accessibles. */
export default function SimulatorDialog({
  title,
  eyebrow,
  closeLabel,
  initialFocus = '[data-dialog-initial-focus]',
  closeOnOverlayClick = true,
  paused = false,
  onClose,
  children,
  footer,
  onSubmit,
}: SimulatorDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialog({ isOpen: true, dialogRef, initialFocus, onClose, paused });

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="classement-piece-overlay fixed inset-0 z-[80] min-h-dvh"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="classement-piece-dialog simulator-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="classement-piece-dialog-heading">
          {eyebrow && <p className="simulator-eyebrow">{eyebrow}</p>}
          <h3 id={titleId} className="[overflow-wrap:anywhere]">
            {title}
          </h3>
          <button
            type="button"
            className="classement-dialog-close ui-focus"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <form
          className="simulator-dialog-form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit?.();
          }}
        >
          <div className="simulator-dialog-body" data-dialog-body>
            {children}
          </div>
          <div className="simulator-dialog-footer">{footer}</div>
        </form>
      </div>
    </div>,
    document.body
  );
}
