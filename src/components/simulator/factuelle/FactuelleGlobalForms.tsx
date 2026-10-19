import { useId, useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  COMBINE_HELP,
  COMMUN_CHOICES,
  communChoice,
  communFromChoice,
  CONFIGURATION_FOUR_LABELS,
  emptyCuissonLine,
  inventaireGroups,
  inventaireLabel,
  LIVRET_ACCUEIL_LABELS,
  TECHNOLOGIE_CUISSON_LABELS,
  type CuissonDraft,
  type MesuresDraft,
} from '../../../utils/factuelleGlobaux';
import type {
  AssisesSalonFaits,
  AssisesTableFaits,
  CatalogueFaits,
  CatalogueOption,
  ChauffageFaits,
  EquipementCommunFaits,
  FourMicroOndesFaits,
  InventaireCatalogue,
  LivretAccueilFaits,
} from '../../../utils/simulatorFactuelle.types';
import { BooleanChoice, CheckRow, ChoiceButtons, NumberField, TextField } from './FactuelleFields';
import type { FieldHighlights } from '../../../utils/factuellePieces';

/** Formulaires contrôlés des modales de faits globaux : aucune requête, aucun verdict calculé. */

interface FormProps<T> {
  value: T;
  onChange: (value: T) => void;
  disabled: boolean;
  highlights: FieldHighlights;
  /** Erreurs locales (structure incomplète) et `fieldErrors` backend, par champ de la modale. */
  errors: Record<string, string>;
}

function highlightOf(highlights: FieldHighlights, field: string) {
  return highlights[field];
}

function FieldErrorText({ message }: { message: string | undefined }) {
  return message ? <p className="factuelle-error">{message}</p> : null;
}

export function CommunForm({
  bloc,
  value,
  onChange,
  disabled,
  highlights,
  errors,
}: FormProps<EquipementCommunFaits> & { bloc: 'c18' | 'c19' }) {
  const labelId = useId();
  const label = bloc === 'c18' ? 'Lave-linge' : 'Sèche-linge';
  return (
    <div
      className="factuelle-field"
      data-factuelle-field={bloc}
      data-highlight={highlightOf(highlights, bloc)}
    >
      <span id={labelId} className="sr-only" data-factuelle-label>
        {label}
      </span>
      <ChoiceButtons
        labelledBy={labelId}
        value={communChoice(value) ?? ''}
        options={COMMUN_CHOICES}
        disabled={disabled}
        invalid={Boolean(errors[bloc])}
        clearLabel={label}
        onChange={(next) =>
          onChange(
            communFromChoice(COMMUN_CHOICES.find((choice) => choice.value === next)?.value ?? null)
          )
        }
      />
      <FieldErrorText message={errors[bloc]} />
    </div>
  );
}

/** C25/C26 : appréciation commune puis précision, masquée quand l'appréciation est négative. */
function AssisesFields({
  bloc,
  appreciation,
  precision,
  precisionField,
  labels,
  disabled,
  highlights,
  errors,
  onAppreciation,
  onPrecision,
}: {
  bloc: 'c25' | 'c26';
  appreciation: boolean | null;
  precision: boolean | null;
  precisionField: string;
  labels: { appreciation: string; precision: string };
  disabled: boolean;
  highlights: FieldHighlights;
  errors: Record<string, string>;
  onAppreciation: (value: boolean | null) => void;
  onPrecision: (value: boolean | null) => void;
}) {
  return (
    <div className="grid gap-4">
      <BooleanChoice
        field={`${bloc}.appreciation_commune`}
        label={labels.appreciation}
        value={appreciation}
        disabled={disabled}
        highlights={highlights}
        error={errors[`${bloc}.appreciation_commune`]}
        onChange={onAppreciation}
      />
      {appreciation !== false && (
        <BooleanChoice
          field={`${bloc}.${precisionField}`}
          label={labels.precision}
          value={precision}
          disabled={disabled}
          highlights={highlights}
          error={errors[`${bloc}.${precisionField}`]}
          onChange={onPrecision}
        />
      )}
    </div>
  );
}

