import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RenderHtml from 'react-native-render-html';
import { supabase } from '../supabaseClient';

export default function LerArtigo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [artigo, setArtigo] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let mounted = true;
    const buscarArtigoUnico = async () => {
      try {
        const { data, error } = await supabase
          .from('artigos')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (mounted && data) {
          setArtigo(data);
        }
      } catch (err) {
        console.warn('Erro ao carregar artigo:', err);
      } finally {
        if (mounted) setCarregando(false);
      }
    };

    if (id) {
      buscarArtigoUnico();
    } else {
      setCarregando(false);
    }

    return () => {
      mounted = false;
    };
  }, [id]);

  if (carregando) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'left', 'right', 'bottom']}>
        <ActivityIndicator size="large" color="#B55A7D" />
        <Text style={styles.loadingText}>Carregando artigo...</Text>
      </SafeAreaView>
    );
  }

  if (!artigo) {
    return (
      <SafeAreaView style={[styles.container, styles.center]} edges={['top', 'left', 'right', 'bottom']}>
        <Ionicons name="document-text-outline" size={48} color="#B55A7D" />
        <Text style={styles.notFoundTitle}>Artigo não encontrado</Text>
        <TouchableOpacity
          style={styles.backButtonSimple}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>Voltar para o início</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={20} color="#5C5257" />
        </TouchableOpacity>
        <View style={styles.categoriaBadge}>
          <Text style={styles.categoriaTag}>{artigo.categoria || 'Saúde'}</Text>
        </View>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(30, insets.bottom + 20) },
        ]}
      >
        <View style={styles.content}>
          <Text style={styles.titulo}>{artigo.titulo}</Text>

          {artigo.resumo && <Text style={styles.resumo}>{artigo.resumo}</Text>}

          <View style={styles.metaRow}>
            {artigo.data && (
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={13} color="#8E7E86" style={{ marginRight: 4 }} />
                <Text style={styles.metaText}>{artigo.data}</Text>
              </View>
            )}
            {artigo.tempo_leitura && (
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={13} color="#8E7E86" style={{ marginRight: 4 }} />
                <Text style={styles.metaText}>{artigo.tempo_leitura}</Text>
              </View>
            )}
          </View>

          <View style={styles.linhaDivisoria} />

          {artigo.conteudo && (
            <RenderHtml
              contentWidth={Math.min(width - 40, 680)}
              source={{ html: artigo.conteudo }}
              tagsStyles={{
                p: { fontSize: 16, lineHeight: 26, color: '#4A3E44', marginBottom: 16 },
                strong: { color: '#B55A7D', fontWeight: '700' },
                em: { color: '#8A72C1' },
                h2: { fontSize: 20, fontWeight: '700', color: '#4A3E44', marginTop: 20, marginBottom: 10 },
                h3: { fontSize: 17, fontWeight: '700', color: '#B55A7D', marginTop: 16, marginBottom: 8 },
                li: { fontSize: 15, lineHeight: 24, color: '#4A3E44', marginBottom: 6 },
              }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8E7E86',
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3E44',
    marginTop: 12,
    marginBottom: 16,
  },
  backButtonSimple: {
    backgroundColor: '#B55A7D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E5EA',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECDCE2',
  },
  categoriaBadge: {
    backgroundColor: '#F3EFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  categoriaTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A72C1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3E5EA',
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A3E44',
    marginBottom: 10,
    lineHeight: 28,
  },
  resumo: {
    fontSize: 15,
    color: '#8E7E86',
    fontStyle: 'italic',
    marginBottom: 14,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#8E7E86',
  },
  linhaDivisoria: {
    height: 1,
    backgroundColor: '#F3E5EA',
    marginBottom: 20,
  },
});