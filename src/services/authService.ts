import { User, LoginForm, RegisterForm, ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });

    const data: ApiResponse<{ user: User; token: string }> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    return data.data!;
  }

  async register(username: string, email: string, password: string, confirmPassword: string): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ username, email, password, confirmPassword })
    });

    const data: ApiResponse<{ user: User; token: string }> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data.data!;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    const data: ApiResponse<{ user: User }> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get user data');
    }

    return data.data!.user;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export const authService = new AuthService();