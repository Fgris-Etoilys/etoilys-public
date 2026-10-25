import { useId, type ReactNode } from 'react';
import {
  sanitaryDimensionsUnconfirmed,
  type EquipementDraft,
  type FactuelleFieldErrors,
  type FactuellePieceDraft,
} from '../../../utils/factuellePieceDraft';
import { SANITAIRE_PROTECTION_LABELS } from '../../../utils/factuellePieces';
import type { CatalogueFaits, SanitaireProtection } from '../../../utils/simulatorFactuelle.types';
import {
  BooleanChoice,
  FactuelleSection,
  HelpButton,
  NumberField,
  type FieldHighlights,
} from './FactuelleFields';
import { fieldHighlight } from '../../../utils/factuellePieces';

interface SanitairesProps {
  draft: FactuellePieceDraft;
  catalogue: CatalogueFaits;
  errors: FactuelleFieldErrors;
  highlights: FieldHighlights;
  onChange: (partial: Partial<FactuellePieceDraft>) => void;
  onOpenHelp: (criterionNumber: number) => void;
}

/** Équipements C39/C40/C44 ; la cotation (seuils, protections, sabot) reste calculée par le backend. */
export function FactuelleSanitaires({
  draft,
  catalogue,
  errors,
  highlights,
  onChange,
  onOpenHelp,
}: SanitairesProps) {
  const value = draft.sanitaires;
  const update = (partial: Partial<typeof value>) =>
    onChange({ sanitaires: { ...value, ...partial } });

  return (
    <FactuelleSection title="Équipements sanitaires">
      <div className="grid gap-4 sm:grid-cols-2">
        <BooleanChoice
          field="sanitaires.lavabo_eau_chaude"
          label="Lavabo avec eau chaude"
          value={value.lavabo_eau_chaude}
          highlights={highlights}
          onChange={(lavabo_eau_chaude) => update({ lavabo_eau_chaude })}
        />
        <BooleanChoice
          field="sanitaires.presence_douche"
          label="Douche"
          value={value.presence_douche}
          highlights={highlights}
          onChange={(presence_douche) => update({ presence_douche })}
        />
        <BooleanChoice
          field="sanitaires.presence_baignoire_avec_douchette"
          label="Baignoire avec douchette"
          value={value.presence_baignoire_avec_douchette}
          highlights={highlights}
          onChange={(presence_baignoire_avec_douchette) =>
            update({ presence_baignoire_avec_douchette })
          }
        />
      </div>

      {value.presence_douche === true && (
        <Equipment
          kind="douche"
          value={value.douche}
          catalogue={catalogue}
          errors={errors}
          highlights={highlights}
          onOpenHelp={onOpenHelp}
          onChange={(douche) => update({ douche })}
        />
      )}
      {value.presence_baignoire_avec_douchette === true && (
        <Equipment
          kind="baignoire"
          value={value.baignoire}
          catalogue={catalogue}
          errors={errors}
          highlights={highlights}
          onOpenHelp={onOpenHelp}
          onChange={(baignoire) => update({ baignoire })}
        >
          <SabotSwitch
            checked={value.baignoire_sabot === true}
            onChange={(baignoire_sabot) => update({ baignoire_sabot })}
          />
        </Equipment>
      )}
    </FactuelleSection>
  );
}

function SabotSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4"
      data-factuelle-field="sanitaires.baignoire_sabot"
    >
      <span className="text-sm font-medium text-ink">Baignoire sabot</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Baignoire sabot"
        className="classement-opening-switch ui-focus"
        onClick={() => onChange(!checked)}
      >
        <span aria-hidden="true" className="classement-opening-thumb" />
      </button>
    </div>
  );
}

function Equipment({
  kind,
  value,
  catalogue,
  errors,
  highlights,
  onOpenHelp,
  onChange,
  children,
}: {
  kind: 'douche' | 'baignoire';
  value: EquipementDraft;
  catalogue: CatalogueFaits;
  errors: FactuelleFieldErrors;
  highlights: FieldHighlights;
  onOpenHelp: (criterionNumber: number) => void;
  onChange: (value: EquipementDraft) => void;
  children?: ReactNode;
}) {
  const field = `sanitaires.${kind}`;
  const label = kind === 'douche' ? 'Douche' : 'Baignoire';
  const protectionId = useId();
  const protectionError = errors[`${field}.protection`];
  const protectionState = fieldHighlight(
    highlights,
    `${field}.protection`,
    value.protection !== null
  );

  return (
    <div className="factuelle-equipment">
      <div className="flex items-center gap-1">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <HelpButton label={`Aide : ${label.toLowerCase()}`} onClick={() => onOpenHelp(40)} />
      </div>
      {children}
      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className="factuelle-field min-w-0"
          data-factuelle-field={`${field}.protection`}
          data-highlight={protectionState}
        >
          <span className="factuelle-label">
            <label htmlFor={protectionId}>Protection</label>
          </span>
          <select
            id={protectionId}
            className={`ui-field h-11 px-3 ${protectionError || protectionState === 'missing' ? 'ui-field-error' : ''}`}
            value={value.protection ?? ''}
            aria-invalid={Boolean(protectionError) || protectionState === 'missing' || undefined}
            aria-describedby={protectionError ? `${protectionId}-error` : undefined}
            onChange={(event) => {
              const protection =
                catalogue.protections_sanitaires.find(
                  (entry): entry is SanitaireProtection => entry === event.target.value
                ) ?? null;
              onChange({ ...value, protection });
            }}
          >
            <option value="">Non renseignée</option>
            {catalogue.protections_sanitaires.map((protection) => (
              <option key={protection} value={protection}>
                {SANITAIRE_PROTECTION_LABELS[protection]}
              </option>
            ))}
          </select>
          {protectionError && (
            <p id={`${protectionId}-error`} className="factuelle-error">
              {protectionError}
            </p>
          )}
        </div>
        <BooleanChoice
          field={`${field}.dimensions_superieures`}
          label="Dimensions supérieures ?"
          value={value.dimensions_superieures}
          error={errors[`${field}.dimensions_superieures`]}
          highlights={highlights}
          onChange={(dimensions_superieures) => onChange({ ...value, dimensions_superieures })}
        />
        {value.dimensions_superieures === true &&
          (['largeur_cm', 'longueur_cm'] as const).map((axis) => (
            <NumberField
              key={axis}
              field={`${field}.${axis}`}
              label={`${axis === 'largeur_cm' ? 'Largeur' : 'Longueur'} (cm)`}
              value={value[axis]}
              error={errors[`${field}.${axis}`]}
              highlights={highlights}
              onChange={(raw) => onChange({ ...value, [axis]: raw })}
            />
          ))}
      </div>
      {sanitaryDimensionsUnconfirmed(value, kind) && (
        <p className="text-sm text-warning-500" role="status">
          Les mesures ne confirment pas des dimensions supérieures.
        </p>
      )}
    </div>
  );
}
