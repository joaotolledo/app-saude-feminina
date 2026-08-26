import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Calendario() {
  const router = useRouter();
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#B55A7D" />
          </TouchableOpacity>
          <Text style={styles.title}>Calendário</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.monthSelector}>
          <Ionicons name="chevron-back" size={20} color="#888" />
          <Text style={styles.monthText}>Março 2026</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </View>

        <View style={styles.weekDays}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
            <Text key={dia} style={styles.weekDayText}>{dia}</Text>
          ))}
        </View>

        <View style={styles.calendarGrid}>
          {dias.map(dia => {
            const isPeriodo = dia >= 9 && dia <= 13;
            const isSelecionado = dia === 18;

            return (
              <View key={dia} style={styles.dayContainer}>
                <View style={[
                  styles.dayCircle,
                  isPeriodo && styles.periodoBg,
                  isSelecionado && styles.selecionadoBorder
                ]}>
                  <Text style={[
                    styles.dayText,
                    isPeriodo && styles.periodoText,
                    isSelecionado && styles.selecionadoText
                  ]}>
                    {dia}
                  </Text>
                </View>
                {isPeriodo && <Ionicons name="heart" size={10} color="#5C5257" style={{ marginTop: 2 }} />}
              </View>
            );
          })}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View>
              <Text style={styles.infoCardDate}>18 de Março</Text>
              <Text style={styles.infoCardSubtitle}>Fase Lútea • Dia 24 do Ciclo</Text>
            </View>
            <View style={styles.sparkleIcon}>
              <Ionicons name="sparkles" size={20} color="#D1B875" />
            </View>
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Adicionar Sintomas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15 },
  iconButton: { padding: 10, backgroundColor: '#FFFFFF', borderRadius: 50, elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#B55A7D' },
  
  monthSelector: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20, gap: 15 },
  monthText: { fontSize: 22, fontWeight: 'bold', color: '#5C5257' },
  
  weekDays: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10, marginBottom: 15 },
  weekDayText: { fontSize: 14, fontWeight: 'bold', color: '#999', width: '14%', textAlign: 'center' },
  
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, justifyContent: 'flex-start' },
  dayContainer: { width: '14.28%', alignItems: 'center', marginBottom: 15, height: 45 },
  dayCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: 16, color: '#5C5257' },
  
  periodoBg: { backgroundColor: '#FADEE5' },
  periodoText: { fontWeight: 'bold', color: '#B55A7D' },
  selecionadoBorder: { borderWidth: 1.5, borderColor: '#B55A7D' },
  selecionadoText: { fontWeight: 'bold', color: '#B55A7D' },

  infoCard: { backgroundColor: '#FFFFFF', margin: 20, borderRadius: 25, padding: 25, elevation: 2, marginTop: 10 },
  infoCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  infoCardDate: { fontSize: 20, fontWeight: 'bold', color: '#5C5257', marginBottom: 5 },
  infoCardSubtitle: { fontSize: 14, color: '#888' },
  sparkleIcon: { width: 45, height: 45, backgroundColor: '#FFF5F8', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  
  addButton: { backgroundColor: '#FADEE5', paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  addButtonText: { color: '#B55A7D', fontSize: 16, fontWeight: 'bold' }
});