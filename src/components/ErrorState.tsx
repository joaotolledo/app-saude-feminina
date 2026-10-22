import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../constants/theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Algo não saiu como esperado',
  message = 'Não foi possível carregar as informações no momento. Verifique sua conexão e tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={36} color={AppTheme.colors.error} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.7}>
          <Ionicons name="reload" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: AppTheme.colors.errorBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: AppTheme.colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: AppTheme.radius.md,
    ...AppTheme.shadows.button,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorState;
