import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const validarFormulario = () => {
    if (!email.trim() || !senha) {
      setMensagemErro('Por favor, preencha todos os campos.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMensagemErro('Por favor, insira um e-mail válido.');
      return false;
    }

    if (senha.length < 6) {
      setMensagemErro('A senha deve ter no mínimo 6 caracteres.');
      return false;
    }

    setMensagemErro(null);
    return true;
  };

  const traduzirErroSupabase = (erroOriginal: string) => {
    const msg = erroOriginal.toLowerCase();
    if (msg.includes('invalid login credentials')) {
      return 'E-mail ou senha incorretos. Verifique suas informações.';
    }
    if (msg.includes('email not confirmed')) {
      return 'Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada.';
    }
    if (msg.includes('user not found')) {
      return 'Usuária não encontrada com este e-mail.';
    }
    if (msg.includes('rate limit')) {
      return 'Muitas tentativas em pouco tempo. Aguarde alguns instantes.';
    }
    return erroOriginal;
  };

  const handleLogin = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    setMensagemErro(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: senha,
      });

      if (error) {
        setMensagemErro(traduzirErroSupabase(error.message));
        return;
      }

      if (data?.session) {
        // Redirecionamento automático gerenciado pelo Auth Gate no _layout
        router.replace('/');
      }
    } catch (err: any) {
      setMensagemErro('Ocorreu um erro ao tentar entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Topo / Ilustração suave */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={32} color="#B55A7D" />
            </View>
            <Text style={styles.title}>Bem-vinda de volta</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta para cuidar do seu ciclo, saúde e bem-estar.
            </Text>
          </View>

          {/* Card do Formulário */}
          <View style={styles.card}>
            {mensagemErro && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={20} color="#D32F2F" style={{ marginRight: 8 }} />
                <Text style={styles.errorText}>{mensagemErro}</Text>
              </View>
            )}

            {/* Campo E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color="#8E7E86" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="seuemail@exemplo.com"
                  placeholderTextColor="#B0A4A8"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (mensagemErro) setMensagemErro(null);
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Campo Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#8E7E86" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Sua senha secreta"
                  placeholderTextColor="#B0A4A8"
                  value={senha}
                  onChangeText={(text) => {
                    setSenha(text);
                    if (mensagemErro) setMensagemErro(null);
                  }}
                  secureTextEntry={!showSenha}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowSenha(!showSenha)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showSenha ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#8E7E86"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Entrar */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.primaryButtonText}>Entrar</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </View>
              )}
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Link para Cadastro */}
            <View style={styles.footerLinkRow}>
              <Text style={styles.footerLinkPreText}>Ainda não tem conta? </Text>
              <TouchableOpacity onPress={() => router.push('/cadastro')} activeOpacity={0.7}>
                <Text style={styles.footerLinkHighlight}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FCE8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FADEE5',
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4A3E44',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E7E86',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F5DFE6',
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEEBEE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    flex: 1,
    color: '#D32F2F',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C5257',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECDCE2',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#4A3E44',
    fontSize: 15,
  },
  eyeButton: {
    padding: 6,
  },
  primaryButton: {
    backgroundColor: '#B55A7D',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F0E2E7',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#A09398',
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLinkPreText: {
    fontSize: 14,
    color: '#8E7E86',
  },
  footerLinkHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B55A7D',
  },
});
