
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Ethiopian fintech color palette
export const colors = {
  // Primary gradient blue for fintech
  primary: '#1976D2',
  primaryDark: '#0D47A1',
  primaryLight: '#2962FF',
  
  // Ethiopian flag colors
  secondary: '#388E3C', // Green - success states
  accent: '#FFC107', // Yellow - highlights
  highlight: '#D32F2F', // Red - errors/warnings
  
  // Base colors
  background: '#F5F5F5', // Light gray
  backgroundDark: '#121212', // Dark mode background
  card: '#FFFFFF',
  cardDark: '#1E1E1E',
  
  // Text colors
  text: '#212121', // Dark gray
  textSecondary: '#757575', // Medium gray
  textLight: '#FFFFFF',
  textDark: '#E0E0E0',
  
  // Utility colors
  border: '#E0E0E0',
  borderDark: '#333333',
  success: '#388E3C',
  warning: '#FFC107',
  error: '#D32F2F',
  info: '#1976D2',
  
  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  md: {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  lg: {
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  cardDark: {
    backgroundColor: colors.cardDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  titleDark: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitleDark: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  bodyDark: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  captionDark: {
    fontSize: 14,
    color: colors.textDark,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
  },
  inputDark: {
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.textDark,
  },
});

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg - 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
