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

export default function CadastroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const emailInputRef = useRef<TextInput>(null);
  const senhaInputRef = useRef<TextInput>(null);
  const confirmarSenhaInputRef = useRef<TextInput>(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [sucessoConfirmacao, setSucessoConfirmacao] = useState(false);

  const validarFormulario = (): boolean => {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();

    if (!nomeLimpo || !emailLimpo || !senha || !confirmarSenha) {
      setMensagemErro('Por favor, preencha todos os campos.');
      return false;
    }

    if (nomeLimpo.length < 2) {
      setMensagemErro('Por favor, informe seu nome como prefere ser chamada.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLimpo)) {
      setMensagemErro('Por favor, insira um endereço de e-mail válido.');
      return false;
    }

    if (senha.length < 6) {
      setMensagemErro('A senha deve ter no mínimo 6 caracteres.');
      return false;
    }

    if (senha !== confirmarSenha) {
      setMensagemErro('As senhas digitadas não coincidem. Verifique e tente novamente.');
      return false;
    }

    setMensagemErro(null);
    return true;
  };

  const traduzirErroSupabase = (erroOriginal: string): string => {
    const msg = erroOriginal.toLowerCase();
    if (msg.includes('user already registered') || msg.includes('already exists')) {
      return 'Este e-mail já está cadastrado. Experimente fazer login.';
    }
    if (msg.includes('password should be at least 6 characters')) {
      return 'A senha deve conter no mínimo 6 caracteres.';
    }
    if (msg.includes('invalid email')) {
      return 'Formato de e-mail inválido.';
    }
    if (msg.includes('rate limit')) {
      return 'Muitas tentativas em pouco tempo. Aguarde alguns instantes.';
    }
    return 'Não foi possível concluir seu cadastro no momento. Tente novamente.';
  };

  const handleCadastro = async () => {
    if (loading) return;
    if (!validarFormulario()) return;

    Keyboard.dismiss();
    setLoading(true);
    setMensagemErro(null);

    const nomeFormatado = nome.trim();
    const emailFormatado = email.trim().toLowerCase();

    try {
      // 1. Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: emailFormatado,
        password: senha,
        options: {
          data: {
            nome: nomeFormatado,
          },
        },
      });

      if (error) {
        setMensagemErro(traduzirErroSupabase(error.message));
        return;
      }

      // 2. Salvar registro na tabela pública 'usuarios'
      if (data?.user?.id) {
        const { error: dbError } = await supabase.from('usuarios').insert([
          {
            id: data.user.id,
            nome: nomeFormatado,
          },
        ]);

        if (dbError) {
          // Log silencioso para resiliência
        }
      }

      if (data?.session) {
        router.replace('/');
      } else {
        setSucessoConfirmacao(true);
      }
    } catch {
      setMensagemErro('Ocorreu uma falha ao criar sua conta. Verifique sua conexão e tente novamente.');
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
              { paddingBottom: Math.max(36, insets.bottom + 20) },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Topo com botão voltar */}
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace('/login')}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityLabel="Voltar para login"
              >
                <Ionicons name="arrow-back" size={22} color={AppTheme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Cabeçalho */}
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Ionicons name="heart" size={32} color={AppTheme.colors.primary} />
              </View>
              <Text style={styles.title}>Crie sua conta</Text>
              <Text style={styles.subtitle}>
                Comece agora sua jornada de autoconhecimento e cuidado com o seu ciclo.
              </Text>
            </View>

            {/* Estado de Sucesso de Confirmação */}
            {sucessoConfirmacao ? (
              <View style={styles.card}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-done" size={36} color={AppTheme.colors.success} />
                </View>
                <Text style={styles.successTitle}>Conta criada com sucesso! 🌸</Text>
                <Text style={styles.successText}>
                  Enviamos uma mensagem para{' '}
                  <Text style={styles.emailHighlight}>{email}</Text>. Acesse seu e-mail para ativar seu
                  acesso e depois faça login no aplicativo.
                </Text>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => router.replace('/login')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>Ir para o Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Card do Formulário de Cadastro */
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

                {/* Campo Nome */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={AppTheme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Como prefere ser chamada"
                      placeholderTextColor={AppTheme.colors.textMuted}
                      value={nome}
                      onChangeText={(text) => {
                        setNome(text);
                        if (mensagemErro) setMensagemErro(null);
                      }}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onSubmitEditing={() => emailInputRef.current?.focus()}
                      blurOnSubmit={false}
                      editable={!loading}
                    />
                  </View>
                </View>

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
                      ref={emailInputRef}
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
                      placeholder="Mínimo de 6 caracteres"
                      placeholderTextColor={AppTheme.colors.textMuted}
                      value={senha}
                      onChangeText={(text) => {
                        setSenha(text);
                        if (mensagemErro) setMensagemErro(null);
                      }}
                      secureTextEntry={!showSenha}
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => confirmarSenhaInputRef.current?.focus()}
                      blurOnSubmit={false}
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

                {/* Campo Confirmação de Senha */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirmar Senha</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={20}
                      color={AppTheme.colors.textSecondary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      ref={confirmarSenhaInputRef}
                      style={styles.input}
                      placeholder="Digite a mesma senha novamente"
                      placeholderTextColor={AppTheme.colors.textMuted}
                      value={confirmarSenha}
                      onChangeText={(text) => {
                        setConfirmarSenha(text);
                        if (mensagemErro) setMensagemErro(null);
                      }}
                      secureTextEntry={!showConfirmarSenha}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleCadastro}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityLabel={showConfirmarSenha ? 'Ocultar confirmação' : 'Ver confirmação'}
                    >
                      <Ionicons
                        name={showConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={AppTheme.colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Botão de Cadastro */}
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                  onPress={handleCadastro}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Text style={styles.primaryButtonText}>Criar minha conta</Text>
                      <Ionicons name="heart" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
                    </View>
                  )}
                </TouchableOpacity>

                {/* Divisor */}
                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>ou</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Link para Login */}
                <View style={styles.footerLinkRow}>
                  <Text style={styles.footerLinkPreText}>Já tem uma conta? </Text>
                  <TouchableOpacity
                    onPress={() => router.replace('/login')}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.footerLinkHighlight}>Fazer login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.borderSubtle,
    ...AppTheme.shadows.card,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: AppTheme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
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
    marginBottom: 16,
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
    marginTop: 10,
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
    marginVertical: 18,
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
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppTheme.colors.successBg,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppTheme.colors.success,
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    fontSize: 14,
    color: AppTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emailHighlight: {
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
});
