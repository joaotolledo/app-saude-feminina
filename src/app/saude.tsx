import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface HormonioItem {
  id: string;
  nome: string;
  subtitulo: string;
  valor: string;
  status: 'Normal' | 'Atenção';
  referencia: string;
  progresso: number; // 0 a 1
  corDestaque: string;
  explicacao: string;
}

const HORMONIOS: HormonioItem[] = [
  {
    id: 'estrogenio',
    nome: 'Estrogênio',
    subtitulo: 'Estradiol',
    valor: '65 pg/ml',
    status: 'Normal',
    referencia: 'Ref: 30 - 400 pg/ml',
    progresso: 0.45,
    corDestaque: '#B55A7D',
    explicacao: 'Promove vitalidade, disposição e hidratação da pele.',
  },
  {
    id: 'progesterona',
    nome: 'Progesterona',
    subtitulo: 'Fase Folicular/Lútea',
    valor: '8 ng/ml',
    status: 'Normal',
    referencia: 'Ref: 2 - 25 ng/ml',
    progresso: 0.38,
    corDestaque: '#8A72C1',
    explicacao: 'Começa a se elevar para promover sensação de relaxamento.',
  },
  {
    id: 'lh',
    nome: 'LH',
    subtitulo: 'Hormônio Luteinizante',
    valor: '12 mIU/ml',
    status: 'Atenção',
    referencia: 'Ref: 2 - 15 mIU/ml',
    progresso: 0.82,
    corDestaque: '#E07A5F',
    explicacao: 'Elevação típica que sinaliza a aproximação da ovulação.',
  },
  {
    id: 'fsh',
    nome: 'FSH',
    subtitulo: 'Folículo Estimulante',
    valor: '8 mIU/ml',
    status: 'Normal',
    referencia: 'Ref: 3 - 12 mIU/ml',
    progresso: 0.62,
    corDestaque: '#529B6B',
    explicacao: 'Auxilia na maturação folicular equilibrada.',
  },
];

