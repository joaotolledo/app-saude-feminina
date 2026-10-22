import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

export interface UserProfile {
  id: string;
  nome?: string;
  data_nascimento?: string | null;
  duracao_ciclo?: number | null;
  duracao_periodo?: number | null;
  created_at?: string;
}

interface AuthContextData {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[AuthContext] Erro ao carregar perfil de usuários:', error.message);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (err) {
      console.warn('[AuthContext] Falha na requisição de perfil:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Obter sessão inicial persistida no AsyncStorage
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
        if (session?.user?.id) {
          fetchProfile(session.user.id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('[AuthContext] Erro ao obter sessão inicial:', err);
        if (mounted) setLoading(false);
      });

    // 2. Escutar mudanças em tempo real na autenticação (login, logout, refresh de token)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (newSession?.user?.id) {
        await fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('[AuthContext] Erro ao encerrar sessão:', err);
    }
  };

  const refreshProfile = async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id);
    }
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signOut,
      refreshProfile,
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
