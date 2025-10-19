
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { balance, transactions, refreshTransactions } = useWallet();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshTransactions();
    setRefreshing(false);
  };

  if (authLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
          Loading...
        </Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  const quickActions = [
    {
      id: 'send',
      title: 'Send',
      icon: 'arrow.up.circle.fill',
      color: colors.primary,
      route: '/send-money',
    },
    {
      id: 'deposit',
      title: 'Deposit',
      icon: 'plus.circle.fill',
      color: colors.secondary,
      route: '/deposit',
    },
    {
      id: 'withdraw',
      title: 'Withdraw',
      icon: 'minus.circle.fill',
      color: colors.accent,
      route: '/withdraw',
    },
    {
      id: 'scan',
      title: 'Scan QR',
      icon: 'qrcode',
      color: colors.highlight,
      route: '/scan-qr',
    },
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={[colors.primaryLight, colors.primary, colors.primaryDark]}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity>
              <IconSymbol name="eye.fill" size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {balance.toFixed(2)} <Text style={styles.currency}>ETB</Text>
          </Text>
          <Text style={styles.userName}>Welcome, {user?.name}!</Text>
        </LinearGradient>

        <View style={styles.quickActionsContainer}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, isDark && styles.quickActionCardDark]}
                onPress={() => router.push(action.route as any)}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color + '20' },
                  ]}
                >
                  <IconSymbol name={action.icon as any} size={28} color={action.color} />
                </View>
                <Text style={[styles.quickActionText, isDark && styles.quickActionTextDark]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
              <IconSymbol name="tray" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>
                No transactions yet
              </Text>
            </View>
          ) : (
            recentTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={[styles.transactionCard, isDark && styles.transactionCardDark]}
                onPress={() =>
                  router.push({
                    pathname: '/transaction-details',
                    params: { id: transaction.id },
                  })
                }
              >
                <View
                  style={[
                    styles.transactionIcon,
                    {
                      backgroundColor:
                        transaction.type === 'send' || transaction.type === 'withdraw'
                          ? colors.highlight + '20'
                          : colors.secondary + '20',
                    },
                  ]}
                >
                  <IconSymbol
                    name={
                      transaction.type === 'send' || transaction.type === 'withdraw'
                        ? 'arrow.up'
                        : 'arrow.down'
                    }
                    size={20}
                    color={
                      transaction.type === 'send' || transaction.type === 'withdraw'
                        ? colors.highlight
                        : colors.secondary
                    }
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text
                    style={[styles.transactionTitle, isDark && styles.transactionTitleDark]}
                  >
                    {transaction.description}
                  </Text>
                  <Text
                    style={[
                      styles.transactionDate,
                      isDark && styles.transactionDateDark,
                    ]}
                  >
                    {transaction.createdAt.toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'send' || transaction.type === 'withdraw'
                      ? styles.transactionAmountNegative
                      : styles.transactionAmountPositive,
                  ]}
                >
                  {transaction.type === 'send' || transaction.type === 'withdraw'
                    ? '-'
                    : '+'}
                  {transaction.amount.toFixed(2)} ETB
                </Text>
              </TouchableOpacity>
            ))
          )}
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
  loadingText: {
    fontSize: 16,
    color: colors.text,
  },
  loadingTextDark: {
    color: colors.textDark,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  balanceCard: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.textLight,
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  currency: {
    fontSize: 20,
    fontWeight: '600',
  },
  userName: {
    fontSize: 14,
    color: colors.textLight,
    opacity: 0.9,
  },
  quickActionsContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  quickActionCardDark: {
    backgroundColor: colors.cardDark,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  quickActionTextDark: {
    color: colors.textDark,
  },
  transactionsContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    alignItems: 'center',
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
  },
  transactionDateDark: {
    color: colors.textDark,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  transactionAmountPositive: {
    color: colors.secondary,
  },
  transactionAmountNegative: {
    color: colors.highlight,
  },
});
