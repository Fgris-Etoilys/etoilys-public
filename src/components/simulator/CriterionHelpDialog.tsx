import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, BookOpen, Info, X } from 'lucide-react';
import type { GridCriterion } from '../../content/simulatorGrid';
import type { CritereAide } from '../../content/criteresAide';

interface CriterionHelpDialogProps {
  criterion: GridCriterion | null;
  aide: CritereAide | null;
  isLoading: boolean;
  onClose: () => void;
}

function renderTextBlocks(value: string) {
  const blocks: Array<
    | { type: 'paragraph'; text: string }
    | { type: 'list'; items: Array<{ text: string; children: string[] }> }
  > = [];
  let currentList: Extract<(typeof blocks)[number], { type: 'list' }> | null = null;

  value.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      currentList = null;
      return;
    }

    if (line.startsWith('  - ')) {
      if (!currentList || currentList.items.length === 0) {
        currentList = {
          type: 'list',
          items: [{ text: trimmed.replace(/^-\s*/, ''), children: [] }],
        };
        blocks.push(currentList);
        return;
      }

      const currentItem = currentList.items[currentList.items.length - 1];
      if (currentItem) {
        currentItem.children.push(trimmed.replace(/^-\s*/, ''));
      }
      return;
    }

    if (line.startsWith('- ')) {
      if (!currentList) {
        currentList = { type: 'list', items: [] };
        blocks.push(currentList);
      }
      currentList.items.push({ text: trimmed.replace(/^-\s*/, ''), children: [] });
      return;
    }

    currentList = null;
    blocks.push({ type: 'paragraph', text: trimmed });
  });

  return blocks.map((block, index) => {
    if (block.type === 'paragraph') {
      return (
        <p key={`${block.text}-${index}`} className="text-gray-700">
          {block.text}
        </p>
      );
    }

    return (
      <ul key={index} className="list-disc space-y-1 pl-5">
        {block.items.map((item, itemIndex) => (
          <li key={`${item.text}-${itemIndex}`}>
            <span>{item.text}</span>
            {item.children.length > 0 && (
              <ul className="mt-1 list-[square] space-y-1 pl-5">
                {item.children.map((child, childIndex) => (
                  <li key={`${child}-${childIndex}`}>{child}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  });
}

function CriterionIllustration({ aide }: { aide: CritereAide }) {
  if (!aide.illustration) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <img
        src={aide.illustration}
        alt={`Illustration ${aide.titre}`}
        className="h-auto max-w-full rounded-lg border border-gray-200 shadow-sm"
      />
    </div>
  );
}

export default function CriterionHelpDialog({
  criterion,
  aide,
  isLoading,
  onClose,
}: CriterionHelpDialogProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!criterion) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [criterion, onClose]);

  if (!criterion || typeof document === 'undefined') {
    return null;
  }

  const dialogContent: CritereAide = aide ?? {
    numero: criterion.num_critere,
    titre: criterion.libelle,
    description: 'Aucune aide contextuelle n’est disponible pour ce critère.',
    non_applicabilite: null,
    notes: null,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex min-h-dvh items-center justify-center overflow-y-auto bg-gray-900/35 px-4 py-6"
      data-testid="criterion-help-dialog-overlay"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-2xl rounded-card border border-gray-200 bg-white p-5 shadow-card md:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h3 id={titleId} className="flex items-center gap-2 text-xl text-gray-900">
            <BookOpen className="h-5 w-5 shrink-0 text-primary-300" aria-hidden="true" />
            <span>Aide - Critère {criterion.num_critere}</span>
          </h3>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors duration-200 hover:border-primary-300 hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 motion-reduce:transition-none"
            aria-label="Fermer l’aide du critère"
            onClick={onClose}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto pr-1">
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-300">
              Intitulé
            </h4>
            <p className="text-lg font-semibold leading-relaxed text-gray-900">
              {dialogContent.titre}
            </p>
          </div>

          {isLoading && !aide && (
            <div
              className="rounded-card border border-primary-200 bg-primary-100 p-4 text-sm font-medium text-primary-500"
              role="status"
            >
              Chargement de l’aide contextuelle...
            </div>
          )}

          {!isLoading && dialogContent.illustration && dialogContent.numero === 28 && (
            <CriterionIllustration aide={dialogContent} />
          )}

          {!isLoading && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">
                Description
              </h4>
              <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                {renderTextBlocks(dialogContent.description)}
              </div>

              {dialogContent.illustration && dialogContent.numero === 57 && (
                <div className="mt-4">
                  <CriterionIllustration aide={dialogContent} />
                </div>
              )}

              {dialogContent.numero === 57 && dialogContent.description_suite && (
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
                  {renderTextBlocks(dialogContent.description_suite)}
                </div>
              )}
            </div>
          )}

          {!isLoading && dialogContent.non_applicabilite && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">
                Non-applicabilité
              </h4>
              <div className="rounded-card border border-warning-200 bg-warning-100 p-4 shadow-sm">
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className="mt-0.5 h-5 w-5 shrink-0 text-warning-500"
                    aria-hidden="true"
                  />
                  <div className="text-sm font-medium leading-relaxed text-warning-500">
                    {renderTextBlocks(dialogContent.non_applicabilite)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && dialogContent.notes && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">
                Notes
              </h4>
              <div className="rounded-card border border-primary-200 bg-primary-100 p-4 shadow-sm">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-300" aria-hidden="true" />
                  <div className="text-sm font-medium leading-relaxed text-primary-500">
                    {renderTextBlocks(dialogContent.notes)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading &&
            dialogContent.illustration &&
            (dialogContent.numero === 123 || dialogContent.numero === 124) && (
              <CriterionIllustration aide={dialogContent} />
            )}
        </div>
      </section>
    </div>,
    document.body
  );
}
