import { ChangeEvent } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormPhoneLink from './FormPhoneLink';
import type { CommuneLookup } from '../../hooks/useCommuneLookup';
import type { formContent } from '../../i18n/formContent';
import type { Locale } from '../../i18n/locales';

interface CommuneLookupFieldProps {
  content: (typeof formContent)[Locale]['demandeClassement'];
  codePostal: string;
  codeInsee: string;
  lookup: CommuneLookup;
  codePostalError?: string | undefined;
  communeError?: string | undefined;
  onCodePostalChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCommuneChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onRetry: () => void;
}

export default function CommuneLookupField({
  content,
  codePostal,
  codeInsee,
  lookup,
  codePostalError,
  communeError,
  onCodePostalChange,
  onCommuneChange,
  onRetry,
}: CommuneLookupFieldProps) {
  const communes = lookup.status === 'ready' ? lookup.communes : [];
  const [uniqueCommune] = communes.length === 1 ? communes : [];

  return (
    <>
      <div>
        <Input
          label={content.labels.codePostal}
          name="codePostal"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          className="inquiry-postal-code"
          value={codePostal}
          onChange={onCodePostalChange}
          error={lookup.status === 'empty' ? content.communeLookup.notFound : codePostalError}
          placeholder={content.placeholders.codePostal}
          required
        />

        {/* Dans le même bloc que le champ : vide, cette zone d'annonce n'ajoute aucun espace. */}
        <div aria-live="polite" className="inquiry-commune-status">
          {lookup.status === 'loading' && (
            <p className="inquiry-form-note">{content.communeLookup.loading}</p>
          )}
          {uniqueCommune && (
            <p className="inquiry-commune">
              <span className="inquiry-commune-label">{content.labels.commune}</span>
              <span className="inquiry-commune-name">{uniqueCommune.nom}</span>
            </p>
          )}
          {communeError && (lookup.status === 'loading' || uniqueCommune) && (
            <p className="mt-2 text-sm text-alert-400">{communeError}</p>
          )}
        </div>
      </div>

      {communes.length > 1 && (
        <Select
          label={content.labels.commune}
          name="commune"
          autoComplete="off"
          value={codeInsee}
          onChange={onCommuneChange}
          error={communeError}
          options={[
            { value: '', label: content.placeholders.commune },
            ...communes.map((commune) => ({ value: commune.codeInsee, label: commune.nom })),
          ]}
          required
        />
      )}

      {lookup.status === 'unavailable' && (
        <div className="inquiry-error inquiry-lookup-error ui-focus" role="alert" tabIndex={-1}>
          <p>{content.communeLookup.unavailable}</p>
          <div className="inquiry-lookup-actions">
            <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
              {content.communeLookup.retry}
            </Button>
            <FormPhoneLink />
          </div>
        </div>
      )}
    </>
  );
}
