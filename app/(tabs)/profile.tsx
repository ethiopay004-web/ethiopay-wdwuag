
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing, borderRadius, shadows } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth');
        },
      },
    ]);
  };

  const profileOptions = [
    {
      id: 'edit',
      title: 'Edit Profile',
      icon: 'person.circle',
      color: colors.primary,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: 'security',
      title: 'Security & PIN',
      icon: 'lock.fill',
      color: colors.secondary,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: 'payment-methods',
      title: 'Payment Methods',
      icon: 'creditcard.fill',
      color: colors.accent,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell.fill',
      color: colors.info,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'questionmark.circle.fill',
      color: colors.primary,
      onPress: () => Alert.alert('Coming Soon', 'This feature is coming soon!'),
    },
    {
      id: 'about',
      title: 'About Ethiopay',
      icon: 'info.circle.fill',
      color: colors.secondary,
      onPress: () =>
        Alert.alert(
          'Ethiopay',
          'Version 1.0.0\n\nYour trusted digital wallet for Ethiopia.\n\nPowered by Ethiopian Innovation'
        ),
    },
  ];

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
          Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          Platform.OS !== 'ios' && styles.scrollContentWithTabBar,
        ]}
      >
        <View style={[styles.profileCard, isDark && styles.profileCardDark]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={40} color={colors.textLight} />
            </View>
          </View>
          <Text style={[styles.userName, isDark && styles.userNameDark]}>
            {user?.name}
          </Text>
          <Text style={[styles.userPhone, isDark && styles.userPhoneDark]}>
            {user?.phone}
          </Text>
          {user?.email && (
            <Text style={[styles.userEmail, isDark && styles.userEmailDark]}>
              {user.email}
            </Text>
          )}
          <View style={styles.verifiedBadge}>
            <IconSymbol name="checkmark.circle.fill" size={16} color={colors.secondary} />
            <Text style={styles.verifiedText}>Verified Account</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, isDark && styles.optionCardDark]}
              onPress={option.onPress}
            >
              <View
                style={[
                  styles.optionIcon,
                  { backgroundColor: option.color + '20' },
                ]}
              >
                <IconSymbol name={option.icon as any} size={24} color={option.color} />
              </View>
              <Text style={[styles.optionTitle, isDark && styles.optionTitleDark]}>
                {option.title}
              </Text>
              <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isDark && styles.logoutButtonDark]}
          onPress={handleLogout}
        >
          <IconSymbol name="arrow.right.square.fill" size={20} color={colors.highlight} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <View style={styles.flagColors}>
            <View style={[styles.flagStripe, { backgroundColor: colors.secondary }]} />
            <View style={[styles.flagStripe, { backgroundColor: colors.accent }]} />
            <View style={[styles.flagStripe, { backgroundColor: colors.highlight }]} />
          </View>
          <Text style={[styles.footerText, isDark && styles.footerTextDark]}>
            Powered by Ethiopian Innovation
          </Text>
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
  },
  headerTitleDark: {
    color: colors.textDark,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  profileCardDark: {
    backgroundColor: colors.cardDark,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userNameDark: {
    color: colors.textDark,
  },
  userPhone: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userPhoneDark: {
    color: colors.textDark,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  userEmailDark: {
    color: colors.textDark,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.sm,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    marginLeft: spacing.xs,
  },
  optionsContainer: {
    marginBottom: spacing.lg,
  },
  optionCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.sm,
  },
  optionCardDark: {
    backgroundColor: colors.cardDark,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  optionTitleDark: {
    color: colors.textDark,
  },
  logoutButton: {
    backgroundColor: colors.highlight + '10',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  logoutButtonDark: {
    backgroundColor: colors.highlight + '20',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.highlight,
    marginLeft: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  flagColors: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  flagStripe: {
    width: 40,
    height: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  footerTextDark: {
    color: colors.textDark,
  },
});
