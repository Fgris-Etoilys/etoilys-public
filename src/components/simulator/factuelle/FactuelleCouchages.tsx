import { useId, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Tooltip from '../../ui/Tooltip';
import {
  buildFactuelleCouchage,
  couchageFormatChoice,
  couchageOption,
  couchageTypes,
  formatValue,
  newCouchageId,
  supportsCouchages,
  withCouchageType,
  type CouchageDraft,
  type FactuelleFieldErrors,
  type FactuellePieceDraft,
} from '../../../utils/factuellePieceDraft';
import {
  COUCHAGE_PROFIL_LABELS,
  COUCHAGE_TYPE_LABELS,
  GIGOGNE_HELP,
  INSPECTION_PRESENTATION,
  visibleInspectionFields,
} from '../../../utils/factuellePieces';
import type { CatalogueFaits } from '../../../utils/simulatorFactuelle.types';
import {
  BooleanChoice,
  ChoiceButtons,
  Counter,
  HelpButton,
  NumberField,
  type FieldHighlights,
} from './FactuelleFields';
import { fieldHighlight } from '../../../utils/factuellePieces';

interface CouchagesProps {
  draft: FactuellePieceDraft;
  catalogue: CatalogueFaits;
  errors: FactuelleFieldErrors;
  highlights: FieldHighlights;
  expandedId: string | null;
  onExpand: (id: string | null) => void;
  /** Ligne ouverte incomplète : ses erreurs sont révélées et son premier champ focalisé. */
  onRowIncomplete: (field: string) => void;
  onFocusField: (field: string) => void;
  onChange: (partial: Partial<FactuellePieceDraft>) => void;
  onOpenHelp: (criterionNumber: number) => void;
}

/** Inventaire des couchages de la pièce, suivi de la literie associée dès qu'une ligne existe. */
export function FactuelleCouchages({
  draft,
  catalogue,
  errors,
  highlights,
  expandedId,
  onExpand,
  onRowIncomplete,
  onFocusField,
  onChange,
  onOpenHelp,
}: CouchagesProps) {
  const [isChoosingType, setIsChoosingType] = useState(false);
  const titleId = useId();
  const supported = supportsCouchages(draft.type_piece);
  if (!supported && draft.couchages.length === 0) {
    return null;
  }

  const quantities = draft.couchages.map((row) =>
    row.nombre_places.trim() === '' ? Number.NaN : Number(row.nombre_places)
  );
  const total = quantities.every((value) => Number.isSafeInteger(value) && value > 0)
    ? quantities.reduce((sum, value) => sum + value, 0)
    : null;
  const openRow = draft.couchages.find((row) => row.id === expandedId);

  /** Une ligne ouverte ne se referme que complète. */
  function leaveOpenRow(): boolean {
    if (!openRow) {
      return true;
    }
    const missing = Object.keys(buildFactuelleCouchage(openRow, catalogue).errors);
    const firstMissing = missing[0];
    if (firstMissing) {
      onRowIncomplete(firstMissing);
      return false;
    }
    return true;
  }

  function addCouchage(type: (typeof catalogue.couchages)[number]['type']) {
    const row = withCouchageType(newCouchageId(), type, catalogue);
    setIsChoosingType(false);
    onChange({ couchages: [...draft.couchages, row] });
    onExpand(row.id);
    const firstMissing = Object.keys(buildFactuelleCouchage(row, catalogue).errors)[0];
    onFocusField(firstMissing ?? `couchages.${row.id}.nombre_places`);
  }

  const state = fieldHighlight(highlights, 'couchages', draft.couchages.length > 0);

  return (
    <section
      className="factuelle-section"
      aria-labelledby={titleId}
      data-factuelle-field="couchages"
      data-highlight={state}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <h4 id={titleId} className="factuelle-section-title">
            Couchages
          </h4>
          <span className="text-sm text-muted" aria-live="polite">
            · {total === null ? '—' : `${total} ${total > 1 ? 'couchages' : 'couchage'}`}
          </span>
          <HelpButton label="Aide : couchages" onClick={() => onOpenHelp(28)} />
        </div>
        <button
          type="button"
          className="factuelle-secondary-action ui-focus"
          aria-expanded={isChoosingType}
          disabled={!supported || catalogue.couchages.length === 0}
          onClick={() => {
            if (leaveOpenRow()) {
              onExpand(null);
              setIsChoosingType((current) => !current);
            }
          }}
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Ajouter un couchage
        </button>
      </div>

      {isChoosingType && (
        <div role="group" aria-label="Type de couchage à ajouter" className="flex flex-wrap gap-2">
          {couchageTypes(catalogue).map((type) => (
            <button
              key={type}
              type="button"
              className="factuelle-choice ui-focus"
              onClick={() => addCouchage(type)}
            >
              {COUCHAGE_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      )}

      {draft.couchages.map((row, index) => (
        <CouchageRow
          key={row.id}
          row={row}
          index={index}
          catalogue={catalogue}
          errors={errors}
          highlights={highlights}
          expanded={expandedId === row.id}
          onToggle={() => {
            if (expandedId === row.id) {
              if (leaveOpenRow()) {
                onExpand(null);
                onFocusField(`couchages.${row.id}`);
              }
              return;
            }
            if (leaveOpenRow()) {
              setIsChoosingType(false);
              onExpand(row.id);
              onFocusField(`couchages.${row.id}.type`);
            }
          }}
          onChange={(next) =>
            onChange({
              couchages: draft.couchages.map((couchage) =>
                couchage.id === row.id ? next : couchage
              ),
            })
          }
          onRemove={() => {
            onChange({ couchages: draft.couchages.filter((couchage) => couchage.id !== row.id) });
            if (expandedId === row.id) onExpand(null);
          }}
        />
      ))}

      {errors.couchages && (
        <p className="factuelle-error" role="alert">
          {errors.couchages}
        </p>
      )}

      {draft.couchages.length > 0 && (
        <Literie
          draft={draft}
          errors={errors}
          highlights={highlights}
          onChange={onChange}
          onOpenHelp={onOpenHelp}
        />
      )}
    </section>
  );
}

function CouchageRow({
  row,
  index,
  catalogue,
  errors,
  highlights,
  expanded,
  onToggle,
  onChange,
  onRemove,
}: {
  row: CouchageDraft;
  index: number;
  catalogue: CatalogueFaits;
  errors: FactuelleFieldErrors;
  highlights: FieldHighlights;
  expanded: boolean;
  onToggle: () => void;
  onChange: (row: CouchageDraft) => void;
  onRemove: () => void;
}) {
  const field = `couchages.${row.id}`;
  const profileLabelId = useId();
  const formatLabelId = useId();
  const typeSelectId = useId();
  const options = catalogue.couchages.filter((option) => option.type === row.type);
  const selected = couchageOption(row, catalogue);
  const formatChoice = couchageFormatChoice(row, selected);
  const freeDimensions = formatChoice === 'libre' && selected?.dimensions_libres === true;
  const title = row.type ? COUCHAGE_TYPE_LABELS[row.type] : `Couchage ${index + 1}`;
  const places = row.nombre_places.trim();
  const summary = [
    places && `${places} ${Number(places) > 1 ? 'couchages' : 'couchage'}`,
    row.largeur_cm && row.longueur_cm && `${row.largeur_cm} × ${row.longueur_cm} cm`,
  ]
    .filter(Boolean)
    .join(' · ');
  const hasErrors = Object.keys(errors).some((key) => key.startsWith(`${field}.`));
  const incomplete = Object.keys(buildFactuelleCouchage(row, catalogue).errors).length > 0;
  const hiddenDimensionError =
    selected && !freeDimensions
      ? (errors[`${field}.largeur_cm`] ?? errors[`${field}.longueur_cm`])
      : undefined;
  const rowHighlighted = Object.entries(highlights).some(
    ([key, state]) => key.startsWith(`${field}.`) && state === 'missing'
  );

  return (
    <div
      className="factuelle-couchage"
      data-factuelle-field={field}
      data-highlight={!expanded && rowHighlighted && incomplete ? 'missing' : undefined}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-sm font-semibold text-ink">
            <span>
              {title}
              {options.length > 1 && row.profil && (
                <span className="font-normal"> · {COUCHAGE_PROFIL_LABELS[row.profil]}</span>
              )}
            </span>
            {row.type === 'GIGOGNE' && (
              <Tooltip srLabel="Aide : gigogne" placement="top" triggerClassName="h-11 w-11">
                {GIGOGNE_HELP}
              </Tooltip>
            )}
          </p>
          {!expanded && summary && <p className="text-sm text-muted">{summary}</p>}
          {!expanded && (hasErrors || incomplete) && (
            <p className="text-sm text-alert-400">{hasErrors ? 'À corriger' : 'À compléter'}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {!expanded && (
            <button
              type="button"
              className="factuelle-text-action ui-focus"
              aria-label={`Modifier le couchage ${index + 1}`}
              onClick={onToggle}
            >
              Modifier
            </button>
          )}
          <button
            type="button"
            className="factuelle-text-action ui-focus"
            aria-label={`Supprimer le couchage ${index + 1}`}
            onClick={onRemove}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="grid gap-4 border-t border-ink/10 pt-4 sm:grid-cols-2">
          <div className="factuelle-field min-w-0" data-factuelle-field={`${field}.type`}>
            <span className="factuelle-label">
              <label htmlFor={typeSelectId}>Type</label>
            </span>
            <select
              id={typeSelectId}
              className="ui-field h-11 px-3"
              value={row.type ?? ''}
              aria-invalid={Boolean(errors[`${field}.type`]) || undefined}
              onChange={(event) => {
                const type = couchageTypes(catalogue).find((entry) => entry === event.target.value);
                if (type) onChange(withCouchageType(row.id, type, catalogue));
              }}
            >
              {row.type === null && <option value="">Sélectionner</option>}
              {couchageTypes(catalogue).map((type) => (
                <option key={type} value={type}>
                  {COUCHAGE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {errors[`${field}.type`] && (
              <p className="factuelle-error">{errors[`${field}.type`]}</p>
            )}
          </div>

          {row.type && options.length > 1 && (
            <div className="factuelle-field min-w-0" data-factuelle-field={`${field}.profil`}>
              <span className="factuelle-label" id={profileLabelId}>
                Profil
              </span>
              <ChoiceButtons
                labelledBy={profileLabelId}
                value={row.profil ?? ''}
                invalid={Boolean(errors[`${field}.profil`])}
                options={options.map((option) => ({
                  value: option.profil,
                  label: COUCHAGE_PROFIL_LABELS[option.profil],
                }))}
                onChange={(value) => {
                  const profile = options.find((option) => option.profil === value);
                  if (profile) {
                    onChange({
                      ...row,
                      profil: profile.profil,
                      nombre_places: String(profile.nombre_places_initial),
                      format: null,
                      largeur_cm: '',
                      longueur_cm: '',
                    });
                  }
                }}
              />
              {errors[`${field}.profil`] && (
                <p className="factuelle-error">{errors[`${field}.profil`]}</p>
              )}
            </div>
          )}

          {selected && (
            <>
              <Counter
                field={`${field}.nombre_places`}
                label="Nombre de couchages (places)"
                value={row.nombre_places}
                minimum={selected.nombre_places_minimum}
                step={selected.pas_nombre_places}
                initial={selected.nombre_places_initial}
                error={errors[`${field}.nombre_places`]}
                highlights={highlights}
                onChange={(nombre_places) => onChange({ ...row, nombre_places })}
              />
              <div
                className="factuelle-field min-w-0 sm:col-span-2"
                data-factuelle-field={freeDimensions ? `${field}.format` : `${field}.largeur_cm`}
              >
                <span className="factuelle-label" id={formatLabelId}>
                  {row.type === 'TWINS' ? 'Format par couchage' : 'Format'}
                </span>
                <ChoiceButtons
                  labelledBy={formatLabelId}
                  value={formatChoice}
                  invalid={Boolean(hiddenDimensionError)}
                  options={[
                    ...selected.formats.map((format) => ({
                      value: formatValue(format),
                      label: `${format.largeur_cm} × ${format.longueur_cm} cm`,
                    })),
                    ...(selected.dimensions_libres
                      ? [{ value: 'libre', label: 'Autres dimensions' }]
                      : []),
                  ]}
                  onChange={(value) => {
                    const format = selected.formats.find((entry) => formatValue(entry) === value);
                    onChange({
                      ...row,
                      format: value,
                      largeur_cm: format ? String(format.largeur_cm) : '',
                      longueur_cm: format ? String(format.longueur_cm) : '',
                    });
                  }}
                />
                {hiddenDimensionError && <p className="factuelle-error">{hiddenDimensionError}</p>}
              </div>
              {freeDimensions && (
                <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                  {(['largeur_cm', 'longueur_cm'] as const).map((axis) => (
                    <NumberField
                      key={axis}
                      field={`${field}.${axis}`}
                      label={`${axis === 'largeur_cm' ? 'Largeur' : 'Longueur'}${
                        row.type === 'TWINS' ? ' par couchage' : ''
                      } (cm)`}
                      value={row[axis]}
                      error={errors[`${field}.${axis}`]}
                      highlights={highlights}
                      onChange={(value) => onChange({ ...row, [axis]: value })}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <div className="flex justify-end sm:col-span-2">
            <button
              type="button"
              className="factuelle-secondary-action ui-focus"
              aria-label={`Valider le couchage ${index + 1}`}
              onClick={onToggle}
            >
              Valider
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Literie({
  draft,
  errors,
  highlights,
  onChange,
  onOpenHelp,
}: {
  draft: FactuellePieceDraft;
  errors: FactuelleFieldErrors;
  highlights: FieldHighlights;
  onChange: (partial: Partial<FactuellePieceDraft>) => void;
  onOpenHelp: (criterionNumber: number) => void;
}) {
  return (
    <div className="space-y-4 border-t border-ink/10 pt-4">
      <p className="text-sm font-semibold text-ink">Literie et équipements associés</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {visibleInspectionFields(draft, 'couchages').map((field) => (
          <BooleanChoice
            key={field}
            field={`inspection.${field}`}
            label={INSPECTION_PRESENTATION[field].label}
            value={draft.inspection[field]}
            highlights={highlights}
            onHelp={() => onOpenHelp(INSPECTION_PRESENTATION[field].help)}
            onChange={(value) => onChange({ inspection: { ...draft.inspection, [field]: value } })}
          />
        ))}
        <Counter
          field="nombre_oreillers"
          label="Nombre d’oreillers"
          value={draft.nombre_oreillers}
          error={errors.nombre_oreillers}
          highlights={highlights}
          onChange={(nombre_oreillers) => onChange({ nombre_oreillers })}
        />
        <BooleanChoice
          field="tous_lits_couette"
          label="Tous les lits concernés ont-ils une couette ?"
          value={draft.tous_lits_couette}
          highlights={highlights}
          onHelp={() => onOpenHelp(31)}
          onChange={(tous_lits_couette) => onChange({ tous_lits_couette })}
        />
        {draft.tous_lits_couette === false && (
          <BooleanChoice
            field="deux_couvertures_par_lit_sans_couette"
            label="Chaque lit sans couette a-t-il au moins deux couvertures ?"
            value={draft.deux_couvertures_par_lit_sans_couette}
            highlights={highlights}
            onChange={(deux_couvertures_par_lit_sans_couette) =>
              onChange({ deux_couvertures_par_lit_sans_couette })
            }
          />
        )}
      </div>
    </div>
  );
}
