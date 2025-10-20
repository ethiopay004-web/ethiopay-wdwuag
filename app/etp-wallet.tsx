
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
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';
import { useWallet } from '@/contexts/WalletContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/commonStyles';

export default function ETPWalletScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { balance, convertToETP, convertToETB, etpBalance } = useWallet();
  
  const [amount, setAmount] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  
  const EXCHANGE_RATE = 150; // 1 ETP = 150 ETB

  const handleConvertToETP = async () => {
    const value = parseFloat(amount);
    
    if (!amount || isNaN(value) || value <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (value > balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough ETB balance');
      return;
    }

    setIsConverting(true);
    const success = await convertToETP(value);
    setIsConverting(false);

    if (success) {
      const etpValue = value / EXCHANGE_RATE;
      Alert.alert(
        'Conversion Successful',
        `${value.toFixed(2)} ETB → ${etpValue.toFixed(2)} ETP`,
        [{ text: 'OK', onPress: () => setAmount('') }]
      );
    } else {
      Alert.alert('Conversion Failed', 'Please try again');
    }
  };

  const handleConvertToETB = async () => {
    const value = parseFloat(amount);
    
    if (!amount || isNaN(value) || value <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (value > etpBalance) {
      Alert.alert('Insufficient Balance', 'You do not have enough ETP balance');
      return;
    }

    setIsConverting(true);
    const success = await convertToETB(value);
    setIsConverting(false);

    if (success) {
      const etbValue = value * EXCHANGE_RATE;
      Alert.alert(
        'Conversion Successful',
        `${value.toFixed(2)} ETP → ${etbValue.toFixed(2)} ETB`,
        [{ text: 'OK', onPress: () => setAmount('') }]
      );
    } else {
      Alert.alert('Conversion Failed', 'Please try again');
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, isDark && styles.backButtonDark]}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={isDark ? colors.textDark : colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
            ETP Wallet
          </Text>
          <View style={styles.placeholder} />
        </View>

        <LinearGradient
          colors={[colors.accent, '#FFD54F', colors.accent]}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>ETP Balance</Text>
              <Text style={styles.balanceAmount}>
                {etpBalance.toFixed(2)} <Text style={styles.currency}>ETP</Text>
              </Text>
              <Text style={styles.balanceEquivalent}>
                ≈ {(etpBalance * EXCHANGE_RATE).toFixed(2)} ETB
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>ETB Balance</Text>
              <Text style={styles.balanceAmount}>
                {balance.toFixed(2)} <Text style={styles.currency}>ETB</Text>
              </Text>
              <Text style={styles.balanceEquivalent}>
                ≈ {(balance / EXCHANGE_RATE).toFixed(2)} ETP
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.rateCard, isDark && styles.rateCardDark]}>
          <IconSymbol name="arrow.left.arrow.right" size={24} color={colors.primary} />
          <Text style={[styles.rateText, isDark && styles.rateTextDark]}>
            Exchange Rate: 1 ETP = {EXCHANGE_RATE} ETB
          </Text>
        </View>

        <View style={[styles.conversionCard, isDark && styles.conversionCardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Convert Currency
          </Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDark && styles.inputLabelDark]}>
              Amount
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Enter amount"
              placeholderTextColor={isDark ? colors.textSecondary : colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.quickAmountsContainer}>
            <Text style={[styles.quickAmountsLabel, isDark && styles.quickAmountsLabelDark]}>
              Quick Amounts:
            </Text>
            <View style={styles.quickAmountsRow}>
              {[100, 500, 1000, 5000].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[styles.quickAmountButton, isDark && styles.quickAmountButtonDark]}
                  onPress={() => handleQuickAmount(value)}
                >
                  <Text style={[styles.quickAmountText, isDark && styles.quickAmountTextDark]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.convertButton,
                styles.convertToETPButton,
                isConverting && styles.convertButtonDisabled,
              ]}
              onPress={handleConvertToETP}
              disabled={isConverting}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <IconSymbol name="arrow.right" size={20} color={colors.textLight} />
                <Text style={styles.convertButtonText}>Convert ETB to ETP</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.convertButton,
                styles.convertToETBButton,
                isConverting && styles.convertButtonDisabled,
              ]}
              onPress={handleConvertToETB}
              disabled={isConverting}
            >
              <LinearGradient
                colors={[colors.secondary, '#2E7D32']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <IconSymbol name="arrow.left" size={20} color={colors.textLight} />
                <Text style={styles.convertButtonText}>Convert ETP to ETB</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <IconSymbol name="info.circle" size={20} color={colors.info} />
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            ETP (Ethiopay Points) is a digital currency that can be converted to and from ETB at a fixed rate. Use ETP for faster transactions and special rewards.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: colors.backgroundDark,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.xl : spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  backButtonDark: {
    backgroundColor: colors.cardDark,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerTitleDark: {
    color: colors.textDark,
  },
  placeholder: {
    width: 40,
  },
  balanceCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.md,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.8,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
  },
  balanceEquivalent: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  rateCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  rateCardDark: {
    backgroundColor: colors.cardDark,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing.sm,
  },
  rateTextDark: {
    color: colors.textDark,
  },
  conversionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  conversionCardDark: {
    backgroundColor: colors.cardDark,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionTitleDark: {
    color: colors.textDark,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  inputLabelDark: {
    color: colors.textDark,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  inputDark: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.borderDark,
    color: colors.textDark,
  },
  quickAmountsContainer: {
    marginBottom: spacing.lg,
  },
  quickAmountsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  quickAmountsLabelDark: {
    color: colors.textDark,
  },
  quickAmountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  quickAmountButtonDark: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.borderDark,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  quickAmountTextDark: {
    color: colors.textDark,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  convertButton: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  convertToETPButton: {},
  convertToETBButton: {},
  convertButtonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  convertButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: colors.info + '10',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  infoCardDark: {
    backgroundColor: colors.info + '20',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    marginLeft: spacing.sm,
    lineHeight: 20,
  },
  infoTextDark: {
    color: colors.textDark,
  },
});
