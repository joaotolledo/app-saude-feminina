import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { UsuarioPerfil } from '../types';

interface AuthContextData {
  session: Session | null;
  user: User | null;
  profile: UsuarioPerfil | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nome, data_nascimento, duracao_ciclo, duracao_periodo, created_at')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        return;
      }

      if (data) {
        setProfile(data as UsuarioPerfil);
      }
    } catch {
      // Falha silenciosa para não travar a inicialização do app
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // 1. Obter sessão inicial persistida no AsyncStorage
    supabase.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        if (!mounted) return;
        setSession(initialSession);
        if (initialSession?.user?.id) {
          fetchProfile(initialSession.user.id);
        }
        setLoading(false);
      })
      .catch(() => {
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
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setProfile(null);
    } catch {
      // Ignora erro no logout local
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id);
    }
  }, [session?.user?.id, fetchProfile]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signOut,
      refreshProfile,
    }),
    [session, profile, loading, signOut, refreshProfile]
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
