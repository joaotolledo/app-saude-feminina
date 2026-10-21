import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../supabaseClient';

// Artigos padrão caso o banco não retorne dados no momento
const ARTIGOS_PADRAO = [
  {
    id: 1,
    categoria: 'Ciclo Menstrual',
    titulo: 'Entendendo as 4 fases do seu ciclo menstrual',
    resumo: 'Aprenda como as oscilações hormonais influenciam sua energia, humor e disposição ao longo do mês.',
    data: '20 Out 2026',
    tempo_leitura: '4 min',
  },
  {
    id: 2,
    categoria: 'Bem-estar',
    titulo: 'Alimentos que ajudam a aliviar cólicas e TPM',
    resumo: 'Descubra nutrientes anti-inflamatórios essenciais que promovem conforto e equilíbrio no seu dia a dia.',
    data: '18 Out 2026',
    tempo_leitura: '3 min',
  },
  {
    id: 3,
    categoria: 'Saúde & Corpo',
    titulo: 'Dicas de autocuidado para os dias de menor energia',
    resumo: 'Pequenos hábitos diários de respiração, hidratação e pausas conscientes para revitalizar o corpo e a mente.',
    data: '15 Out 2026',
    tempo_leitura: '5 min',
  },
];

const HUMORES = [
  { id: 'otima', emoji: '🌸', nome: 'Ótima', cor: '#FCE8EE', mensagem: 'Que maravilhoso! Aproveite sua vitalidade hoje.' },
  { id: 'bem', emoji: '😊', nome: 'Bem', cor: '#E8F5E9', mensagem: 'Um ótimo dia para manter o foco e boas práticas.' },
  { id: 'tranquila', emoji: '😌', nome: 'Tranquila', cor: '#EDE7F6', mensagem: 'Dia sereno: momento perfeito para respirar e cuidar de si.' },
  { id: 'cansada', emoji: '🥱', nome: 'Cansada', cor: '#FFF3E0', mensagem: 'Respeite seu ritmo: descanse e mantenha-se hidratada.' },
  { id: 'sensivel', emoji: '😣', nome: 'Sensível', cor: '#FCE4EC', mensagem: 'Tudo bem não estar 100%. Seja gentil consigo mesma hoje.' },
];

