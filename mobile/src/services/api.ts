import { config } from '../config/env';

export interface ApiError {
  code?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | ApiError;
}

class ApiClient {
  private baseUrl: string;
  private timeoutMs: number;

  constructor() {
    this.baseUrl = config.apiUrl;
    this.timeoutMs = config.timeout || 10000;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: controller.signal,
      });
      clearTimeout(id);

      const json = await response.json();
      if (!response.ok && json.error) {
        return {
          success: false,
          error: typeof json.error === 'string' ? json.error : json.error.message || 'Request failed',
        };
      }
      return json;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Network request timed out. Please check your connection and backend URL.',
        };
      }
      return {
        success: false,
        error: error?.message || 'Network request failed. Ensure backend is running.',
      };
    }
  }

  public async post<T>(endpoint: string, body: any, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(id);

      const json = await response.json();
      if (!response.ok && json.error) {
        return {
          success: false,
          error: json.error,
        };
      }
      return json;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Network request timed out.',
        };
      }
      return {
        success: false,
        error: error?.message || 'Network request failed.',
      };
    }
  }
}

export const apiClient = new ApiClient();
