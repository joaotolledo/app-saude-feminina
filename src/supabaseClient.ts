import 'react-native-url-polyfill/auto'; // 1. Sempre no topo absoluto
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { AppState, type AppStateStatus, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.error(
    '[Supabase] ERRO: EXPO_PUBLIC_SUPABASE_URL ou EXPO_PUBLIC_SUPABASE_ANON_KEY não configuradas no arquivo .env.'
  );
}

// Storage seguro para ambiente React Native (iOS/Android) e Web/SSR
const SafeAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return null;
    }
    return AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }
    await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  supabaseUrl || 'https://yvxzgiqwegnuwipjvjzh.supabase.co',
  supabaseKey ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eHpnaXF3ZWdudXdpcGp2anpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTE3NDYsImV4cCI6MjEwMzE4Nzc0Nn0.XaBGd_zxmp5dU7hfE6Tzw9H3mCnXbATr6AFeN8vaBCQ',
  {
    auth: {
      storage: SafeAsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      // 2. Habilita detecção de URL apenas na Web (necessário para OAuth / Magic Links)
      detectSessionInUrl: Platform.OS === 'web',
    },
  }
);

// 3. Mantém o token atualizado no Mobile ao alternar entre primeiro e segundo plano
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state: AppStateStatus) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
