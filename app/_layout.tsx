
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SystemBars } from 'react-native-edge-to-edge';
import { useNetworkState } from 'expo-network';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Alert } from 'react-native';
import 'react-native-reanimated';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { Stack, router } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <WalletProvider>
            <SystemBars style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="auth" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen 
                name="send-money" 
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Send Money',
                }}
              />
              <Stack.Screen 
                name="deposit" 
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Deposit Money',
                }}
              />
              <Stack.Screen 
                name="withdraw" 
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Withdraw Money',
                }}
              />
              <Stack.Screen 
                name="pay-bill" 
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Pay Bill',
                }}
              />
              <Stack.Screen 
                name="buy-airtime" 
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Buy Airtime',
                }}
              />
              <Stack.Screen 
                name="transaction-details" 
                options={{
                  presentation: 'modal',
                  headerShown: true,
                  title: 'Transaction Details',
                }}
              />
            </Stack>
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
