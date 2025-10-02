const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.etoilys.fr';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const submitToApi = async <T = any>(
  endpoint: string,
  payload: any
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

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur est survenue',
    };
  }
};
