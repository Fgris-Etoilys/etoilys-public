const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

const isApiErrorBody = (
  value: unknown
): value is { error?: string; fieldErrors?: Record<string, string> } => {
  if (!isRecord(value)) return false;
  const hasError = value.error === undefined || typeof value.error === 'string';
  const hasFieldErrors = value.fieldErrors === undefined || isFieldErrors(value.fieldErrors);
  return hasError && hasFieldErrors;
};

export type ApiResponse<T = unknown> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string>;
    };

export const submitToApi = async <T = unknown, P = Record<string, unknown>>(
  endpoint: string,
  payload: P
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
    const parsed = parseJsonSafe(rawText);

    if (!response.ok) {
      if (isApiErrorBody(parsed)) {
        return {
          success: false,
          error: parsed.error || `Erreur HTTP ${response.status}`,
          fieldErrors: parsed.fieldErrors,
        };
      }

      return {
        success: false,
        error: `Erreur HTTP ${response.status}`,
      };
    }

    if (!isJsonValue(parsed)) {
      return {
        success: false,
        error: 'Reponse API invalide',
      };
    }

    return {
      success: true,
      data: parsed as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
    };
  }
};
