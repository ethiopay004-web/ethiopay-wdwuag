
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
import { calculateTransactionFee } from '@/types';
import { colors, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function WithdrawScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { balance, withdrawMoney } = useWallet();

  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    { id: 'telebirr', name: 'Telebirr', icon: 'phone.fill', color: colors.primary },
    { id: 'mpesa', name: 'M-Pesa', icon: 'phone.fill', color: colors.secondary },
    { id: 'cbe', name: 'Commercial Bank of Ethiopia', icon: 'building.columns.fill', color: colors.accent },
  ];

  const fee = amount ? calculateTransactionFee(parseFloat(amount)) : 0;
  const total = amount ? parseFloat(amount) + fee : 0;

  const handleWithdraw = async () => {
    if (!selectedMethod || !amount) {
      Alert.alert('Error', 'Please select a payment method and enter an amount');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (total > balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough balance for this transaction');
      return;
    }

    setIsLoading(true);
    const success = await withdrawMoney(amountNum, selectedMethod);
    setIsLoading(false);

    if (success) {
      Alert.alert('Success', 'Money withdrawn successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to withdraw money. Please try again.');
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
              Available Balance
            </Text>
            <Text style={[styles.balanceAmount, isDark && styles.balanceAmountDark]}>
              {balance.toFixed(2)} ETB
            </Text>
          </View>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Withdraw To
          </Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
                isDark && styles.methodCardDark,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
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
        </View>

        {amount && parseFloat(amount) > 0 && (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
                Amount
              </Text>
              <Text style={[styles.summaryValue, isDark && styles.summaryValueDark]}>
                {parseFloat(amount).toFixed(2)} ETB
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
                Transaction Fee
              </Text>
              <Text style={[styles.summaryValue, isDark && styles.summaryValueDark]}>
                {fee.toFixed(2)} ETB
              </Text>
            </View>
            <View style={[styles.divider, isDark && styles.dividerDark]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, isDark && styles.totalLabelDark]}>
                Total Deducted
              </Text>
              <Text style={[styles.totalValue, isDark && styles.totalValueDark]}>
                {total.toFixed(2)} ETB
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled, isDark && styles.buttonDark]}
          onPress={handleWithdraw}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Withdraw Money'}
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryLabelDark: {
    color: colors.textDark,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  summaryValueDark: {
    color: colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  dividerDark: {
    backgroundColor: colors.borderDark,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalLabelDark: {
    color: colors.textDark,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.highlight,
  },
  totalValueDark: {
    color: colors.highlight,
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
