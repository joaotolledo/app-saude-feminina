import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme } from '../constants/theme';

export type BottomNavTab = 'inicio' | 'calendario' | 'saude' | 'bemestar';

export interface FloatingBottomNavProps {
  activeTab: BottomNavTab;
}

export function FloatingBottomNav({ activeTab }: FloatingBottomNavProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navigateTo = (tab: BottomNavTab, path: string) => {
    if (activeTab === tab) return;
    router.push(path as any);
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        { bottom: Math.max(14, insets.bottom) },
      ]}
    >
      <View style={styles.dockShadow}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={75} tint="light" style={styles.blurContainer}>
            <DockContent activeTab={activeTab} onNavigate={navigateTo} />
          </BlurView>
        ) : (
          <View style={styles.androidGlassContainer}>
            <DockContent activeTab={activeTab} onNavigate={navigateTo} />
          </View>
        )}
      </View>
    </View>
  );
};

interface DockContentProps {
  activeTab: BottomNavTab;
  onNavigate: (tab: BottomNavTab, path: string) => void;
}

const DockContent: React.FC<DockContentProps> = ({ activeTab, onNavigate }) => {
  return (
    <View style={styles.contentRow}>
      {/* 1. Início */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onNavigate('inicio', '/')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Início"
      >
        <Ionicons
          name={activeTab === 'inicio' ? 'home' : 'home-outline'}
          size={22}
          color={activeTab === 'inicio' ? AppTheme.colors.primary : AppTheme.colors.textSecondary}
        />
        <Text style={[styles.navText, activeTab === 'inicio' && styles.navTextActive]}>
          Início
        </Text>
      </TouchableOpacity>

      {/* 2. Ciclo & Calendário */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onNavigate('calendario', '/calendario')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Ciclo e Calendário"
      >
        <Ionicons
          name={activeTab === 'calendario' ? 'calendar' : 'calendar-outline'}
          size={22}
          color={activeTab === 'calendario' ? AppTheme.colors.primary : AppTheme.colors.textSecondary}
        />
        <Text style={[styles.navText, activeTab === 'calendario' && styles.navTextActive]}>
          Ciclo
        </Text>
      </TouchableOpacity>

      {/* 3. Botão Central de Destaque */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => onNavigate('calendario', '/calendario')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Registrar Sintoma ou Ciclo"
      >
        <View style={styles.centerButtonInner}>
          <Ionicons name="heart" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* 4. Saúde */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onNavigate('saude', '/saude')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Saúde do Corpo"
      >
        <Ionicons
          name={activeTab === 'saude' ? 'body' : 'body-outline'}
          size={22}
          color={activeTab === 'saude' ? AppTheme.colors.primary : AppTheme.colors.textSecondary}
        />
        <Text style={[styles.navText, activeTab === 'saude' && styles.navTextActive]}>
          Saúde
        </Text>
      </TouchableOpacity>

      {/* 5. Bem-estar */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onNavigate('bemestar', '/bemestar')}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Bem-estar"
      >
        <Ionicons
          name={activeTab === 'bemestar' ? 'sparkles' : 'sparkles-outline'}
          size={22}
          color={activeTab === 'bemestar' ? AppTheme.colors.primary : AppTheme.colors.textSecondary}
        />
        <Text style={[styles.navText, activeTab === 'bemestar' && styles.navTextActive]}>
          Bem-estar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 18,
    right: 18,
    alignItems: 'center',
    zIndex: 99,
  },
  dockShadow: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 34,
    shadowColor: AppTheme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  blurContainer: {
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  androidGlassContainer: {
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
    paddingVertical: 2,
  },
  navText: {
    fontSize: 11,
    color: AppTheme.colors.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  navTextActive: {
    color: AppTheme.colors.primary,
    fontWeight: '700',
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  centerButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default FloatingBottomNav;
