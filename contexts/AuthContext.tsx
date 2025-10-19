
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    try {
      // Simulate OTP verification
      if (otp === '123456') {
        // Check if user exists
        const existingUser = await AsyncStorage.getItem(`user_${phone}`);
        
        let userData: User;
        if (existingUser) {
          userData = JSON.parse(existingUser);
        } else {
          // Create new user
          userData = {
            id: Date.now().toString(),
            name: 'User',
            phone,
            balance: 0,
            createdAt: new Date(),
            isVerified: true,
            isBusiness: false,
            isBlocked: false,
          };
          await AsyncStorage.setItem(`user_${phone}`, JSON.stringify(userData));
        }

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      await AsyncStorage.setItem(`user_${user.phone}`, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.log('Update user error:', error);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        console.log('No biometric hardware available');
        return false;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        console.log('No biometrics enrolled');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Ethiopay',
        fallbackLabel: 'Use PIN',
      });

      return result.success;
    } catch (error) {
      console.log('Biometric authentication error:', error);
      return false;
    }
  };

  const setPin = async (pin: string) => {
    try {
      await SecureStore.setItemAsync('user_pin', pin);
      await updateUser({ pin: 'set' });
    } catch (error) {
      console.log('Set PIN error:', error);
    }
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    try {
      const storedPin = await SecureStore.getItemAsync('user_pin');
      return storedPin === pin;
    } catch (error) {
      console.log('Verify PIN error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        authenticateWithBiometrics,
        setPin,
        verifyPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
