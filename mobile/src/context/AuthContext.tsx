import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../services/api';
import { authApi, User, LoginPayload, RegisterPayload } from '../services/authApi';

const TOKEN_KEY = 'feedants_auth_jwt_token';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Storage Helpers with Fallback
  const saveTokenToStorage = async (jwtToken: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, jwtToken);
    } catch {
      // Fallback for non-supported runtimes
    }
  };

  const getTokenFromStorage = async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  };

  const deleteTokenFromStorage = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // Fallback
    }
  };

  // APP STARTUP SESSION RESTORATION & 401 INTERCEPTOR
  useEffect(() => {
    apiClient.setOnUnauthorized(() => {
      logout();
    });

    async function bootstrapAsync() {
      setIsLoading(true);
      try {
        const storedToken = await getTokenFromStorage();
        if (storedToken) {
          apiClient.setAuthToken(storedToken);
          setToken(storedToken);

          const res = await authApi.getCurrentUser();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          } else {
            // Token expired or invalid
            await deleteTokenFromStorage();
            apiClient.setAuthToken(null);
            setToken(null);
            setUser(null);
          }
        }
      } catch {
        await deleteTokenFromStorage();
        apiClient.setAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrapAsync();

    return () => {
      apiClient.setOnUnauthorized(null);
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const res = await authApi.login(payload);
    if (res.success && res.data) {
      const { user: userData, token: jwtToken } = res.data;
      await saveTokenToStorage(jwtToken);
      apiClient.setAuthToken(jwtToken);
      setToken(jwtToken);
      setUser(userData);
      return { success: true };
    }
    const errMsg = typeof res.error === 'string' ? res.error : res.error?.message || 'Login failed.';
    return { success: false, error: errMsg };
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authApi.register(payload);
    if (res.success && res.data) {
      const { user: userData, token: jwtToken } = res.data;
      await saveTokenToStorage(jwtToken);
      apiClient.setAuthToken(jwtToken);
      setToken(jwtToken);
      setUser(userData);
      return { success: true };
    }
    const errMsg = typeof res.error === 'string' ? res.error : res.error?.message || 'Registration failed.';
    return { success: false, error: errMsg };
  };

  const logout = async () => {
    await deleteTokenFromStorage();
    apiClient.setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    const res = await authApi.getCurrentUser();
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