export default function SaudeECorpo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Em telas muito estreitas (<360px), adapta os cards de métricas
  const isSmallScreen = width < 360;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(20, insets.bottom) + 90 },
        ]}
      >
        {/* BARRA SUPERIOR COM BOTÃO VOLTAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={22} color="#5C5257" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Saúde da Mulher</Text>
          <View style={styles.placeholderButton} />
        </View>

        {/* CABEÇALHO PRINCIPAL DA TELA */}
        <View style={styles.headerCard}>
          <View style={styles.headerIconRing}>
            <View style={styles.headerIconCircle}>
              <Ionicons name="body" size={32} color="#8A72C1" />
            </View>
          </View>
          <View style={styles.headerTextContainer}>
            <View style={styles.headerBadge}>
              <Ionicons name="sparkles" size={12} color="#8A72C1" style={{ marginRight: 4 }} />
              <Text style={styles.headerBadgeText}>Fisiologia & Ciclo</Text>
            </View>
            <Text style={styles.title}>Saúde e Corpo</Text>
            <Text style={styles.subtitle}>
              Compreenda seus sinais biológicos e cuide de você em cada fase.
            </Text>
          </View>
        </View>

        {/* CARDS RESUMO DO CICLO (GRID DE 3 CARDS) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Status do Ciclo</Text>
          <TouchableOpacity onPress={() => router.push('/calendario')} activeOpacity={0.7}>
            <Text style={styles.sectionLink}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.cycleCardsRow, isSmallScreen && styles.cycleCardsRowSmall]}>
          {/* Card 1: Dia do Ciclo */}
          <View style={[styles.cycleCard, { backgroundColor: '#F8F1F4' }]}>
            <View style={[styles.cycleCardIcon, { backgroundColor: '#FCE8EE' }]}>
              <Ionicons name="calendar" size={18} color="#B55A7D" />
            </View>
            <Text style={styles.cycleCardValue}>Dia 14</Text>
            <Text style={styles.cycleCardLabel}>Dia do ciclo</Text>
          </View>

          {/* Card 2: Próxima Menstruação */}
          <View style={[styles.cycleCard, { backgroundColor: '#FFF5EE' }]}>
            <View style={[styles.cycleCardIcon, { backgroundColor: '#FFEBDC' }]}>
              <Ionicons name="water" size={18} color="#E07A5F" />
            </View>
            <Text style={styles.cycleCardValue}>5 dias</Text>
            <Text style={styles.cycleCardLabel}>Próxima fase</Text>
          </View>

          {/* Card 3: Janela Fértil */}
          <View style={[styles.cycleCard, { backgroundColor: '#F3EFFF' }]}>
            <View style={[styles.cycleCardIcon, { backgroundColor: '#E8DFF8' }]}>
              <Ionicons name="heart" size={18} color="#8A72C1" />
            </View>
            <Text style={styles.cycleCardValue}>Hoje</Text>
            <Text style={styles.cycleCardLabel}>Janela fértil</Text>
          </View>
        </View>

        {/* SEÇÃO: INDICADORES HORMONAIS */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Indicadores Hormonais</Text>
          <View style={styles.infoPill}>
            <Ionicons name="information-circle-outline" size={13} color="#8E7E86" style={{ marginRight: 4 }} />
            <Text style={styles.infoPillText}>Fase Folicular</Text>
          </View>
        </View>

        <View style={styles.hormonesList}>
          {HORMONIOS.map((item) => {
            const isAtencao = item.status === 'Atenção';
            return (
              <View key={item.id} style={styles.hormoneCard}>
                {/* Linha superior: Nome + Status Badge */}
                <View style={styles.hormoneHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.hormoneTitle}>{item.nome}</Text>
                    <Text style={styles.hormoneSubtitle}>{item.subtitulo}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusChip,
                      isAtencao ? styles.statusChipWarning : styles.statusChipNormal,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: isAtencao ? '#D97706' : '#2E7D32' },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusChipText,
                        { color: isAtencao ? '#B45309' : '#1B5E20' },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Linha central: Valor numérico e Faixa de Referência */}
                <View style={styles.hormoneValueRow}>
                  <Text style={[styles.hormoneValueText, { color: item.corDestaque }]}>
                    {item.valor}
                  </Text>
                  <Text style={styles.hormoneRefText}>{item.referencia}</Text>
                </View>

                {/* Barra de Progresso do Nível Hormonal */}
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(100, Math.max(10, item.progresso * 100))}%`,
                        backgroundColor: item.corDestaque,
                      },
                    ]}
                  />
                </View>

                {/* Explicação clínica acolhedora */}
                <View style={styles.hormoneTipRow}>
                  <Ionicons name="sparkles-outline" size={14} color="#8E7E86" style={{ marginRight: 6 }} />
                  <Text style={styles.hormoneTipText}>{item.explicacao}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* CARD INFORMATIVO DE AUTOCUIDADO */}
        <View style={styles.tipCard}>
          <View style={styles.tipCardIconContainer}>
            <Ionicons name="bulb" size={24} color="#B55A7D" />
          </View>
          <View style={styles.tipCardContent}>
            <Text style={styles.tipCardTitle}>Dica de Bem-estar</Text>
            <Text style={styles.tipCardText}>
              Na fase de ovulação, sua disposição física atinge o ápice! Excelente momento para
              praticar exercícios e projetos que exigem foco criativo.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ============================================================ */}
      {/* BARRA DE NAVEGAÇÃO INFERIOR FLUTUANTE PADRONIZADA */}
      {/* ============================================================ */}
      <View
        style={[
          styles.floatingNavContainer,
          { bottom: Math.max(12, insets.bottom) },
        ]}
      >
        <View style={styles.floatingNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/')}
            activeOpacity={0.7}
          >
            <Ionicons name="home-outline" size={22} color="#888888" />
            <Text style={styles.navText}>Início</Text>
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

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Ionicons name="body" size={22} color="#B55A7D" />
            <Text style={styles.navTextAtivo}>Saúde</Text>
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
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A3E44',
  },
  placeholderButton: {
    width: 42,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#F3E5EA',
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  headerIconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E8DFF8',
  },
  headerIconCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  headerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A72C1',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A3E44',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E7E86',
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3E44',
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B55A7D',
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  infoPillText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E7E86',
  },
  cycleCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 24,
  },
  cycleCardsRowSmall: {
    flexWrap: 'wrap',
  },
  cycleCard: {
    flex: 1,
    minWidth: 90,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cycleCardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cycleCardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A3E44',
    marginBottom: 2,
  },
  cycleCardLabel: {
    fontSize: 11,
    color: '#8E7E86',
    textAlign: 'center',
  },
  hormonesList: {
    gap: 14,
    marginBottom: 20,
  },
  hormoneCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3E5EA',
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hormoneHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  hormoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A3E44',
  },
  hormoneSubtitle: {
    fontSize: 12,
    color: '#8E7E86',
    marginTop: 1,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusChipNormal: {
    backgroundColor: '#E8F5E9',
  },
  statusChipWarning: {
    backgroundColor: '#FFF3E0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  hormoneValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  hormoneValueText: {
    fontSize: 22,
    fontWeight: '700',
  },
  hormoneRefText: {
    fontSize: 12,
    color: '#9E8F96',
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#F5EDF1',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  hormoneTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5F7',
    padding: 8,
    borderRadius: 10,
  },
  hormoneTipText: {
    flex: 1,
    fontSize: 12,
    color: '#6E6167',
    lineHeight: 16,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FADEE5',
    marginBottom: 20,
  },
  tipCardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipCardContent: {
    flex: 1,
  },
  tipCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B55A7D',
    marginBottom: 4,
  },
  tipCardText: {
    fontSize: 13,
    color: '#6C5E64',
    lineHeight: 18,
  },

  // Barra Flutuante de Navegação
  floatingNavContainer: {
    position: 'absolute',
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
    borderWidth: 1,
    borderColor: '#F3E5EA',
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
    fontWeight: '700',
  },
  navCenterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#B55A7D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    marginTop: -16,
  },
});