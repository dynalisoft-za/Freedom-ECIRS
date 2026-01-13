/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

import { apiClient } from './apiClient';

export type UserRole = 'super_admin' | 'station_manager' | 'sales_executive' | 'accountant' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  station_codes: string[];
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role: UserRole;
  station_codes: string[];
  status?: 'active' | 'inactive';
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  /**
   * Register a new user
   */
  async register(data: RegisterPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Login with username and password
   */
  async login(credentials: LoginPayload): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Save authentication data to localStorage
   */
  saveAuthData(token: string, user: User): void {
    localStorage.setItem('freedom_ecirs_token', token);
    localStorage.setItem('freedom_ecirs_user', JSON.stringify(user));
  },

  /**
   * Clear authentication data from localStorage
   */
  clearAuthData(): void {
    localStorage.removeItem('freedom_ecirs_token');
    localStorage.removeItem('freedom_ecirs_user');
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser(): User | null {
    const userJson = localStorage.getItem('freedom_ecirs_user');
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  /**
   * Get stored token from localStorage
   */
  getStoredToken(): string | null {
    return localStorage.getItem('freedom_ecirs_token');
  },

  /**
   * Check if user has permission to register new users
   */
  canRegisterUsers(role: UserRole): boolean {
    return ['super_admin', 'station_manager'].includes(role);
  },
};
