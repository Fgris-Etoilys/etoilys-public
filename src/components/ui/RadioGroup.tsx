import { useId } from 'react';

export interface RadioOption<T extends string> {
  value: T;
  label: string;
}

interface RadioGroupProps<T extends string> {
  label: string;
  name: string;
  value: T | '';
  options: readonly RadioOption<T>[];
  onChange: (value: T) => void;
  error?: string | undefined;
  required?: boolean;
}

export default function RadioGroup<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
  error,
  required = false,
}: RadioGroupProps<T>) {
  const id = useId();
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;

  return (
    // `maskAllInputs` ne masque pas l'état des radios : le groupe entier sort des replays.
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? messageId : undefined}
      tabIndex={-1}
      className="ui-focus w-full"
      data-ph-no-autocapture="true"
      data-replay-block="true"
    >
      <p id={labelId} className="mb-2 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-alert-400 ml-1">*</span>}
      </p>
      <div className="flex flex-col gap-x-6 sm:flex-row sm:flex-wrap">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex min-h-[44px] cursor-pointer items-start gap-3 text-sm text-ink"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="ui-focus mt-px h-5 w-5 shrink-0 cursor-pointer accent-ink"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={messageId} className="mt-2 text-sm text-alert-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
