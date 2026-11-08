import { ChangeEvent } from 'react';
import Input from '../ui/Input';
import RadioGroup from '../ui/RadioGroup';
import Select from '../ui/Select';
import { getCountryOptions } from '../../content/countries';
import type { formContent } from '../../i18n/formContent';
import type { Locale } from '../../i18n/locales';
import {
  ADRESSE_IDENTIQUE_VALUES,
  PAYS_FRANCE,
  TYPE_CLIENT_VALUES,
  type AdresseIdentique,
  type DemandeClassementFormData,
  type TypeClient,
  type ValidationError,
} from '../../utils/formValidation';

interface ClientCoordonneesFieldsProps {
  content: (typeof formContent)[Locale]['demandeClassement'];
  locale: Locale;
  data: DemandeClassementFormData;
  errors: ValidationError;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onTypeClientChange: (typeClient: TypeClient) => void;
  onAdresseIdentiqueChange: (adresseIdentique: AdresseIdentique) => void;
  onNumSiretChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCodePostalClientChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPaysClientChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

export default function ClientCoordonneesFields({
  content,
  locale,
  data,
  errors,
  onChange,
  onTypeClientChange,
  onAdresseIdentiqueChange,
  onNumSiretChange,
  onCodePostalClientChange,
  onPaysClientChange,
}: ClientCoordonneesFieldsProps) {
  const isSociete = data.typeClient === 'PROFESSIONNEL';
  const isFrance = data.paysClient === PAYS_FRANCE;

  return (
    <>
      <RadioGroup
        label={content.labels.typeClient}
        name="typeClient"
        value={data.typeClient}
        options={TYPE_CLIENT_VALUES.map((value) => ({
          value,
          label: content.typeClientOptions[value],
        }))}
        onChange={onTypeClientChange}
        error={errors.typeClient}
        required
      />

      {isSociete && (
        <div className="inquiry-field-grid">
          <Input
            label={content.labels.raisonSociale}
            name="raisonSociale"
            type="text"
            autoComplete="organization"
            maxLength={255}
            value={data.raisonSociale}
            onChange={onChange}
            error={errors.raisonSociale}
            required
          />
          <Input
            label={content.labels.numSiret}
            name="numSiret"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={content.placeholders.numSiret}
            value={data.numSiret}
            onChange={onNumSiretChange}
            error={errors.numSiret}
            required
          />
        </div>
      )}

      {data.typeClient && (
        <RadioGroup
          label={
            isSociete
              ? content.labels.adresseIdentiqueSociete
              : content.labels.adresseIdentiqueParticulier
          }
          name="adresseClientIdentiqueLogement"
          value={data.adresseClientIdentiqueLogement}
          options={ADRESSE_IDENTIQUE_VALUES.map((value) => ({
            value,
            label: content.adresseIdentiqueOptions[value],
          }))}
          onChange={onAdresseIdentiqueChange}
          error={errors.adresseClientIdentiqueLogement}
          required
        />
      )}

      {data.adresseClientIdentiqueLogement === 'non' && (
        <>
          {/* Avant le code postal, dont le format dépend du pays. Une société est forcément française. */}
          {!isSociete && (
            <Select
              label={content.labels.paysClient}
              name="paysClient"
              autoComplete="country"
              value={data.paysClient}
              onChange={onPaysClientChange}
              error={errors.paysClient}
              options={getCountryOptions(locale)}
              required
            />
          )}
          <Input
            label={content.labels.adresseClient}
            name="adresseClient"
            type="text"
            autoComplete="address-line1"
            maxLength={255}
            placeholder={content.placeholders.adresse}
            value={data.adresseClient}
            onChange={onChange}
            error={errors.adresseClient}
            required
          />
          <Input
            label={content.labels.complementAdresseClient}
            name="complementAdresseClient"
            type="text"
            autoComplete="address-line2"
            maxLength={255}
            value={data.complementAdresseClient}
            onChange={onChange}
            error={errors.complementAdresseClient}
          />
          <div className="inquiry-field-grid">
            <Input
              label={content.labels.codePostalClient}
              name="codePostalClient"
              type="text"
              inputMode={isFrance ? 'numeric' : 'text'}
              autoComplete="postal-code"
              maxLength={isFrance ? 5 : 10}
              value={data.codePostalClient}
              onChange={onCodePostalClientChange}
              error={errors.codePostalClient}
              required={isFrance}
            />
            <Input
              label={content.labels.villeClient}
              name="villeClient"
              type="text"
              autoComplete="address-level2"
              maxLength={255}
              value={data.villeClient}
              onChange={onChange}
              error={errors.villeClient}
              required
            />
          </div>
        </>
      )}
    </>
  );
}
