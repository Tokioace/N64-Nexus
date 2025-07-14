import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string, platform: 'PAL' | 'NTSC') => Promise<boolean>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  hasAcceptedTerms: boolean;
  acceptTerms: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    loadUserFromStorage();
    checkTermsAcceptance();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkTermsAcceptance = async () => {
    try {
      const accepted = await SecureStore.getItemAsync('termsAccepted');
      setHasAcceptedTerms(accepted === 'true');
    } catch (error) {
      console.error('Error checking terms acceptance:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // TODO: Implement actual API call
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        email,
        platform: 'PAL',
        isVerified: true,
        createdAt: new Date(),
      };
      
      await SecureStore.setItemAsync('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    platform: 'PAL' | 'NTSC'
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      // TODO: Implement actual API call
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        platform,
        isVerified: false,
        createdAt: new Date(),
      };
      
      await SecureStore.setItemAsync('user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      await SecureStore.setItemAsync('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  const acceptTerms = async (): Promise<void> => {
    try {
      await SecureStore.setItemAsync('termsAccepted', 'true');
      setHasAcceptedTerms(true);
    } catch (error) {
      console.error('Error accepting terms:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    hasAcceptedTerms,
    acceptTerms,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};