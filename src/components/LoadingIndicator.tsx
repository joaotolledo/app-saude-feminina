import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { AppTheme } from '../constants/theme';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message = 'Carregando informações...' }: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: AppTheme.colors.background,
  },
  card: {
    alignItems: 'center',
    padding: 24,
  },
  text: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '500',
    color: AppTheme.colors.textSecondary,
    letterSpacing: 0.2,
  },
});

export default LoadingIndicator;
