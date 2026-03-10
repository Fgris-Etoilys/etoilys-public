const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.etoilys.fr';

type ApiErrorMessage = string;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];

const isJsonValue = (value: unknown): value is JsonValue => {
  if (value === null) {
    return true;
  }

  if (['string', 'number', 'boolean'].includes(typeof value)) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (isRecord(value)) {
    return Object.values(value).every(isJsonValue);
  }

  return false;
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiErrorMessage;
}

export const submitToApi = async <T = unknown, P = Record<string, unknown>>(
  endpoint: string,
  payload: P
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData: unknown = await response.json();
    if (!isJsonValue(rawData)) {
      throw new Error('Réponse API invalide');
    }

    return {
      success: true,
      data: rawData as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
    };
  }
};
