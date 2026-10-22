import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FloatingBottomNav } from '../components/FloatingBottomNav';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const MESES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

interface SintomaOpcao {
  id: string;
  nome: string;
  icone: keyof typeof Ionicons.glyphMap;
}

const SINTOMAS_DISPONIVEIS: SintomaOpcao[] = [
  { id: 'colica', nome: 'Cólicas', icone: 'fitness-outline' },
  { id: 'dor_cabeca', nome: 'Dor de cabeça', icone: 'bandage-outline' },
  { id: 'inchaco', nome: 'Inchaço', icone: 'water-outline' },
  { id: 'cansaco', nome: 'Cansaço', icone: 'moon-outline' },
  { id: 'humor', nome: 'Humor sensível', icone: 'heart-dislike-outline' },
  { id: 'acne', nome: 'Acne', icone: 'sparkles-outline' },
  { id: 'seios', nome: 'Seios doloridos', icone: 'shield-checkmark-outline' },
  { id: 'ansiedade', nome: 'Ansiedade', icone: 'pulse-outline' },
  { id: 'fluxo_leve', nome: 'Fluxo leve', icone: 'water-outline' },
  { id: 'fluxo_medio', nome: 'Fluxo médio', icone: 'water' },
  { id: 'fluxo_intenso', nome: 'Fluxo intenso', icone: 'color-fill-outline' },
  { id: 'boa_disposicao', nome: 'Boa disposição', icone: 'sunny-outline' },
];

