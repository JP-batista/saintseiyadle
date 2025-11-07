// src/i18n/types.ts
import pt from './locales/pt.json';

// Cria um tipo baseado no arquivo de idioma em português (o mais completo)
export type Dictionary = typeof pt;

// Define a estrutura de um item de notícia
export type NewsItem = {
    id: string;
    icon: string; // Componente Lucide (ex: 'Trophy')
    title: string;
    date: string;
    description: string;
    glow: string; // Tailwind glow classes
};

// --- NOVOS TIPOS PARA O MODO FALA (QUOTE MODE) ---

/**
 * A estrutura de uma fala individual (aninhada no arquivo de dados).
 */
export type Quote = {
  idQuote: string; // <-- CORRIGIDO DE 'id' PARA 'idQuote'
  texts: string;
  dica1: string;
  dica2: string;
};

/**
 * Informações básicas do personagem, usadas para
 * identificar o autor correto da fala.
 */
export type CharacterBaseInfo = {
  patente: any;
  titulo: any;
  idKey: string;
  nome: string;
  imgSrc: string;
  // Outros campos (titulo, etc.) podem ser adicionados se o ResultCard precisar
};

/**
 * Define a estrutura do arquivo de dados (ex: quotesDLE_pt.ts).
 * Contém os dados do personagem + um array de suas falas.
 */
export type CharacterWithQuotes = CharacterBaseInfo & {
  // Dados completos do personagem (opcional, mas bom para consistência)
  titulo?: string;
  idade: string;
  altura: string;
  genero: string;
  peso: string;
  signo: string;
  localDeTreinamento: string;
  patente: string;
  exercito: string;
  saga?: string;
  // O array de falas
  quotes: Quote[];
};

/**
 * O objeto "achatado" (flattened) usado pelo useDailyQuote e pelo store.
 * Esta é a estrutura da "fala do dia".
 */
export type SelectedQuote = {
  patente: any;
  titulo: any;
  quote: Quote; // A fala em si
  character: CharacterBaseInfo; // O personagem correto (a resposta)
};