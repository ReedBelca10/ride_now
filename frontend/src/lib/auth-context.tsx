/**
 * Context global pour l'authentification et les données utilisateur
 * Fournit l'état de l'utilisateur à toute l'application
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from './api-client';

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  role: string;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<UserData>) => void;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider pour le contexte d'authentification
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charge l'utilisateur depuis le localStorage au montage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('❌ Erreur parsing utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  /**
   * Connecte l'utilisateur
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });

      if (!response.success) {
        throw new Error(response.error || 'Erreur de connexion');
      }

      const { access_token, user: userData } = response.data as any;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Crée un nouvel utilisateur
   */
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', userData);

      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de l\'inscription');
      }

      const { access_token, user: newUser } = response.data as any;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Déconnecte l'utilisateur
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  /**
   * Met à jour les données utilisateur
   */
  const updateUser = (userData: Partial<UserData>) => {
    const updated = { ...user, ...userData } as UserData;
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    isAdmin: user?.role === 'ADMIN',
    isManager: user?.role === 'MANAGER' || user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  return context;
}
