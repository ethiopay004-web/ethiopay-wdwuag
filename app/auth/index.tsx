
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing, borderRadius } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { login, loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();

  // Auth method: 'phone', 'email', 'signup'
  const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'signup'>('phone');
  
  // Phone auth
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  
  // Email auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  // Google Sign-in configuration
  // IMPORTANT: Replace these with your actual Google OAuth credentials
  // Get these from: Google Cloud Console > APIs & Services > Credentials
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    setIsLoading(true);
    const success = await loginWithGoogle(idToken);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)/(home)');
    } else {
      Alert.alert('Google Sign-in Failed', 'Please try again');
    }
  };

  const handleSendOTP = () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setPhoneStep('otp');
    Alert.alert('OTP Sent', 'Use 123456 as OTP for demo purposes');
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    const success = await login(phone, otp);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)/(home)');
    } else {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP');
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    const success = await loginWithEmail(email, password);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)/(home)');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const handleEmailSignup = async () => {
    if (!email || !password || !name || !signupPhone) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const success = await signupWithEmail(email, password, name, signupPhone);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)/(home)');
    } else {
      Alert.alert('Signup Failed', 'Email may already be in use');
    }
  };

  const renderPhoneAuth = () => (
    <>
      {phoneStep === 'phone' ? (
        <>
          <Text style={[styles.formTitle, isDark && styles.formTitleDark]}>
            Welcome Back
          </Text>
          <Text style={[styles.formSubtitle, isDark && styles.formSubtitleDark]}>
            Enter your phone number to continue
          </Text>

          <View style={styles.inputContainer}>
            <IconSymbol name="phone.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Phone Number"
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOTP}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[colors.primaryLight, colors.primary]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Send OTP</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setPhoneStep('phone')}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.formTitle, isDark && styles.formTitleDark]}>
            Verify OTP
          </Text>
          <Text style={[styles.formSubtitle, isDark && styles.formSubtitleDark]}>
            Enter the code sent to {phone}
          </Text>

          <View style={styles.inputContainer}>
            <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Enter OTP"
              placeholderTextColor={colors.textSecondary}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOTP}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[colors.primaryLight, colors.primary]}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </>
  );

  const renderEmailAuth = () => (
    <>
      <Text style={[styles.formTitle, isDark && styles.formTitleDark]}>
        Email Login
      </Text>
      <Text style={[styles.formSubtitle, isDark && styles.formSubtitleDark]}>
        Sign in with your email and password
      </Text>

      <View style={styles.inputContainer}>
        <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleEmailLogin}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[colors.primaryLight, colors.primary]}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  const renderSignup = () => (
    <>
      <Text style={[styles.formTitle, isDark && styles.formTitleDark]}>
        Create Account
      </Text>
      <Text style={[styles.formSubtitle, isDark && styles.formSubtitleDark]}>
        Sign up to get started
      </Text>

      <View style={styles.inputContainer}>
        <IconSymbol name="person.fill" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Full Name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <IconSymbol name="phone.fill" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Phone Number"
          placeholderTextColor={colors.textSecondary}
          value={signupPhone}
          onChangeText={setSignupPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.inputContainer}>
        <IconSymbol name="envelope.fill" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <IconSymbol name="lock.fill" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Password (min 6 characters)"
          placeholderTextColor={colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleEmailSignup}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[colors.secondary, '#2E7D32']}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.primaryLight, colors.primary, colors.primaryDark]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <IconSymbol name="banknote" size={60} color={colors.textLight} />
            </View>
            <Text style={styles.appName}>Ethiopay</Text>
            <Text style={styles.tagline}>Your Digital Wallet</Text>
          </View>

          <View style={[styles.formCard, isDark && styles.formCardDark]}>
            {authMethod === 'phone' && renderPhoneAuth()}
            {authMethod === 'email' && renderEmailAuth()}
            {authMethod === 'signup' && renderSignup()}

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, isDark && styles.dividerTextDark]}>
                OR
              </Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign-in */}
            <TouchableOpacity
              style={[styles.googleButton, isDark && styles.googleButtonDark]}
              onPress={() => promptAsync()}
              disabled={!request || isLoading}
            >
              <IconSymbol name="globe" size={20} color={colors.text} />
              <Text style={[styles.googleButtonText, isDark && styles.googleButtonTextDark]}>
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Auth method switcher */}
            <View style={styles.switchContainer}>
              {authMethod === 'phone' && (
                <>
                  <TouchableOpacity onPress={() => setAuthMethod('email')}>
                    <Text style={styles.switchText}>Use Email Instead</Text>
                  </TouchableOpacity>
                  <Text style={[styles.switchDivider, isDark && styles.switchDividerDark]}>
                    •
                  </Text>
                  <TouchableOpacity onPress={() => setAuthMethod('signup')}>
                    <Text style={styles.switchText}>Create Account</Text>
                  </TouchableOpacity>
                </>
              )}
              {authMethod === 'email' && (
                <>
                  <TouchableOpacity onPress={() => setAuthMethod('phone')}>
                    <Text style={styles.switchText}>Use Phone Instead</Text>
                  </TouchableOpacity>
                  <Text style={[styles.switchDivider, isDark && styles.switchDividerDark]}>
                    •
                  </Text>
                  <TouchableOpacity onPress={() => setAuthMethod('signup')}>
                    <Text style={styles.switchText}>Create Account</Text>
                  </TouchableOpacity>
                </>
              )}
              {authMethod === 'signup' && (
                <>
                  <TouchableOpacity onPress={() => setAuthMethod('phone')}>
                    <Text style={styles.switchText}>Login with Phone</Text>
                  </TouchableOpacity>
                  <Text style={[styles.switchDivider, isDark && styles.switchDividerDark]}>
                    •
                  </Text>
                  <TouchableOpacity onPress={() => setAuthMethod('email')}>
                    <Text style={styles.switchText}>Login with Email</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.flagColors}>
              <View style={[styles.flagStripe, { backgroundColor: colors.secondary }]} />
              <View style={[styles.flagStripe, { backgroundColor: colors.accent }]} />
              <View style={[styles.flagStripe, { backgroundColor: colors.highlight }]} />
            </View>
            <Text style={styles.footerText}>Powered by Ethiopian Innovation</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 16,
    color: colors.textLight,
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    elevation: 8,
  },
  formCardDark: {
    backgroundColor: colors.cardDark,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  formTitleDark: {
    color: colors.textDark,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  formSubtitleDark: {
    color: colors.textDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingLeft: spacing.sm,
    fontSize: 16,
    color: colors.text,
  },
  inputDark: {
    color: colors.textDark,
  },
  button: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  buttonGradient: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  resendText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  dividerTextDark: {
    color: colors.textDark,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  googleButtonDark: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.borderDark,
  },
  googleButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  googleButtonTextDark: {
    color: colors.textDark,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  switchText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  switchDivider: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  switchDividerDark: {
    color: colors.textDark,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  flagColors: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  flagStripe: {
    width: 40,
    height: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  footerText: {
    color: colors.textLight,
    fontSize: 12,
    opacity: 0.8,
  },
});
