import { useId, type KeyboardEvent, type ReactNode } from 'react';
import { Check, Info, Minus, Plus, X } from 'lucide-react';
import { fieldHighlight, type FieldHighlights } from '../../../utils/factuellePieces';

export type { FieldHighlights };

/** Entrée valide le champ sans soumettre la fenêtre (touche « Terminé » sur mobile). */
function finishOnEnter(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key === 'Enter') {
    event.preventDefault();
    event.currentTarget.blur();
  }
}

export function HelpButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="ui-focus inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface-neutral hover:text-ink"
      aria-label={label}
      onClick={onClick}
    >
      <Info aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

function FieldLabel({
  id,
  htmlFor,
  children,
  onHelp,
  helpLabel,
}: {
  id?: string | undefined;
  htmlFor?: string | undefined;
  children: ReactNode;
  onHelp?: (() => void) | undefined;
  helpLabel?: string | undefined;
}) {
  return (
    <span className="factuelle-label">
      <label id={id} htmlFor={htmlFor} data-factuelle-label>
        {children}
      </label>
      {onHelp && <HelpButton label={helpLabel ?? `Aide : ${String(children)}`} onClick={onHelp} />}
    </span>
  );
}

export function BooleanChoice({
  field,
  label,
  value,
  onChange,
  disabled = false,
  onHelp,
  highlights,
  error,
}: {
  field: string;
  label: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
  disabled?: boolean | undefined;
  onHelp?: (() => void) | undefined;
  highlights?: FieldHighlights | undefined;
  error?: string | undefined;
}) {
  const errorId = useId();
  const state = fieldHighlight(highlights, field, value !== null);

  return (
    <fieldset
      className="factuelle-field min-w-0"
      data-factuelle-field={field}
      data-highlight={state}
      aria-describedby={error ? errorId : undefined}
      disabled={disabled}
    >
      <legend className="factuelle-label">
        <span data-factuelle-label>{label}</span>
        {onHelp && <HelpButton label={`Aide : ${label}`} onClick={onHelp} />}
      </legend>
      <div className="flex flex-wrap items-center gap-2">
        {[true, false].map((choice) => {
          const selected = value === choice;
          return (
            <button
              key={String(choice)}
              type="button"
              aria-pressed={selected}
              aria-invalid={state === 'missing' || Boolean(error) || undefined}
              className={`factuelle-choice ui-focus ${
                selected ? (choice ? 'factuelle-choice-yes' : 'factuelle-choice-no') : ''
              }`}
              onClick={() => {
                if (!selected) onChange(choice);
              }}
            >
              {selected &&
                (choice ? (
                  <Check aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <X aria-hidden="true" className="h-4 w-4" />
                ))}
              {choice ? 'Oui' : 'Non'}
            </button>
          );
        })}
        {value !== null && !disabled && (
          <button
            type="button"
            className="ui-focus inline-flex h-11 w-11 items-center justify-center rounded-control text-muted hover:bg-surface-neutral hover:text-ink"
            aria-label={`Retirer la réponse : ${label}`}
            title="Retirer la réponse"
            onClick={() => onChange(null)}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} className="factuelle-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function NumberField({
  field,
  label,
  value,
  onChange,
  integer = false,
  disabled = false,
  error,
  highlights,
}: {
  field: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  integer?: boolean | undefined;
  disabled?: boolean | undefined;
  error?: string | undefined;
  highlights?: FieldHighlights | undefined;
}) {
  const id = useId();
  const state = fieldHighlight(highlights, field, value.trim() !== '');

  return (
    <div className="factuelle-field min-w-0" data-factuelle-field={field} data-highlight={state}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="text"
        inputMode={integer ? 'numeric' : 'decimal'}
        enterKeyHint="done"
        value={value}
        disabled={disabled}
        aria-invalid={Boolean(error) || state === 'missing' || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`ui-field h-11 px-3 ${error || state === 'missing' ? 'ui-field-error' : ''}`}
        onKeyDown={finishOnEnter}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p id={`${id}-error`} className="factuelle-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  field,
  label,
  value,
  onChange,
  maxLength,
  disabled = false,
  error,
}: {
  field: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number | undefined;
  disabled?: boolean | undefined;
  error?: string | undefined;
}) {
  const id = useId();
  return (
    <div className="factuelle-field min-w-0" data-factuelle-field={field}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <input
        id={id}
        type="text"
        enterKeyHint="done"
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`ui-field h-11 px-3 ${error ? 'ui-field-error' : ''}`}
        onKeyDown={finishOnEnter}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p id={`${id}-error`} className="factuelle-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Compteur −/+ : vide signifie inconnu, zéro est une réponse. */
export function Counter({
  field,
  label,
  value,
  onChange,
  minimum = 0,
  step = 1,
  initial = minimum,
  disabled = false,
  error,
  highlights,
  onHelp,
}: {
  field: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  minimum?: number;
  step?: number;
  initial?: number;
  disabled?: boolean | undefined;
  error?: string | undefined;
  highlights?: FieldHighlights | undefined;
  onHelp?: (() => void) | undefined;
}) {
  const id = useId();
  const number = value.trim() === '' ? null : Number(value);
  const valid =
    number !== null &&
    Number.isSafeInteger(number) &&
    number >= minimum &&
    (number - minimum) % step === 0;
  const decrement = valid ? number - step : minimum;
  const increment = valid ? number + step : initial;
  const state = fieldHighlight(highlights, field, number !== null);

  return (
    <div className="factuelle-field min-w-0" data-factuelle-field={field} data-highlight={state}>
      <FieldLabel id={`${id}-label`} onHelp={onHelp} helpLabel={`Aide : ${label}`}>
        {label}
      </FieldLabel>
      <div
        role="group"
        aria-labelledby={`${id}-label`}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`factuelle-counter ${error || state === 'missing' ? 'factuelle-counter-invalid' : ''}`}
      >
        <button
          type="button"
          className="ui-focus factuelle-counter-button"
          aria-label={`Diminuer : ${label}`}
          disabled={disabled || (valid && decrement < minimum)}
          onClick={() => onChange(String(decrement))}
        >
          <Minus aria-hidden="true" className="h-4 w-4" />
        </button>
        <span aria-live="polite" className="factuelle-counter-value">
          {number === null ? '—' : value}
        </span>
        <button
          type="button"
          className="ui-focus factuelle-counter-button"
          aria-label={`Augmenter : ${label}`}
          disabled={disabled}
          onClick={() => onChange(String(increment))}
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="factuelle-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** Choix exclusif en boutons (profil, format) : toutes les options visibles. */
export function ChoiceButtons({
  labelledBy,
  value,
  options,
  onChange,
  disabled = false,
  invalid = false,
}: {
  labelledBy: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean | undefined;
  invalid?: boolean;
}) {
  return (
    <div role="group" aria-labelledby={labelledBy} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={disabled}
          aria-pressed={value === option.value}
          aria-invalid={(invalid && value !== option.value) || undefined}
          className={`factuelle-choice ui-focus ${value === option.value ? 'factuelle-choice-selected' : ''}`}
          onClick={() => {
            if (value !== option.value) onChange(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function FactuelleSection({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section className="factuelle-section">
      <h4 className="factuelle-section-title">{title}</h4>
      {children}
    </section>
  );
}
