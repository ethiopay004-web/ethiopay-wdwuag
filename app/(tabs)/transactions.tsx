
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useWallet } from '@/contexts/WalletContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { Transaction } from '@/types';

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { transactions } = useWallet();
  const [filter, setFilter] = useState<'all' | 'send' | 'receive' | 'payment'>('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'send') return t.type === 'send' || t.type === 'withdraw';
    if (filter === 'receive') return t.type === 'receive' || t.type === 'deposit';
    if (filter === 'payment') return t.type === 'payment' || t.type === 'bill' || t.type === 'airtime';
    return true;
  });

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={[styles.transactionCard, isDark && styles.transactionCardDark]}
      onPress={() =>
        router.push({
          pathname: '/transaction-details',
          params: { id: item.id },
        })
      }
    >
      <View
        style={[
          styles.transactionIcon,
          {
            backgroundColor:
              item.type === 'send' || item.type === 'withdraw'
                ? colors.highlight + '20'
                : colors.secondary + '20',
          },
        ]}
      >
        <IconSymbol
          name={
            item.type === 'send' || item.type === 'withdraw'
              ? 'arrow.up'
              : 'arrow.down'
          }
          size={20}
          color={
            item.type === 'send' || item.type === 'withdraw'
              ? colors.highlight
              : colors.secondary
          }
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={[styles.transactionTitle, isDark && styles.transactionTitleDark]}>
          {item.description}
        </Text>
        <Text style={[styles.transactionDate, isDark && styles.transactionDateDark]}>
          {item.createdAt.toLocaleDateString()} • {item.createdAt.toLocaleTimeString()}
        </Text>
        {item.fee > 0 && (
          <Text style={[styles.transactionFee, isDark && styles.transactionFeeDark]}>
            Fee: {item.fee.toFixed(2)} ETB
          </Text>
        )}
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            item.type === 'send' || item.type === 'withdraw'
              ? styles.transactionAmountNegative
              : styles.transactionAmountPositive,
          ]}
        >
          {item.type === 'send' || item.type === 'withdraw' ? '-' : '+'}
          {item.amount.toFixed(2)}
        </Text>
        <Text style={[styles.transactionStatus, isDark && styles.transactionStatusDark]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Transactions
        </Text>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'send', 'receive', 'payment'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterButton,
              filter === f && styles.filterButtonActive,
              isDark && styles.filterButtonDark,
              filter === f && isDark && styles.filterButtonActiveDark,
            ]}
            onPress={() => setFilter(f as any)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === f && styles.filterButtonTextActive,
                isDark && styles.filterButtonTextDark,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          Platform.OS !== 'ios' && styles.listContentWithTabBar,
        ]}
        ListEmptyComponent={
          <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
            <IconSymbol name="tray" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>
              No transactions found
            </Text>
          </View>
        }
      />
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
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  headerTitleDark: {
    color: colors.textDark,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    marginRight: spacing.sm,
  },
  filterButtonDark: {
    backgroundColor: colors.cardDark,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonActiveDark: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterButtonTextDark: {
    color: colors.textDark,
  },
  filterButtonTextActive: {
    color: colors.textLight,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
  transactionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  transactionCardDark: {
    backgroundColor: colors.cardDark,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  transactionTitleDark: {
    color: colors.textDark,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  transactionDateDark: {
    color: colors.textDark,
  },
  transactionFee: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  transactionFeeDark: {
    color: colors.textDark,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  transactionAmountPositive: {
    color: colors.secondary,
  },
  transactionAmountNegative: {
    color: colors.highlight,
  },
  transactionStatus: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  transactionStatusDark: {
    color: colors.textDark,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.xl,
    ...shadows.sm,
  },
  emptyStateDark: {
    backgroundColor: colors.cardDark,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  emptyStateTextDark: {
    color: colors.textDark,
  },
});
