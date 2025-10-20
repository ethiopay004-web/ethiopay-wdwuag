
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { User } from '@/types';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string, otp: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  signupWithEmail: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  loginWithGoogle: (idToken: string) => Promise<boolean>;
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
    
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await handleFirebaseUser(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleFirebaseUser = async (firebaseUser: FirebaseUser) => {
    try {
      // Check if user data exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      let userData: User;
      if (userDoc.exists()) {
        const data = userDoc.data();
        userData = {
          id: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || 'User',
          phone: data.phone || firebaseUser.phoneNumber || '',
          email: firebaseUser.email || '',
          balance: data.balance || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          isVerified: firebaseUser.emailVerified,
          isBusiness: data.isBusiness || false,
          isBlocked: data.isBlocked || false,
        };
      } else {
        // Create new user document
        userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          phone: firebaseUser.phoneNumber || '',
          email: firebaseUser.email || '',
          balance: 0,
          createdAt: new Date(),
          isVerified: firebaseUser.emailVerified,
          isBusiness: false,
          isBlocked: false,
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...userData,
          createdAt: new Date(),
        });
      }

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log('Error handling Firebase user:', error);
    }
  };

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

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleFirebaseUser(userCredential.user);
      return true;
    } catch (error: any) {
      console.log('Email login error:', error);
      return false;
    }
  };

  const signupWithEmail = async (
    email: string, 
    password: string, 
    name: string, 
    phone: string
  ): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      const userData = {
        name,
        phone,
        email,
        balance: 0,
        createdAt: new Date(),
        isVerified: false,
        isBusiness: false,
        isBlocked: false,
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      await handleFirebaseUser(userCredential.user);
      
      return true;
    } catch (error: any) {
      console.log('Email signup error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<boolean> => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      await handleFirebaseUser(userCredential.user);
      return true;
    } catch (error: any) {
      console.log('Google login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await firebaseSignOut(auth);
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
      
      // Update in Firestore if user is from Firebase
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', user.id), updates, { merge: true });
      } else {
        await AsyncStorage.setItem(`user_${user.phone}`, JSON.stringify(updatedUser));
      }
      
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
        loginWithEmail,
        signupWithEmail,
        loginWithGoogle,
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
