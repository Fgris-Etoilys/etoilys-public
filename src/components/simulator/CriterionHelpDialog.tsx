import { useId, useRef } from 'react';
import { useDialog } from '../../hooks/useDialog';
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
      return <p key={`${block.text}-${index}`}>{block.text}</p>;
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
    <div className="flex justify-center rounded-editorial border border-ink/10 bg-white p-2">
      <img
        src={aide.illustration}
        alt={`Illustration ${aide.titre}`}
        className="h-auto max-w-full rounded-control"
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
  const dialogRef = useRef<HTMLElement | null>(null);

  useDialog({
    isOpen: criterion !== null,
    dialogRef,
    initialFocus: 'button',
    onClose,
  });

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
      className="criterion-help-overlay"
      data-testid="criterion-help-dialog-overlay"
      onClick={onClose}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="criterion-help-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="criterion-help-header">
          <h3
            id={titleId}
            className="flex min-h-11 items-center gap-3 text-base font-semibold text-ink"
          >
            <BookOpen className="h-5 w-5 shrink-0 text-copper" aria-hidden="true" />
            <span>Aide - Critère {criterion.num_critere}</span>
          </h3>
          <button
            type="button"
            className="ui-focus inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-ink/15 text-muted transition-colors duration-200 hover:border-copper hover:bg-paper hover:text-copper motion-reduce:transition-none"
            aria-label="Fermer l’aide du critère"
            onClick={onClose}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div
          className="criterion-help-content"
          tabIndex={0}
          role="region"
          aria-label="Explications du critère"
        >
          <div>
            <h4>Intitulé</h4>
            <p className="text-xl font-medium leading-relaxed text-ink">{dialogContent.titre}</p>
          </div>

          {isLoading && !aide && (
            <div
              className="rounded-editorial bg-paper p-4 text-sm font-medium text-ink"
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
              <h4>Description</h4>
              <div className="space-y-3 text-sm leading-relaxed text-ink">
                {renderTextBlocks(dialogContent.description)}
              </div>

              {dialogContent.illustration && dialogContent.numero === 57 && (
                <div className="mt-4">
                  <CriterionIllustration aide={dialogContent} />
                </div>
              )}

              {dialogContent.numero === 57 && dialogContent.description_suite && (
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink">
                  {renderTextBlocks(dialogContent.description_suite)}
                </div>
              )}
            </div>
          )}

          {!isLoading && dialogContent.non_applicabilite && (
            <div>
              <h4>Non-applicabilité</h4>
              <div className="rounded-control border-l-2 border-warning-500 bg-warning-100/60 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle
                    className="mt-0.5 h-5 w-5 shrink-0 text-warning-500"
                    aria-hidden="true"
                  />
                  <div className="text-sm leading-relaxed text-ink">
                    {renderTextBlocks(dialogContent.non_applicabilite)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && dialogContent.notes && (
            <div>
              <h4>Notes</h4>
              <div className="rounded-control border-l-2 border-copper bg-paper p-4">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-copper" aria-hidden="true" />
                  <div className="text-sm leading-relaxed text-ink">
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
