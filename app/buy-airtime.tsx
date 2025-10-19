
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

export default function BuyAirtimeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { balance, buyAirtime } = useWallet();

  const [provider, setProvider] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const providers = [
    { id: 'ethio-telecom', name: 'Ethio Telecom', icon: 'phone.fill', color: colors.primary },
    { id: 'safaricom', name: 'Safaricom Ethiopia', icon: 'phone.fill', color: colors.secondary },
  ];

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  const fee = amount ? calculateTransactionFee(parseFloat(amount)) : 0;
  const total = amount ? parseFloat(amount) + fee : 0;

  const handleBuyAirtime = async () => {
    if (!provider || !phoneNumber || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
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
    const success = await buyAirtime(provider, phoneNumber, amountNum);
    setIsLoading(false);

    if (success) {
      Alert.alert('Success', 'Airtime purchased successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to purchase airtime. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Select Provider
          </Text>
          {providers.map((prov) => (
            <TouchableOpacity
              key={prov.id}
              style={[
                styles.providerCard,
                provider === prov.id && styles.providerCardSelected,
                isDark && styles.providerCardDark,
              ]}
              onPress={() => setProvider(prov.id)}
            >
              <View style={[styles.providerIcon, { backgroundColor: prov.color + '20' }]}>
                <IconSymbol name={prov.icon as any} size={24} color={prov.color} />
              </View>
              <Text style={[styles.providerName, isDark && styles.providerNameDark]}>
                {prov.name}
              </Text>
              {provider === prov.id && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {provider && (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Phone Number</Text>
            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <IconSymbol name="phone.fill" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="+251..."
                placeholderTextColor={colors.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
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

            <Text style={[styles.quickAmountsLabel, isDark && styles.quickAmountsLabelDark]}>
              Quick Amounts
            </Text>
            <View style={styles.quickAmountsGrid}>
              {quickAmounts.map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={[styles.quickAmountButton, isDark && styles.quickAmountButtonDark]}
                  onPress={() => setAmount(quickAmount.toString())}
                >
                  <Text style={[styles.quickAmountText, isDark && styles.quickAmountTextDark]}>
                    {quickAmount} ETB
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {amount && parseFloat(amount) > 0 && (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
                Airtime Amount
              </Text>
              <Text style={[styles.summaryValue, isDark && styles.summaryValueDark]}>
                {parseFloat(amount).toFixed(2)} ETB
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
                Service Fee
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
          style={[styles.button, isLoading && styles.buttonDisabled, isDark && styles.buttonDark]}
          onPress={handleBuyAirtime}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Buy Airtime'}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionTitleDark: {
    color: colors.textDark,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  providerCardDark: {
    backgroundColor: colors.backgroundDark,
  },
  providerCardSelected: {
    borderColor: colors.secondary,
  },
  providerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  providerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  providerNameDark: {
    color: colors.textDark,
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
  quickAmountsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  quickAmountsLabelDark: {
    color: colors.textDark,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    width: '31%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  quickAmountButtonDark: {
    backgroundColor: colors.backgroundDark,
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  quickAmountTextDark: {
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
