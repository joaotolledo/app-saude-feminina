/**
 * Tipagens centrais da aplicação de saúde feminina
 */

export interface UsuarioPerfil {
  id: string;
  nome: string;
  data_nascimento?: string | null;
  duracao_ciclo?: number | null;
  duracao_periodo?: number | null;
  created_at?: string;
}

export interface Artigo {
  id: number | string;
  categoria: string;
  titulo: string;
  resumo?: string;
  conteudo?: string;
  data?: string;
  data_publicacao?: string;
  tempo_leitura?: string;
}

export interface Humor {
  id: string;
  emoji: string;
  nome: string;
  cor: string;
  mensagem: string;
}

export interface HormonioItem {
  id: string;
  nome: string;
  subtitulo: string;
  valor: string;
  status: 'Normal' | 'Atenção';
  referencia: string;
  progresso: number;
  corDestaque: string;
  explicacao: string;
}

export interface RegistroSintoma {
  sintomas: string[];
  nota?: string;
}

export interface SintomaOpcao {
  id: string;
  nome: string;
  icone: string;
}
