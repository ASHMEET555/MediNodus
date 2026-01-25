// mobile/services/auth.ts
import { Platform } from 'react-native';

// CHANGE THIS to your backend URL
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const authService = {
  async register(email: string, password: string, fullName: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      let errorMessage = 'Login failed';
      if (Array.isArray(errorData.detail)) {
         errorMessage = errorData.detail.map((e: any) => e.msg).join('\n');
      } else if (typeof errorData.detail === 'string') {
         errorMessage = errorData.detail;
      }
      
      throw new Error(errorMessage);
    }
    return response.json(); 
  },

  async logout(token: string) {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Backend logout failed, clearing local state anyway.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // We swallow the error so the frontend still logs out
    }
  }

};