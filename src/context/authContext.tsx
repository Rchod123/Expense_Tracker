// context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import {
  saveAuthData,
  getStoredToken,
  getStoredUser,
  clearAuthData,
} from '../services/authStorage';
import { authApi } from '../services/apiClient';

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Record<string, unknown>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ⚠️ Use your machine's LAN IP for physical device or 10.0.2.2 for Android Emulator
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Load token on app launch
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await getStoredToken();
        const savedUser = await getStoredUser();

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } catch (e) {
        console.error('Failed to load session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, [token]);

  const register = async (name: string, email: string, pass: string) => {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      throw new Error('Internet connection required to create an account.');
    }

    const data = await authApi.register(name, email, pass);

    setToken(data.token);
    setUser(data.user);
    await saveAuthData(data.token, data.user);
  };

  const login = async (email: string, pass: string) => {
    const netState = await NetInfo.fetch();

    // Prevent login attempt if totally offline
    if (!netState.isConnected) {
      throw new Error('Offline. Please connect to the internet to log in.');
    }

    const data = await authApi.login(email, pass);

    setToken(data.token);
    setUser(data.user);
    await saveAuthData(data.token, data.user);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await clearAuthData();
  };

  const updateUser = async (updates: Record<string, unknown>) => {
    if (!user || !token) return;
    const nextUser = { ...user, ...updates };
    setUser(nextUser);
    await saveAuthData(token, nextUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
