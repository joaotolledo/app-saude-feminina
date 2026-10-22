import { Artigo } from '../types';

/**
 * Formata data no formato brasileiro amigável ("20 Out 2026")
 */
export function formatarDataArtigo(dataStr?: string | null): string {
  if (!dataStr) return 'Artigo Recomendado';
  if (!dataStr.includes('T') && !dataStr.includes('-')) return dataStr;
  try {
    const d = new Date(dataStr);
    if (isNaN(d.getTime())) return dataStr;
    const meses = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ];
    const dia = String(d.getUTCDate()).padStart(2, '0');
    const mes = meses[d.getUTCMonth()] || '';
    const ano = d.getUTCFullYear();
    return `${dia} ${mes} ${ano}`;
  } catch {
    return dataStr;
  }
}

/**
 * Calcula o tempo estimado de leitura a partir da quantidade de palavras
 */
export function calcularTempoLeitura(
  conteudo?: string | null,
  resumo?: string | null
): string {
  const textoBase = `${conteudo || ''} ${resumo || ''}`;
  // Remove tags HTML e entidades comuns como &nbsp;
  const textoLimpo = textoBase
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .trim();

  const palavras = textoLimpo.split(/\s+/).filter(Boolean).length;
  if (palavras === 0) return '3 min';
  // Média de leitura: ~180 palavras por minuto
  const minutos = Math.max(1, Math.ceil(palavras / 180));
  return `${minutos} min`;
}

/**
 * Normaliza os campos do artigo vindo do Supabase para os tipos usados na UI
 */
export function normalizarArtigo(item: any): Artigo {
  if (!item) {
    return {
      id: '',
      categoria: 'Geral',
      titulo: '',
      resumo: '',
      conteudo: '',
    };
  }

  // Valida se já existe um tempo de leitura formatado e válido (ex: '3 min', '5 min' ou numérico)
  let tempoLeituraValido: string | undefined = undefined;
  if (typeof item.tempo_leitura === 'number') {
    tempoLeituraValido = `${item.tempo_leitura} min`;
  } else if (
    typeof item.tempo_leitura === 'string' &&
    item.tempo_leitura.trim().length > 0 &&
    item.tempo_leitura.length <= 15 &&
    /^\s*\d+\s*(min|minutos?|m)?$/i.test(item.tempo_leitura.trim())
  ) {
    tempoLeituraValido = item.tempo_leitura.trim().toLowerCase().includes('min')
      ? item.tempo_leitura.trim()
      : `${item.tempo_leitura.trim()} min`;
  }

  return {
    id: item.id,
    categoria: item.categoria || 'Geral',
    titulo: item.titulo || 'Sem título',
    resumo: item.resumo || '',
    conteudo: item.conteudo || '',
    data: item.data || formatarDataArtigo(item.data_publicacao),
    data_publicacao: item.data_publicacao,
    tempo_leitura:
      tempoLeituraValido || calcularTempoLeitura(item.conteudo, item.resumo),
  };
}
