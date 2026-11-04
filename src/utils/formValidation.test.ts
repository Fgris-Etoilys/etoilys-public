import { describe, expect, it } from 'vitest';
import {
  buildDemandeClassementPayload,
  getFirstDemandeClassementStepWithError,
  isPostalCodeValidForCountry,
  validateContactForm,
  validateDemandeClassementForm,
  validateDemandeClassementStep,
  validatePhone,
  validatePostalCode,
  type DemandeClassementFormData,
} from './formValidation';

const validDemande: DemandeClassementFormData = {
  codePostal: '24150',
  commune: 'Mauzac-et-Grand-Castang',
  codeInsee: '24260',
  adresse: '1 rue du Test',
  nom: 'Doe',
  prenom: 'Jane',
  email: 'jane@example.com',
  telephone: '06 12 34 56 78',
  civilite: 'Madame',
  typeClient: 'PARTICULIER',
  raisonSociale: '',
  numSiret: '',
  adresseClientIdentiqueLogement: 'oui',
  adresseClient: '',
  complementAdresseClient: '',
  codePostalClient: '',
  villeClient: '',
  paysClient: 'FR',
  classementActuelDeclare: 'INCONNU',
  message: '',
  consent: true,
};

describe('validatePhone', () => {
  it('accepts French phone numbers', () => {
    expect(validatePhone('0612345678')).toBe(true);
    expect(validatePhone('06 12 34 56 78')).toBe(true);
    expect(validatePhone('+33612345678')).toBe(true);
    expect(validatePhone('+33 6 12 34 56 78')).toBe(true);
    expect(validatePhone('0033612345678')).toBe(true);
  });

  it('accepts international phone numbers', () => {
    expect(validatePhone('+32 470 12 34 56')).toBe(true);
    expect(validatePhone('0032 470 12 34 56')).toBe(true);
    expect(validatePhone('+44 7700 900123')).toBe(true);
    expect(validatePhone('+31 6 12345678')).toBe(true);
    expect(validatePhone('+1 (202) 555-0123')).toBe(true);
  });

  it('rejects malformed phone numbers', () => {
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('12345')).toBe(false);
    expect(validatePhone('abcdefghij')).toBe(false);
    expect(validatePhone('+32 abc 12 34')).toBe(false);
    expect(validatePhone('+0123456789')).toBe(false);
    expect(validatePhone('+33')).toBe(false);
  });
});

describe('form validation i18n', () => {
  it('keeps French validation messages by default', () => {
    expect(
      validateContactForm({
        nom: '',
        email: 'email-invalide',
        message: '',
        consent: false,
      })
    ).toEqual({
      nom: 'Le nom est requis',
      email: "L'email n'est pas valide",
      message: 'Le message est requis',
      consent: 'Vous devez accepter la politique de confidentialité',
    });
  });

  it('returns English validation messages when locale is en', () => {
    expect(
      validateDemandeClassementForm(
        {
          codePostal: '',
          commune: '',
          codeInsee: '',
          adresse: '',
          nom: '',
          prenom: '',
          email: '',
          telephone: '123',
          civilite: '',
          typeClient: '',
          raisonSociale: '',
          numSiret: '',
          adresseClientIdentiqueLogement: '',
          adresseClient: '',
          complementAdresseClient: '',
          codePostalClient: '',
          villeClient: '',
          paysClient: 'FR',
          classementActuelDeclare: '',
          message: '',
          consent: false,
        },
        'en'
      )
    ).toEqual({
      codePostal: 'Postcode is required',
      nom: 'Name is required',
      prenom: 'First name is required',
      email: 'Email is required',
      telephone: 'Phone number is not valid',
      civilite: 'Select your title',
      typeClient: 'Tell us how you rent out this accommodation',
      classementActuelDeclare: 'Select your situation',
      consent: 'You must accept the privacy policy',
    });
  });
});

describe('validatePostalCode', () => {
  it('accepts exactly five digits', () => {
    expect(validatePostalCode('24150')).toBe(true);
    expect(validatePostalCode('2415')).toBe(false);
    expect(validatePostalCode('241500')).toBe(false);
    expect(validatePostalCode('2A004')).toBe(false);
  });
});

