import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/cadastro' ||
    segments[0] === 'login' ||
    segments[0] === 'cadastro';

  useEffect(() => {
    if (loading) return;

    if (!session && !isAuthRoute) {
      // Sem sessão ativa: bloqueia o acesso e redireciona para a tela de Login
      router.replace('/login');
    } else if (session && isAuthRoute) {
      // Com sessão ativa: redireciona para a tela principal
      router.replace('/');
    }
  }, [session, loading, isAuthRoute, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#B55A7D" />
          <Text style={styles.loadingText}>Verificando sessão...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFF5F8' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
        <Stack.Screen name="calendario" />
        <Stack.Screen name="saude" />
        <Stack.Screen name="bemestar" />
        <Stack.Screen name="artigo" />
        <Stack.Screen name="explore" />
      </Stack>
    </>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '500',
    color: '#8E7E86',
    letterSpacing: 0.3,
  },
});