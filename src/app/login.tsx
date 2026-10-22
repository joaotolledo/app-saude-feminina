import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';
import { AppTheme } from '../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const senhaInputRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  const validarFormulario = (): boolean => {
    const emailLimpo = email.trim();
    if (!emailLimpo || !senha) {
      setMensagemErro('Por favor, preencha todos os campos.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLimpo)) {
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

  const traduzirErroSupabase = (erroOriginal: string): string => {
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
    return 'Não foi possível entrar. Verifique os dados digitados e tente novamente.';
  };

  const handleLogin = async () => {
    if (loading) return;
    if (!validarFormulario()) return;

    Keyboard.dismiss();
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
        router.replace('/');
      }
    } catch {
      setMensagemErro('Ocorreu uma falha de conexão. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(32, insets.bottom + 16) },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Topo / Ilustração suave */}
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="sparkles" size={32} color={AppTheme.colors.primary} />
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
                  <Ionicons
                    name="alert-circle"
                    size={20}
                    color={AppTheme.colors.error}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.errorText}>{mensagemErro}</Text>
                </View>
              )}

              {/* Campo E-mail */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={AppTheme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="seuemail@exemplo.com"
                    placeholderTextColor={AppTheme.colors.textMuted}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (mensagemErro) setMensagemErro(null);
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => senhaInputRef.current?.focus()}
                    blurOnSubmit={false}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Campo Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={AppTheme.colors.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    ref={senhaInputRef}
                    style={styles.input}
                    placeholder="Sua senha secreta"
                    placeholderTextColor={AppTheme.colors.textMuted}
                    value={senha}
                    onChangeText={(text) => {
                      setSenha(text);
                      if (mensagemErro) setMensagemErro(null);
                    }}
                    secureTextEntry={!showSenha}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowSenha(!showSenha)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityLabel={showSenha ? 'Ocultar senha' : 'Ver senha'}
                  >
                    <Ionicons
                      name={showSenha ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={AppTheme.colors.textSecondary}
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
                <TouchableOpacity
                  onPress={() => router.push('/cadastro')}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.footerLinkHighlight}>Cadastre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  keyboardView: {
    flex: 1,
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
    backgroundColor: AppTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.primarySoft,
    ...AppTheme.shadows.card,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: AppTheme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  card: {
    backgroundColor: AppTheme.colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    ...AppTheme.shadows.card,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.errorBg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    flex: 1,
    color: AppTheme.colors.error,
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
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AppTheme.colors.borderSubtle,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: AppTheme.colors.text,
    fontSize: 15,
  },
  eyeButton: {
    padding: 6,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    ...AppTheme.shadows.button,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
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
    color: AppTheme.colors.textMuted,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  footerLinkPreText: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
  },
  footerLinkHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: AppTheme.colors.primary,
  },
});