export default function Calendario() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Data atual do sistema
  const hoje = new Date();

  // Estado da data do calendário (inicializado com o dia atual)
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());
  const [diaSelecionado, setDiaSelecionado] = useState(hoje.getDate());

  // Estados dos modais
  const [modalMesAnoAberto, setModalMesAnoAberto] = useState(false);
  const [anoModal, setAnoModal] = useState(hoje.getFullYear());
  const [modalSintomasAberto, setModalSintomasAberto] = useState(false);

  // Estado para armazenar sintomas por data (chave: 'ANO-MES-DIA')
  const [registrosSintomas, setRegistrosSintomas] = useState<
    Record<string, { sintomas: string[]; nota?: string }>
  >({});

  // Sintomas temporários do modal de edição
  const [sintomasTemporarios, setSintomasTemporarios] = useState<string[]>([]);
  const [notaTemporaria, setNotaTemporaria] = useState('');

  // Cálculo da quantidade de dias e primeiro dia da semana (memoizado)
  const diasNoMes = useMemo(() => new Date(anoAtual, mesAtual + 1, 0).getDate(), [anoAtual, mesAtual]);
  const primeiroDiaSemana = useMemo(() => new Date(anoAtual, mesAtual, 1).getDay(), [anoAtual, mesAtual]);
  const dias = useMemo(() => Array.from({ length: diasNoMes }, (_, i) => i + 1), [diasNoMes]);

  // Chave da data atual selecionada
  const chaveDataSelecionada = `${anoAtual}-${mesAtual + 1}-${diaSelecionado}`;
  const registroAtual = registrosSintomas[chaveDataSelecionada];

  // Cálculo dinâmico das fases do ciclo (ciclo padrão de 28 dias)
  const calcularFaseCiclo = useCallback((dia: number, mes: number, ano: number) => {
    // Referência alinhada: ciclo iniciando em 23/02/2026
    const dataReferencia = new Date(2026, 1, 23);
    const dataAlvo = new Date(ano, mes, dia);
    const diffTime = dataAlvo.getTime() - dataReferencia.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diaCiclo = (((diffDays % 28) + 28) % 28) + 1;

    if (diaCiclo >= 1 && diaCiclo <= 5) {
      return {
        fase: 'Menstruação',
        diaCiclo: `Dia ${diaCiclo} do Ciclo`,
        isPeriodo: true,
        icone: 'water' as const,
        corIcone: '#B55A7D',
      };
    } else if (diaCiclo >= 6 && diaCiclo <= 11) {
      return {
        fase: 'Fase Folicular',
        diaCiclo: `Dia ${diaCiclo} do Ciclo`,
        isPeriodo: false,
        icone: 'leaf-outline' as const,
        corIcone: '#8A72C1',
      };
    } else if (diaCiclo >= 12 && diaCiclo <= 16) {
      return {
        fase: 'Período Fértil',
        diaCiclo: `Dia ${diaCiclo} do Ciclo`,
        isPeriodo: false,
        icone: 'sparkles' as const,
        corIcone: '#D1B875',
      };
    } else {
      return {
        fase: 'Fase Lútea',
        diaCiclo: `Dia ${diaCiclo} do Ciclo`,
        isPeriodo: false,
        icone: 'sparkles' as const,
        corIcone: '#D1B875',
      };
    }
  }, []);

  const faseSelecionada = useMemo(
    () => calcularFaseCiclo(diaSelecionado, mesAtual, anoAtual),
    [calcularFaseCiclo, diaSelecionado, mesAtual, anoAtual]
  );

  // Navegação de meses
  const voltarMes = useCallback(() => {
    let novoMes = mesAtual - 1;
    let novoAno = anoAtual;
    if (novoMes < 0) {
      novoMes = 11;
      novoAno -= 1;
    }
    const maxDias = new Date(novoAno, novoMes + 1, 0).getDate();
    setMesAtual(novoMes);
    setAnoAtual(novoAno);
    if (diaSelecionado > maxDias) {
      setDiaSelecionado(maxDias);
    }
  }, [mesAtual, anoAtual, diaSelecionado]);

  const avancarMes = useCallback(() => {
    let novoMes = mesAtual + 1;
    let novoAno = anoAtual;
    if (novoMes > 11) {
      novoMes = 0;
      novoAno += 1;
    }
    const maxDias = new Date(novoAno, novoMes + 1, 0).getDate();
    setMesAtual(novoMes);
    setAnoAtual(novoAno);
    if (diaSelecionado > maxDias) {
      setDiaSelecionado(maxDias);
    }
  }, [mesAtual, anoAtual, diaSelecionado]);

  const selecionarMesAno = useCallback((mesIndex: number, ano: number) => {
    setMesAtual(mesIndex);
    setAnoAtual(ano);
    const maxDias = new Date(ano, mesIndex + 1, 0).getDate();
    if (diaSelecionado > maxDias) {
      setDiaSelecionado(maxDias);
    }
    setModalMesAnoAberto(false);
  }, [diaSelecionado]);

  // Funções de Sintomas
  const abrirModalSintomas = useCallback(() => {
    if (registroAtual) {
      setSintomasTemporarios([...registroAtual.sintomas]);
      setNotaTemporaria(registroAtual.nota || '');
    } else {
      setSintomasTemporarios([]);
      setNotaTemporaria('');
    }
    setModalSintomasAberto(true);
  }, [registroAtual]);

  const toggleSintoma = useCallback((nome: string) => {
    setSintomasTemporarios(prev =>
      prev.includes(nome) ? prev.filter(s => s !== nome) : [...prev, nome]
    );
  }, []);

  const salvarSintomas = useCallback(() => {
    Keyboard.dismiss();
    if (sintomasTemporarios.length === 0 && !notaTemporaria.trim()) {
      setRegistrosSintomas(prev => {
        const copia = { ...prev };
        delete copia[chaveDataSelecionada];
        return copia;
      });
    } else {
      setRegistrosSintomas(prev => ({
        ...prev,
        [chaveDataSelecionada]: {
          sintomas: sintomasTemporarios,
          nota: notaTemporaria.trim() || undefined,
        },
      }));
    }
    setModalSintomasAberto(false);
  }, [chaveDataSelecionada, notaTemporaria, sintomasTemporarios]);

  const removerSintoma = useCallback((nome: string) => {
    if (!registroAtual) return;
    const novosSintomas = registroAtual.sintomas.filter(s => s !== nome);
    if (novosSintomas.length === 0 && !registroAtual.nota) {
      setRegistrosSintomas(prev => {
        const copia = { ...prev };
        delete copia[chaveDataSelecionada];
        return copia;
      });
    } else {
      setRegistrosSintomas(prev => ({
        ...prev,
        [chaveDataSelecionada]: {
          ...registroAtual,
          sintomas: novosSintomas,
        },
      }));
    }
  }, [chaveDataSelecionada, registroAtual]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(20, insets.bottom) + 90 }}
      >

        {/* CABEÇALHO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color="#B55A7D" />
          </TouchableOpacity>
          <Text style={styles.title}>Calendário</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* SELETOR DE MÊS E ANO */}
        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={voltarMes}
            style={styles.chevronButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={22} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setAnoModal(anoAtual);
              setModalMesAnoAberto(true);
            }}
            style={styles.monthTitleButton}
            activeOpacity={0.7}
          >
            <Text style={styles.monthText}>{MESES[mesAtual]} {anoAtual}</Text>
            <Ionicons name="chevron-down" size={16} color="#888" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={avancarMes}
            style={styles.chevronButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-forward" size={22} color="#888" />
          </TouchableOpacity>
        </View>

        {/* DIAS DA SEMANA */}
        <View style={styles.weekDays}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
            <Text key={dia} style={styles.weekDayText}>{dia}</Text>
          ))}
        </View>

        {/* GRADE DO CALENDÁRIO */}
        <View style={styles.calendarGrid}>
          {/* Espaços em branco antes do 1º dia */}
          {Array.from({ length: primeiroDiaSemana }).map((_, i) => (
            <View key={`vazio-${i}`} style={styles.dayContainer} />
          ))}

          {/* Dias do mês */}
          {dias.map(dia => {
            const { isPeriodo } = calcularFaseCiclo(dia, mesAtual, anoAtual);
            const isSelecionado = dia === diaSelecionado;
            const chaveDia = `${anoAtual}-${mesAtual + 1}-${dia}`;
            const temSintomas = registrosSintomas[chaveDia]?.sintomas?.length > 0;

            return (
              <TouchableOpacity
                key={`dia-${dia}`}
                style={styles.dayContainer}
                onPress={() => setDiaSelecionado(dia)}
                activeOpacity={0.7}
              >
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

                {/* Ícone de coração para o período menstrual */}
                {isPeriodo && (
                  <Ionicons name="heart" size={10} color="#5C5257" style={{ marginTop: 2 }} />
                )}

                {/* Indicador discreto para dias com sintomas anotados */}
                {!isPeriodo && temSintomas && (
                  <View style={styles.sintomaDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CARD DE INFORMAÇÕES E SINTOMAS (Linha 59) */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.infoCardDate}>
                {diaSelecionado} de {MESES[mesAtual]}
              </Text>
              <Text style={styles.infoCardSubtitle}>
                {faseSelecionada.fase} • {faseSelecionada.diaCiclo}
              </Text>
            </View>
            <View style={styles.sparkleIcon}>
              <Ionicons name={faseSelecionada.icone} size={20} color={faseSelecionada.corIcone} />
            </View>
          </View>

          {/* SINTOMAS REGISTRADOS NO DIA SELECIONADO */}
          {registroAtual && registroAtual.sintomas.length > 0 && (
            <View style={styles.sintomasSection}>
              <Text style={styles.sintomasSectionTitle}>Sintomas Registrados</Text>
              <View style={styles.sintomasList}>
                {registroAtual.sintomas.map(sintoma => (
                  <View key={sintoma} style={styles.sintomaBadge}>
                    <Text style={styles.sintomaBadgeText}>{sintoma}</Text>
                    <TouchableOpacity
                      onPress={() => removerSintoma(sintoma)}
                      style={styles.sintomaRemoveBtn}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons name="close-circle" size={16} color="#B55A7D" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* NOTA OU OBSERVAÇÃO DO DIA */}
          {registroAtual && registroAtual.nota ? (
            <View style={styles.notaCard}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#B55A7D" style={{ marginRight: 6, marginTop: 2 }} />
              <Text style={styles.notaCardText}>{registroAtual.nota}</Text>
            </View>
          ) : null}

          {/* ESTADO VAZIO INFORMATIVO QUANDO NÃO HÁ SINTOMAS */}
          {(!registroAtual || (registroAtual.sintomas.length === 0 && !registroAtual.nota)) && (
            <View style={styles.sintomasEmptyRow}>
              <Ionicons name="leaf-outline" size={16} color="#A09398" style={{ marginRight: 6 }} />
              <Text style={styles.sintomasEmptyText}>
                Nenhum sintoma ou observação registrada para este dia.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={abrirModalSintomas}
            activeOpacity={0.8}
          >
            <Text style={styles.addButtonText}>
              {registroAtual && (registroAtual.sintomas.length > 0 || registroAtual.nota)
                ? '+ Editar Sintomas'
                : '+ Adicionar Sintomas'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MODAL DE SELEÇÃO DE MÊS E ANO */}
        <Modal
          visible={modalMesAnoAberto}
          transparent
          animationType="fade"
          onRequestClose={() => setModalMesAnoAberto(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalMesAnoAberto(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalMesAnoContent}>
                  {/* Navegação de Ano */}
                  <View style={styles.modalYearHeader}>
                    <TouchableOpacity
                      onPress={() => setAnoModal(a => a - 1)}
                      style={styles.modalYearArrow}
                    >
                      <Ionicons name="chevron-back" size={22} color="#B55A7D" />
                    </TouchableOpacity>
                    <Text style={styles.modalYearText}>{anoModal}</Text>
                    <TouchableOpacity
                      onPress={() => setAnoModal(a => a + 1)}
                      style={styles.modalYearArrow}
                    >
                      <Ionicons name="chevron-forward" size={22} color="#B55A7D" />
                    </TouchableOpacity>
                  </View>

                  {/* Grade de 12 Meses */}
                  <View style={styles.mesesGrid}>
                    {MESES_ABREV.map((mesNome, index) => {
                      const isMesAtivo = index === mesAtual && anoModal === anoAtual;
                      return (
                        <TouchableOpacity
                          key={mesNome}
                          style={[styles.mesItem, isMesAtivo && styles.mesItemAtivo]}
                          onPress={() => selecionarMesAno(index, anoModal)}
                        >
                          <Text style={[styles.mesItemText, isMesAtivo && styles.mesItemTextAtivo]}>
                            {mesNome}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TouchableOpacity
                    style={styles.modalFecharButton}
                    onPress={() => setModalMesAnoAberto(false)}
                  >
                    <Text style={styles.modalFecharButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* MODAL DE ADICIONAR / EDITAR SINTOMAS */}
        <Modal
          visible={modalSintomasAberto}
          transparent
          animationType="slide"
          onRequestClose={() => setModalSintomasAberto(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalBottomOverlay}
          >
            <TouchableWithoutFeedback onPress={() => setModalSintomasAberto(false)}>
              <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>

            <View style={styles.modalSintomasContent}>
              <View style={styles.modalSintomasHeader}>
                <View>
                  <Text style={styles.modalSintomasTitle}>Registrar Sintomas</Text>
                  <Text style={styles.modalSintomasSubtitle}>
                    {diaSelecionado} de {MESES[mesAtual]} de {anoAtual}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setModalSintomasAberto(false)}
                  style={styles.modalCloseIcon}
                >
                  <Ionicons name="close" size={22} color="#5C5257" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
                <Text style={styles.modalSectionLabel}>Selecione os sintomas do dia:</Text>
                <View style={styles.modalChipsGrid}>
                  {SINTOMAS_DISPONIVEIS.map(s => {
                    const selecionado = sintomasTemporarios.includes(s.nome);
                    return (
                      <TouchableOpacity
                        key={s.id}
                        onPress={() => toggleSintoma(s.nome)}
                        style={[
                          styles.sintomaChipOpcao,
                          selecionado && styles.sintomaChipOpcaoAtivo,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={s.icone}
                          size={16}
                          color={selecionado ? '#B55A7D' : '#888'}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.sintomaChipOpcaoText,
                            selecionado && styles.sintomaChipOpcaoTextAtivo,
                          ]}
                        >
                          {s.nome}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={[styles.modalSectionLabel, { marginTop: 18 }]}>
                  Observação ou nota do dia:
                </Text>
                <TextInput
                  style={styles.modalTextInput}
                  placeholder="Ex: Tive um pouco de dor de cabeça após o almoço..."
                  placeholderTextColor="#AAA"
                  value={notaTemporaria}
                  onChangeText={setNotaTemporaria}
                  multiline
                  numberOfLines={3}
                />
              </ScrollView>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.btnCancelar}
                  onPress={() => setModalSintomasAberto(false)}
                >
                  <Text style={styles.btnCancelarText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnSalvar}
                  onPress={salvarSintomas}
                  activeOpacity={0.8}
                >
                  <Text style={styles.btnSalvarText}>Salvar Sintomas</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

      </ScrollView>

      {/* BARRA DE NAVEGAÇÃO INFERIOR FLUTUANTE COM GLASSMORPHISM */}
      <FloatingBottomNav activeTab="calendario" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15 },
  iconButton: { padding: 10, backgroundColor: '#FFFFFF', borderRadius: 50, elevation: 2 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#B55A7D' },

  // Seletor de Mês e Ano
  monthSelector: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20, gap: 15 },
  monthTitleButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8 },
  monthText: { fontSize: 22, fontWeight: 'bold', color: '#5C5257' },
  chevronButton: { padding: 6 },

  weekDays: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10, marginBottom: 15 },
  weekDayText: { fontSize: 14, fontWeight: 'bold', color: '#999', width: '14%', textAlign: 'center' },

  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10, justifyContent: 'flex-start' },
  dayContainer: { width: '14.28%', alignItems: 'center', marginBottom: 15, height: 48 },
  dayCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  dayText: { fontSize: 16, color: '#5C5257' },

  periodoBg: { backgroundColor: '#FADEE5' },
  periodoText: { fontWeight: 'bold', color: '#B55A7D' },
  selecionadoBorder: { borderWidth: 1.5, borderColor: '#B55A7D' },
  selecionadoText: { fontWeight: 'bold', color: '#B55A7D' },
  sintomaDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#D1B875', marginTop: 3 },

  // Card de Informações e Sintomas (Linha 59)
  infoCard: { backgroundColor: '#FFFFFF', margin: 20, borderRadius: 25, padding: 25, elevation: 2, marginTop: 10 },
  infoCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  infoCardDate: { fontSize: 20, fontWeight: 'bold', color: '#5C5257', marginBottom: 5 },
  infoCardSubtitle: { fontSize: 14, color: '#888' },
  sparkleIcon: { width: 45, height: 45, backgroundColor: '#FFF5F8', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },

  // Lista de Sintomas no Card
  sintomasSection: { marginBottom: 15 },
  sintomasSectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  sintomasList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sintomaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#FADEE5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  sintomaBadgeText: { fontSize: 13, color: '#B55A7D', fontWeight: '600' },
  sintomaRemoveBtn: { marginLeft: 6 },

  // Nota no Card
  notaCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FADEE5',
  },
  notaCardText: { flex: 1, fontSize: 13, color: '#5C5257', lineHeight: 18 },

  sintomasEmptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3E5EA',
  },
  sintomasEmptyText: {
    flex: 1,
    fontSize: 13,
    color: '#8E7E86',
    lineHeight: 18,
  },

  addButton: { backgroundColor: '#FADEE5', paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  addButtonText: { color: '#B55A7D', fontSize: 16, fontWeight: 'bold' },

  // Modal de Mês e Ano
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalMesAnoContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 22, width: '100%', maxWidth: 340, elevation: 5 },
  modalYearHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  modalYearArrow: { padding: 8, backgroundColor: '#FFF5F8', borderRadius: 20 },
  modalYearText: { fontSize: 20, fontWeight: 'bold', color: '#5C5257' },
  mesesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  mesItem: { width: '30%', paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#FFF5F8' },
  mesItemAtivo: { backgroundColor: '#FADEE5', borderWidth: 1.5, borderColor: '#B55A7D' },
  mesItemText: { fontSize: 14, fontWeight: '600', color: '#5C5257' },
  mesItemTextAtivo: { color: '#B55A7D', fontWeight: 'bold' },
  modalFecharButton: { marginTop: 18, backgroundColor: '#FFF5F8', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  modalFecharButtonText: { color: '#5C5257', fontSize: 15, fontWeight: 'bold' },

  // Modal de Sintomas
  modalBottomOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalBackdrop: { flex: 1 },
  modalSintomasContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, elevation: 10 },
  modalSintomasHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  modalSintomasTitle: { fontSize: 20, fontWeight: 'bold', color: '#5C5257' },
  modalSintomasSubtitle: { fontSize: 13, color: '#888', marginTop: 3 },
  modalCloseIcon: { padding: 4, backgroundColor: '#FFF5F8', borderRadius: 20 },
  modalSectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#5C5257', marginBottom: 12 },
  modalChipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sintomaChipOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#F3DCE4',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
  },
  sintomaChipOpcaoAtivo: { backgroundColor: '#FADEE5', borderColor: '#B55A7D' },
  sintomaChipOpcaoText: { fontSize: 13, color: '#666', fontWeight: '500' },
  sintomaChipOpcaoTextAtivo: { color: '#B55A7D', fontWeight: 'bold' },
  modalTextInput: {
    backgroundColor: '#FFF5F8',
    borderWidth: 1,
    borderColor: '#F3DCE4',
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: '#5C5257',
    textAlignVertical: 'top',
    minHeight: 70,
  },
  modalButtonsRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btnCancelar: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: '#FFF5F8', alignItems: 'center' },
  btnCancelarText: { fontSize: 15, fontWeight: 'bold', color: '#888' },
  btnSalvar: { flex: 2, paddingVertical: 14, borderRadius: 14, backgroundColor: '#B55A7D', alignItems: 'center' },
  btnSalvarText: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF' },
});