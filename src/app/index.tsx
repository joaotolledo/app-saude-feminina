
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { supabase } from '../supabaseClient';

export default function TelaInicial() {
  const router = useRouter();
  // 1. Preparamos o espaço para guardar os artigos e o tamanho da tela
  const [artigos, setArtigos] = useState<any[]>([]);
  const { width } = useWindowDimensions();

  // 2. O "Carteiro": busca os artigos no Supabase assim que a tela abre
  useEffect(() => {
    const buscarArtigos = async () => {
      const { data, error } = await supabase
        .from('artigos')
        .select('*')
        .order('id', { ascending: false }); // Traz os mais novos primeiro

      if (data) {
        setArtigos(data);
      }
    };

    buscarArtigos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>

        {/* BLOCO 1: O TOPO */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#A34A6A" />
          </TouchableOpacity>
          <Text style={styles.title}>Minha Saúde Feminina</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-outline" size={24} color="#A34A6A" />
          </TouchableOpacity>
        </View>

        {/* BLOCO 2: O BANNER */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Bem-vinda de volta!</Text>
            <Text style={styles.bannerSubtitle}>Como podemos ajudar você hoje?</Text>
          </View>
          <View style={styles.bannerImageContainer}>
            <Image
              source={require('../../assets/images/ilustracao-banner.png')}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* BLOCO 3: A GRADE DE CATEGORIAS */}
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#FFF5F8' }]}
            onPress={() => router.push('/calendario')}
          >
            <Ionicons name="calendar-outline" size={36} color="#B55A7D" />
            <Text style={styles.cardTitlePink}>Calendário</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#F3EFFF' }]}
            onPress={() => router.push('/saude')}
          >
            <Ionicons name="body-outline" size={36} color="#8A72C1" />
            <Text style={styles.cardTitlePurple}>Saúde e Corpo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#FFF5F8' }]}
            onPress={() => router.push('/bemestar')}
          >
            <Ionicons name="heart-outline" size={36} color="#B55A7D" />
            <Text style={styles.cardTitlePink}>Bem-estar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { backgroundColor: '#F3EFFF' }]}>
            <Ionicons name="help-circle-outline" size={36} color="#8A72C1" />
            <Text style={styles.cardTitlePurple}>Dúvidas</Text>
          </TouchableOpacity>
        </View>

        {/* BLOCO 4: OS ARTIGOS DO BANCO DE DADOS */}
    <View style={styles.artigosContainer}>
      <Text style={styles.artigosTitulo}>Últimos Artigos</Text>
      
      {artigos.map((artigo) => (
        <TouchableOpacity 
          key={artigo.id} 
          style={styles.artigoCard}
          onPress={() => router.push({ pathname: '/artigo', params: { id: artigo.id } })}
        >
          <Text style={styles.artigoCategoria}>{artigo.categoria}</Text>
          <Text style={styles.artigoNome}>{artigo.titulo}</Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 5 }}>{artigo.resumo}</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
            <Text style={{ color: '#B55A7D', fontWeight: 'bold', marginRight: 5 }}>Ler artigo completo</Text>
            <Ionicons name="arrow-forward" size={16} color="#B55A7D" />
          </View>
        </TouchableOpacity>
      ))}
    </View>

      </ScrollView>

      {/* BLOCO 5: BARRA DE NAVEGAÇÃO INFERIOR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="home" size={24} color="#B55A7D" />
          <Text style={styles.footerTextActive}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="folder-outline" size={24} color="#A34A6A" />
          <Text style={styles.footerText}>Áreas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="bulb-outline" size={24} color="#D1B875" />
          <Text style={styles.footerText}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#A34A6A" />
          <Text style={styles.footerText}>Dúvidas</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  scrollArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#B55A7D' },
  iconButton: { padding: 10, backgroundColor: '#FFFFFF', borderRadius: 50, elevation: 2 },

  banner: { backgroundColor: '#ECA9BA', marginHorizontal: 20, marginTop: 30, borderRadius: 25, paddingLeft: 25, paddingTop: 25, paddingBottom: 25, paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 170, overflow: 'hidden' },
  bannerText: { flex: 1, paddingRight: 10 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#5C5257', marginBottom: 10 },
  bannerSubtitle: { fontSize: 15, color: '#666666', lineHeight: 22 },
  bannerImageContainer: { width: 130, height: 170, justifyContent: 'flex-end' },
  bannerImage: { width: '100%', height: '100%' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 25 },
  card: { width: '47.5%', padding: 20, borderRadius: 25, marginBottom: 15, alignItems: 'center' },
  cardTitlePink: { fontSize: 16, fontWeight: 'bold', color: '#B55A7D', marginTop: 10 },
  cardTitlePurple: { fontSize: 16, fontWeight: 'bold', color: '#8A72C1', marginTop: 10 },

  // Estilos da lista de Artigos
  artigosContainer: { paddingHorizontal: 20, marginTop: 10, paddingBottom: 30 },
  artigosTitulo: { fontSize: 20, fontWeight: 'bold', color: '#5C5257', marginBottom: 15 },
  artigoCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 1 },
  artigoCategoria: { fontSize: 12, color: '#8A72C1', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
  artigoNome: { fontSize: 18, fontWeight: 'bold', color: '#B55A7D', marginBottom: 10 },

  footer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', paddingVertical: 15, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10 },
  footerItem: { alignItems: 'center' },
  footerText: { fontSize: 10, color: '#A34A6A', marginTop: 5 },
  footerTextActive: { fontSize: 10, fontWeight: 'bold', color: '#B55A7D', marginTop: 5 }
});