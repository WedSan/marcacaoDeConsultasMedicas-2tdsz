import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticationHandler } from '../../handlers/AuthHandler'; 
import { User } from '../../types/User';
import { LoginCredentials,  RegisterData, AuthContextData } from '../../types/Authenticatication';

const STORAGE_KEYS = {
  USER: '@MedicalApp:user',
  TOKEN: '@MedicalApp:token',
};

const authService = new AuthenticationHandler();

const AuthenticationContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthenticationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
    loadRegisteredUsers();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error to load user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegisteredUsers = async () => {
    try {
      await authService.loadRegisteredUsers();
    } catch (error) {
      console.error('failed to load registered users:', error);
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
      const response = authService.signIn(credentials);
      if(!response){
        throw new Error();
      }
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
      await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthenticationContext.Provider value={{ user, loading, signIn, register, signOut }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 