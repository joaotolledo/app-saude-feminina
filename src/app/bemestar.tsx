import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BemEstar() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#B55A7D" />
          </TouchableOpacity>
          <Text style={styles.title}>Seu Bem-estar</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person" size={24} color="#4A708B" />
          </TouchableOpacity>
        </View>

        {/* BANNER PRINCIPAL */}
        <View style={styles.mainBanner}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Equilíbrio Diário</Text>
            <Text style={styles.bannerSubtitle}>Cuide da sua saúde mental{'\n'}com carinho e acolhimento.</Text>
          </View>
          <View style={styles.bannerIcon}>
            <Ionicons name="leaf" size={40} color="#B55A7D" />
          </View>
        </View>

        {/* TÍTULO DA SEÇÃO */}
        <Text style={styles.sectionTitle}>Foco no Autocuidado</Text>

        {/* GRADE DE CARDS (2x2) */}
        <View style={styles.gridContainer}>
          {/* Card 1 */}
          <TouchableOpacity style={[styles.card, { backgroundColor: '#FFF5F8' }]}>
            <Ionicons name="book" size={36} color="#B55A7D" style={styles.cardIcon} />
            <Text style={styles.cardTitlePink}>Diário de Humor</Text>
            <Text style={styles.cardSubtitle}>Registre como você{'\n'}se sente hoje</Text>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={[styles.card, { backgroundColor: '#F3EFFF' }]}>
            <Ionicons name="water" size={36} color="#8A72C1" style={styles.cardIcon} />
            <Text style={styles.cardTitlePurple}>Lidando com a TPM</Text>
            <Text style={styles.cardSubtitle}>Dicas para cólicas{'\n'}e irritabilidade</Text>
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity style={[styles.card, { backgroundColor: '#FFF5F8' }]}>
            <Ionicons name="moon" size={36} color="#B55A7D" style={styles.cardIcon} />
            <Text style={styles.cardTitlePink}>Sono Reparador</Text>
            <Text style={styles.cardSubtitle}>Rotinas para noites{'\n'}de descanso</Text>
          </TouchableOpacity>

          {/* Card 4 */}
          <TouchableOpacity style={[styles.card, { backgroundColor: '#F3EFFF' }]}>
            <Ionicons name="bicycle" size={36} color="#8A72C1" style={styles.cardIcon} />
            <Text style={styles.cardTitlePurple}>Momentos de Lazer</Text>
            <Text style={styles.cardSubtitle}>Priorize atividades{'\n'}que você gosta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* MENU INFERIOR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/')}>
          <Ionicons name="home" size={24} color="#A34A6A" />
          <Text style={styles.footerTextActive}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="folder" size={24} color="#888" />
          <Text style={styles.footerText}>Áreas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="bulb-outline" size={24} color="#D1B875" /> 
          <Text style={styles.footerText}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="heart" size={24} color="#ccc" /> 
          <Text style={styles.footerText}>Dicas</Text>
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
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, marginBottom: 20 },
  iconButton: { padding: 10, backgroundColor: '#FFFFFF', borderRadius: 50, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#B55A7D' },

  mainBanner: { backgroundColor: '#FFF0F5', marginHorizontal: 20, borderRadius: 25, padding: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
  bannerTextContainer: { flex: 1, paddingRight: 10 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#5C5257', marginBottom: 8 },
  bannerSubtitle: { fontSize: 13, color: '#666', lineHeight: 20 },
  bannerIcon: { width: 70, height: 70, backgroundColor: '#FFFFFF', borderRadius: 35, justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#B55A7D', paddingHorizontal: 20, marginBottom: 15 },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  card: { width: '48%', padding: 20, borderRadius: 25, marginBottom: 15, alignItems: 'flex-start' },
  cardIcon: { marginBottom: 15 },
  cardTitlePink: { fontSize: 14, fontWeight: 'bold', color: '#B55A7D', marginBottom: 5 },
  cardTitlePurple: { fontSize: 14, fontWeight: 'bold', color: '#8A72C1', marginBottom: 5 },
  cardSubtitle: { fontSize: 12, color: '#888', lineHeight: 16 },

  footer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', paddingVertical: 15, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10, position: 'absolute', bottom: 0, width: '100%' },
  footerItem: { alignItems: 'center' },
  footerText: { fontSize: 10, color: '#888', marginTop: 5 },
  footerTextActive: { fontSize: 10, fontWeight: 'bold', color: '#B55A7D', marginTop: 5 }
});