
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function PaymentsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const paymentOptions = [
    {
      id: 'bills',
      title: 'Pay Bills',
      description: 'Electricity, Water, Wi-Fi',
      icon: 'bolt.fill',
      color: colors.accent,
      route: '/pay-bill',
    },
    {
      id: 'airtime',
      title: 'Buy Airtime',
      description: 'Mobile credit & data',
      icon: 'phone.fill',
      color: colors.secondary,
      route: '/buy-airtime',
    },
    {
      id: 'merchant',
      title: 'Pay Merchant',
      description: 'Scan QR or enter phone',
      icon: 'qrcode',
      color: colors.primary,
      route: '/pay-merchant',
    },
    {
      id: 'request',
      title: 'Request Money',
      description: 'Request from contacts',
      icon: 'arrow.down.circle.fill',
      color: colors.highlight,
      route: '/request-money',
    },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Payments
        </Text>
        <Text style={[styles.headerSubtitle, isDark && styles.headerSubtitleDark]}>
          Pay bills, buy airtime, and more
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
      >
        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.paymentCard, isDark && styles.paymentCardDark]}
            onPress={() => router.push(option.route as any)}
          >
            <View
              style={[
                styles.paymentIcon,
                { backgroundColor: option.color + '20' },
              ]}
            >
              <IconSymbol name={option.icon as any} size={28} color={option.color} />
            </View>
            <View style={styles.paymentDetails}>
              <Text style={[styles.paymentTitle, isDark && styles.paymentTitleDark]}>
                {option.title}
              </Text>
              <Text
                style={[
                  styles.paymentDescription,
                  isDark && styles.paymentDescriptionDark,
                ]}
              >
                {option.description}
              </Text>
            </View>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}

        <View style={[styles.infoCard, isDark && styles.infoCardDark]}>
          <IconSymbol name="info.circle.fill" size={24} color={colors.info} />
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, isDark && styles.infoTitleDark]}>
              Transaction Fees
            </Text>
            <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
              - Up to 100 ETB: 0.50 ETB{'\n'}
              - 101-500 ETB: 1 ETB{'\n'}
              - 501-1000 ETB: 2 ETB{'\n'}
              - 1001-1500 ETB: 3 ETB{'\n'}
              - Above 1500 ETB: 5 ETB
            </Text>
          </View>
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
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerTitleDark: {
    color: colors.textDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerSubtitleDark: {
    color: colors.textDark,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  paymentCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  paymentCardDark: {
    backgroundColor: colors.cardDark,
  },
  paymentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  paymentTitleDark: {
    color: colors.textDark,
  },
  paymentDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  paymentDescriptionDark: {
    color: colors.textDark,
  },
  infoCard: {
    backgroundColor: colors.info + '10',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    flexDirection: 'row',
  },
  infoCardDark: {
    backgroundColor: colors.info + '20',
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoTitleDark: {
    color: colors.textDark,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoTextDark: {
    color: colors.textDark,
  },
});
