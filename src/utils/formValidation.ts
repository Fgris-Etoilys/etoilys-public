export interface ValidationError {
  [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export interface ContactFormData {
  nom: string;
  email: string;
  message: string;
  consent: boolean;
}

export interface DemandeClassementFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  message: string;
  consent: boolean;
}

export const validateContactForm = (data: ContactFormData): ValidationError => {
  const errors: ValidationError = {};

  if (!validateRequired(data.nom)) {
    errors.nom = 'Le nom est requis';
  }

  if (!validateRequired(data.email)) {
    errors.email = 'L\'email est requis';
  } else if (!validateEmail(data.email)) {
    errors.email = 'L\'email n\'est pas valide';
  }

  if (!validateRequired(data.message)) {
    errors.message = 'Le message est requis';
  }

  if (!data.consent) {
    errors.consent = 'Vous devez accepter la politique de confidentialité';
  }

  return errors;
};

export const validateDemandeClassementForm = (data: DemandeClassementFormData): ValidationError => {
  const errors: ValidationError = {};

  if (!validateRequired(data.nom)) {
    errors.nom = 'Le nom est requis';
  }

  if (!validateRequired(data.prenom)) {
    errors.prenom = 'Le prénom est requis';
  }

  if (!validateRequired(data.email)) {
    errors.email = 'L\'email est requis';
  } else if (!validateEmail(data.email)) {
    errors.email = 'L\'email n\'est pas valide';
  }

  if (!validateRequired(data.telephone)) {
    errors.telephone = 'Le téléphone est requis';
  } else if (!validatePhone(data.telephone)) {
    errors.telephone = 'Le numéro de téléphone n\'est pas valide';
  }

  if (!validateRequired(data.adresse)) {
    errors.adresse = 'L\'adresse du bien est requise';
  }

  if (!data.consent) {
    errors.consent = 'Vous devez accepter la politique de confidentialité';
  }

  return errors;
};
