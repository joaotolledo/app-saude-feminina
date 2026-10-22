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

export default function BemEstar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

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
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconButton}
            activeOpacity={0.7}
            accessibilityLabel="Voltar"
          >
            <Ionicons name="chevron-back" size={22} color="#B55A7D" />
          </TouchableOpacity>
          <Text style={styles.title}>Seu Bem-estar</Text>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => router.push('/')}
          >
            <Ionicons name="sparkles" size={20} color="#8A72C1" />
          </TouchableOpacity>
        </View>

        {/* BANNER PRINCIPAL */}
        <View style={styles.mainBanner}>
          <View style={styles.bannerTextContainer}>
            <View style={styles.bannerBadge}>
              <Ionicons name="heart" size={12} color="#B55A7D" style={{ marginRight: 4 }} />
              <Text style={styles.bannerBadgeText}>Harmonia</Text>
            </View>
            <Text style={styles.bannerTitle}>Equilíbrio Diário</Text>
            <Text style={styles.bannerSubtitle}>
              Cuide da sua saúde mental com carinho, pausas conscientes e acolhimento.
            </Text>
          </View>
          <View style={styles.bannerIcon}>
            <Ionicons name="leaf" size={36} color="#B55A7D" />
          </View>
        </View>

        {/* TÍTULO DA SEÇÃO */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Foco no Autocuidado</Text>
          <Text style={styles.sectionSubtitle}>Práticas recomendadas</Text>
        </View>

        {/* GRADE DE CARDS (2x2) */}
        <View style={[styles.gridContainer, isSmallScreen && { gap: 10 }]}>
          {/* Card 1 */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#FFF5F8' }]}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIconRing, { backgroundColor: '#FCE8EE' }]}>
              <Ionicons name="book" size={24} color="#B55A7D" />
            </View>
            <Text style={styles.cardTitlePink}>Diário de Humor</Text>
            <Text style={styles.cardSubtitle}>
              Registre como você se sente hoje
            </Text>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#F3EFFF' }]}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIconRing, { backgroundColor: '#E8DFF8' }]}>
              <Ionicons name="water" size={24} color="#8A72C1" />
            </View>
            <Text style={styles.cardTitlePurple}>Lidando com a TPM</Text>
            <Text style={styles.cardSubtitle}>
              Dicas para cólicas e alívio de tensão
            </Text>
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#FFF5F8' }]}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIconRing, { backgroundColor: '#FCE8EE' }]}>
              <Ionicons name="moon" size={24} color="#B55A7D" />
            </View>
            <Text style={styles.cardTitlePink}>Sono Reparador</Text>
            <Text style={styles.cardSubtitle}>
              Rotinas suaves para noites de descanso
            </Text>
          </TouchableOpacity>

          {/* Card 4 */}
          <TouchableOpacity
            style={[styles.card, { backgroundColor: '#F3EFFF' }]}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIconRing, { backgroundColor: '#E8DFF8' }]}>
              <Ionicons name="bicycle" size={24} color="#8A72C1" />
            </View>
            <Text style={styles.cardTitlePurple}>Momentos de Lazer</Text>
            <Text style={styles.cardSubtitle}>
              Priorize atividades que você ama
            </Text>
          </TouchableOpacity>
        </View>

        {/* CARD EXTRA: LEMBRETE DE HIDRATAÇÃO */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderIconCircle}>
            <Ionicons name="water-outline" size={24} color="#4A90E2" />
          </View>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Hidratação é Autocuidado</Text>
            <Text style={styles.reminderText}>
              Beba água ao longo do dia para manter sua pele radiante e diminuir a retenção de
              líquidos.
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

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push('/saude')}
            activeOpacity={0.7}
          >
            <Ionicons name="body-outline" size={22} color="#888888" />
            <Text style={styles.navText}>Saúde</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
            <Ionicons name="sparkles" size={22} color="#B55A7D" />
            <Text style={styles.navTextAtivo}>Bem-estar</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3E44',
  },
  mainBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3E5EA',
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE8EE',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B55A7D',
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3E44',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#8E7E86',
    lineHeight: 18,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#FCE8EE',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FADEE5',
  },
  sectionHeaderRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A3E44',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#8E7E86',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3E5EA',
    shadowColor: '#B55A7D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardIconRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitlePink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B55A7D',
    marginBottom: 4,
  },
  cardTitlePurple: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8A72C1',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#8E7E86',
    lineHeight: 16,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8ECFF',
    marginBottom: 20,
  },
  reminderIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2B6CB0',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 13,
    color: '#4A6572',
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