export function TableAssisesForm({
  value,
  onChange,
  disabled,
  highlights,
  errors,
}: FormProps<AssisesTableFaits>) {
  return (
    <AssisesFields
      bloc="c25"
      appreciation={value.appreciation_commune}
      precision={value.besoin_assises_sans_dossier}
      precisionField="besoin_assises_sans_dossier"
      labels={{
        appreciation: 'Une place à table et un siège pour chaque occupant ?',
        precision:
          'Des assises sans dossier sont-elles nécessaires pour accueillir tous les occupants ?',
      }}
      disabled={disabled}
      highlights={highlights}
      errors={errors}
      onAppreciation={(appreciation_commune) => onChange({ ...value, appreciation_commune })}
      onPrecision={(besoin_assises_sans_dossier) =>
        onChange({ ...value, besoin_assises_sans_dossier })
      }
    />
  );
}

export function SalonAssisesForm({
  value,
  onChange,
  disabled,
  highlights,
  errors,
}: FormProps<AssisesSalonFaits>) {
  return (
    <AssisesFields
      bloc="c26"
      appreciation={value.appreciation_commune}
      precision={value.assises_uniquement_convertibles}
      precisionField="assises_uniquement_convertibles"
      labels={{
        appreciation: 'Des places assises en nombre suffisant dans le salon ?',
        precision: 'Les assises sont-elles uniquement des convertibles ?',
      }}
      disabled={disabled}
      highlights={highlights}
      errors={errors}
      onAppreciation={(appreciation_commune) => onChange({ ...value, appreciation_commune })}
      onPrecision={(assises_uniquement_convertibles) =>
        onChange({ ...value, assises_uniquement_convertibles })
      }
    />
  );
}

