import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { supabase } from '../supabaseClient';

export default function LerArtigo() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [artigo, setArtigo] = useState<any>(null);

  useEffect(() => {
    const buscarArtigoUnico = async () => {
      const { data, error } = await supabase
        .from('artigos')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setArtigo(data);
    };
    
    if (id) buscarArtigoUnico();
  }, [id]);

  if (!artigo) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#B55A7D" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#B55A7D" />
        </TouchableOpacity>
        <Text style={styles.categoriaTag}>{artigo.categoria}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.titulo}>{artigo.titulo}</Text>
          <Text style={styles.resumo}>{artigo.resumo}</Text>
          
          <View style={styles.linhaDivisoria} />

          <RenderHtml
            contentWidth={width - 40}
            source={{ html: artigo.conteudo }}
            tagsStyles={{
              p: { fontSize: 16, lineHeight: 26, color: '#444', marginBottom: 15 },
              strong: { color: '#B55A7D' },
              em: { color: '#8A72C1' }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backButton: { padding: 10, backgroundColor: '#FFF5F8', borderRadius: 50 },
  categoriaTag: { fontSize: 14, fontWeight: 'bold', color: '#8A72C1', textTransform: 'uppercase' },
  
  content: { padding: 20, paddingBottom: 50 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#5C5257', marginBottom: 10 },
  resumo: { fontSize: 16, color: '#888', fontStyle: 'italic', marginBottom: 20, lineHeight: 24 },
  linhaDivisoria: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 25 }
});