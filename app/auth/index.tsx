
import React, { useState } from 'react';
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
import { colors, spacing, borderRadius, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = () => {
    if (phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    setStep('otp');
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
            {step === 'phone' ? (
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
                  onPress={() => setStep('phone')}
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
