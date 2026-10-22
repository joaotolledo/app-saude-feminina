import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';

export default function CadastroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);
  const [sucessoConfirmacao, setSucessoConfirmacao] = useState(false);

  const validarFormulario = () => {
    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setMensagemErro('Por favor, preencha todos os campos.');
      return false;
    }

    if (nome.trim().length < 2) {
      setMensagemErro('Por favor, informe seu nome completo ou como gosta de ser chamada.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
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

  const traduzirErroSupabase = (erroOriginal: string) => {
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
    return erroOriginal;
  };

  const handleCadastro = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    setMensagemErro(null);

    try {
      // a) Chamar supabase.auth.signUp({ email, password })
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: {
          data: {
            nome: nome.trim(),
          },
        },
      });

      if (error) {
        setMensagemErro(traduzirErroSupabase(error.message));
        return;
      }

      // b) Caso o cadastro no Auth tenha sucesso e retorne o user.id, faça um insert na tabela public.usuarios
      if (data?.user?.id) {
        const { error: dbError } = await supabase.from('usuarios').insert([
          {
            id: data.user.id,
            nome: nome.trim(),
          },
        ]);

        if (dbError) {
          console.warn('[Cadastro] Aviso ao inserir na tabela usuarios:', dbError.message);
        }
      }

      // Se houver sessão ativa imediatamente (confirmação por e-mail desativada)
      if (data?.session) {
        router.replace('/');
      } else {
        // Se o Supabase exigir confirmação por e-mail
        setSucessoConfirmacao(true);
      }
    } catch (err: any) {
      setMensagemErro('Ocorreu um erro ao criar sua conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
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
            >
              <Ionicons name="arrow-back" size={22} color="#5C5257" />
            </TouchableOpacity>
          </View>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="heart" size={32} color="#B55A7D" />
            </View>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>
              Comece agora sua jornada de autoconhecimento e cuidado com o seu ciclo.
            </Text>
          </View>

          {/* Estado de Sucesso de Confirmação (quando o Supabase exige confirmação) */}
          {sucessoConfirmacao ? (
            <View style={styles.card}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-done" size={36} color="#2E7D32" />
              </View>
              <Text style={styles.successTitle}>Conta criada com sucesso! 🌸</Text>
              <Text style={styles.successText}>
                Enviamos um link de confirmação para o seu e-mail{' '}
                <Text style={{ fontWeight: '700', color: '#4A3E44' }}>{email}</Text>. Acesse sua caixa
                de entrada para ativar seu cadastro e depois faça login.
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
                  <Ionicons name="alert-circle" size={20} color="#D32F2F" style={{ marginRight: 8 }} />
                  <Text style={styles.errorText}>{mensagemErro}</Text>
                </View>
              )}

              {/* Campo Nome */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nome</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color="#8E7E86" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Seu nome ou como prefere ser chamada"
                    placeholderTextColor="#B0A4A8"
                    value={nome}
                    onChangeText={(text) => {
                      setNome(text);
                      if (mensagemErro) setMensagemErro(null);
                    }}
                    autoCapitalize="words"
                  />
                </View>
              </View>

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
                    placeholder="Mínimo de 6 caracteres"
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

              {/* Campo Confirmação de Senha */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#8E7E86" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite a mesma senha novamente"
                    placeholderTextColor="#B0A4A8"
                    value={confirmarSenha}
                    onChangeText={(text) => {
                      setConfirmarSenha(text);
                      if (mensagemErro) setMensagemErro(null);
                    }}
                    secureTextEntry={!showConfirmarSenha}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmarSenha(!showConfirmarSenha)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#8E7E86"
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
                <TouchableOpacity onPress={() => router.replace('/login')} activeOpacity={0.7}>
                  <Text style={styles.footerLinkHighlight}>Fazer login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  topBar: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECDCE2',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FCE8EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
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
    marginBottom: 16,
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
    marginTop: 10,
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
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  successText: {
    fontSize: 14,
    color: '#5C5257',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});