const LIVRET_OPTIONS = Object.entries(LIVRET_ACCUEIL_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function LivretAccueilForm({
  value,
  onChange,
  disabled,
  highlights,
  errors,
}: FormProps<LivretAccueilFaits>) {
  const labelId = useId();
  return (
    <div
      className="factuelle-field"
      data-factuelle-field="c101.situation"
      data-highlight={highlightOf(highlights, 'c101.situation')}
    >
      <span id={labelId} className="sr-only" data-factuelle-label>
        Livret d’accueil
      </span>
      <ChoiceButtons
        labelledBy={labelId}
        value={value.situation ?? ''}
        options={LIVRET_OPTIONS}
        disabled={disabled}
        invalid={Boolean(errors['c101.situation'])}
        clearLabel="Livret d’accueil"
        onChange={(next) =>
          onChange({
            situation:
              next === 'ABSENT' || next === 'PRESENT_NON_BILINGUE' || next === 'PRESENT_BILINGUE'
                ? next
                : null,
          })
        }
      />
      <FieldErrorText message={errors['c101.situation']} />
    </div>
  );
}

const AUCUNE_PLAQUE = 'AUCUNE';

export function CuissonForm({
  value,
  onChange,
  disabled,
  highlights,
  catalogue,
  errors,
}: FormProps<CuissonDraft> & { catalogue: CatalogueFaits }) {
  // Ligne neutre affichée tant qu'aucune plaque n'est saisie : elle ne devient réelle qu'au choix d'un type.
  const [placeholderId] = useState(() => emptyCuissonLine().id);
  const { presence, lignes } = value;
  const rows =
    presence !== false && lignes.length > 0
      ? lignes
      : [{ id: placeholderId, technologie: null, nombre: '' }];

  function selectTechnology(rowId: string, selected: string) {
    if (selected === AUCUNE_PLAQUE) {
      onChange({ presence: false, lignes: [] });
      return;
    }
    const technologie = catalogue.technologies_cuisson.find((entry) => entry === selected) ?? null;
    if (lignes.length === 0 || presence === false) {
      onChange({
        presence: technologie ? true : null,
        lignes: technologie ? [{ id: rowId, technologie, nombre: '' }] : [],
      });
      return;
    }
    onChange({
      presence: true,
      lignes: lignes.map((ligne) => (ligne.id === rowId ? { ...ligne, technologie } : ligne)),
    });
  }

  return (
    <div
      className="factuelle-field space-y-3"
      data-factuelle-field="cuisson"
      data-highlight={highlightOf(highlights, 'cuisson')}
    >
      {rows.map((ligne) => {
        const real = presence !== false && lignes.length > 0;
        const technologyError = errors[`cuisson.${ligne.id}.technologie`];
        return (
          <div
            key={ligne.id}
            className="factuelle-equipment grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-start"
          >
            <div
              className="factuelle-field min-w-0"
              data-factuelle-field={`cuisson.${ligne.id}.technologie`}
            >
              <span className="factuelle-label">
                <label htmlFor={`plaque-${ligne.id}`} data-factuelle-label>
                  Type de plaque
                </label>
              </span>
              <select
                id={`plaque-${ligne.id}`}
                className={`ui-field h-11 px-3 ${technologyError ? 'ui-field-error' : ''}`}
                value={presence === false ? AUCUNE_PLAQUE : (ligne.technologie ?? '')}
                disabled={disabled}
                aria-invalid={Boolean(technologyError) || undefined}
                onChange={(event) => selectTechnology(ligne.id, event.target.value)}
              >
                <option value="">Sélectionner</option>
                {catalogue.technologies_cuisson.map((technologie) => (
                  <option key={technologie} value={technologie}>
                    {TECHNOLOGIE_CUISSON_LABELS[technologie]}
                  </option>
                ))}
                <option value={AUCUNE_PLAQUE}>Aucune plaque</option>
              </select>
              {technologyError && <p className="factuelle-error">{technologyError}</p>}
            </div>
            {real && (
              <>
                <NumberField
                  field={`cuisson.${ligne.id}.nombre_foyers`}
                  label="Nombre de foyers"
                  value={ligne.nombre}
                  integer
                  disabled={disabled}
                  error={errors[`cuisson.${ligne.id}.nombre_foyers`]}
                  onChange={(nombre) =>
                    onChange({
                      presence,
                      lignes: lignes.map((entry) =>
                        entry.id === ligne.id ? { ...entry, nombre } : entry
                      ),
                    })
                  }
                />
                <button
                  type="button"
                  className="factuelle-icon-action ui-focus sm:mt-11"
                  aria-label="Retirer la plaque"
                  disabled={disabled}
                  onClick={() => {
                    const next = lignes.filter((entry) => entry.id !== ligne.id);
                    onChange({ presence: next.length > 0 ? presence : null, lignes: next });
                  }}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        );
      })}
      {presence === true && (
        <button
          type="button"
          className="factuelle-secondary-action ui-focus"
          disabled={disabled}
          onClick={() => onChange({ presence, lignes: [...lignes, emptyCuissonLine()] })}
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Ajouter une plaque
        </button>
      )}
      <FieldErrorText message={errors.cuisson} />
    </div>
  );
}

export function FourForm({
  value,
  onChange,
  disabled,
  highlights,
  catalogue,
  errors,
}: FormProps<FourMicroOndesFaits> & { catalogue: CatalogueFaits }) {
  const configurationId = useId();
  const choiceId = useId();
  return (
    <div className="grid gap-4">
      <div
        className="factuelle-field"
        data-factuelle-field="four_micro_ondes.configuration"
        data-highlight={highlightOf(highlights, 'four_micro_ondes.configuration')}
      >
        <span id={configurationId} className="factuelle-label">
          <span data-factuelle-label>Équipements</span>
        </span>
        <ChoiceButtons
          labelledBy={configurationId}
          value={value.configuration ?? ''}
          options={catalogue.configurations_four_micro_ondes.map((configuration) => ({
            value: configuration,
            label: CONFIGURATION_FOUR_LABELS[configuration],
          }))}
          disabled={disabled}
          invalid={Boolean(errors['four_micro_ondes.configuration'])}
          clearLabel="Équipements"
          onChange={(next) => {
            const configuration =
              catalogue.configurations_four_micro_ondes.find((entry) => entry === next) ?? null;
            if (configuration !== value.configuration) {
              onChange({ configuration, choix_combine: null });
            }
          }}
        />
        <FieldErrorText message={errors['four_micro_ondes.configuration']} />
      </div>
      {value.configuration === 'COMBINE_SEUL' && (
        <div
          className="factuelle-field"
          data-factuelle-field="four_micro_ondes.choix_combine"
          data-highlight={highlightOf(highlights, 'four_micro_ondes.choix_combine')}
        >
          <span id={choiceId} className="factuelle-label">
            <span data-factuelle-label>Équipement retenu à partir de 3★</span>
          </span>
          <p className="text-sm text-muted">{COMBINE_HELP}</p>
          <ChoiceButtons
            labelledBy={choiceId}
            value={value.choix_combine ?? ''}
            options={[
              { value: 'FOUR', label: 'Four' },
              { value: 'MICRO_ONDES', label: 'Micro-ondes' },
            ]}
            disabled={disabled}
            invalid={Boolean(errors['four_micro_ondes.choix_combine'])}
            clearLabel="Équipement retenu"
            onChange={(next) =>
              onChange({
                ...value,
                choix_combine: next === 'FOUR' || next === 'MICRO_ONDES' ? next : null,
              })
            }
          />
          <FieldErrorText message={errors['four_micro_ondes.choix_combine']} />
        </div>
      )}
    </div>
  );
}

const CHAUFFAGE_NEGATIFS = [
  { etat: 'AUCUN', label: 'Aucun système de chauffage' },
  { etat: 'MOBILES_UNIQUEMENT', label: 'Chauffages mobiles d’appoint uniquement' },
] as const;

export function ChauffageForm({
  value,
  onChange,
  disabled,
  highlights,
  catalogue,
  errors,
}: FormProps<ChauffageFaits> & { catalogue: CatalogueFaits }) {
  const negative = value.etat === 'AUCUN' || value.etat === 'MOBILES_UNIQUEMENT';
  return (
    <div className="grid gap-4">
      <div
        className="factuelle-field gap-2"
        data-factuelle-field="chauffage"
        data-highlight={highlightOf(highlights, 'chauffage')}
      >
        {catalogue.types_chauffage.map((type) => (
          <CheckRow
            key={type.id}
            checked={!negative && value.types.includes(type.id)}
            disabled={disabled}
            onChange={(checked) => {
              // Une situation négative a vidé les types : cocher une installation la remplace.
              const types = checked
                ? [...value.types.filter((id) => id !== type.id), type.id]
                : value.types.filter((id) => id !== type.id);
              onChange({
                etat: types.length > 0 ? 'INSTALLATIONS' : null,
                types,
                autre: value.autre,
              });
            }}
          >
            {type.libelle}
          </CheckRow>
        ))}
        {/* Situations exclusives, séparées des installations. */}
        {CHAUFFAGE_NEGATIFS.map((option) => (
          <CheckRow
            key={option.etat}
            checked={value.etat === option.etat}
            disabled={disabled}
            onChange={(checked) =>
              onChange(
                checked
                  ? { etat: option.etat, types: [], autre: null }
                  : { etat: null, types: [], autre: null }
              )
            }
          >
            {option.label}
          </CheckRow>
        ))}
        <FieldErrorText message={errors.chauffage} />
      </div>
      {!negative && value.types.includes('AUTRE') && (
        <TextField
          field="chauffage.autre"
          label="Autre"
          value={value.autre ?? ''}
          maxLength={255}
          disabled={disabled}
          error={errors['chauffage.autre']}
          onChange={(autre) => onChange({ ...value, autre })}
        />
      )}
    </div>
  );
}

export function MesuresForm({
  field,
  value,
  onChange,
  disabled,
  highlights,
  errors,
  options,
}: FormProps<MesuresDraft> & {
  field: 'mesures_energie' | 'mesures_eau';
  options: CatalogueOption[];
}) {
  return (
    <div
      className="factuelle-field gap-2"
      data-factuelle-field={field}
      data-highlight={highlightOf(highlights, field)}
    >
      {options.map((option) => (
        <CheckRow
          key={option.id}
          checked={!value.aucune && value.mesures.includes(option.id)}
          disabled={disabled}
          onChange={(checked) =>
            onChange({
              ...value,
              aucune: false,
              mesures: checked
                ? [...value.mesures.filter((id) => id !== option.id), option.id]
                : value.mesures.filter((id) => id !== option.id),
            })
          }
        >
          {option.libelle}
        </CheckRow>
      ))}
      <CheckRow
        checked={!value.aucune && value.autresOuvert}
        disabled={disabled}
        onChange={(checked) =>
          onChange({
            ...value,
            aucune: false,
            autresOuvert: checked,
            autres: checked && value.autres.length === 0 ? [''] : value.autres,
          })
        }
      >
        Autres
      </CheckRow>
      {!value.aucune && value.autresOuvert && (
        <div className="space-y-2 pl-1">
          {value.autres.map((text, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <TextField
                  field={`${field}.autres.${index}`}
                  label={`Autre mesure ${index + 1}`}
                  value={text}
                  maxLength={255}
                  disabled={disabled}
                  error={errors[`${field}.autres.${index}`]}
                  onChange={(next) =>
                    onChange({
                      ...value,
                      autres: value.autres.map((entry, position) =>
                        position === index ? next : entry
                      ),
                    })
                  }
                />
              </div>
              <button
                type="button"
                className="factuelle-icon-action ui-focus"
                aria-label={`Retirer la mesure ${index + 1}`}
                disabled={disabled}
                onClick={() =>
                  onChange({
                    ...value,
                    autres: value.autres.filter((_entry, position) => position !== index),
                  })
                }
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="factuelle-secondary-action ui-focus"
            disabled={disabled}
            onClick={() => onChange({ ...value, autres: [...value.autres, ''] })}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Ajouter une mesure
          </button>
        </div>
      )}
      <CheckRow
        checked={value.aucune}
        disabled={disabled}
        onChange={(checked) =>
          onChange(
            checked
              ? { aucune: true, mesures: [], autresOuvert: false, autres: [] }
              : { ...value, aucune: false }
          )
        }
      >
        Aucune mesure
      </CheckRow>
      <FieldErrorText message={errors[field]} />
    </div>
  );
}

export function InventaireForm({
  field,
  value,
  onChange,
  disabled,
  highlights,
  errors,
  inventaire,
}: FormProps<Record<string, boolean>> & {
  field: 'c63' | 'c64' | 'c65';
  inventaire: InventaireCatalogue;
}) {
  return (
    <div
      className="factuelle-field gap-4"
      data-factuelle-field={field}
      data-highlight={highlightOf(highlights, field)}
    >
      {inventaireGroups(inventaire.items).map((group) => (
        <section key={group.items[0]?.id ?? group.groupe} className="space-y-2">
          {group.groupe && <h5 className="factuelle-section-title">{group.groupe}</h5>}
          {group.items.map((item) => (
            <CheckRow
              key={item.id}
              checked={value[item.id] === true}
              disabled={disabled}
              onChange={(checked) => onChange({ ...value, [item.id]: checked })}
            >
              {inventaireLabel(item)}
            </CheckRow>
          ))}
        </section>
      ))}
      <FieldErrorText message={errors[field]} />
    </div>
  );
}
