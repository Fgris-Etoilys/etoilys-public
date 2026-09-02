import { formContent, getLocalizedApiErrorMessage } from '../i18n/formContent';
import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || '/api';

export const API_ERROR_CODES = [
  'METHOD_NOT_ALLOWED',
  'INVALID_JSON',
  'INVALID_PAYLOAD',
  'VALIDATION_FAILED',
  'TURNSTILE_INVALID',
  'RATE_LIMITED',
  'RATE_LIMIT_UNAVAILABLE',
  'NOTIFICATION_FAILED',
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export const FIELD_ERROR_CODES = ['REQUIRED', 'INVALID_EMAIL', 'INVALID_PHONE'] as const;

export type FieldErrorCode = (typeof FIELD_ERROR_CODES)[number];

export const RATE_LIMIT_ERROR_MESSAGE = formContent.fr.api.rateLimited;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

const isJsonValue = (value: unknown): value is JsonValue => {
  if (value === null) return true;
  if (['string', 'number', 'boolean'].includes(typeof value)) return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (isRecord(value)) return Object.values(value).every(isJsonValue);
  return false;
};

const isApiErrorCode = (value: unknown): value is ApiErrorCode =>
  typeof value === 'string' && (API_ERROR_CODES as readonly string[]).includes(value);

const isFieldErrorCode = (value: unknown): value is FieldErrorCode =>
  typeof value === 'string' && (FIELD_ERROR_CODES as readonly string[]).includes(value);

const parseJsonSafe = (text: string): unknown | null => {
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const isFieldErrors = (value: unknown): value is Record<string, string> => {
  if (!isRecord(value)) return false;
  return Object.values(value).every((entry) => typeof entry === 'string');
};

const isFieldErrorCodes = (value: unknown): value is Record<string, FieldErrorCode> => {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isFieldErrorCode);
};

const isApiErrorBody = (
  value: unknown
): value is {
  success?: boolean;
  error?: string;
  errorCode?: ApiErrorCode;
  fieldErrors?: Record<string, string>;
  fieldErrorCodes?: Record<string, FieldErrorCode>;
} => {
  if (!isRecord(value)) return false;
  const hasPublicFormErrorShape =
    'success' in value || 'error' in value || 'errorCode' in value || 'fieldErrorCodes' in value;
  if (!hasPublicFormErrorShape) return false;
  const hasSuccess = value.success === undefined || typeof value.success === 'boolean';
  const hasError = value.error === undefined || typeof value.error === 'string';
  const hasErrorCode = value.errorCode === undefined || isApiErrorCode(value.errorCode);
  const hasFieldErrors = value.fieldErrors === undefined || isFieldErrors(value.fieldErrors);
  const hasFieldErrorCodes =
    value.fieldErrorCodes === undefined || isFieldErrorCodes(value.fieldErrorCodes);
  return hasSuccess && hasError && hasErrorCode && hasFieldErrors && hasFieldErrorCodes;
};

const isStarsmanagerErrorBody = (
  value: unknown
): value is {
  code?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
} => {
  if (!isRecord(value)) return false;
  const hasStarsmanagerErrorShape = 'code' in value || 'message' in value || 'fieldErrors' in value;
  if (!hasStarsmanagerErrorShape) return false;
  const hasCode = value.code === undefined || typeof value.code === 'string';
  const hasMessage = value.message === undefined || typeof value.message === 'string';
  const hasFieldErrors = value.fieldErrors === undefined || isFieldErrors(value.fieldErrors);
  return hasCode && hasMessage && hasFieldErrors;
};

export type ApiResponse<T = unknown> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      status?: number | undefined;
      errorCode?: ApiErrorCode | undefined;
      code?: string | undefined;
      fieldErrors?: Record<string, string> | undefined;
      fieldErrorCodes?: Record<string, FieldErrorCode> | undefined;
    };

type SubmitToApiOptions = {
  locale?: Locale;
};

export const getApiUrl = (endpoint: string): string => {
  const normalizedBaseUrl = API_BASE_URL.replace(/\/+$/, '');
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${normalizedBaseUrl}${normalizedEndpoint}`;
};

export const getHttpErrorMessage = (status: number, locale: Locale = DEFAULT_LOCALE): string =>
  status === 429
    ? formContent[locale].api.rateLimited
    : status >= 500
      ? formContent[locale].api.genericError
      : formContent[locale].api.httpError(status);

const getStarsmanagerErrorMessage = (
  parsed: {
    fieldErrors?: Record<string, string>;
  },
  status: number,
  locale: Locale
): string => {
  if (status === 429) {
    return formContent[locale].api.rateLimited;
  }

  if (parsed.fieldErrors !== undefined) {
    return getLocalizedApiErrorMessage({ errorCode: 'VALIDATION_FAILED', status }, locale);
  }

  return formContent[locale].api.genericError;
};

export const submitToApi = async <T = unknown, P = Record<string, unknown>>(
  endpoint: string,
  payload: P,
  options: SubmitToApiOptions = {}
): Promise<ApiResponse<T>> => {
  const locale = options.locale ?? DEFAULT_LOCALE;

  try {
    const response = await fetch(getApiUrl(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    const parsed = parseJsonSafe(rawText);

    if (!response.ok) {
      if (isApiErrorBody(parsed)) {
        const apiError: Extract<ApiResponse<T>, { success: false }> = {
          success: false,
          status: response.status,
          error: getLocalizedApiErrorMessage(
            {
              errorCode: parsed.errorCode,
              status: response.status,
              fallbackError: parsed.error,
            },
            locale
          ),
        };

        if (parsed.errorCode !== undefined) {
          apiError.errorCode = parsed.errorCode;
        }

        if (parsed.fieldErrors !== undefined) {
          apiError.fieldErrors = parsed.fieldErrors;
        }

        if (parsed.fieldErrorCodes !== undefined) {
          apiError.fieldErrorCodes = parsed.fieldErrorCodes;
        }

        return apiError;
      }

      if (isStarsmanagerErrorBody(parsed)) {
        const apiError: Extract<ApiResponse<T>, { success: false }> = {
          success: false,
          status: response.status,
          error: getStarsmanagerErrorMessage(parsed, response.status, locale),
        };

        if (parsed.code !== undefined) {
          apiError.code = parsed.code;
        }

        if (parsed.fieldErrors !== undefined) {
          apiError.fieldErrors = parsed.fieldErrors;
        }

        return apiError;
      }

      return {
        success: false,
        status: response.status,
        error: getHttpErrorMessage(response.status, locale),
      };
    }

    if (!isJsonValue(parsed)) {
      return {
        success: false,
        error: formContent[locale].api.invalidResponse,
      };
    }

    return {
      success: true,
      data: parsed as T,
    };
  } catch {
    return {
      success: false,
      error: formContent[locale].api.genericError,
    };
  }
};
