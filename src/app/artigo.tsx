import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import RenderHtml from 'react-native-render-html';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { AppTheme } from '../constants/theme';
import { supabase } from '../supabaseClient';
import { Artigo } from '../types';
import { normalizarArtigo } from '../utils/artigos';

export default function LerArtigo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();

  const [artigo, setArtigo] = useState<Artigo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarArtigoUnico = useCallback(async () => {
    if (!id) {
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);

      const { data, error } = await supabase
        .from('artigos')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setArtigo(normalizarArtigo(data));
      } else {
        setArtigo(null);
      }
    } catch (err: any) {
      setErro(err?.message || 'Não foi possível carregar os detalhes do artigo.');
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    buscarArtigoUnico();
  }, [buscarArtigoUnico]);

  // 1. Estado de Carregamento
  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'left', 'right', 'bottom']}>
        <LoadingIndicator message="Carregando artigo..." />
      </SafeAreaView>
    );
  }

  // 2. Estado de Erro
  if (erro) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'left', 'right', 'bottom']}>
        <ErrorState
          message={erro}
          onRetry={buscarArtigoUnico}
        />
      </SafeAreaView>
    );
  }

  // 3. Estado Vazio / Não Encontrado
  if (!artigo) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'left', 'right', 'bottom']}>
        <EmptyState
          icon="document-text-outline"
          title="Artigo não encontrado"
          message="O artigo que você está procurando pode ter sido removido ou está temporariamente indisponível."
          actionText="Voltar para o Início"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  // 4. Renderização do Artigo
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={20} color={AppTheme.colors.text} />
        </TouchableOpacity>

        <View style={styles.categoriaBadge}>
          <Text style={styles.categoriaTag}>{artigo.categoria || 'Saúde & Bem-estar'}</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(30, insets.bottom + 24) },
        ]}
      >
        <View style={styles.contentCard}>
          <Text style={styles.titulo}>{artigo.titulo}</Text>

          {artigo.resumo ? <Text style={styles.resumo}>{artigo.resumo}</Text> : null}

          <View style={styles.metaRow}>
            {artigo.data ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={AppTheme.colors.textSecondary}
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.metaText}>{artigo.data}</Text>
              </View>
            ) : null}

            {artigo.tempo_leitura ? (
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={AppTheme.colors.textSecondary}
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.metaText} numberOfLines={1}>{artigo.tempo_leitura}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.linhaDivisoria} />

          {artigo.conteudo ? (
            <RenderHtml
              contentWidth={Math.min(width - 40, 680)}
              source={{ html: artigo.conteudo }}
              tagsStyles={{
                p: { fontSize: 16, lineHeight: 26, color: AppTheme.colors.text, marginBottom: 16 },
                strong: { color: AppTheme.colors.primary, fontWeight: '700' },
                em: { color: AppTheme.colors.lavender },
                h2: { fontSize: 20, fontWeight: '700', color: AppTheme.colors.text, marginTop: 22, marginBottom: 10 },
                h3: { fontSize: 17, fontWeight: '700', color: AppTheme.colors.primary, marginTop: 18, marginBottom: 8 },
                li: { fontSize: 15, lineHeight: 24, color: AppTheme.colors.text, marginBottom: 8 },
              }}
            />
          ) : (
            <Text style={styles.conteudoBreve}>
              Em breve disponibilizaremos mais detalhes e recomendações clínicas para este tema.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.card,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.borderSubtle,
  },
  categoriaBadge: {
    backgroundColor: AppTheme.colors.lavenderLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.pill,
  },
  categoriaTag: {
    fontSize: 12,
    fontWeight: '700',
    color: AppTheme.colors.lavender,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  contentCard: {
    backgroundColor: AppTheme.colors.card,
    borderRadius: AppTheme.radius.lg,
    padding: 22,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    ...AppTheme.shadows.card,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: AppTheme.colors.text,
    marginBottom: 10,
    lineHeight: 28,
  },
  resumo: {
    fontSize: 15,
    color: AppTheme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 14,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: AppTheme.colors.textSecondary,
  },
  linhaDivisoria: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginBottom: 20,
  },
  conteudoBreve: {
    fontSize: 15,
    color: AppTheme.colors.textSecondary,
    lineHeight: 24,
    marginTop: 8,
  },
});