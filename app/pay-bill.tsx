
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

export default function PayBillScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { balance, payBill } = useWallet();

  const [billType, setBillType] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const billTypes = [
    { id: 'electricity', name: 'Electricity', icon: 'bolt.fill', color: colors.accent },
    { id: 'water', name: 'Water', icon: 'drop.fill', color: colors.info },
    { id: 'wifi', name: 'Wi-Fi / Internet', icon: 'wifi', color: colors.secondary },
  ];

  const providers = {
    electricity: ['Ethiopian Electric Power', 'Addis Ababa Power'],
    water: ['Addis Ababa Water', 'Regional Water Authority'],
    wifi: ['Ethio Telecom', 'Safaricom Ethiopia'],
  };

  const fee = amount ? calculateTransactionFee(parseFloat(amount)) : 0;
  const total = amount ? parseFloat(amount) + fee : 0;

  const handlePayBill = async () => {
    if (!billType || !provider || !accountNumber || !amount) {
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
    const success = await payBill(billType, provider, accountNumber, amountNum);
    setIsLoading(false);

    if (success) {
      Alert.alert('Success', 'Bill paid successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to pay bill. Please try again.');
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
            Select Bill Type
          </Text>
          {billTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                billType === type.id && styles.typeCardSelected,
                isDark && styles.typeCardDark,
              ]}
              onPress={() => {
                setBillType(type.id);
                setProvider('');
              }}
            >
              <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                <IconSymbol name={type.icon as any} size={24} color={type.color} />
              </View>
              <Text style={[styles.typeName, isDark && styles.typeNameDark]}>
                {type.name}
              </Text>
              {billType === type.id && (
                <IconSymbol name="checkmark.circle.fill" size={24} color={colors.secondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {billType && (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Provider</Text>
            {providers[billType as keyof typeof providers]?.map((prov) => (
              <TouchableOpacity
                key={prov}
                style={[
                  styles.providerButton,
                  provider === prov && styles.providerButtonSelected,
                  isDark && styles.providerButtonDark,
                ]}
                onPress={() => setProvider(prov)}
              >
                <Text
                  style={[
                    styles.providerText,
                    provider === prov && styles.providerTextSelected,
                    isDark && styles.providerTextDark,
                  ]}
                >
                  {prov}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={[styles.label, isDark && styles.labelDark, { marginTop: spacing.md }]}>
              Account Number
            </Text>
            <View style={[styles.inputContainer, isDark && styles.inputContainerDark]}>
              <IconSymbol name="number" size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, isDark && styles.inputDark]}
                placeholder="Enter account number"
                placeholderTextColor={colors.textSecondary}
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
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
          </View>
        )}

        {amount && parseFloat(amount) > 0 && (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, isDark && styles.summaryLabelDark]}>
                Bill Amount
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
          onPress={handlePayBill}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Processing...' : 'Pay Bill'}
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
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardDark: {
    backgroundColor: colors.backgroundDark,
  },
  typeCardSelected: {
    borderColor: colors.secondary,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  typeName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  typeNameDark: {
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
  providerButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  providerButtonDark: {
    backgroundColor: colors.backgroundDark,
    borderColor: colors.borderDark,
  },
  providerButtonSelected: {
    backgroundColor: colors.secondary + '20',
    borderColor: colors.secondary,
  },
  providerText: {
    fontSize: 14,
    color: colors.text,
  },
  providerTextDark: {
    color: colors.textDark,
  },
  providerTextSelected: {
    fontWeight: '600',
    color: colors.secondary,
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
