import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SaudeECorpo() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* BOTÃO DE VOLTAR DISCRETO NO TOPO */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#8A72C1" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {/* TÍTULO E ILUSTRAÇÃO */}
        <View style={styles.header}>
          <View style={styles.iconPlaceholder}>
            <Ionicons name="body" size={60} color="#D1C4E9" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Saúde e Corpo</Text>
            <Text style={styles.subtitle}>Informações e{'\n'}cuidados com seu corpo</Text>
          </View>
        </View>

        {/* INFO DO CICLO */}
        <View style={styles.cycleInfo}>
          <Text style={styles.cycleDay}>Dia do ciclo: 14</Text>
          <Text style={styles.cycleDetails}>Próxima menstruação: 5 dias</Text>
          <Text style={styles.cycleDetails}>Janela fértil: Hoje</Text>
        </View>

        {/* INDICADORES HORMONAIS */}
        <View style={styles.hormoneContainer}>
          {/* Estrogênio */}
          <Text style={styles.hormoneName}>Estrogênio</Text>
          <View style={styles.hormoneRow}>
            <View style={[styles.valueBox, { backgroundColor: '#FF99FF' }]}>
              <Text style={[styles.valueText, { color: '#E000E0' }]}>65 pg/ml</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#66FF99' }]}>
              <Text style={[styles.statusText, { color: '#008000' }]}>Normal</Text>
            </View>
          </View>

          {/* Progesterona */}
          <Text style={styles.hormoneName}>Progesterona</Text>
          <View style={styles.hormoneRow}>
            <View style={[styles.valueBox, { backgroundColor: '#DBB4FF' }]}>
              <Text style={[styles.valueText, { color: '#8A2BE2' }]}>8 ng/ml</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#66FF99' }]}>
              <Text style={[styles.statusText, { color: '#008000' }]}>Normal</Text>
            </View>
          </View>

          {/* Lh */}
          <Text style={styles.hormoneName}>Lh (luteinizante)</Text>
          <View style={styles.hormoneRow}>
            <View style={[styles.valueBox, { backgroundColor: '#A3C2FF' }]}>
              <Text style={[styles.valueText, { color: '#0000CD' }]}>12 mlU/ml</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#FF9999' }]}>
              <Text style={[styles.statusText, { color: '#CC0000' }]}>Atenção</Text>
            </View>
          </View>

          {/* Fsh */}
          <Text style={styles.hormoneName}>Fsh(Folículo estimulante)</Text>
          <View style={styles.hormoneRow}>
            <View style={[styles.valueBox, { backgroundColor: '#FFD1A3' }]}>
              <Text style={[styles.valueText, { color: '#D2691E' }]}>8 mlU/ml</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#66FF99' }]}>
              <Text style={[styles.statusText, { color: '#008000' }]}>Normal</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* MENU INFERIOR */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => router.push('/')}>
          <Ionicons name="home" size={24} color="#A34A6A" />
          <Text style={styles.footerText}>Início</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="folder" size={24} color="#888" />
          <Text style={styles.footerText}>Áreas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="bulb-outline" size={24} color="#D1B875" /> 
          <Text style={styles.footerText}>Informação</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="heart-outline" size={24} color="#ccc" /> 
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
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15 },
  backText: { color: '#8A72C1', fontWeight: 'bold', marginLeft: 5, fontSize: 16 },
  
  header: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  iconPlaceholder: { width: 80, height: 100, backgroundColor: '#F3EFFF', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  headerTextContainer: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#8A72C1', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666' },

  cycleInfo: { paddingHorizontal: 20, marginBottom: 30 },
  cycleDay: { fontSize: 22, fontWeight: 'bold', color: '#5C5257', marginBottom: 10 },
  cycleDetails: { fontSize: 18, color: '#666', marginBottom: 5 },

  hormoneContainer: { paddingHorizontal: 20 },
  hormoneName: { fontSize: 18, fontWeight: 'bold', color: '#5C5257', marginBottom: 10 },
  hormoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  valueBox: { paddingVertical: 15, paddingHorizontal: 30, borderRadius: 15, marginRight: 15, minWidth: 160, alignItems: 'center' },
  valueText: { fontSize: 20, fontWeight: 'bold' },
  statusBadge: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  statusText: { fontSize: 14, fontWeight: 'bold' },

  footer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', paddingVertical: 15, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10, position: 'absolute', bottom: 0, width: '100%' },
  footerItem: { alignItems: 'center' },
  footerText: { fontSize: 10, color: '#A34A6A', marginTop: 5 }
});