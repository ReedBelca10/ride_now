/**
 * Client HTTP centralisé pour toutes les requêtes API
 * Gère l'authentification, les erreurs et les retries
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  includeAuth?: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private maxRetries = 3;
  private retryDelay = 1000; // ms

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  /**
   * Récupère le token JWT du localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Récupère les en-têtes par défaut
   */
  private getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Effectue une requête HTTP avec retry automatique
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit & { attempt?: number } = {},
  ): Promise<Response> {
    const attempt = options.attempt || 1;

    try {
      const response = await fetch(url, options);

      // Retry sur erreurs réseau temporaires (5xx)
      if (response.status >= 500 && attempt < this.maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * attempt),
        );
        return this.fetchWithRetry(url, { ...options, attempt: attempt + 1 });
      }

      return response;
    } catch (error) {
      // Retry sur erreurs réseau
      if (attempt < this.maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * attempt),
        );
        return this.fetchWithRetry(url, { ...options, attempt: attempt + 1 });
      }
      throw error;
    }
  }

  /**
   * Effectue une requête API générique
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      includeAuth = true,
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    const defaultHeaders = this.getDefaultHeaders();

    const fetchOptions: RequestInit & { attempt?: number } = {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    if (!includeAuth && fetchOptions.headers && typeof fetchOptions.headers === 'object') {
      const headers = fetchOptions.headers as Record<string, string>;
      delete headers['Authorization'];
    }

    try {
      const response = await this.fetchWithRetry(url, fetchOptions);

      // Vérifie si le token a expiré (401 Unauthorized)
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return {
          success: false,
          error: 'Session expirée. Veuillez vous reconnecter.',
          status: 401,
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Erreur serveur',
          status: response.status,
        };
      }

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      console.error(`❌ Erreur requête API: ${endpoint}`, error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Erreur de connexion au serveur',
        status: 0,
      };
    }
  }

  /**
   * GET /endpoint
   */
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST /endpoint
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PATCH /endpoint
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  /**
   * PUT /endpoint
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, 'method' | 'body'>,
  ) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE /endpoint
   */
  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Exportez une instance unique (singleton)
export const apiClient = new ApiClient();

// Exportez le type de classe pour les tests
export type { ApiResponse };
