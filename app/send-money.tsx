
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

export default function SendMoneyScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { balance, sendMoney } = useWallet();

  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fee = amount ? calculateTransactionFee(parseFloat(amount)) : 0;
  const total = amount ? parseFloat(amount) + fee : 0;

  const handleSend = async () => {
    if (!phone || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
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
    const success = await sendMoney(phone, amountNum, description || 'Money transfer');
    setIsLoading(false);

    if (success) {
      Alert.alert('Success', 'Money sent successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to send money. Please try again.');
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
          <Text style={[styles.label, isDark && styles.labelDark]}>Recipient Phone Number</Text>
          <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
            <IconSymbol name="phone.fill" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="+251..."
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

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

          <Text style={[styles.label, isDark && styles.labelDark]}>
            Description (Optional)
          </Text>
          <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
            <IconSymbol name="text.alignleft" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="What's this for?"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
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
                Total
              </Text>
              <Text style={[styles.totalValue, isDark && styles.totalValueDark]}>
                {total.toFixed(2)} ETB
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            isLoading && styles.buttonDisabled,
            isDark && styles.buttonDark,
          ]}
          onPress={handleSend}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending...' : 'Send Money'}
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
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
    color: colors.primary,
  },
  totalValueDark: {
    color: colors.primaryLight,
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
