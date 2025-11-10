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

// --- TIPOS BASE COMPARTILHADOS ---

/**
 * Informações básicas do personagem.
 */
export type CharacterBaseInfo = {
    patente: any;
    titulo: any;
    idKey: string;
    nome: string;
    imgSrc: string;
};

// --- TIPOS PARA O MODO ATAQUE (ATTACK MODE) ---

/**
 * A estrutura de um ataque individual (aninhada no arquivo de dados).
 */
export type Attack = {
    idAttack: string;
    name: string; // Nome do ataque (a resposta)
    gifSrc: string; // URL do GIF
};

/**
 * Define a estrutura do arquivo de dados de ataques (ex: attackDLE_pt.ts).
 * Contém os dados do personagem + um array de seus ataques.
 */
export type CharacterWithAttacks = CharacterBaseInfo & {
    // O array de ataques
    attacks: Attack[];
};

/**
 * O objeto "achatado" (flattened) usado pelo useDailyAttack e pelo store.
 * Esta é a estrutura do "ataque do dia".
 */
export type SelectedAttack = {
    attack: Attack; // O ataque em si
    character: CharacterBaseInfo; // O personagem correto (a resposta)
};

/**
 * Tipo para o histórico de jogos do Modo Ataque (usado no useAttackStatsStore).
 */
export type AttackGameHistory = {
    date: string; // YYYY-MM-DD
    attempts: number;
    won: boolean;
    firstTry: boolean;
    attackName: string; 
    attackId: string;
    characterName: string;
    characterImage: string;
    characteridKey: string;
};


// --- TIPOS PARA O MODO FALA (QUOTE MODE) ---

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
 * Define a estrutura do arquivo de dados de falas (ex: quotesDLE_pt.ts).
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

/**
 * Tipo para o histórico de jogos do Modo Fala (usado no useQuoteStatsStore).
 */
export type QuoteGameHistory = {
    date: string; // YYYY-MM-DD
    attempts: number;
    won: boolean;
    firstTry: boolean;
    
    // Dados específicos do Modo Fala
    characterName: string; 
    characterImage: string;
    characteridKey: string;
    quoteText: string; 
    quoteId: string; 
};

// --- NOVO: TIPOS PARA O MODO SILHUETA (SILHOUETTE MODE) ---

/**
 * Define a estrutura de uma Armadura individual, 
 * conforme os dados em /data/armors/armorsDLE_pt.ts
 */
export type Armor = {
  name: string; // Nome da armadura (a resposta)
  category: string;
  description: string;
  knight: string; // Nome do cavaleiro (para contexto)
  saga: string;
  silhouetteImg: string; // Caminho para a imagem da silhueta (com zoom)
  revealedImg: string;  // Caminho para a imagem revelada (para o ResultCard)
};

/**
 * A Armadura selecionada para o desafio do dia.
 */
export type SelectedArmor = Armor;

/**
 * Tipo para o histórico de jogos do MODO SILHUETA (usado no useSilhouetteStatsStore).
 */
export type SilhouetteGameHistory = {
  date: string; // YYYY-MM-DD
  attempts: number;
  won: boolean;
  firstTry: boolean;
  
  // Dados específicos do Modo Silhueta
  name: string; // O nome da armadura (a resposta)
  revealedImg: string; // A imagem revelada (para o modal)
  knight: string; // O cavaleiro (para contexto)
};