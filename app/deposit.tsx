
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
import { useWallet } from '@/contexts/WalletContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function DepositScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { balance, depositMoney } = useWallet();

  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', icon: 'phone.fill', color: colors.primary },
    { id: 'mpesa', name: 'M-Pesa', icon: 'phone.fill', color: colors.secondary },
    { id: 'cbe', name: 'Commercial Bank of Ethiopia', icon: 'building.columns.fill', color: colors.accent },
  ];

  const handleDeposit = async () => {
    if (!selectedMethod || !amount) {
      Alert.alert('Error', 'Please select a payment method and enter an amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    const success = await depositMoney(amountNum, selectedMethod);
    setIsLoading(false);

    if (success) {
      Alert.alert('Success', 'Money deposited successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to deposit money. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.balanceInfo}>
            <Text style={[styles.balanceLabel, isDark && styles.balanceLabelDark]}>
              Current Balance
            </Text>
            <Text style={[styles.balanceAmount, isDark && styles.balanceAmountDark]}>
              {balance.toFixed(2)} ETB
            </Text>
          </View>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Select Payment Method
          </Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
                isDark && styles.methodCardDark,
                selectedMethod === method.id && isDark && styles.methodCardSelectedDark,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View
                style={[
                  styles.methodIcon,
                  { backgroundColor: method.color + '20' },
                ]}
              >
                <IconSymbol name={method.icon as any} size={24} color={method.color} />
              </View>
              <Text style={[styles.methodName, isDark && styles.methodNameDark]}>
                {method.name}
              </Text>
              {selectedMethod === method.id && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.label, isDark && styles.labelDark]}>Amount (ETB)</Text>
          <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
            <IconSymbol name="banknote" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.quickAmounts}>
            {[100, 500, 1000, 5000].map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={[styles.quickAmountButton, isDark && styles.quickAmountButtonDark]}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={[styles.quickAmountText, isDark && styles.quickAmountTextDark]}>
                  {quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            isLoading && styles.buttonDisabled,
            isDark && styles.buttonDark,
          ]}
          onPress={handleDeposit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Deposit Money'}
          </Text>
        </TouchableOpacity>
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
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardDark: {
    backgroundColor: colors.cardDark,
  },
  balanceInfo: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceLabelDark: {
    color: colors.textDark,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  balanceAmountDark: {
    color: colors.primaryLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionTitleDark: {
    color: colors.textDark,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodCardDark: {
    backgroundColor: colors.backgroundDark,
  },
  methodCardSelected: {
    borderColor: colors.secondary,
  },
  methodCardSelectedDark: {
    borderColor: colors.secondary,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  methodNameDark: {
    color: colors.textDark,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  labelDark: {
    color: colors.textDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  inputContainerDark: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.borderDark,
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
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickAmountButtonDark: {
    backgroundColor: colors.backgroundDark,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  quickAmountTextDark: {
    color: colors.textDark,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    ...shadows.sm,
  },
  buttonDark: {
    backgroundColor: colors.primaryLight,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
});