describe('isPostalCodeValidForCountry', () => {
  it('accepts an empty code, which is only missing where it is required', () => {
    expect(isPostalCodeValidForCountry('FR', '')).toBe(true);
    expect(isPostalCodeValidForCountry('GB', '   ')).toBe(true);
  });

  it('requires five digits in France', () => {
    expect(isPostalCodeValidForCountry('FR', '01000')).toBe(true);
    expect(isPostalCodeValidForCountry('FR', '1000')).toBe(false);
    expect(isPostalCodeValidForCountry('FR', 'SW1A 2AA')).toBe(false);
  });

  it('accepts 1 to 10 ASCII letters, digits, spaces or hyphens abroad', () => {
    expect(isPostalCodeValidForCountry('GB', 'SW1A 2AA')).toBe(true);
    expect(isPostalCodeValidForCountry('PT', '1000-001')).toBe(true);
    expect(isPostalCodeValidForCountry('GB', ' 1 ')).toBe(true);
    expect(isPostalCodeValidForCountry('GB', '12345678901')).toBe(false);
    expect(isPostalCodeValidForCountry('DE', 'Köln')).toBe(false);
  });
});

describe('validateDemandeClassementStep', () => {
  it('accepts a complete request on every step', () => {
    expect(validateDemandeClassementForm(validDemande)).toEqual({});
  });

  it('only validates the fields of the requested step', () => {
    const empty: DemandeClassementFormData = {
      ...validDemande,
      codePostal: '',
      nom: '',
      classementActuelDeclare: '',
    };

    expect(Object.keys(validateDemandeClassementStep(0, empty))).toEqual(['codePostal']);
    expect(Object.keys(validateDemandeClassementStep(1, empty))).toEqual(['nom']);
    expect(Object.keys(validateDemandeClassementStep(2, empty))).toEqual([
      'classementActuelDeclare',
    ]);
  });

  it('rejects an incomplete postal code', () => {
    expect(validateDemandeClassementStep(0, { ...validDemande, codePostal: '2415' })).toEqual({
      codePostal: 'Le code postal doit contenir 5 chiffres',
    });
  });

  it('requires a confirmed commune before asking for the address', () => {
    expect(
      validateDemandeClassementStep(0, { ...validDemande, commune: '', codeInsee: '', adresse: '' })
    ).toEqual({ commune: 'Sélectionnez votre commune' });
    expect(validateDemandeClassementStep(0, { ...validDemande, adresse: '  ' })).toEqual({
      adresse: "L'adresse du bien est requise",
    });
  });

  it('limits the address to 255 characters without counting surrounding spaces', () => {
    expect(validateDemandeClassementStep(0, { ...validDemande, adresse: 'a'.repeat(255) })).toEqual(
      {}
    );
    expect(
      validateDemandeClassementStep(0, { ...validDemande, adresse: ` ${'a'.repeat(255)} ` })
    ).toEqual({});
    expect(validateDemandeClassementStep(0, { ...validDemande, adresse: 'a'.repeat(256) })).toEqual(
      { adresse: "L'adresse du logement ne doit pas dépasser 255 caractères" }
    );
  });

  it('asks for the address choice only once the type is chosen', () => {
    const unanswered: DemandeClassementFormData = {
      ...validDemande,
      typeClient: '',
      adresseClientIdentiqueLogement: '',
    };

    expect(Object.keys(validateDemandeClassementStep(1, unanswered))).toEqual(['typeClient']);
    expect(
      Object.keys(validateDemandeClassementStep(1, { ...unanswered, typeClient: 'PARTICULIER' }))
    ).toEqual(['adresseClientIdentiqueLogement']);
  });

  it('requires the company name and a 14-digit SIRET for a company only', () => {
    const societe: DemandeClassementFormData = { ...validDemande, typeClient: 'PROFESSIONNEL' };

    expect(validateDemandeClassementStep(1, societe)).toEqual({
      raisonSociale: 'Le nom de la société est requis',
      numSiret: 'Le numéro SIRET est requis',
    });
    expect(
      validateDemandeClassementStep(1, { ...societe, raisonSociale: 'SCI', numSiret: '1234' })
    ).toEqual({ numSiret: 'Le numéro SIRET doit contenir 14 chiffres' });
    expect(
      validateDemandeClassementStep(1, {
        ...societe,
        raisonSociale: 'SCI',
        numSiret: '01234567890123',
      })
    ).toEqual({});
    expect(validateDemandeClassementStep(1, validDemande)).toEqual({});
  });

  it('validates a distinct address according to its country', () => {
    const distincte: DemandeClassementFormData = {
      ...validDemande,
      adresseClientIdentiqueLogement: 'non',
    };

    expect(validateDemandeClassementStep(1, distincte)).toEqual({
      adresseClient: "L'adresse est requise",
      villeClient: 'La ville est requise',
      codePostalClient: 'Le code postal est requis',
    });

    const complete = { ...distincte, adresseClient: '5 High Street', villeClient: 'London' };
    expect(validateDemandeClassementStep(1, { ...complete, codePostalClient: '123' })).toEqual({
      codePostalClient: 'Le code postal doit contenir 5 chiffres',
    });
    expect(validateDemandeClassementStep(1, { ...complete, paysClient: 'GB' })).toEqual({});
    expect(
      validateDemandeClassementStep(1, { ...complete, paysClient: 'GB', codePostalClient: 'é' })
    ).toEqual({
      codePostalClient:
        'Le code postal doit comporter au plus 10 lettres, chiffres, espaces ou tirets',
    });
  });

  it('keeps NC and INCONNU as distinct explicit declarations', () => {
    expect(
      validateDemandeClassementStep(2, { ...validDemande, classementActuelDeclare: 'NC' })
    ).toEqual({});
    expect(
      validateDemandeClassementStep(2, { ...validDemande, classementActuelDeclare: 'INCONNU' })
    ).toEqual({});
    expect(
      validateDemandeClassementStep(2, { ...validDemande, classementActuelDeclare: '' })
    ).toEqual({ classementActuelDeclare: 'Sélectionnez votre situation' });
  });
});