export default function TelaInicial() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [artigos, setArtigos] = useState<any[]>([]);
  const [humorSelecionado, setHumorSelecionado] = useState<string>('otima');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Todos');

  useEffect(() => {
    const buscarArtigos = async () => {
      try {
        const { data, error } = await supabase
          .from('artigos')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          console.log('Utilizando artigos locais:', error.message);
          setArtigos(ARTIGOS_PADRAO);
          return;
        }

        if (data && data.length > 0) {
          setArtigos(data);
        } else {
          setArtigos(ARTIGOS_PADRAO);
        }
      } catch (err) {
        console.log('Utilizando artigos de demonstração');
        setArtigos(ARTIGOS_PADRAO);
      }
    };

    buscarArtigos();
  }, []);

  // Lista de artigos exibida de acordo com o filtro
  const artigosExibidos = (artigos.length > 0 ? artigos : ARTIGOS_PADRAO).filter(artigo => {
    if (categoriaAtiva === 'Todos') return true;
    return artigo.categoria?.toLowerCase() === categoriaAtiva.toLowerCase();
  });

  const humorAtualObj = HUMORES.find(h => h.id === humorSelecionado);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ============================================================ */}
        {/* CABEÇALHO ELEGANTE COM AVATAR E NOTIFICAÇÃO (Estilo Imagens 1 e 2) */}
        {/* ============================================================ */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarRing}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#B55A7D" />
              </View>
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Bem-vinda de volta</Text>
              <Text style={styles.userNameText}>Minha Saúde</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={22} color="#5C5257" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* ============================================================ */}
        {/* BANNER PRINCIPAL: SUA SAÚDE, NOSSA PRIORIDADE (Imagem 2) */}
        {/* ============================================================ */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTag}>
              <Ionicons name="sparkles" size={12} color="#B55A7D" style={{ marginRight: 4 }} />
              <Text style={styles.bannerTagText}>Cuidado Diário</Text>
            </View>

            <Text style={styles.bannerTitle}>Sua saúde,{'\n'}nossa prioridade.</Text>
            <Text style={styles.bannerSubtitle}>
              Acompanhe seu ciclo e cuide do seu corpo com amor.
            </Text>

            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => router.push('/calendario')}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerButtonText}>Ver Calendário</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.bannerImageWrapper}>
            <Image
              source={require('../../assets/images/ilustracao-banner.png')}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ============================================================ */}
        {/* CHECK-IN DIÁRIO DE HUMOR (Daily Check-in - Imagem 2) */}
        {/* ============================================================ */}
        <View style={styles.checkInCard}>
          <View style={styles.sectionHeaderNoMargin}>
            <View>
              <Text style={styles.sectionTitle}>Check-in Diário</Text>
              <Text style={styles.sectionSubtitle}>Como você está se sentindo hoje?</Text>
            </View>
          </View>

          <View style={styles.humoresRow}>
            {HUMORES.map(item => {
              const ativo = humorSelecionado === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.humorItem}
                  onPress={() => setHumorSelecionado(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.humorEmojiCircle,
                      { backgroundColor: item.cor },
                      ativo && styles.humorEmojiCircleAtivo,
                    ]}
                  >
                    <Text style={styles.humorEmoji}>{item.emoji}</Text>
                  </View>
                  <Text style={[styles.humorNome, ativo && styles.humorNomeAtivo]}>
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {humorAtualObj && (
            <View style={styles.humorMensagemBox}>
              <Ionicons name="heart" size={14} color="#B55A7D" style={{ marginRight: 6 }} />
              <Text style={styles.humorMensagemText}>{humorAtualObj.mensagem}</Text>
            </View>
          )}
        </View>

        {/* ============================================================ */}
        {/* VISÃO GERAL / OVERVIEW (Cards Métricas - Imagem 1) */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visão Geral</Text>
            <TouchableOpacity
              style={styles.filterPillSmall}
              onPress={() => router.push('/calendario')}
            >
              <Text style={styles.filterPillSmallText}>Esta Semana</Text>
              <Ionicons name="chevron-forward" size={14} color="#B55A7D" />
            </TouchableOpacity>
          </View>

          <View style={styles.overviewGrid}>
            {/* Card 1: Dia do Ciclo */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#F8F1F4' }]}
              onPress={() => router.push('/calendario')}
              activeOpacity={0.8}
            >
              <View style={styles.overviewCardTop}>
                <Text style={styles.overviewNumber}>Dia 14</Text>
                <Ionicons name="pulse" size={20} color="#B55A7D" />
              </View>
              <Text style={styles.overviewLabel}>Período Fértil</Text>
              <View style={styles.overviewArrowRow}>
                <Text style={styles.overviewSubLabel}>Fase Ovulatória</Text>
                <Ionicons name="chevron-forward" size={16} color="#B55A7D" />
              </View>
            </TouchableOpacity>

            {/* Card 2: Próxima Menstruação */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#FFF5EE' }]}
              onPress={() => router.push('/calendario')}
              activeOpacity={0.8}
            >
              <View style={styles.overviewCardTop}>
                <Text style={styles.overviewNumber}>14 dias</Text>
                <Ionicons name="water-outline" size={20} color="#E07A5F" />
              </View>
              <Text style={styles.overviewLabel}>Próx. Período</Text>
              <View style={styles.overviewArrowRow}>
                <Text style={styles.overviewSubLabel}>Previsão normal</Text>
                <Ionicons name="chevron-forward" size={16} color="#E07A5F" />
              </View>
            </TouchableOpacity>

            {/* Card 3: Sintomas */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#F3EFFF' }]}
              onPress={() => router.push('/calendario')}
              activeOpacity={0.8}
            >
              <View style={styles.overviewCardTop}>
                <Text style={styles.overviewNumber}>Sintomas</Text>
                <Ionicons name="heart-outline" size={20} color="#8A72C1" />
              </View>
              <Text style={styles.overviewLabel}>Registro Diário</Text>
              <View style={styles.overviewArrowRow}>
                <Text style={styles.overviewSubLabel}>Ver no calendário</Text>
                <Ionicons name="chevron-forward" size={16} color="#8A72C1" />
              </View>
            </TouchableOpacity>

            {/* Card 4: Hidratação e Cuidados */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: '#F0F8FF' }]}
              onPress={() => router.push('/bemestar')}
              activeOpacity={0.8}
            >
              <View style={styles.overviewCardTop}>
                <Text style={styles.overviewNumber}>Água & Bem-estar</Text>
                <Ionicons name="leaf-outline" size={20} color="#4A90E2" />
              </View>
              <Text style={styles.overviewLabel}>Dica de Hoje</Text>
              <View style={styles.overviewArrowRow}>
                <Text style={styles.overviewSubLabel}>Alimentação & Sono</Text>
                <Ionicons name="chevron-forward" size={16} color="#4A90E2" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* RECURSOS ESSENCIAIS (Health Essentials - Imagem 2) */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos Essenciais</Text>
          <View style={styles.essentialsRow}>
            {/* Calendário */}
            <TouchableOpacity
              style={styles.essentialItem}
              onPress={() => router.push('/calendario')}
              activeOpacity={0.7}
            >
              <View style={[styles.essentialIconCircle, { backgroundColor: '#FCE8EE' }]}>
                <Ionicons name="calendar" size={24} color="#B55A7D" />
              </View>
              <Text style={styles.essentialText}>Ciclo & Calendário</Text>
            </TouchableOpacity>

            {/* Saúde e Corpo */}
            <TouchableOpacity
              style={styles.essentialItem}
              onPress={() => router.push('/saude')}
              activeOpacity={0.7}
            >
              <View style={[styles.essentialIconCircle, { backgroundColor: '#F3EFFF' }]}>
                <Ionicons name="body" size={24} color="#8A72C1" />
              </View>
              <Text style={styles.essentialText}>Saúde do Corpo</Text>
            </TouchableOpacity>

            {/* Bem-estar */}
            <TouchableOpacity
              style={styles.essentialItem}
              onPress={() => router.push('/bemestar')}
              activeOpacity={0.7}
            >
              <View style={[styles.essentialIconCircle, { backgroundColor: '#FFF5EE' }]}>
                <Ionicons name="heart" size={24} color="#E07A5F" />
              </View>
              <Text style={styles.essentialText}>Bem-estar</Text>
            </TouchableOpacity>

            {/* Dúvidas / Apoio */}
            <TouchableOpacity
              style={styles.essentialItem}
              onPress={() => router.push('/saude')}
              activeOpacity={0.7}
            >
              <View style={[styles.essentialIconCircle, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="help-buoy" size={24} color="#529B6B" />
              </View>
              <Text style={styles.essentialText}>Dúvidas & Apoio</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ============================================================ */}
        {/* ARTIGOS E DICAS COM FILTRO PILLS (Estilo Imagem 1) */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Artigos e Cuidados</Text>
          </View>

          {/* Filtros em Pílula (Estilo Imagem 1) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillsContainer}
          >
            {['Todos', 'Ciclo Menstrual', 'Bem-estar', 'Saúde & Corpo'].map(cat => {
              const ativo = categoriaAtiva === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pillButton, ativo && styles.pillButtonAtivo]}
                  onPress={() => setCategoriaAtiva(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.pillText, ativo && styles.pillTextAtivo]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Lista de Artigos em Cards Estilizados */}
          <View style={styles.artigosList}>
            {artigosExibidos.map(artigo => (
              <TouchableOpacity
                key={artigo.id}
                style={styles.artigoCardModerno}
                onPress={() => router.push({ pathname: '/artigo', params: { id: artigo.id } })}
                activeOpacity={0.8}
              >
                <View style={styles.artigoHeaderRow}>
                  <View style={styles.artigoDateBadge}>
                    <Ionicons name="calendar-outline" size={13} color="#B55A7D" style={{ marginRight: 4 }} />
                    <Text style={styles.artigoDateText}>{artigo.data || 'Artigo Recomendado'}</Text>
                  </View>
                  <View style={styles.artigoCategoryBadge}>
                    <Text style={styles.artigoCategoryText}>{artigo.categoria || 'Geral'}</Text>
                  </View>
                </View>

                <Text style={styles.artigoTituloModerno}>{artigo.titulo}</Text>
                <Text style={styles.artigoResumoModerno} numberOfLines={2}>
                  {artigo.resumo}
                </Text>

                <View style={styles.artigoFooterRow}>
                  <View style={styles.artigoTempo}>
                    <Ionicons name="time-outline" size={14} color="#888" style={{ marginRight: 4 }} />
                    <Text style={styles.artigoTempoText}>{artigo.tempo_leitura || '3 min'}</Text>
                  </View>

                  <View style={styles.artigoLerMais}>
                    <Text style={styles.artigoLerMaisText}>Ler artigo completo</Text>
                    <Ionicons name="arrow-forward" size={14} color="#B55A7D" style={{ marginLeft: 4 }} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ============================================================ */}
      {/* BARRA DE NAVEGAÇÃO INFERIOR FLUTUANTE (Estilo Imagens 1 e 2) */}
      {/* ============================================================ */}
      <View style={styles.floatingNavContainer}>
        <View style={styles.floatingNav}>
          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Ionicons name="home" size={22} color="#B55A7D" />
            <Text style={styles.navTextAtivo}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/calendario')}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={22} color="#888888" />
            <Text style={styles.navText}>Ciclo</Text>
          </TouchableOpacity>

          {/* Botão Central de Destaque */}
          <TouchableOpacity
            style={styles.navCenterButton}
            onPress={() => router.push('/calendario')}
            activeOpacity={0.85}
          >
            <Ionicons name="heart" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/saude')}
            activeOpacity={0.7}
          >
            <Ionicons name="body-outline" size={22} color="#888888" />
            <Text style={styles.navText}>Saúde</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/bemestar')}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles-outline" size={22} color="#888888" />
            <Text style={styles.navText}>Bem-estar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Cabeçalho
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FADEE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A3E44',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B55A7D',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // Banner Principal
  bannerCard: {
    backgroundColor: '#FADEE5',
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 26,
    paddingLeft: 22,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 180,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  bannerContent: {
    flex: 1,
    paddingRight: 6,
  },
  bannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bannerTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B55A7D',
  },
  bannerTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#4A3E44',
    lineHeight: 27,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 14,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B55A7D',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bannerImageWrapper: {
    width: 125,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },

  // Check-in Diário de Humor (Imagem 2)
  checkInCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    padding: 18,
    elevation: 2,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  sectionHeaderNoMargin: {
    marginBottom: 14,
  },
  humoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  humorItem: {
    alignItems: 'center',
    width: '18%',
  },
  humorEmojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  humorEmojiCircleAtivo: {
    borderWidth: 2,
    borderColor: '#B55A7D',
    transform: [{ scale: 1.06 }],
  },
  humorEmoji: {
    fontSize: 22,
  },
  humorNome: {
    fontSize: 11,
    color: '#777777',
    fontWeight: '500',
  },
  humorNomeAtivo: {
    color: '#B55A7D',
    fontWeight: 'bold',
  },
  humorMensagemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  humorMensagemText: {
    flex: 1,
    fontSize: 12,
    color: '#5C5257',
    fontWeight: '500',
  },

  // Seções Gerais
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A3E44',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  filterPillSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3DCE4',
  },
  filterPillSmallText: {
    fontSize: 12,
    color: '#B55A7D',
    fontWeight: '600',
    marginRight: 2,
  },

  // Visão Geral (Overview 2x2 - Imagem 1)
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  overviewCard: {
    width: '48%',
    borderRadius: 22,
    padding: 16,
    minHeight: 110,
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  overviewCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewNumber: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#4A3E44',
  },
  overviewLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A3E44',
    marginTop: 4,
  },
  overviewArrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  overviewSubLabel: {
    fontSize: 11,
    color: '#777777',
  },

  // Recursos Essenciais (Imagem 2)
  essentialsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  essentialItem: {
    width: '23%',
    alignItems: 'center',
  },
  essentialIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  essentialText: {
    fontSize: 11,
    color: '#5C5257',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
  },

  // Filtros Pílula (Imagem 1)
  pillsContainer: {
    flexDirection: 'row',
    paddingVertical: 6,
    gap: 8,
    marginBottom: 14,
  },
  pillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3DCE4',
  },
  pillButtonAtivo: {
    backgroundColor: '#4A3E44',
    borderColor: '#4A3E44',
  },
  pillText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },
  pillTextAtivo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Cards Modernos de Artigos (Estilo Imagens 1 e 2)
  artigosList: {
    gap: 14,
  },
  artigoCardModerno: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    elevation: 2,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#FAF0F3',
  },
  artigoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  artigoDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  artigoDateText: {
    fontSize: 11,
    color: '#B55A7D',
    fontWeight: '600',
  },
  artigoCategoryBadge: {
    backgroundColor: '#F3EFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  artigoCategoryText: {
    fontSize: 10,
    color: '#8A72C1',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  artigoTituloModerno: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4A3E44',
    lineHeight: 22,
    marginBottom: 6,
  },
  artigoResumoModerno: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 14,
  },
  artigoFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8EFF2',
    paddingTop: 12,
  },
  artigoTempo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artigoTempoText: {
    fontSize: 12,
    color: '#888888',
  },
  artigoLerMais: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  artigoLerMaisText: {
    fontSize: 13,
    color: '#B55A7D',
    fontWeight: 'bold',
  },

  // Barra Flutuante de Navegação (Floating Dock - Imagens 1 e 2)
  floatingNavContainer: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  floatingNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  navText: {
    fontSize: 10,
    color: '#888888',
    marginTop: 3,
    fontWeight: '500',
  },
  navTextAtivo: {
    fontSize: 10,
    color: '#B55A7D',
    marginTop: 3,
    fontWeight: 'bold',
  },
  navCenterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#B55A7D',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
    elevation: 5,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});