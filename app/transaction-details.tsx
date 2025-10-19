
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useWallet } from '@/contexts/WalletContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function TransactionDetailsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { id } = useLocalSearchParams();
  const { transactions } = useWallet();

  const transaction = transactions.find((t) => t.id === id);

  if (!transaction) {
    return (
      <View style={[styles.container, styles.centered, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
          Transaction not found
        </Text>
      </View>
    );
  }

  const handleShare = () => {
    Alert.alert('Coming Soon', 'Share receipt feature coming soon!');
  };

  const handleDownload = () => {
    Alert.alert('Coming Soon', 'Download receipt feature coming soon!');
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.statusCard, isDark && styles.statusCardDark]}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor:
                  transaction.status === 'completed'
                    ? colors.secondary + '20'
                    : colors.accent + '20',
              },
            ]}
          >
            <IconSymbol
              name={
                transaction.status === 'completed'
                  ? 'checkmark.circle.fill'
                  : 'clock.fill'
              }
              size={48}
              color={transaction.status === 'completed' ? colors.secondary : colors.accent}
            />
          </View>
          <Text style={[styles.statusText, isDark && styles.statusTextDark]}>
            {transaction.status === 'completed' ? 'Transaction Successful' : 'Transaction Pending'}
          </Text>
          <Text style={[styles.amountText, isDark && styles.amountTextDark]}>
            {transaction.type === 'send' || transaction.type === 'withdraw' ? '-' : '+'}
            {transaction.amount.toFixed(2)} ETB
          </Text>
        </View>

        <View style={[styles.detailsCard, isDark && styles.detailsCardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
            Transaction Details
          </Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
              Receipt ID
            </Text>
            <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
              {transaction.receiptId}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
              Type
            </Text>
            <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
              Description
            </Text>
            <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
              {transaction.description}
            </Text>
          </View>

          {transaction.toPhone && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
                To
              </Text>
              <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
                {transaction.toPhone}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
              Date & Time
            </Text>
            <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
              {transaction.createdAt.toLocaleDateString()} at{' '}
              {transaction.createdAt.toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
              Status
            </Text>
            <Text
              style={[
                styles.detailValue,
                isDark && styles.detailValueDark,
                { color: transaction.status === 'completed' ? colors.secondary : colors.accent },
              ]}
            >
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={[styles.detailsCard, isDark && styles.detailsCardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
            Payment Summary
          </Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
              Amount
            </Text>
            <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
              {transaction.amount.toFixed(2)} ETB
            </Text>
          </View>

          {transaction.fee > 0 && (
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, isDark && styles.detailLabelDark]}>
                Transaction Fee
              </Text>
              <Text style={[styles.detailValue, isDark && styles.detailValueDark]}>
                {transaction.fee.toFixed(2)} ETB
              </Text>
            </View>
          )}

          <View style={[styles.divider, isDark && styles.dividerDark]} />

          <View style={styles.detailRow}>
            <Text style={[styles.totalLabel, isDark && styles.totalLabelDark]}>
              Total
            </Text>
            <Text style={[styles.totalValue, isDark && styles.totalValueDark]}>
              {transaction.total.toFixed(2)} ETB
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, isDark && styles.actionButtonDark]}
            onPress={handleShare}
          >
            <IconSymbol name="square.and.arrow.up" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, isDark && styles.actionButtonTextDark]}>
              Share Receipt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, isDark && styles.actionButtonDark]}
            onPress={handleDownload}
          >
            <IconSymbol name="arrow.down.circle" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, isDark && styles.actionButtonTextDark]}>
              Download
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
  },
  errorTextDark: {
    color: colors.textDark,
  },
  scrollContent: {
    padding: spacing.md,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  statusCardDark: {
    backgroundColor: colors.cardDark,
  },
  statusIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  statusTextDark: {
    color: colors.textDark,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  amountTextDark: {
    color: colors.primaryLight,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  detailsCardDark: {
    backgroundColor: colors.cardDark,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  cardTitleDark: {
    color: colors.textDark,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailLabelDark: {
    color: colors.textDark,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.md,
  },
  detailValueDark: {
    color: colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.sm,
  },
  actionButtonDark: {
    backgroundColor: colors.cardDark,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  actionButtonTextDark: {
    color: colors.primaryLight,
  },
});