describe('buildDemandeClassementPayload', () => {
  const stale = {
    raisonSociale: 'Ancienne SCI',
    numSiret: '01234567890123',
    adresseClient: '5 High Street',
    complementAdresseClient: 'Flat 2',
    codePostalClient: 'SW1A 2AA',
    villeClient: 'London',
    paysClient: 'GB',
  };

  it('never sends fields that no longer apply', () => {
    const payload = buildDemandeClassementPayload({ ...validDemande, ...stale });

    expect(payload.adresseClientIdentiqueLogement).toBe(true);
    Object.keys(stale).forEach((field) => expect(payload).not.toHaveProperty(field));
  });

  it('sends a real boolean and the trimmed distinct address, without empty optional fields', () => {
    const payload = buildDemandeClassementPayload({
      ...validDemande,
      adresseClientIdentiqueLogement: 'non',
      adresseClient: ' 5 High Street ',
      complementAdresseClient: '  ',
      codePostalClient: ' ',
      villeClient: ' London ',
      paysClient: 'GB',
    });

    expect(payload).toMatchObject({
      adresseClientIdentiqueLogement: false,
      adresseClient: '5 High Street',
      villeClient: 'London',
      paysClient: 'GB',
    });
    expect(payload).not.toHaveProperty('complementAdresseClient');
    expect(payload).not.toHaveProperty('codePostalClient');
    expect(payload).not.toHaveProperty('raisonSociale');
  });

  it('sends the company fields for a company', () => {
    expect(
      buildDemandeClassementPayload({
        ...validDemande,
        typeClient: 'PROFESSIONNEL',
        raisonSociale: ' Les Gîtes du Moulin ',
        numSiret: '01234567890123',
      })
    ).toMatchObject({
      typeClient: 'PROFESSIONNEL',
      raisonSociale: 'Les Gîtes du Moulin',
      numSiret: '01234567890123',
    });
  });
});

describe('getFirstDemandeClassementStepWithError', () => {
  it('returns the earliest step with an error', () => {
    expect(getFirstDemandeClassementStepWithError({ consent: 'x', email: 'x' })).toBe(1);
    expect(getFirstDemandeClassementStepWithError({ message: 'x', commune: 'x' })).toBe(0);
    expect(getFirstDemandeClassementStepWithError({ turnstileToken: 'x' })).toBe(2);
    expect(getFirstDemandeClassementStepWithError({ numSiret: 'x', consent: 'x' })).toBe(1);
    expect(getFirstDemandeClassementStepWithError({ codePostalClient: 'x' })).toBe(1);
  });

  it('returns null when no displayed field is concerned', () => {
    expect(getFirstDemandeClassementStepWithError({})).toBeNull();
    expect(getFirstDemandeClassementStepWithError({ submissionId: 'x' })).toBeNull();
  });
});
