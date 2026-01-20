/**
 * Service API Admin
 * Centralisé les appels API pour les fonctionnalités d'administration
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

class AdminAPI {
  private getAuthHeader(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const url = `${BASE_URL}/admin${endpoint}`;
    const { method = 'GET', body, headers = {} } = options;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...this.getAuthHeader(),
        ...headers,
      },
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // ============================================
  // ANALYTICS ENDPOINTS
  // ============================================

  async getAnalytics() {
    return this.request('/analytics');
  }

  async getUserGrowthStats() {
    return this.request('/analytics/users');
  }

  async getReservationStats() {
    return this.request('/analytics/reservations');
  }

  async getRevenueStats() {
    return this.request('/analytics/revenue');
  }

  async getVehicleTypeStats() {
    return this.request('/analytics/vehicles');
  }

  // ============================================
  // USERS ENDPOINTS
  // ============================================

  async getUsers(skip: number = 0, take: number = 10, role?: string, search?: string) {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('take', take.toString());
    if (role) params.append('role', role);
    if (search) params.append('search', search);

    return this.request(`/users?${params.toString()}`);
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: userData,
    });
  }

  async updateUser(userId: number, userData: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: userData,
    });
  }

  async deleteUser(userId: number) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async hardDeleteUser(userId: number) {
    return this.request(`/users/${userId}/permanent`, {
      method: 'DELETE',
    });
  }

  async toggleUserActive(userId: number, isActive: boolean) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: { isActive },
    });
  }

  async changeUserRole(userId: number, role: string) {
    return this.request(`/users/${userId}/role`, {
      method: 'PATCH',
      body: { role },
    });
  }

  // ============================================
  // VEHICLES ENDPOINTS
  // ============================================

  async getVehicles(skip: number = 0, take: number = 10, type?: string, etat?: string, search?: string) {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('take', take.toString());
    if (type) params.append('type', type);
    if (etat) params.append('etat', etat);
    if (search) params.append('search', search);

    return this.request(`/vehicles?${params.toString()}`);
  }

  async createVehicle(vehicleData: any) {
    return this.request('/vehicles', {
      method: 'POST',
      body: vehicleData,
    });
  }

  async updateVehicle(vehicleId: number, vehicleData: any) {
    return this.request(`/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: vehicleData,
    });
  }

  async deleteVehicle(vehicleId: number) {
    return this.request(`/vehicles/${vehicleId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // RESERVATIONS ENDPOINTS
  // ============================================

  async getReservations(skip: number = 0, take: number = 10, etat?: string, search?: string) {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('take', take.toString());
    if (etat) params.append('etat', etat);
    if (search) params.append('search', search);

    return this.request(`/reservations?${params.toString()}`);
  }

  async updateReservationEtat(reservationId: number, etat: string) {
    return this.request(`/reservations/${reservationId}/etat`, {
      method: 'PATCH',
      body: { etat },
    });
  }
}

// Export singleton instance
export const adminAPI = new AdminAPI();
